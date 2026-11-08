'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type RenderMode = 'hybrid' | 'step-overlay' | 'step-xray';

interface CalloutScreenPos {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  specs: string[];
  anchorX: number;
  anchorY: number;
  cardSide: 'left' | 'right';
  cardSlot: 'top' | 'bottom';
  visible: boolean;
  active: boolean;
  displacementLabel: string;
}

interface StepTelemetry {
  loaded: boolean;
  fileSizeKB: number;
  products: number;
  manifoldSolids: number;
  closedShells: number;
  advancedFaces: number;
  edgeCurves: number;
  cartesianPoints: number;
  circles: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function VanguardExplodedViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('hybrid');
  const [showAllCallouts, setShowAllCallouts] = useState(false);
  const [stepTelemetry, setStepTelemetry] = useState<StepTelemetry>({
    loaded: true,
    fileSizeKB: 2692,
    products: 8,
    manifoldSolids: 44,
    closedShells: 74,
    advancedFaces: 627,
    edgeCurves: 1465,
    cartesianPoints: 5941,
    circles: 313,
  });

  const [callouts, setCallouts] = useState<CalloutScreenPos[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 800 });
  const [touchOrbitEnabled, setTouchOrbitEnabled] = useState(false);

  const effectiveProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const renderModeRef = useRef<RenderMode>('hybrid');
  const showAllCalloutsRef = useRef(false);
  const userInteractingRef = useRef(false);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererDomRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    effectiveProgressRef.current = manualOverride !== null ? manualOverride : scrollProgress;
  }, [scrollProgress, manualOverride]);

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  useEffect(() => {
    showAllCalloutsRef.current = showAllCallouts;
  }, [showAllCallouts]);

  useEffect(() => {
    const isSmallScreen = viewportSize.width < 1024;
    if (controlsRef.current) {
      controlsRef.current.enabled = !isSmallScreen || touchOrbitEnabled;
    }
    if (rendererDomRef.current) {
      rendererDomRef.current.style.touchAction =
        !isSmallScreen || touchOrbitEnabled ? 'none' : 'pan-y';
    }
  }, [touchOrbitEnabled, viewportSize.width]);

  // Bind scroll progress (0.0 -> 1.0) within the scroll track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      const p = clamp01(scrolled / totalScrollable);
      setScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const jumpToProgress = useCallback((targetP: number) => {
    setManualOverride(null);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTopDoc = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    window.scrollTo({
      top: containerTopDoc + targetP * totalScrollable,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const width = wrapper.clientWidth || 1280;
    const height = wrapper.clientHeight || 800;
    setViewportSize({ width, height });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0C0E');
    scene.fog = new THREE.FogExp2('#0B0C0E', 0.0008);

    const camera = new THREE.PerspectiveCamera(34, width / height, 1, 3000);
    camera.position.set(275, 135, 310);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;

    wrapper.innerHTML = '';
    wrapper.appendChild(renderer.domElement);
    rendererDomRef.current = renderer.domElement;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.82;
    const isInitialSmall = width < 1024;
    controls.enabled = !isInitialSmall;
    renderer.domElement.style.touchAction = isInitialSmall ? 'pan-y' : 'none';

    const onStartInteract = () => {
      userInteractingRef.current = true;
    };
    const onEndInteract = () => {
      setTimeout(() => {
        userInteractingRef.current = false;
      }, 2800);
    };
    controls.addEventListener('start', onStartInteract);
    controls.addEventListener('end', onEndInteract);

    // =========================================================================
    // STUDIO KEY / RIM / AMBIENT LIGHTING SETUP (#0B0C0E Minimalist Defense-Tech)
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0xdbe6f5, 0x0b0c0e, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf5, 2.7);
    keyLight.position.set(260, 380, 320);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 50;
    keyLight.shadow.camera.far = 1100;
    const d = 240;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.9);
    rimLight.position.set(-300, 180, -280);
    scene.add(rimLight);

    const tacticalLight = new THREE.DirectionalLight(0x00ff41, 0.5);
    tacticalLight.position.set(0, -260, 120);
    scene.add(tacticalLight);

    const noseSpot = new THREE.PointLight(0x38bdf8, 1.5, 420);
    noseSpot.position.set(0, 20, 240);
    scene.add(noseSpot);

    const gridHelper = new THREE.GridHelper(640, 32, 0x1e293b, 0x131720);
    gridHelper.position.y = -215;
    scene.add(gridHelper);

    const uavRoot = new THREE.Group();
    scene.add(uavRoot);

    // Component Sub-Groups for Hierarchical Scroll Translation
    const dorsalHullGroup = new THREE.Group();
    const dorsalFastenersGroup = new THREE.Group();
    const aviarsCoreGroup = new THREE.Group();
    const ventralHullGroup = new THREE.Group();
    const ventralFastenersGroup = new THREE.Group();
    const kineticPayloadGroup = new THREE.Group();
    const gimbalGroup = new THREE.Group();
    const lensGroup = new THREE.Group();
    const rotorHubFastenersGroup = new THREE.Group();
    const tofSensorGroup = new THREE.Group();

    uavRoot.add(
      dorsalHullGroup,
      dorsalFastenersGroup,
      aviarsCoreGroup,
      ventralHullGroup,
      ventralFastenersGroup,
      kineticPayloadGroup,
      gimbalGroup,
      lensGroup,
      rotorHubFastenersGroup,
      tofSensorGroup
    );

    const radialSensorGroups: {
      name: string;
      group: THREE.Group;
      dirX: number;
      dirY: number;
      dirZ: number;
    }[] = [];

    const rotorConfigs: Record<
      string,
      { hubX: number; hubY: number; hubZ: number; hand: number; group: THREE.Group; spinMesh?: THREE.Object3D }
    > = {
      Ducted_Propeller_L1: { hubX: -52.0, hubY: -2.5, hubZ: 33.0, hand: 1, group: new THREE.Group() },
      Ducted_Propeller_R1: { hubX: 52.0, hubY: -2.5, hubZ: 33.0, hand: -1, group: new THREE.Group() },
      Ducted_Propeller_L2: { hubX: -52.0, hubY: -2.5, hubZ: -35.0, hand: -1, group: new THREE.Group() },
      Ducted_Propeller_R2: { hubX: 52.0, hubY: -2.5, hubZ: -35.0, hand: 1, group: new THREE.Group() },
    };
    Object.values(rotorConfigs).forEach((rc) => {
      rc.group.position.set(rc.hubX, rc.hubY, rc.hubZ);
      uavRoot.add(rc.group);
    });

    const pbrMeshes: THREE.Mesh[] = [];
    const stepEdgeLines: THREE.LineSegments[] = [];

    const buildMaterialForNode = (name: string): THREE.MeshPhysicalMaterial => {
      if (name === 'Main_Hull_Top') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#1e232a'),
          metalness: 0.38,
          roughness: 0.45,
          clearcoat: 0.3,
          clearcoatRoughness: 0.35,
        });
      }
      if (name === 'Main_Hull_Ventral') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#161920'),
          metalness: 0.32,
          roughness: 0.52,
          clearcoat: 0.2,
        });
      }
      if (name.startsWith('Ducted_Propeller')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#323b48'),
          metalness: 0.68,
          roughness: 0.26,
          clearcoat: 0.4,
        });
      }
      if (name === 'Gimbal_Sphere_Assembly') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#2b323d'),
          metalness: 0.82,
          roughness: 0.22,
          clearcoat: 0.5,
        });
      }
      if (name === 'Primary_4K_Lens') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0ea5e9'),
          emissive: new THREE.Color('#0284c7'),
          emissiveIntensity: 0.4,
          metalness: 0.15,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          reflectivity: 1.0,
        });
      }
      if (name.startsWith('Sensor_')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#f59e0b'),
          emissive: new THREE.Color('#d97706'),
          emissiveIntensity: 0.35,
          metalness: 0.4,
          roughness: 0.12,
          clearcoat: 1.0,
        });
      }
      if (name === 'AVIARS_Core_Thermal_Sink') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#10b981'),
          emissive: new THREE.Color('#059669'),
          emissiveIntensity: 0.25,
          metalness: 0.72,
          roughness: 0.25,
          clearcoat: 0.6,
        });
      }
      if (name === 'Modular_Kinetic_Payload') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#3b4252'),
          emissive: new THREE.Color('#ef4444'),
          emissiveIntensity: 0.14,
          metalness: 0.78,
          roughness: 0.26,
          clearcoat: 0.45,
        });
      }
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#94a3b8'),
        metalness: 0.9,
        roughness: 0.18,
      });
    };

    // =========================================================================
    // INSTANT 0-MS PROCEDURAL INITIALIZATION (Ensures zero loading delay!)
    // Upgraded seamlessly in place as soon as /models/sa1_vanguard.glb arrives
    // =========================================================================
    const fallbackMeshes: THREE.Object3D[] = [];
    const buildInstantFallbackModel = () => {
      const registerFallback = (mesh: THREE.Mesh, group: THREE.Group) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        pbrMeshes.push(mesh);
        fallbackMeshes.push(mesh);
      };

      // Dorsal Hull faceted stealth carapace
      const dorsalGeom = new THREE.CylinderGeometry(64, 86, 19, 8);
      dorsalGeom.scale(1.0, 1.0, 0.92);
      const dorsalMesh = new THREE.Mesh(dorsalGeom, buildMaterialForNode('Main_Hull_Top'));
      dorsalMesh.position.set(0, 10, 0);
      registerFallback(dorsalMesh, dorsalHullGroup);

      // Ventral Hull chassis
      const ventralGeom = new THREE.CylinderGeometry(86, 68, 16, 8);
      ventralGeom.scale(1.0, 1.0, 0.92);
      const ventralMesh = new THREE.Mesh(ventralGeom, buildMaterialForNode('Main_Hull_Ventral'));
      ventralMesh.position.set(0, -8, 0);
      registerFallback(ventralMesh, ventralHullGroup);

      // A.V.I.A.R.S. Core + Thermal Heatsink
      const coreGeom = new THREE.BoxGeometry(40, 10, 60);
      const coreMesh = new THREE.Mesh(coreGeom, buildMaterialForNode('AVIARS_Core_Thermal_Sink'));
      coreMesh.position.set(0, 4, 0);
      registerFallback(coreMesh, aviarsCoreGroup);

      // Gimbal Sphere
      const gimGeom = new THREE.SphereGeometry(12, 32, 32);
      const gimMesh = new THREE.Mesh(gimGeom, buildMaterialForNode('Gimbal_Sphere_Assembly'));
      gimMesh.position.set(0, 0, 62);
      registerFallback(gimMesh, gimbalGroup);

      // 4K Sapphire Lens
      const lensGeom = new THREE.CylinderGeometry(8.5, 8.5, 5, 32);
      lensGeom.rotateX(Math.PI / 2);
      const lensMesh = new THREE.Mesh(lensGeom, buildMaterialForNode('Primary_4K_Lens'));
      lensMesh.position.set(0, 0, 70);
      registerFallback(lensMesh, lensGroup);

      // Modular Kinetic Payload
      const kinGeom = new THREE.CylinderGeometry(5.2, 5.2, 56, 8);
      kinGeom.rotateX(Math.PI / 2);
      const kinMesh = new THREE.Mesh(kinGeom, buildMaterialForNode('Modular_Kinetic_Payload'));
      kinMesh.position.set(0, -8.2, 0);
      registerFallback(kinMesh, kineticPayloadGroup);

      // 4x Rotors
      Object.entries(rotorConfigs).forEach(([rName, rc]) => {
        const rGroup = new THREE.Group();
        const hubG = new THREE.CylinderGeometry(6.5, 6.5, 7, 24);
        const hubM = new THREE.Mesh(hubG, buildMaterialForNode(rName));
        rGroup.add(hubM);
        for (let b = 0; b < 5; b++) {
          const bladeG = new THREE.BoxGeometry(16, 1.2, 5.2);
          const bladeM = new THREE.Mesh(bladeG, buildMaterialForNode(rName));
          const ang = (b * Math.PI * 2) / 5;
          bladeM.position.set(Math.cos(ang) * 13, 0, Math.sin(ang) * 13);
          bladeM.rotation.y = -ang;
          rGroup.add(bladeM);
        }
        rc.group.add(rGroup);
        rc.spinMesh = rGroup;
        fallbackMeshes.push(rGroup);
      });
    };

    buildInstantFallbackModel();

    const applyRenderModeStyles = () => {
      const mode = renderModeRef.current;
      pbrMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (!mat) return;
        if (mode === 'step-xray') {
          mat.transparent = true;
          mat.opacity = 0.18;
          mat.depthWrite = false;
        } else {
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.depthWrite = true;
        }
        mat.needsUpdate = true;
      });

      stepEdgeLines.forEach((line) => {
        line.visible = true;
        const lmat = line.material as THREE.LineBasicMaterial;
        lmat.opacity = mode === 'hybrid' ? 0.18 : mode === 'step-overlay' ? 0.65 : 0.9;
      });
    };

    // 1. Stream pre-parsed ISO-10303-21 STEP B-Rep edges (43 KB JSON) for instant CAD overlay
    let isCancelled = false;
    fetch('/models/sa1_vanguard_step_edges.json')
      .then((res) => res.json())
      .then((parsed) => {
        if (isCancelled || !parsed || !parsed.groups) return;
        if (parsed.telemetry) {
          setStepTelemetry(parsed.telemetry);
        }

        const attachStepGroup = (
          arr: number[],
          targetGroup: THREE.Group,
          colorHex: number
        ) => {
          if (!arr || arr.length === 0) return;
          const positions = new Float32Array(arr);
          const bGeom = new THREE.BufferGeometry();
          bGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const bMat = new THREE.LineBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.22,
          });
          const lines = new THREE.LineSegments(bGeom, bMat);
          targetGroup.add(lines);
          stepEdgeLines.push(lines);
        };

        attachStepGroup(parsed.groups.dorsal, dorsalHullGroup, 0x00ff41);
        attachStepGroup(parsed.groups.ventral, ventralHullGroup, 0x38bdf8);
        attachStepGroup(parsed.groups.gimbal, gimbalGroup, 0x22d3ee);
        attachStepGroup(parsed.groups.lens, lensGroup, 0x60a5fa);
        attachStepGroup(parsed.groups.sensors, gimbalGroup, 0xfbbf24);
        attachStepGroup(parsed.groups.rotors, rotorHubFastenersGroup, 0x34d399);
        applyRenderModeStyles();
      })
      .catch((err) => {
        console.error('Error loading STEP edges JSON:', err);
      });

    // 2. Load the watertight 2-Manifold GLTF (.GLB) assembly without blocking the main thread
    const loader = new GLTFLoader();
    loader.load(
      '/models/sa1_vanguard.glb',
      (gltf) => {
        if (isCancelled) return;

        // Remove instant fallback meshes and replace with exact manifold CAD solids
        fallbackMeshes.forEach((obj) => {
          if (obj.parent) obj.parent.remove(obj);
        });
        pbrMeshes.length = 0;

        const meshesToProcess: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshesToProcess.push(child as THREE.Mesh);
          }
        });

        meshesToProcess.forEach((origMesh) => {
          const nodeName = origMesh.name || origMesh.parent?.name || 'Unknown';
          const geom = origMesh.geometry.clone();
          geom.computeVertexNormals();

          const mat = buildMaterialForNode(nodeName);
          const mesh = new THREE.Mesh(geom, mat);
          mesh.name = nodeName;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          pbrMeshes.push(mesh);

          if (nodeName === 'Main_Hull_Top') {
            dorsalHullGroup.add(mesh);
          } else if (nodeName === 'Main_Hull_Ventral') {
            ventralHullGroup.add(mesh);
          } else if (nodeName === 'Fasteners_Dorsal') {
            dorsalFastenersGroup.add(mesh);
          } else if (nodeName === 'Fasteners_Ventral') {
            ventralFastenersGroup.add(mesh);
          } else if (nodeName === 'Fasteners_Rotor_Hubs') {
            rotorHubFastenersGroup.add(mesh);
          } else if (nodeName === 'AVIARS_Core_Thermal_Sink') {
            aviarsCoreGroup.add(mesh);
          } else if (nodeName === 'Modular_Kinetic_Payload') {
            kineticPayloadGroup.add(mesh);
          } else if (nodeName === 'Gimbal_Sphere_Assembly') {
            gimbalGroup.add(mesh);
          } else if (nodeName === 'Primary_4K_Lens') {
            lensGroup.add(mesh);
          } else if (nodeName in rotorConfigs) {
            const rc = rotorConfigs[nodeName];
            geom.translate(-rc.hubX, -rc.hubY, -rc.hubZ);
            rc.group.add(mesh);
            rc.spinMesh = mesh;
          } else if (nodeName.startsWith('Sensor_LiDAR_') || nodeName.startsWith('Sensor_VIO_')) {
            const sGroup = new THREE.Group();
            sGroup.add(mesh);
            uavRoot.add(sGroup);

            let dirX = 0;
            let dirY = 0;
            let dirZ = 75;
            if (nodeName === 'Sensor_LiDAR_Center') {
              dirX = 0;
              dirY = 38;
              dirZ = 88;
            } else if (nodeName === 'Sensor_LiDAR_Port') {
              dirX = -42;
              dirY = 26;
              dirZ = 82;
            } else if (nodeName === 'Sensor_LiDAR_Starboard') {
              dirX = 42;
              dirY = 26;
              dirZ = 82;
            } else if (nodeName === 'Sensor_VIO_Port') {
              dirX = -52;
              dirY = 8;
              dirZ = 68;
            } else if (nodeName === 'Sensor_VIO_Starboard') {
              dirX = 52;
              dirY = 8;
              dirZ = 68;
            }
            radialSensorGroups.push({ name: nodeName, group: sGroup, dirX, dirY, dirZ });
          } else {
            tofSensorGroup.add(mesh);
          }
        });

        applyRenderModeStyles();
      },
      undefined,
      (err) => {
        console.error('Error loading SA-1 Vanguard GLB:', err);
      }
    );

    const anchorEdgeSuite = new THREE.Vector3();
    const anchorNacelles = new THREE.Vector3();
    const anchorAviarsCore = new THREE.Vector3();
    const anchorVentralHardpoint = new THREE.Vector3();

    const projectToScreen = (worldVec: THREE.Vector3, w: number, h: number) => {
      const v = worldVec.clone().project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * w,
        y: (-v.y * 0.5 + 0.5) * h,
      };
    };

    const clock = new THREE.Clock();
    let animFrameId = 0;
    let lastCalloutUpdate = -1;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const targetP = effectiveProgressRef.current;
      smoothedProgressRef.current += (targetP - smoothedProgressRef.current) * 0.1;
      const p = smoothedProgressRef.current;

      const t2 = smoothstep(0.25, 0.5, p);
      const t3 = smoothstep(0.5, 0.75, p);
      const t4 = smoothstep(0.75, 1.0, p);

      const floatY = Math.sin(elapsed * 1.7) * 3.2;
      const floatRoll = Math.sin(elapsed * 0.85) * 0.016;
      const floatPitch = Math.cos(elapsed * 1.05) * 0.014;
      uavRoot.position.y = floatY;
      uavRoot.rotation.z = floatRoll;
      uavRoot.rotation.x = floatPitch;

      // Phase 2: Dorsal Hull separates upwards along +Y (+150mm)
      const dorsalY = 150.0 * t2;
      dorsalHullGroup.position.set(0, dorsalY, 0);
      dorsalFastenersGroup.position.set(0, 174.0 * t2, 0);
      aviarsCoreGroup.position.set(0, 6.0 * t2, 0);

      // Phase 3: Nose Gimbal & 4K Sapphire Lens pull forward along +Z (+120mm), LiDARs expand radially, 4x props elevate
      const gimbalZ = 92.0 * t3;
      const lensZ = 120.0 * t3;
      gimbalGroup.position.set(0, 0, gimbalZ);
      lensGroup.position.set(0, 0, lensZ);

      radialSensorGroups.forEach((rs) => {
        rs.group.position.set(rs.dirX * t3, rs.dirY * t3, rs.dirZ * t3);
      });
      tofSensorGroup.position.set(0, -24.0 * t3 - 100.0 * t4, 22.0 * t3);

      const propElevateY = 42.0 * t3;
      Object.values(rotorConfigs).forEach((rc) => {
        rc.group.position.set(rc.hubX, rc.hubY + propElevateY, rc.hubZ);
        if (rc.spinMesh) {
          rc.spinMesh.rotation.y += 0.08 * rc.hand;
        }
      });
      rotorHubFastenersGroup.position.set(0, 56.0 * t3, 0);

      // Phase 4: Ventral Chassis lowers along -Y (-100mm); Modular kinetic payload drops onto its own focal plane
      const ventralY = -100.0 * t4;
      const kineticY = -156.0 * t4;
      const kineticZ = 16.0 * t4;
      ventralHullGroup.position.set(0, ventralY, 0);
      ventralFastenersGroup.position.set(0, -122.0 * t4, 0);
      kineticPayloadGroup.position.set(0, kineticY, kineticZ);

      if (!userInteractingRef.current) {
        const w = wrapper.clientWidth || 1280;
        const h = Math.max(1, wrapper.clientHeight || 800);
        const aspect = w / h;
        // Pull camera back on portrait mobile/tablet so the 180mm assembly + exploded components stay framed
        const portraitMultiplier =
          aspect < 1.05 ? Math.min(1.68, Math.max(1.0, 0.94 / Math.max(aspect, 0.45))) : 1.0;

        const camAngle = 0.68 - 0.18 * t2 + 0.26 * t3 - 0.12 * t4 + Math.sin(elapsed * 0.25) * 0.03;
        const camRadius = (405 + 45 * t2 + 35 * t3 + 45 * t4) * portraitMultiplier;
        const camHeight = (115 + 35 * t2 - 15 * t3 - 25 * t4) * (aspect < 0.8 ? 1.15 : 1.0);
        const targetCamX = Math.sin(camAngle) * camRadius;
        const targetCamZ = Math.cos(camAngle) * camRadius;

        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (camHeight - camera.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        // Shift target slightly downward on mobile so the UAV sits higher in the open viewport above the bottom card
        const mobileTargetYOffset = aspect < 0.85 ? -28 : 0;
        const lookY = 12 * t2 - 18 * t4 + mobileTargetYOffset;
        const lookZ = 15 * t3;
        controls.target.lerp(new THREE.Vector3(0, lookY, lookZ), 0.08);
      }

      controls.update();
      renderer.render(scene, camera);

      if (elapsed - lastCalloutUpdate > 0.033) {
        lastCalloutUpdate = elapsed;
        const w = wrapper.clientWidth || 1280;
        const h = wrapper.clientHeight || 800;

        anchorEdgeSuite.set(0, floatY + 2, 71.0 + lensZ);
        anchorNacelles.set(52.0, floatY - 2.5 + propElevateY, 33.0);
        anchorAviarsCore.set(0, floatY + 8.0 + 6.0 * t2, 2.0);
        anchorVentralHardpoint.set(0, floatY - 8.2 + kineticY, 8.0 + kineticZ);

        const pt1 = projectToScreen(anchorEdgeSuite, w, h);
        const pt2 = projectToScreen(anchorNacelles, w, h);
        const pt3 = projectToScreen(anchorAviarsCore, w, h);
        const pt4 = projectToScreen(anchorVentralHardpoint, w, h);

        const forceAll = showAllCalloutsRef.current;
        const fullExplode = p >= 0.82;

        setCallouts([
          {
            id: 'callout-2',
            number: '02',
            title: 'Flush Acoustic Nacelles',
            subtitle: 'Serrated Ducted Quad-Rotors',
            specs: [
              '4× 45.0 mm Enclosed Toroidal Carbon Ducts',
              '9 Circumferential & 36 Axial Vortex Serrations',
              '5-Blade Swept Low-Re Counter-Rotating Props',
            ],
            anchorX: pt2.x,
            anchorY: pt2.y,
            cardSide: 'right',
            cardSlot: 'top',
            visible: forceAll || p <= 0.28 || (p >= 0.48 && p <= 0.78) || fullExplode,
            active: p < 0.25,
            displacementLabel: `ELEVATION ΔY: +${(42.0 * t3).toFixed(1)} mm`,
          },
          {
            id: 'callout-3',
            number: '03',
            title: 'A.V.I.A.R.S. Core',
            subtitle: 'Onboard Autonomous Compute / Thermal Dissipation',
            specs: [
              'Dorsal Monocoque Separation: +150.0 mm (+Y)',
              '13-Fin Anodized Thermal Sink & 30° Exhaust Gills',
              'Flush Conformal GNSS Patch & Edge Neural TPU',
            ],
            anchorX: pt3.x,
            anchorY: pt3.y,
            cardSide: 'left',
            cardSlot: 'top',
            visible: forceAll || (p >= 0.22 && p <= 0.55) || fullExplode,
            active: p >= 0.25 && p < 0.5,
            displacementLabel: `DORSAL LIFT ΔY: +${dorsalY.toFixed(1)} mm`,
          },
          {
            id: 'callout-1',
            number: '01',
            title: 'Multi-Spectral Edge Suite',
            subtitle: '4K Optical Lens + Solid-State LiDAR',
            specs: [
              'Forward Optical Axis Extension: +120.0 mm (+Z)',
              '24.0 mm 2-Axis Gimbal + 3-Element Sapphire 4K Lens',
              '3× Radial Quartz LiDAR Windows & Stereo VIO Ring',
            ],
            anchorX: pt1.x,
            anchorY: pt1.y,
            cardSide: 'right',
            cardSlot: 'bottom',
            visible: forceAll || (p >= 0.46 && p <= 0.8) || fullExplode,
            active: p >= 0.5 && p < 0.75,
            displacementLabel: `OPTICAL PULL ΔZ: +${lensZ.toFixed(1)} mm`,
          },
          {
            id: 'callout-4',
            number: '04',
            title: 'Modular Ventral Hardpoint',
            subtitle: 'Low-Drag Kinetic Interdiction Payload',
            specs: [
              'Ventral Chassis Lowering: -100.0 mm (-Y)',
              'Internal Flush Bay — Zero Payload Drag Penalty',
              'Precision-Guided Micro-Munition & Seeker Dome',
            ],
            anchorX: pt4.x,
            anchorY: pt4.y,
            cardSide: 'left',
            cardSlot: 'bottom',
            visible: forceAll || p >= 0.72,
            active: p >= 0.75,
            displacementLabel: `VENTRAL DROP ΔY: ${ventralY.toFixed(1)} mm / PAYLOAD: ${kineticY.toFixed(1)} mm`,
          },
        ]);
      }
    };

    animate();

    const handleResize = () => {
      if (!wrapper) return;
      const w = wrapper.clientWidth || 1280;
      const h = wrapper.clientHeight || 800;
      setViewportSize({ width: w, height: h });
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const modeCheck = setInterval(applyRenderModeStyles, 150);

    return () => {
      isCancelled = true;
      clearInterval(modeCheck);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const activeProgress = manualOverride !== null ? manualOverride : scrollProgress;
  const activePhaseIndex =
    activeProgress < 0.25 ? 1 : activeProgress < 0.5 ? 2 : activeProgress < 0.75 ? 3 : 4;

  const phases = [
    {
      phase: 1,
      shortTitle: 'Hover',
      range: '0% – 25%',
      targetP: 0.08,
      title: 'Tactical Stealth Hover',
      desc: 'Fully assembled SA-1 Vanguard in low-observable flight trim with subtle idle float and enclosed acoustic propulsion.',
      metric: 'RCS < 0.0004 m² // IDLE FLOAT',
    },
    {
      phase: 2,
      shortTitle: 'Dorsal',
      range: '25% – 50%',
      targetP: 0.42,
      title: 'Dorsal Monocoque Separation',
      desc: 'Dorsal carbon hull separates upwards along +Y (+150mm), exposing internal skived thermal sinks, A.V.I.A.R.S. compute core, and conformal GNSS patch antenna.',
      metric: 'DORSAL HULL ΔY: +150.0 mm',
    },
    {
      phase: 3,
      shortTitle: 'Optics',
      range: '50% – 75%',
      targetP: 0.67,
      title: 'Multi-Spectral Optics & Rotor Array',
      desc: 'Nose Gimbal Assembly and 4K sapphire optical lens pull forward along +Z (+120mm), solid-state LiDAR apertures expand radially, and 4× ducted rotors elevate.',
      metric: 'OPTICS ΔZ: +120.0 mm // RADIAL LIDAR',
    },
    {
      phase: 4,
      shortTitle: 'Ventral',
      range: '75% – 100%',
      targetP: 0.96,
      title: 'Ventral Chassis & Kinetic Hardpoint',
      desc: 'Ventral chassis lowers along -Y (-100mm) as the modular precision-guided kinetic micro-munition drops down onto its own focal plane.',
      metric: 'VENTRAL ΔY: -100.0 mm // PAYLOAD DEPLOY',
    },
  ];

  const getCardAnchorBox = (c: CalloutScreenPos) => {
    const isLeft = c.cardSide === 'left';
    const isTop = c.cardSlot === 'top';
    const isXl = viewportSize.width >= 1280;
    const cardWidth = isXl ? 320 : 280;
    const sideOffset = isXl ? 56 : 28;
    const xEdge = isLeft ? sideOffset + cardWidth : viewportSize.width - sideOffset - cardWidth;
    const yCenter = isTop ? viewportSize.height * 0.28 : viewportSize.height * 0.64;
    return { xEdge, yCenter, isLeft, isTop };
  };

  const activeMobileCallout =
    callouts.find((c) => c.active) || callouts[0] || null;

  return (
    <div ref={containerRef} className="relative w-full h-[360vh] sm:h-[420vh] lg:h-[500vh]">
      {/* Sticky Full-Viewport 3D Storytelling Stage */}
      <div className="sticky top-16 sm:top-20 lg:top-24 w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden bg-[#0B0C0E] border-y border-white/10">
        {/* Subtle Studio Radial Lighting Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 52% 46%, rgba(30, 41, 59, 0.28) 0%, rgba(11, 12, 14, 0.92) 72%)',
          }}
        />

        {/* Three.js WebGL Canvas Mount */}
        <div
          ref={canvasWrapperRef}
          className="relative z-10 w-full h-full lg:cursor-grab lg:active:cursor-grabbing"
        />

        {/* Desktop SVG 1px Leader Lines & Target Reticles Overlay (lg+) */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 w-full h-full hidden lg:block"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
        >
          {callouts.map((c) => {
            if (!c.visible) return null;
            const { xEdge, yCenter, isLeft } = getCardAnchorBox(c);
            const elbowX = isLeft ? xEdge + 40 : xEdge - 40;
            const ax = Math.max(80, Math.min(viewportSize.width - 80, c.anchorX));
            const ay = Math.max(60, Math.min(viewportSize.height - 60, c.anchorY));

            return (
              <g key={c.id} className="transition-opacity duration-500">
                <polyline
                  points={`${xEdge},${yCenter} ${elbowX},${yCenter} ${ax},${ay}`}
                  fill="none"
                  stroke={c.active ? '#00ff41' : 'rgba(255,255,255,0.38)'}
                  strokeWidth="1"
                />
                <circle
                  cx={xEdge}
                  cy={yCenter}
                  r="3"
                  fill={c.active ? '#00ff41' : '#94a3b8'}
                />
                <circle
                  cx={ax}
                  cy={ay}
                  r="4"
                  fill="#0B0C0E"
                  stroke={c.active ? '#00ff41' : '#ffffff'}
                  strokeWidth="1.5"
                />
                <circle
                  cx={ax}
                  cy={ay}
                  r="9"
                  fill="none"
                  stroke={c.active ? 'rgba(0,255,65,0.45)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>

        {/* Mobile & Tablet SVG Target Reticle & Leader Line (< lg) */}
        {activeMobileCallout && (
          <svg
            className="pointer-events-none absolute inset-0 z-20 w-full h-full lg:hidden"
            viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
            preserveAspectRatio="none"
          >
            {(() => {
              const ax = Math.max(36, Math.min(viewportSize.width - 36, activeMobileCallout.anchorX));
              const ay = Math.max(70, Math.min(viewportSize.height - 190, activeMobileCallout.anchorY));
              const cardTopY = Math.max(ay + 24, viewportSize.height - 200);
              const cardCenterX = viewportSize.width * 0.5;
              return (
                <g>
                  <polyline
                    points={`${cardCenterX},${cardTopY} ${ax},${ay}`}
                    fill="none"
                    stroke="#00ff41"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle cx={ax} cy={ay} r="4" fill="#0B0C0E" stroke="#00ff41" strokeWidth="1.5" />
                  <circle cx={ax} cy={ay} r="9" fill="none" stroke="rgba(0,255,65,0.45)" strokeWidth="1" />
                </g>
              );
            })()}
          </svg>
        )}

        {/* Top Bar HUD — Phase Status + CAD Format Controls */}
        <div className="pointer-events-none absolute z-30 top-3 sm:top-5 lg:top-7 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="pointer-events-auto flex items-center justify-between sm:justify-start gap-3 bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl px-3.5 py-2.5 sm:px-5 sm:py-3">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00ff41] animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#00ff41] truncate">
                  SA-1 VANGUARD // PHASE 0{activePhaseIndex}/04
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                  {phases[activePhaseIndex - 1].title}
                </p>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-white/55 font-mono shrink-0 ml-2">
              {Math.round(activeProgress * 100)}%
            </span>
          </div>

          {/* Interactive CAD Layer & Callout Switcher */}
          <div className="pointer-events-auto flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setRenderMode('hybrid')}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  renderMode === 'hybrid'
                    ? 'bg-[#00ff41] text-black font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Studio .GLB
              </button>
              <button
                type="button"
                onClick={() => setRenderMode('step-overlay')}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  renderMode === 'step-overlay'
                    ? 'bg-[#00ff41] text-black font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="sm:hidden">.GLB + .STEP</span>
                <span className="hidden sm:inline">.GLB + .STEP B-Rep</span>
              </button>
              <button
                type="button"
                onClick={() => setRenderMode('step-xray')}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  renderMode === 'step-xray'
                    ? 'bg-[#00ff41] text-black font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="sm:hidden">Wireframe</span>
                <span className="hidden sm:inline">ISO-10303 .STEP Wireframe</span>
              </button>
            </div>

            {/* Mobile/Tablet Touch Orbit Toggle (< lg) */}
            <button
              type="button"
              onClick={() => setTouchOrbitEnabled((v) => !v)}
              className={`lg:hidden rounded-lg px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap border transition-all ${
                touchOrbitEnabled
                  ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50'
                  : 'text-white/60 border-white/10'
              }`}
            >
              {touchOrbitEnabled ? '3D Orbit: ON' : '3D Orbit'}
            </button>

            {/* Desktop All-Callout Toggle (lg+) */}
            <span className="hidden lg:inline h-4 w-px bg-white/15 mx-1" />
            <button
              type="button"
              onClick={() => setShowAllCallouts((v) => !v)}
              className={`hidden lg:inline-block rounded-lg px-3.5 py-2 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                showAllCallouts
                  ? 'bg-white/20 text-[#00ff41] border border-[#00ff41]/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {showAllCallouts ? 'All 4 Callouts: ON' : 'Auto Phase Callouts'}
            </button>
          </div>
        </div>

        {/* Desktop 4 Glassmorphism Callout Cards (lg+) */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
          {callouts.map((c) => {
            const isLeft = c.cardSide === 'left';
            const isTop = c.cardSlot === 'top';
            return (
              <div
                key={c.id}
                style={{
                  top: isTop ? '18%' : '52%',
                }}
                className={`pointer-events-auto absolute w-[280px] xl:w-[320px] ${
                  isLeft ? 'left-7 xl:left-14' : 'right-7 xl:right-14'
                } p-5 xl:p-6 transition-all duration-500 rounded-2xl backdrop-blur-xl border ${
                  c.visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3 pointer-events-none'
                } ${
                  c.active
                    ? 'bg-black/80 border-[#00ff41]/55 shadow-[0_0_30px_rgba(0,255,65,0.14)]'
                    : 'bg-black/60 border-white/15'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ff41] font-bold">
                    CALLOUT {c.number}
                  </span>
                  <span className="text-[9px] xl:text-[10px] font-mono text-white/55 bg-white/5 rounded border border-white/10 px-2 py-0.5 truncate">
                    {c.displacementLabel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-1">
                  {c.title}
                </h3>
                <p className="text-xs font-mono text-[#00ff41]/90 mb-3.5">{c.subtitle}</p>
                <ul className="space-y-2 border-t border-white/10 pt-3">
                  {c.specs.map((s, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] text-white/75 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Dock — Mobile Active Callout Card (< lg) + 4-Phase Interactive Stepper */}
        <div className="pointer-events-auto absolute z-30 bottom-3 sm:bottom-5 lg:bottom-7 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10">
          <div className="max-w-6xl mx-auto space-y-2.5 sm:space-y-3">
            {/* Mobile & Tablet Active Callout Card (< lg) */}
            {activeMobileCallout && (
              <div className="lg:hidden bg-black/85 backdrop-blur-xl border border-[#00ff41]/40 rounded-xl p-3.5 sm:p-4 shadow-2xl">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00ff41] font-bold">
                    CALLOUT {activeMobileCallout.number} // {activeMobileCallout.subtitle}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/60 bg-white/5 rounded border border-white/10 px-2 py-0.5 shrink-0">
                    {activeMobileCallout.displacementLabel.split('/')[0]}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {activeMobileCallout.title}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 pt-1.5 border-t border-white/10">
                  {activeMobileCallout.specs.slice(0, 2).map((s, idx) => (
                    <p
                      key={idx}
                      className="text-[11px] text-white/75 flex items-center gap-2 truncate"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shrink-0" />
                      <span className="truncate">{s}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* 4-Phase Interactive Stepper */}
            <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3.5">
                {phases.map((ph) => {
                  const isCurrent = activePhaseIndex === ph.phase;
                  return (
                    <button
                      key={ph.phase}
                      type="button"
                      onClick={() => jumpToProgress(ph.targetP)}
                      className={`text-left rounded-lg sm:rounded-xl p-2 sm:p-3.5 border transition-all ${
                        isCurrent
                          ? 'bg-[#00ff41]/15 border-[#00ff41]/60'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5 sm:mb-1">
                        <span className={isCurrent ? 'text-[#00ff41] font-bold' : 'text-white/50'}>
                          <span className="sm:hidden">0{ph.phase}</span>
                          <span className="hidden sm:inline">
                            Phase 0{ph.phase} ({ph.range})
                          </span>
                        </span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-white truncate">
                        <span className="sm:hidden">{ph.shortTitle}</span>
                        <span className="hidden sm:inline">{ph.title}</span>
                      </p>
                      <p className="hidden md:block text-[10px] font-mono text-white/50 truncate mt-1">
                        {ph.metric}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
