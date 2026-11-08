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

// Parse ISO-10303-21 STEP file text into 3D line segments (converted to glTF Y-up, Z-forward space)
function parseStepFileToSegments(stepText: string): {
  telemetry: StepTelemetry;
  groups: Record<string, Float32Array>;
} {
  const countOccurrences = (needle: string) => {
    let count = 0;
    let pos = 0;
    while ((pos = stepText.indexOf(needle, pos)) !== -1) {
      count++;
      pos += needle.length;
    }
    return count;
  };

  const pts = new Map<string, [number, number, number]>();
  const ptRe =
    /#(\d+)\s*=\s*CARTESIAN_POINT\s*\(\s*'[^']*'\s*,\s*\(\s*([-+0-9.Ee]+)\s*,\s*([-+0-9.Ee]+)\s*,\s*([-+0-9.Ee]+)\s*\)\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = ptRe.exec(stepText)) !== null) {
    pts.set(m[1], [parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])]);
  }

  const dirs = new Map<string, [number, number, number]>();
  const dirRe =
    /#(\d+)\s*=\s*DIRECTION\s*\(\s*'[^']*'\s*,\s*\(\s*([-+0-9.Ee]+)\s*,\s*([-+0-9.Ee]+)\s*,\s*([-+0-9.Ee]+)\s*\)\s*\)/g;
  while ((m = dirRe.exec(stepText)) !== null) {
    dirs.set(m[1], [parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])]);
  }

  const axes = new Map<string, { ptId: string; zId: string; xId: string }>();
  const axisRe =
    /#(\d+)\s*=\s*AXIS2_PLACEMENT_3D\s*\(\s*'[^']*'\s*,\s*#(\d+)\s*,\s*#(\d+)\s*,\s*#(\d+)\s*\)/g;
  while ((m = axisRe.exec(stepText)) !== null) {
    axes.set(m[1], { ptId: m[2], zId: m[3], xId: m[4] });
  }

  const circles = new Map<string, { axisId: string; radius: number }>();
  const circRe =
    /#(\d+)\s*=\s*CIRCLE\s*\(\s*'[^']*'\s*,\s*#(\d+)\s*,\s*([-+0-9.Ee]+)\s*\)/g;
  while ((m = circRe.exec(stepText)) !== null) {
    circles.set(m[1], { axisId: m[2], radius: parseFloat(m[3]) });
  }

  const vtx = new Map<string, [number, number, number]>();
  const vtxRe = /#(\d+)\s*=\s*VERTEX_POINT\s*\(\s*'[^']*'\s*,\s*#(\d+)\s*\)/g;
  while ((m = vtxRe.exec(stepText)) !== null) {
    const p = pts.get(m[2]);
    if (p) vtx.set(m[1], p);
  }

  const buckets: Record<string, number[]> = {
    dorsal: [],
    ventral: [],
    gimbal: [],
    lens: [],
    sensors: [],
    rotors: [],
  };

  // Classify a CAD point (x_cad, y_cad, z_cad) into the subsystem it belongs to
  const classifyCadPoint = (x: number, y: number, z: number): string => {
    // Lens region: X > 66.2, near centerline
    if (x > 66.2 && Math.abs(y) < 10.5 && Math.abs(z) < 10.5) {
      return 'lens';
    }
    // Gimbal sphere region: X in [49, 71], |Y| <= 13, |Z| <= 12.5
    if (x >= 49.0 && x <= 71.5 && Math.abs(y) <= 13.0 && Math.abs(z) <= 12.5) {
      return 'gimbal';
    }
    // LiDAR & VIO upper nose sensors
    if (x >= 61.5 && z >= 7.5 && Math.abs(y) <= 15.0) {
      return 'sensors';
    }
    // Rotor blades inside the 4 ducts (centers at (+33, ±52) and (-35, ±52), Z in [-6.5, +4.5])
    const d1 = Math.hypot(x - 33.0, Math.abs(y) - 52.0);
    const d2 = Math.hypot(x + 35.0, Math.abs(y) - 52.0);
    if ((d1 < 21.8 || d2 < 21.8) && z > -6.5 && z < 4.5) {
      return 'rotors';
    }
    if (z >= 0.0) {
      return 'dorsal';
    }
    return 'ventral';
  };

  // Convert CAD (x_cad, y_cad, z_cad) -> glTF (X = y_cad, Y = z_cad, Z = x_cad)
  const pushSegmentCad = (
    target: number[],
    p1: [number, number, number],
    p2: [number, number, number]
  ) => {
    target.push(p1[1], p1[2], p1[0], p2[1], p2[2], p2[0]);
  };

  let edgeCurveCount = 0;
  const edgeRe =
    /#(\d+)\s*=\s*EDGE_CURVE\s*\(\s*'[^']*'\s*,\s*#(\d+)\s*,\s*#(\d+)\s*,\s*#(\d+)/g;
  while ((m = edgeRe.exec(stepText)) !== null) {
    edgeCurveCount++;
    const v1 = vtx.get(m[2]);
    const v2 = vtx.get(m[3]);
    const curveId = m[4];

    if (circles.has(curveId)) {
      const cInfo = circles.get(curveId)!;
      const ax = axes.get(cInfo.axisId);
      if (ax) {
        const center = pts.get(ax.ptId);
        const normal = dirs.get(ax.zId);
        const refX = dirs.get(ax.xId);
        if (center && normal && refX && cInfo.radius > 0.5) {
          // Cross product Y_axis = normal x refX
          const ry: [number, number, number] = [
            normal[1] * refX[2] - normal[2] * refX[1],
            normal[2] * refX[0] - normal[0] * refX[2],
            normal[0] * refX[1] - normal[1] * refX[0],
          ];
          const groupKey = classifyCadPoint(center[0], center[1], center[2]);
          const bucket = buckets[groupKey];
          const segs = cInfo.radius > 10 ? 36 : 18;
          for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            const pA: [number, number, number] = [
              center[0] + cInfo.radius * (Math.cos(a0) * refX[0] + Math.sin(a0) * ry[0]),
              center[1] + cInfo.radius * (Math.cos(a0) * refX[1] + Math.sin(a0) * ry[1]),
              center[2] + cInfo.radius * (Math.cos(a0) * refX[2] + Math.sin(a0) * ry[2]),
            ];
            const pB: [number, number, number] = [
              center[0] + cInfo.radius * (Math.cos(a1) * refX[0] + Math.sin(a1) * ry[0]),
              center[1] + cInfo.radius * (Math.cos(a1) * refX[1] + Math.sin(a1) * ry[1]),
              center[2] + cInfo.radius * (Math.cos(a1) * refX[2] + Math.sin(a1) * ry[2]),
            ];
            pushSegmentCad(bucket, pA, pB);
          }
          continue;
        }
      }
    }

    if (v1 && v2) {
      const dist = Math.hypot(v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]);
      if (dist > 0.25) {
        const mx = 0.5 * (v1[0] + v2[0]);
        const my = 0.5 * (v1[1] + v2[1]);
        const mz = 0.5 * (v1[2] + v2[2]);
        const groupKey = classifyCadPoint(mx, my, mz);
        pushSegmentCad(buckets[groupKey], v1, v2);
      }
    }
  }

  const groups: Record<string, Float32Array> = {};
  for (const [k, arr] of Object.entries(buckets)) {
    groups[k] = new Float32Array(arr);
  }

  return {
    telemetry: {
      loaded: true,
      fileSizeKB: Math.round(stepText.length / 1024),
      products: countOccurrences('PRODUCT('),
      manifoldSolids: countOccurrences('MANIFOLD_SOLID_BREP('),
      closedShells: countOccurrences('CLOSED_SHELL('),
      advancedFaces: countOccurrences('ADVANCED_FACE('),
      edgeCurves: edgeCurveCount,
      cartesianPoints: pts.size,
      circles: circles.size,
    },
    groups,
  };
}

export default function VanguardExplodedViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('hybrid');
  const [showAllCallouts, setShowAllCallouts] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [stepTelemetry, setStepTelemetry] = useState<StepTelemetry>({
    loaded: false,
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

  // Refs shared with the animation loop
  const effectiveProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const renderModeRef = useRef<RenderMode>('hybrid');
  const showAllCalloutsRef = useRef(false);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    effectiveProgressRef.current = manualOverride !== null ? manualOverride : scrollProgress;
  }, [scrollProgress, manualOverride]);

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  useEffect(() => {
    showAllCalloutsRef.current = showAllCallouts;
  }, [showAllCallouts]);

  // Listen to window scroll to compute 0.0 -> 1.0 progress within the 520vh scroll track
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

  // Jump to a specific scroll phase smoothly
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

  // Main Three.js Scene + GLB Loader + STEP B-Rep Loader + Animation Loop
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const width = wrapper.clientWidth || 1280;
    const height = wrapper.clientHeight || 800;
    setViewportSize({ width, height });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0C0E');
    scene.fog = new THREE.FogExp2('#0B0C0E', 0.00085);

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
    renderer.toneMappingExposure = 1.25;

    wrapper.innerHTML = '';
    wrapper.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.82;

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
    const hemiLight = new THREE.HemisphereLight(0xdbe6f5, 0x0b0c0e, 0.85);
    scene.add(hemiLight);

    // Main Warm-White Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xfffcf5, 2.6);
    keyLight.position.set(260, 380, 320);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 50;
    keyLight.shadow.camera.far = 1100;
    const d = 240;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Steel-Blue Rim Light (Aft-Port Backlight for razor-sharp chine highlights)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.85);
    rimLight.position.set(-300, 180, -280);
    scene.add(rimLight);

    // Subtle Sisko Emerald Tactical Under-Fill Light
    const tacticalLight = new THREE.DirectionalLight(0x00ff41, 0.45);
    tacticalLight.position.set(0, -260, 120);
    scene.add(tacticalLight);

    // Soft Nose Fill Light for the 4K Sapphire Lens & Gold-Dichroic LiDAR Windows
    const noseSpot = new THREE.PointLight(0x38bdf8, 1.4, 420);
    noseSpot.position.set(0, 20, 240);
    scene.add(noseSpot);

    // Subtle Tactical Floor Reference Grid at Y = -210mm
    const gridHelper = new THREE.GridHelper(640, 32, 0x1e293b, 0x131720);
    gridHelper.position.y = -215;
    scene.add(gridHelper);

    // Root assembly group (receives subtle idle hover float)
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

    // Individual radial sensor groups
    const radialSensorGroups: {
      name: string;
      group: THREE.Group;
      dirX: number;
      dirY: number;
      dirZ: number;
    }[] = [];

    // 4x Individual spinning & elevating rotor groups
    // Duct centers in glTF space (X = y_cad, Y = z_cad, Z = x_cad)
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

    // Collections for dynamic render mode switching (PBR vs STEP B-Rep overlay vs Wireframe)
    const pbrMeshes: THREE.Mesh[] = [];
    const glbChineEdges: THREE.LineSegments[] = [];
    const stepEdgeLines: THREE.LineSegments[] = [];

    // High-luxury defense-tech physical materials per node
    const buildMaterialForNode = (name: string): THREE.MeshPhysicalMaterial => {
      if (name === 'Main_Hull_Top') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#1c2026'),
          metalness: 0.35,
          roughness: 0.48,
          clearcoat: 0.25,
          clearcoatRoughness: 0.4,
        });
      }
      if (name === 'Main_Hull_Ventral') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#15181e'),
          metalness: 0.3,
          roughness: 0.55,
          clearcoat: 0.15,
        });
      }
      if (name.startsWith('Ducted_Propeller')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#2d3540'),
          metalness: 0.65,
          roughness: 0.28,
          clearcoat: 0.4,
        });
      }
      if (name === 'Gimbal_Sphere_Assembly') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#282e38'),
          metalness: 0.82,
          roughness: 0.22,
          clearcoat: 0.5,
        });
      }
      if (name === 'Primary_4K_Lens') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0ea5e9'),
          emissive: new THREE.Color('#0284c7'),
          emissiveIntensity: 0.35,
          metalness: 0.15,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          reflectivity: 1.0,
        });
      }
      if (name.startsWith('Sensor_')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#f59e0b'),
          emissive: new THREE.Color('#d97706'),
          emissiveIntensity: 0.32,
          metalness: 0.4,
          roughness: 0.12,
          clearcoat: 1.0,
        });
      }
      if (name === 'AVIARS_Core_Thermal_Sink') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#10b981'),
          emissive: new THREE.Color('#059669'),
          emissiveIntensity: 0.22,
          metalness: 0.72,
          roughness: 0.25,
          clearcoat: 0.6,
        });
      }
      if (name === 'Modular_Kinetic_Payload') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#3b4252'),
          emissive: new THREE.Color('#ef4444'),
          emissiveIntensity: 0.1,
          metalness: 0.78,
          roughness: 0.26,
          clearcoat: 0.45,
        });
      }
      // Fasteners_Hardware
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#94a3b8'),
        metalness: 0.9,
        roughness: 0.18,
      });
    };

    const applyRenderModeStyles = () => {
      const mode = renderModeRef.current;
      pbrMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mode === 'step-xray') {
          mat.transparent = true;
          mat.opacity = 0.16;
          mat.depthWrite = false;
        } else {
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.depthWrite = true;
        }
        mat.needsUpdate = true;
      });

      glbChineEdges.forEach((line) => {
        const lmat = line.material as THREE.LineBasicMaterial;
        lmat.opacity = mode === 'hybrid' ? 0.22 : mode === 'step-overlay' ? 0.35 : 0.45;
      });

      stepEdgeLines.forEach((line) => {
        line.visible = mode === 'step-overlay' || mode === 'step-xray';
        const lmat = line.material as THREE.LineBasicMaterial;
        lmat.opacity = mode === 'step-xray' ? 0.85 : 0.55;
      });
    };

    // 1. Load the hierarchical GLTF (.GLB) model
    const loader = new GLTFLoader();
    loader.load(
      '/models/sa1_vanguard.glb',
      (gltf) => {
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

          // Add razor-sharp hard-chine crease highlight lines (threshold 28 degrees)
          const edgesGeom = new THREE.EdgesGeometry(geom, 28);
          const edgeColor =
            nodeName === 'AVIARS_Core_Thermal_Sink'
              ? 0x00ff41
              : nodeName === 'Primary_4K_Lens'
              ? 0x38bdf8
              : nodeName.startsWith('Sensor_')
              ? 0xfbbf24
              : nodeName === 'Modular_Kinetic_Payload'
              ? 0xf87171
              : 0x64748b;
          const edgesMat = new THREE.LineBasicMaterial({
            color: edgeColor,
            transparent: true,
            opacity: 0.22,
          });
          const chineLines = new THREE.LineSegments(edgesGeom, edgesMat);
          mesh.add(chineLines);
          glbChineEdges.push(chineLines);

          // Route each mesh into its corresponding hierarchical animation group
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
            // Translate geometry so rotor center is at local (0,0,0) for true shaft rotation
            geom.translate(-rc.hubX, -rc.hubY, -rc.hubZ);
            edgesGeom.translate(-rc.hubX, -rc.hubY, -rc.hubZ);
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
        setModelLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Error loading SA-1 Vanguard GLB:', err);
      }
    );

    // 2. Fetch and parse the ISO-10303-21 STEP B-Rep CAD file (/models/sa1_vanguard.step)
    let isCancelled = false;
    fetch('/models/sa1_vanguard.step')
      .then((res) => res.text())
      .then((stepText) => {
        if (isCancelled) return;
        const parsed = parseStepFileToSegments(stepText);
        setStepTelemetry(parsed.telemetry);

        const attachStepGroup = (
          positions: Float32Array,
          targetGroup: THREE.Group,
          colorHex: number
        ) => {
          if (!positions || positions.length === 0) return;
          const bGeom = new THREE.BufferGeometry();
          bGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const bMat = new THREE.LineBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.6,
          });
          const lines = new THREE.LineSegments(bGeom, bMat);
          lines.visible =
            renderModeRef.current === 'step-overlay' || renderModeRef.current === 'step-xray';
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
        console.error('Error parsing STEP file:', err);
      });

    // 3D Anchor Helpers for the 4 Callout Leader Lines
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
    let lastCalloutUpdate = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smoothly damp scroll progress for cinematic Apple-grade fluid motion
      const targetP = effectiveProgressRef.current;
      smoothedProgressRef.current += (targetP - smoothedProgressRef.current) * 0.1;
      const p = smoothedProgressRef.current;

      // =======================================================================
      // 4-PHASE EXPLODED TRANSLATION (Z / Y AXES) BOUND TO SCROLL PROGRESS
      // =======================================================================
      // Phase 1 (0.00 - 0.25): Fully assembled SA-1 Vanguard hovering with subtle idle float
      // Phase 2 (0.25 - 0.50): Dorsal Hull separates upwards along +Y (+150mm), exposing thermal sinks & patch antennae
      // Phase 3 (0.50 - 0.75):
      //   - Nose Gimbal Assembly & 4K sapphire optical lens pull forward along +Z (+120mm)
      //   - Peripheral solid-state LiDAR apertures expand radially
      //   - 4x ducted rotor props elevate slightly within their nacelles
      // Phase 4 (0.75 - 1.00):
      //   - Ventral Chassis lowers along -Y (-100mm)
      //   - Modular precision kinetic payload / micro-munition drops down onto its own focal plane
      const t2 = smoothstep(0.25, 0.5, p);
      const t3 = smoothstep(0.5, 0.75, p);
      const t4 = smoothstep(0.75, 1.0, p);

      // Subtle idle hover float (Phase 1 prominent, persists gently throughout)
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

      // Smooth camera choreography across the 4 phases (when user is not manually dragging)
      if (!userInteractingRef.current) {
        // Orbit angle sweeps gently from isometric front-starboard to profile-isometric so all +Y/+Z/-Y axes are crystal clear
        const camAngle = 0.68 - 0.18 * t2 + 0.26 * t3 - 0.12 * t4 + Math.sin(elapsed * 0.25) * 0.03;
        const camRadius = 395 + 45 * t2 + 35 * t3 + 45 * t4;
        const camHeight = 115 + 35 * t2 - 15 * t3 - 25 * t4;
        const targetCamX = Math.sin(camAngle) * camRadius;
        const targetCamZ = Math.cos(camAngle) * camRadius;

        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (camHeight - camera.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        const lookY = 12 * t2 - 18 * t4;
        const lookZ = 15 * t3;
        controls.target.lerp(new THREE.Vector3(0, lookY, lookZ), 0.08);
      }

      controls.update();
      renderer.render(scene, camera);

      // Update 2D screen projections for the 4 Callout 1px leader lines (~30fps React state sync)
      if (elapsed - lastCalloutUpdate > 0.033) {
        lastCalloutUpdate = elapsed;
        const w = wrapper.clientWidth || 1280;
        const h = wrapper.clientHeight || 800;

        // Compute world coordinates of the 4 component anchors
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
            active: p < 0.25 || (p >= 0.5 && p < 0.75),
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

    // Watch for renderMode updates via interval check
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

  const t2Display = smoothstep(0.25, 0.5, activeProgress);
  const t3Display = smoothstep(0.5, 0.75, activeProgress);
  const t4Display = smoothstep(0.75, 1.0, activeProgress);

  const phases = [
    {
      phase: 1,
      range: '0% – 25%',
      targetP: 0.08,
      title: 'Tactical Stealth Hover',
      desc: 'Fully assembled SA-1 Vanguard in low-observable flight trim with subtle idle float and enclosed acoustic propulsion.',
      metric: 'RCS < 0.0004 m² // IDLE FLOAT',
    },
    {
      phase: 2,
      range: '25% – 50%',
      targetP: 0.42,
      title: 'Dorsal Monocoque Separation',
      desc: 'Dorsal carbon hull separates upwards along +Y (+150mm), exposing internal skived thermal sinks, A.V.I.A.R.S. compute core, and conformal GNSS patch antenna.',
      metric: 'DORSAL HULL ΔY: +150.0 mm',
    },
    {
      phase: 3,
      range: '50% – 75%',
      targetP: 0.67,
      title: 'Multi-Spectral Optics & Rotor Array',
      desc: 'Nose Gimbal Assembly and 4K sapphire optical lens pull forward along +Z (+120mm), solid-state LiDAR apertures expand radially, and 4× ducted rotors elevate.',
      metric: 'OPTICS ΔZ: +120.0 mm // RADIAL LIDAR',
    },
    {
      phase: 4,
      range: '75% – 100%',
      targetP: 0.96,
      title: 'Ventral Chassis & Kinetic Hardpoint',
      desc: 'Ventral chassis lowers along -Y (-100mm) as the modular precision-guided kinetic micro-munition drops down onto its own focal plane.',
      metric: 'VENTRAL ΔY: -100.0 mm // PAYLOAD DEPLOY',
    },
  ];

  // Calculate fixed screen coordinates for the 4 callout card anchor terminals
  const getCardAnchorBox = (c: CalloutScreenPos) => {
    const isLeft = c.cardSide === 'left';
    const isTop = c.cardSlot === 'top';
    const cardWidth = 310;
    const xEdge = isLeft ? 48 + cardWidth : viewportSize.width - 48 - cardWidth;
    const yCenter = isTop ? viewportSize.height * 0.27 : viewportSize.height * 0.68;
    return { xEdge, yCenter, isLeft, isTop };
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '520vh' }}>
      {/* Sticky Full-Viewport 3D Storytelling Stage */}
      <div
        className="sticky top-20 lg:top-24 w-full overflow-hidden bg-[#0B0C0E] border-y border-white/10"
        style={{ height: 'calc(100vh - 5rem)' }}
      >
        {/* Subtle Studio Radial Lighting Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 52% 46%, rgba(30, 41, 59, 0.28) 0%, rgba(11, 12, 14, 0.92) 72%)',
          }}
        />

        {/* Three.js WebGL Canvas Mount */}
        <div ref={canvasWrapperRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />

        {/* SVG 1px Leader Lines & Target Reticles Overlay */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 w-full h-full hidden lg:block"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="leaderLineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff41" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="leaderLineGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00ff41" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {callouts.map((c) => {
            if (!c.visible) return null;
            const { xEdge, yCenter, isLeft } = getCardAnchorBox(c);
            const elbowX = isLeft ? xEdge + 42 : xEdge - 42;
            const ax = Math.max(80, Math.min(viewportSize.width - 80, c.anchorX));
            const ay = Math.max(60, Math.min(viewportSize.height - 60, c.anchorY));

            return (
              <g key={c.id} className="transition-opacity duration-500">
                {/* 1px Crisp Elbow Leader Line */}
                <polyline
                  points={`${xEdge},${yCenter} ${elbowX},${yCenter} ${ax},${ay}`}
                  fill="none"
                  stroke={c.active ? '#00ff41' : 'rgba(255,255,255,0.38)'}
                  strokeWidth="1"
                />
                {/* Card Terminal Node */}
                <circle
                  cx={xEdge}
                  cy={yCenter}
                  r="3"
                  fill={c.active ? '#00ff41' : '#94a3b8'}
                />
                {/* 3D Component Anchor Target Reticle */}
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

        {/* Top Bar HUD — Phase Status + CAD Format Controls */}
        <div className="pointer-events-none absolute top-5 left-6 right-6 z-30 flex flex-wrap items-center justify-between gap-4">
          <div className="pointer-events-auto flex items-center gap-4 bg-black/65 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#00ff41]">
                SA-1 &ldquo;VANGUARD&rdquo; // PHASE 0{activePhaseIndex} OF 04
              </p>
              <p className="text-xs font-semibold text-white tracking-wide">
                {phases[activePhaseIndex - 1].title}{' '}
                <span className="text-white/45 font-mono ml-2">
                  [{Math.round(activeProgress * 100)}% EXPLODED]
                </span>
              </p>
            </div>
          </div>

          {/* Interactive CAD Layer & Callout Switcher */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-black/65 backdrop-blur-xl border border-white/10 p-1.5 rounded-lg">
            <button
              type="button"
              onClick={() => setRenderMode('hybrid')}
              className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
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
              className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
                renderMode === 'step-overlay'
                  ? 'bg-[#00ff41] text-black font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              .GLB + .STEP B-Rep
            </button>
            <button
              type="button"
              onClick={() => setRenderMode('step-xray')}
              className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
                renderMode === 'step-xray'
                  ? 'bg-[#00ff41] text-black font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              ISO-10303 .STEP Wireframe
            </button>
            <span className="h-4 w-px bg-white/15 mx-1" />
            <button
              type="button"
              onClick={() => setShowAllCallouts((v) => !v)}
              className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
                showAllCallouts
                  ? 'bg-white/20 text-[#00ff41] border border-[#00ff41]/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {showAllCallouts ? 'All 4 Callouts: ON' : 'Auto Phase Callouts'}
            </button>
          </div>
        </div>

        {/* 4 Glassmorphism Callout Cards (Desktop Anchored + Mobile Responsive) */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
          {callouts.map((c) => {
            const isLeft = c.cardSide === 'left';
            const isTop = c.cardSlot === 'top';
            return (
              <div
                key={c.id}
                style={{
                  width: '310px',
                  left: isLeft ? '48px' : undefined,
                  right: !isLeft ? '48px' : undefined,
                  top: isTop ? '18%' : '57%',
                }}
                className={`pointer-events-auto absolute transition-all duration-500 rounded-xl p-5 backdrop-blur-xl border ${
                  c.visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3 pointer-events-none'
                } ${
                  c.active
                    ? 'bg-black/75 border-[#00ff41]/55 shadow-[0_0_30px_rgba(0,255,65,0.14)]'
                    : 'bg-black/55 border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ff41] font-bold">
                    CALLOUT {c.number}
                  </span>
                  <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {c.displacementLabel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-0.5">
                  {c.title}
                </h3>
                <p className="text-xs font-mono text-[#00ff41]/90 mb-3">{c.subtitle}</p>
                <ul className="space-y-1.5 border-t border-white/10 pt-2.5">
                  {c.specs.map((s, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] text-white/70 leading-snug flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#00ff41] mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Dock — 4-Phase Interactive Scrubber & Live Z/Y Axis Telemetry */}
        <div className="pointer-events-auto absolute bottom-5 left-6 right-6 z-30">
          <div className="max-w-6xl mx-auto bg-black/75 backdrop-blur-xl border border-white/15 rounded-xl p-4 sm:p-5 shadow-2xl">
            {/* Phase Stepper Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {phases.map((ph) => {
                const isCurrent = activePhaseIndex === ph.phase;
                return (
                  <button
                    key={ph.phase}
                    type="button"
                    onClick={() => jumpToProgress(ph.targetP)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-[#00ff41]/10 border-[#00ff41]/60'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
                      <span className={isCurrent ? 'text-[#00ff41] font-bold' : 'text-white/50'}>
                        Phase 0{ph.phase} ({ph.range})
                      </span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">{ph.title}</p>
                    <p className="text-[10px] font-mono text-white/50 truncate mt-0.5">
                      {ph.metric}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Interactive Explode Scrubber Slider + Live Axis Readouts */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3 w-full md:w-1/2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 whitespace-nowrap">
                  EXPLODE (0.0 → 1.0)
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.005}
                  value={activeProgress}
                  onChange={(e) => setManualOverride(parseFloat(e.target.value))}
                  aria-label="Exploded View Progress Slider"
                  className="w-full accent-[#00ff41] cursor-pointer h-1.5 bg-white/15 rounded-lg"
                />
                {manualOverride !== null && (
                  <button
                    type="button"
                    onClick={() => setManualOverride(null)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#00ff41] hover:underline whitespace-nowrap"
                  >
                    Sync Scroll
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-4 text-[11px] font-mono text-white/75">
                <span>
                  DORSAL (+Y):{' '}
                  <strong className="text-[#00ff41]">
                    +{(150 * t2Display).toFixed(0)}mm
                  </strong>
                </span>
                <span>
                  OPTICS (+Z):{' '}
                  <strong className="text-[#38bdf8]">
                    +{(120 * t3Display).toFixed(0)}mm
                  </strong>
                </span>
                <span>
                  VENTRAL (-Y):{' '}
                  <strong className="text-amber-400">
                    -{(100 * t4Display).toFixed(0)}mm
                  </strong>
                </span>
                <span className="hidden sm:inline text-white/40">|</span>
                <span className="hidden sm:inline text-white/50">
                  STEP B-REP:{' '}
                  <strong className="text-white/85">
                    {stepTelemetry.edgeCurves} EDGES / {stepTelemetry.advancedFaces} FACES
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {!modelLoaded && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0B0C0E]/90 backdrop-blur-md">
            <div className="w-10 h-10 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#00ff41]">
              Loading SA-1 Vanguard .GLB &amp; ISO-10303-21 .STEP Assembly...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
