'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ScenarioType = 'land' | 'air' | 'naval';
type MissionMode = 'recon' | 'attack';

interface TargetSpec {
  id: string;
  code: string;
  name: string;
  classification: string;
  telemetryRecon: string;
  telemetryAttack: string;
  capabilityLayer: string;
  howItWorksRecon: string;
  howItWorksAttack: string;
  componentName: string;
  componentSpec: string;
  worldPos: [number, number, number];
}

interface ProjectedTarget extends TargetSpec {
  screenX: number;
  screenY: number;
  inFront: boolean;
  distanceMeters: number;
  isPrimaryLock: boolean;
}

const SCENARIO_CONFIGS: Record<
  ScenarioType,
  {
    label: string;
    shortLabel: string;
    sectorName: string;
    altitudeLabel: string;
    environmentDesc: string;
    targets: [TargetSpec, TargetSpec, TargetSpec];
    secondaryLabels: string[];
  }
> = {
  land: {
    label: 'Land // Urban Battlefield',
    shortLabel: 'Land',
    sectorName: 'SECTOR 01 // CONTESTED URBAN CORRIDOR (GPS-DENIED)',
    altitudeLabel: 'ALT: 42.5 M AGL // URBAN CANYON',
    environmentDesc: 'Dense urban structures, thermal smoke plumes & active RF jamming',
    targets: [
      {
        id: 'land-t1',
        code: 'TGT-ALPHA // 01',
        name: 'Concealed Mobile SAM Launcher',
        classification: 'THERMAL + SAR SIGNATURE CONFIRMED',
        telemetryRecon: 'PASSIVE IR LOCK // EMISSION: 84°C // COORDS ENCRYPTED',
        telemetryAttack: 'TERMINAL SEEKER LOCK // IMPACT T-1.8s // CEP < 0.15m',
        capabilityLayer: 'LAYER 01 — REAL-TIME MULTI-SPECTRAL SENSOR FUSION (120 FPS)',
        howItWorksRecon:
          'Fuses 4K optical video, thermal infrared (LWIR), and synthetic aperture radar (SAR) feeds simultaneously at 120 FPS to expose camouflaged thermal signatures through urban smoke and fog.',
        howItWorksAttack:
          'Correlates thermal exhaust plumes with 3D LiDAR surface geometry at 120 FPS to pinpoint the vulnerable missile canister warhead section for surgical micro-munition strike.',
        componentName: 'Forward 4K Sapphire Gimbal + 3× Quartz LiDAR Array',
        componentSpec: '24.0 mm 2-Axis Spherical Gimbal // -36° / 0° / +36° Solid-State LiDAR',
        worldPos: [-36, -24, -270],
      },
      {
        id: 'land-t2',
        code: 'TGT-BRAVO // 02',
        name: 'Armored Command Convoy (Moving)',
        classification: 'MULTI-TARGET NEURAL LOCK [12/64 TRACKS]',
        telemetryRecon: 'VIO TRACKING // VEL: 48 KM/H // AES-256 FHSS UPLINK',
        telemetryAttack: 'LEAD-ANGLE BALLISTIC SOLUTION // LASER DESIGNATOR ACTIVE',
        capabilityLayer: 'LAYER 02 & 03 — AUTONOMOUS TARGET TRACKING & HARDENED UPLINK',
        howItWorksRecon:
          'Deep neural networks lock onto moving ground vehicles in GPS-denied urban canyons using Visual Inertial Odometry (VIO), transmitting coordinates over quantum-safe AES-256 frequency-hopping links.',
        howItWorksAttack:
          'Computes predictive lead-pursuit vectors on moving armor while resisting MIL-STD-461G electronic warfare jamming via autonomous onboard visual-inertial lock.',
        componentName: 'Dual 3.0 mm Stereo VIO Cameras + Conformal FHSS Patch',
        componentSpec: 'GPS-Denied Visual Odometry // MIL-STD-461G Jamming-Proof Telemetry',
        worldPos: [42, -26, -540],
      },
      {
        id: 'land-t3',
        code: 'TGT-CHARLIE // 03',
        name: 'Fortified C4ISR Radar Node',
        classification: 'HIGH-PRIORITY STRATEGIC EMITTER',
        telemetryRecon: 'RF SPECTRUM MAPPED // 0% CLOUD DEPENDENCY // < 5ms TPU',
        telemetryAttack: 'VENTRAL BAY OPEN // KINETIC INTERDICTION AUTHORIZED',
        capabilityLayer: 'LAYER 04 — SUB-5MS NEUROMORPHIC EDGE AI & DUAL-MODE EXECUTION',
        howItWorksRecon:
          'Executes complete classification and RF emitter triangulation 100% onboard the neuromorphic TPU in under 5 milliseconds with zero cloud latency or external kill-switch vulnerability.',
        howItWorksAttack:
          'Onboard Edge TPU computes terminal ballistic trajectory and releases the precision-guided micro-munition from the internal flush bay with automated civilian fail-safe abort protocols.',
        componentName: 'A.V.I.A.R.S. Neuromorphic TPU + Modular Ventral Hardpoint',
        componentSpec: '< 5 ms Decision Loop (18W Peak) // Zero-Drag Internal Munition Bay',
        worldPos: [-18, -16, -810],
      },
    ],
    secondaryLabels: ['INFANTRY SQUAD [0.98]', 'UGV PATROL [0.96]', 'RF JAMMER [0.99]', 'RELAY TOWER [0.95]'],
  },
  air: {
    label: 'Air // Counter-UAS Intercept',
    shortLabel: 'Air',
    sectorName: 'SECTOR 02 // LOW-ALTITUDE CONTESTED AIRSPACE',
    altitudeLabel: 'ALT: 310.0 M ASL // INTERCEPT VECTOR',
    environmentDesc: 'High-speed aerial swarm interception & micro-Doppler tracking',
    targets: [
      {
        id: 'air-t1',
        code: 'AIR-ALPHA // 01',
        name: 'Hostile Reconnaissance Micro-UAV',
        classification: 'LOW-RCS AERIAL INTRUDER DETECTED',
        telemetryRecon: 'MICRO-DOPPLER LOCK // RCS: 0.002 m² // RANGE: 185m',
        telemetryAttack: 'INTERCEPT VECTOR LOCKED // CLOSING VEL: 64 M/S',
        capabilityLayer: 'LAYER 01 — REAL-TIME MULTI-SPECTRAL SENSOR FUSION (120 FPS)',
        howItWorksRecon:
          'Combines high-frequency micro-Doppler rotor blade signatures with 120 FPS thermal and 4K optical feeds to spot miniature carbon drones against cluttered cloud and skyline backgrounds.',
        howItWorksAttack:
          'Locks onto fast-moving aerial intruders at 120 FPS, fusing solid-state LiDAR rangefinding with optical contrast tracking for high-velocity air-to-air interdiction.',
        componentName: 'Forward 4K Sapphire Gimbal + 3× Quartz LiDAR Array',
        componentSpec: '120 FPS Multi-Spectral Fusion // 0.8 mm Dynamic Gimbal Clearance',
        worldPos: [-34, 14, -270],
      },
      {
        id: 'air-t2',
        code: 'AIR-BRAVO // 02',
        name: 'Autonomous Loitering Swarm (6× Units)',
        classification: 'SWARM CLUSTER TRACKING [38/64 TRACKS]',
        telemetryRecon: '64-TARGET SIMULTANEOUS TRACK // FHSS ENCRYPTED MESH',
        telemetryAttack: 'MULTI-VECTOR PRIORITY QUEUE // PRIMARY LEAD LOCKED',
        capabilityLayer: 'LAYER 02 & 03 — AUTONOMOUS TARGET TRACKING & HARDENED UPLINK',
        howItWorksRecon:
          'Tracks up to 64 independent airborne targets simultaneously using deep neural networks while sharing encrypted swarm telemetry across frequency-hopping spread spectrum (FHSS) links.',
        howItWorksAttack:
          'Autonomously ranks hostile swarm threats by kinematic time-to-impact and maintains terminal lock even under aggressive electronic warfare (EW) spoofing.',
        componentName: 'Dual 3.0 mm Stereo VIO + AES-256 Quantum-Safe Transceiver',
        componentSpec: 'Up to 64 Simultaneous Target Locks // Adaptive FHSS Anti-Jamming',
        worldPos: [38, -8, -540],
      },
      {
        id: 'air-t3',
        code: 'AIR-CHARLIE // 03',
        name: 'Airborne EW Jamming Relay Platform',
        classification: 'ACTIVE ELECTRONIC WARFARE SOURCE',
        telemetryRecon: 'PASSIVE RF HOMING // ONBOARD TPU INFERENCE: 4.1 ms',
        telemetryAttack: 'KINETIC INTERCEPT SOLUTION // FAIL-SAFE ABORT READY',
        capabilityLayer: 'LAYER 04 — SUB-5MS NEUROMORPHIC EDGE AI & DUAL-MODE EXECUTION',
        howItWorksRecon:
          'Processes raw RF signal anomalies and visual kinematics directly at the edge in under 5 ms, operating completely air-gapped from ground cloud networks.',
        howItWorksAttack:
          'Guides precision kinetic interception onto the hostile airborne relay using onboard neuromorphic TPU ballistic solvers and 4× serrated acoustic ducted thrust vectoring.',
        componentName: 'A.V.I.A.R.S. Neuromorphic TPU + 4× Serrated Ducted Rotors',
        componentSpec: '< 5 ms Edge AI Latency // 45.0 mm Enclosed Toroidal Carbon Ducts',
        worldPos: [-14, 10, -810],
      },
    ],
    secondaryLabels: ['SWARM NODE #02 [0.99]', 'SWARM NODE #03 [0.97]', 'LOITER MUNITION [0.98]', 'DECOY DRONE [0.94]'],
  },
  naval: {
    label: 'Naval // Singapore Strait Overwatch',
    shortLabel: 'Naval',
    sectorName: 'SECTOR 03 // SINGAPORE STRAIT & LITTORAL SEA LANES',
    altitudeLabel: 'ALT: 65.0 M MSL // MARITIME OVERWATCH',
    environmentDesc: 'Tropical monsoon haze penetration, dark-ship AIS audit & littoral defense',
    targets: [
      {
        id: 'naval-t1',
        code: 'NAV-ALPHA // 01',
        name: 'Unregistered "Dark Ship" Tanker',
        classification: 'AIS TRANSPONDER SPOOFING DETECTED',
        telemetryRecon: 'SAR + THERMAL HULL MATCH // AIS DISCREPANCY: 1.4 NM',
        telemetryAttack: 'RUDDER / PROPULSION SUBSYSTEM TARGETED // LOCK CONFIRMED',
        capabilityLayer: 'LAYER 01 — REAL-TIME MULTI-SPECTRAL SENSOR FUSION (120 FPS)',
        howItWorksRecon:
          'Penetrates heavy tropical rain, sea spray, and monsoon haze by fusing synthetic aperture radar (SAR) wake profiling with thermal infrared hull signatures at 120 FPS.',
        howItWorksAttack:
          'Isolates critical vessel propulsion and bridge radar arrays through zero-visibility maritime weather using co-aligned 4K optical, thermal IR, and LiDAR point clouds.',
        componentName: 'Forward 4K Sapphire Gimbal + Multi-Spectral Sensor Ring',
        componentSpec: 'All-Weather 24/7 Maritime Clarity // 120 FPS SAR + IR + Optical Fusion',
        worldPos: [-40, -24, -270],
      },
      {
        id: 'naval-t2',
        code: 'NAV-BRAVO // 02',
        name: 'High-Speed Littoral Fast Attack Craft',
        classification: 'UNAUTHORIZED SPEED ANOMALY [46 KNOTS]',
        telemetryRecon: 'WAKE VECTOR LOCK // 46 KTS // ENCRYPTED COASTAL ALERT',
        telemetryAttack: 'MOVING MARITIME LEAD SOLUTION // LASER DESIGNATOR LOCKED',
        capabilityLayer: 'LAYER 02 & 03 — AUTONOMOUS TARGET TRACKING & HARDENED UPLINK',
        howItWorksRecon:
          'Locks onto high-speed surface craft across featureless open water without GPS using visual wave-surface odometry, streaming AES-256 encrypted alerts to coastal command.',
        howItWorksAttack:
          'Maintains sub-pixel laser designation on pitching, high-speed naval targets at 46 knots while defeating littoral radar multipath and RF jamming.',
        componentName: '2-Axis Stabilized Gimbal + Stereo VIO + AES-256 Uplink',
        componentSpec: '130,000+ Annual Vessel Overwatch // Quantum-Resistant Telemetry',
        worldPos: [44, -25, -540],
      },
      {
        id: 'naval-t3',
        code: 'NAV-CHARLIE // 03',
        name: 'Autonomous Semi-Submersible USV',
        classification: 'LOW-PROFILE MARITIME THREAT',
        telemetryRecon: 'SUB-SURFACE THERMAL WAKE // < 5 ms ONBOARD TPU AUDIT',
        telemetryAttack: 'TERMINAL KINETIC DIVE PROFILE // VENTRAL PAYLOAD ARMED',
        capabilityLayer: 'LAYER 04 — SUB-5MS NEUROMORPHIC EDGE AI & DUAL-MODE EXECUTION',
        howItWorksRecon:
          'Detects near-submerged unmanned surface vessels in under 5 milliseconds via onboard neuromorphic TPU anomaly detection, keeping all sovereign maritime data 100% air-gapped.',
        howItWorksAttack:
          'Executes an autonomous terminal dive guidance solution from the flush ventral hardpoint with real-time wave-crest compensation and instant fail-safe abort control.',
        componentName: 'A.V.I.A.R.S. Edge TPU + Modular Ventral Kinetic Hardpoint',
        componentSpec: '0% Cloud Leak Risk (Air-Gapped) //Zero-Drag Internal Munition Bay',
        worldPos: [-16, -25, -810],
      },
    ],
    secondaryLabels: ['CARGO VESSEL [AIS OK]', 'FAST INTERCEPTOR [0.99]', 'PATROL CRAFT [AIS OK]', 'BUOY RELAY [0.96]'],
  },
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function AviarsBattlefieldViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scenario, setScenario] = useState<ScenarioType>('land');
  const [missionMode, setMissionMode] = useState<MissionMode>('recon');
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 800 });
  const [projectedTargets, setProjectedTargets] = useState<ProjectedTarget[]>([]);
  const [secondaryTracks, setSecondaryTracks] = useState<
    { id: string; label: string; x: number; y: number; visible: boolean }[]
  >([]);

  const progressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const scenarioRef = useRef<ScenarioType>('land');
  const missionModeRef = useRef<MissionMode>('recon');

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  useEffect(() => {
    missionModeRef.current = missionMode;
  }, [missionMode]);

  // Bind scroll progress (0.0 -> 1.0)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const p = clamp01(-rect.top / totalScrollable);
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
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTopDoc = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    window.scrollTo({
      top: containerTopDoc + targetP * totalScrollable,
      behavior: 'smooth',
    });
  }, []);

  // Initialize Three.js WebGL Stage (0ms instant load + background GLB upgrade)
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const width = wrapper.clientWidth || 1280;
    const height = wrapper.clientHeight || 800;
    setViewportSize({ width, height });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07090D');
    scene.fog = new THREE.FogExp2('#07090D', 0.0014);

    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 2400);
    camera.position.set(0, 38, 250);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.touchAction = 'pan-y';

    wrapper.innerHTML = '';
    wrapper.appendChild(renderer.domElement);

    // Studio & Tactical Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x07090d, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(180, 320, 260);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-220, 140, -180);
    scene.add(rimLight);

    const noseGlowLight = new THREE.PointLight(0x38bdf8, 2.2, 160);
    scene.add(noseGlowLight);

    // =========================================================================
    // 1. SA-1 "VANGUARD" DRONE GROUP (Visible in Phase 1 before POV Entry)
    // =========================================================================
    const droneRoot = new THREE.Group();
    scene.add(droneRoot);

    const hullMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#222730'),
      metalness: 0.45,
      roughness: 0.42,
      clearcoat: 0.25,
    });
    const darkCarbonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#15181f'),
      metalness: 0.55,
      roughness: 0.35,
    });
    const blueSphereMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0284c7'),
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 0.65,
      metalness: 0.2,
      roughness: 0.08,
      clearcoat: 1.0,
    });

    const fallbackGroup = new THREE.Group();
    droneRoot.add(fallbackGroup);

    // Procedural SA-1 Vanguard (0ms instant render matching the quad-ducted CAD silhouette)
    const bodyGeom = new THREE.CylinderGeometry(58, 76, 18, 8);
    bodyGeom.scale(1.0, 1.0, 1.05);
    const bodyMesh = new THREE.Mesh(bodyGeom, hullMat);
    fallbackGroup.add(bodyMesh);

    const spineGeom = new THREE.BoxGeometry(44, 20, 136);
    const spineMesh = new THREE.Mesh(spineGeom, darkCarbonMat);
    spineMesh.position.set(0, 2, 0);
    fallbackGroup.add(spineMesh);

    // Blue Optical Camera & Sensor Sphere at the Nose (+Z in local drone space)
    const noseSphereGeom = new THREE.SphereGeometry(13.5, 32, 32);
    const noseSphereMesh = new THREE.Mesh(noseSphereGeom, blueSphereMat);
    noseSphereMesh.position.set(0, -1, 68);
    droneRoot.add(noseSphereMesh);

    const lensRingGeom = new THREE.TorusGeometry(14.5, 1.2, 16, 48);
    const lensRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lensRingMesh = new THREE.Mesh(lensRingGeom, lensRingMat);
    lensRingMesh.position.set(0, -1, 70);
    droneRoot.add(lensRingMesh);

    // 4 Flush Ducted Rotors
    const rotorPositions: [number, number, number, number][] = [
      [-52, 0, 34, 1],
      [52, 0, 34, -1],
      [-52, 0, -34, -1],
      [52, 0, -34, 1],
    ];
    const spinningRotors: { mesh: THREE.Object3D; dir: number }[] = [];

    rotorPositions.forEach(([rx, ry, rz, dir]) => {
      const ductGeom = new THREE.CylinderGeometry(28, 28, 16, 28, 1, true);
      const ductMesh = new THREE.Mesh(ductGeom, hullMat);
      ductMesh.position.set(rx, ry, rz);
      fallbackGroup.add(ductMesh);

      const propGroup = new THREE.Group();
      propGroup.position.set(rx, ry, rz);
      const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 7, 16), darkCarbonMat);
      propGroup.add(hubMesh);
      for (let b = 0; b < 5; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(18, 1.0, 4.5), darkCarbonMat);
        const ang = (b * Math.PI * 2) / 5;
        blade.position.set(Math.cos(ang) * 12, 0, Math.sin(ang) * 12);
        blade.rotation.y = -ang;
        propGroup.add(blade);
      }
      fallbackGroup.add(propGroup);
      spinningRotors.push({ mesh: propGroup, dir });
    });

    // Background stream of authentic /models/sa1_vanguard.glb
    let isDisposed = false;
    const loader = new GLTFLoader();
    loader.load(
      '/models/sa1_vanguard.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            if (m.name.includes('Lens') || m.name.includes('Gimbal') || m.name.includes('Sensor')) {
              m.material = blueSphereMat;
            } else {
              m.material = hullMat;
            }
          }
        });
        droneRoot.remove(fallbackGroup);
        droneRoot.add(model);
      },
      undefined,
      () => {
        // Keep procedural fallback if offline
      }
    );

    // =========================================================================
    // 2. MULTI-SCENARIO 3D BATTLEFIELD ENVIRONMENT (LAND / AIR / NAVAL)
    // =========================================================================
    const battlefieldRoot = new THREE.Group();
    scene.add(battlefieldRoot);

    // Base Tactical Coordinate Grid extending downrange (-Z from 100 to -1250)
    const floorGrid = new THREE.GridHelper(1600, 64, 0x00ff41, 0x13202c);
    floorGrid.position.set(0, -32, -520);
    (floorGrid.material as THREE.Material).transparent = true;
    (floorGrid.material as THREE.Material).opacity = 0.32;
    battlefieldRoot.add(floorGrid);

    // Scenario-Specific Environment Groups
    const landEnvGroup = new THREE.Group();
    const airEnvGroup = new THREE.Group();
    const navalEnvGroup = new THREE.Group();
    battlefieldRoot.add(landEnvGroup, airEnvGroup, navalEnvGroup);

    const wireBuildingMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const solidBuildingMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d131c,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
    });

    // Populate Land / Urban Canyon Buildings along left & right corridors
    for (let i = 0; i < 28; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const zPos = -80 - i * 40;
      const xPos = side * (85 + (i % 3) * 28);
      const bw = 34 + (i % 4) * 10;
      const bh = 45 + ((i * 17) % 85);
      const bd = 34 + (i % 3) * 12;

      const bGeom = new THREE.BoxGeometry(bw, bh, bd);
      const bMesh = new THREE.Mesh(bGeom, solidBuildingMat);
      bMesh.position.set(xPos, -32 + bh / 2, zPos);
      landEnvGroup.add(bMesh);

      const bWire = new THREE.Mesh(bGeom, wireBuildingMat);
      bWire.position.copy(bMesh.position);
      landEnvGroup.add(bWire);
    }

    // Populate Air / Contested Airspace Volumetric Flight Corridors & Cloud Grid
    const upperAirGrid = new THREE.GridHelper(1600, 40, 0x38bdf8, 0x0f172a);
    upperAirGrid.position.set(0, 75, -520);
    (upperAirGrid.material as THREE.Material).transparent = true;
    (upperAirGrid.material as THREE.Material).opacity = 0.22;
    airEnvGroup.add(upperAirGrid);

    const airRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    for (let i = 0; i < 10; i++) {
      const gateGeom = new THREE.RingGeometry(68, 70, 6);
      const gateMesh = new THREE.Mesh(gateGeom, airRingMat);
      gateMesh.position.set(0, 0, -120 - i * 100);
      airEnvGroup.add(gateMesh);
    }

    // Populate Naval / Maritime Sea Wave Mesh & Shipping Lane Buoys
    const seaGeom = new THREE.PlaneGeometry(1400, 1600, 48, 64);
    seaGeom.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const seaMesh = new THREE.Mesh(seaGeom, seaMat);
    seaMesh.position.set(0, -31, -520);
    navalEnvGroup.add(seaMesh);

    // =========================================================================
    // 3. 3D TARGET MESHES + SCAN CONES + BALLISTIC TRAJECTORY + LASER BEAM
    // =========================================================================
    const targetMeshes: THREE.Group[] = [];
    const targetBoxMats: THREE.MeshBasicMaterial[] = [];
    const targetCoreMats: THREE.MeshPhysicalMaterial[] = [];

    for (let tIdx = 0; tIdx < 3; tIdx++) {
      const tGroup = new THREE.Group();

      // Target Core Mesh (Vehicle / Vessel / Aircraft silhouette)
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1e293b'),
        emissive: new THREE.Color('#00ff41'),
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.3,
      });
      targetCoreMats.push(coreMat);

      const hullG = new THREE.BoxGeometry(22, 10, 34);
      const hullM = new THREE.Mesh(hullG, coreMat);
      tGroup.add(hullM);

      const turretG = new THREE.ConeGeometry(8, 12, 6);
      turretG.rotateX(Math.PI / 2);
      const turretM = new THREE.Mesh(turretG, coreMat);
      turretM.position.set(0, 6, 4);
      tGroup.add(turretM);

      // 3D Tactical Bounding Cage around target
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      });
      targetBoxMats.push(cageMat);
      const cageG = new THREE.BoxGeometry(30, 18, 42);
      const cageM = new THREE.Mesh(cageG, cageMat);
      tGroup.add(cageM);

      // Ground/Target Radar Pulse Ring
      const pulseRingG = new THREE.RingGeometry(22, 24, 32);
      pulseRingG.rotateX(-Math.PI / 2);
      const pulseRingM = new THREE.Mesh(pulseRingG, cageMat);
      pulseRingM.position.set(0, -8, 0);
      tGroup.add(pulseRingM);

      battlefieldRoot.add(tGroup);
      targetMeshes.push(tGroup);
    }

    // Secondary Peripheral Swarm / Convoy Nodes (to demonstrate 64-target tracking)
    const secondaryNodes: { mesh: THREE.Mesh; basePos: THREE.Vector3 }[] = [];
    const secMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const secCoords: [number, number, number][] = [
      [-70, -18, -360],
      [68, -12, -410],
      [-62, -20, -640],
      [58, -14, -720],
    ];
    secCoords.forEach(([sx, sy, sz]) => {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(7, 0), secMat);
      m.position.set(sx, sy, sz);
      battlefieldRoot.add(m);
      secondaryNodes.push({ mesh: m, basePos: new THREE.Vector3(sx, sy, sz) });
    });

    // Tactical Laser Designator Beam & Ballistic Curve (For Attack vs Recon Mode)
    const laserMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.85,
    });
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, -20, -200),
    ]);
    const laserLine = new THREE.Line(laserGeom, laserMat);
    scene.add(laserLine);

    const ballisticMat = new THREE.LineBasicMaterial({
      color: 0x00ff41,
      transparent: true,
      opacity: 0.65,
    });
    const ballisticPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      ballisticPoints.push(new THREE.Vector3(0, 0, 0));
    }
    const ballisticGeom = new THREE.BufferGeometry().setFromPoints(ballisticPoints);
    const ballisticArc = new THREE.Line(ballisticGeom, ballisticMat);
    scene.add(ballisticArc);

    // =========================================================================
    // 4. ANIMATION & CAMERA POV FLIGHT LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    let animId = 0;
    let lastHudSync = 0;

    const projectWorldToScreen = (worldVec: THREE.Vector3, w: number, h: number) => {
      const v = worldVec.clone().project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * w,
        y: (-(v.y * 0.5) + 0.5) * h,
        inFront: v.z >= -1.0 && v.z <= 1.0,
      };
    };

    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const targetP = progressRef.current;
      smoothedProgressRef.current += (targetP - smoothedProgressRef.current) * 0.09;
      const p = smoothedProgressRef.current;

      const curScenario = scenarioRef.current;
      const curMode = missionModeRef.current;
      const isAttack = curMode === 'attack';
      const accentHex = isAttack ? 0xef4444 : 0x00ff41;

      // Toggle Scenario 3D groups
      landEnvGroup.visible = curScenario === 'land';
      airEnvGroup.visible = curScenario === 'air';
      navalEnvGroup.visible = curScenario === 'naval';

      // Animate Sea Waves in Naval scenario
      if (curScenario === 'naval') {
        const posAttr = seaGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vz = posAttr.getZ(i);
          posAttr.setY(i, Math.sin(vx * 0.04 + elapsed * 1.8) * 1.8 + Math.cos(vz * 0.03 + elapsed * 1.4) * 1.8);
        }
        posAttr.needsUpdate = true;
      }

      // Spin SA-1 Vanguard rotors
      spinningRotors.forEach((r) => {
        r.mesh.rotation.y += 0.22 * r.dir;
      });

      // Update Target 3D positions & colors for active scenario
      const activeTargets = SCENARIO_CONFIGS[curScenario].targets;
      activeTargets.forEach((tSpec, idx) => {
        const tMesh = targetMeshes[idx];
        const [tx, ty, tz] = tSpec.worldPos;
        // Subtle motion on targets to feel alive
        const driftX = Math.sin(elapsed * 0.9 + idx * 2.1) * 3.5;
        const driftY = curScenario === 'air' ? Math.cos(elapsed * 1.3 + idx) * 3.0 : 0;
        tMesh.position.set(tx + driftX, ty + driftY, tz);
        tMesh.rotation.y = Math.sin(elapsed * 0.4 + idx) * 0.15;

        targetBoxMats[idx].color.setHex(accentHex);
        targetCoreMats[idx].emissive.setHex(accentHex);
      });

      secondaryNodes.forEach((sn, idx) => {
        sn.mesh.position.x = sn.basePos.x + Math.cos(elapsed * 0.8 + idx) * 6;
        sn.mesh.position.y =
          (curScenario === 'air' ? 12 : -18) + Math.sin(elapsed * 1.1 + idx) * 3;
        sn.mesh.rotation.y += 0.02;
        sn.mesh.rotation.x += 0.01;
      });

      // =======================================================================
      // PHASE 1 (p: 0.0 -> 0.18): THIRD-PERSON DRONE TURN & ZOOM INTO CAMERA POV
      // PHASE 2..4 (p: 0.18 -> 1.0): FIRST-PERSON POV FLIGHT THROUGH BATTLEFIELD
      // =======================================================================
      const w = wrapper.clientWidth || 1280;
      const h = Math.max(1, wrapper.clientHeight || 800);
      const aspect = w / h;
      const portraitPullback = aspect < 0.95 ? Math.min(1.55, 0.95 / Math.max(aspect, 0.45)) : 1.0;

      if (p < 0.18) {
        const tIntro = smoothstep(0.0, 0.14, p);
        const tZoom = smoothstep(0.10, 0.18, p);

        droneRoot.visible = true;
        // Drone hovers and turns from facing camera (0 rad) to facing battlefield (PI rad)
        const hoverY = Math.sin(elapsed * 2.4) * 2.5;
        droneRoot.position.set(0, hoverY, 0);
        // Turn 180 degrees smoothly while banking slightly
        droneRoot.rotation.y = tIntro * Math.PI * 0.85;
        droneRoot.rotation.z = Math.sin(tIntro * Math.PI) * -0.22;
        droneRoot.rotation.x = Math.sin(tIntro * Math.PI) * 0.14;

        // Camera starts in front of the drone (z = 240 * portraitPullback) and zooms straight into the blue optical sphere
        const startZ = 225 * portraitPullback;
        const startY = 42 * portraitPullback;
        const camZ = startZ * (1 - tZoom) + 18 * tZoom;
        const camY = startY * (1 - tZoom) + (hoverY + 2) * tZoom;
        const camX = Math.sin(tIntro * Math.PI) * 28 * (1 - tZoom);

        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, hoverY - 2 * tZoom, -120 * tZoom);
        noseGlowLight.position.set(0, hoverY, 70);

        laserLine.visible = false;
        ballisticArc.visible = false;
      } else {
        // Inside First-Person Camera POV (A.V.I.A.R.S. Optical Gimbal HUD)
        droneRoot.visible = false;

        const flightT = clamp01((p - 0.18) / 0.82);
        // Fly downrange from Z = -40 to Z = -670
        const camZ = -40 - flightT * 630;
        const camX = Math.sin(flightT * Math.PI * 2.0) * 14;
        const baseAltY = curScenario === 'air' ? 6 : -4;
        const camY = baseAltY + Math.cos(elapsed * 1.6) * 1.2;

        camera.position.set(camX, camY, camZ);

        // Determine active primary target index (0, 1, or 2) based on scroll phase
        const activeIdx = p < 0.48 ? 0 : p < 0.75 ? 1 : 2;
        const activeTargetMesh = targetMeshes[activeIdx];

        // Smoothly orient gimbal lookAt bias toward the active target while flying forward
        const forwardLook = new THREE.Vector3(
          activeTargetMesh.position.x * 0.42,
          activeTargetMesh.position.y * 0.45,
          camZ - 190
        );
        camera.lookAt(forwardLook);

        // Update Laser Designator & Ballistic Trajectory Curve from Drone Ventral Bay to Active Target
        const droneBayOrigin = new THREE.Vector3(camX, camY - 6, camZ - 8);
        const targetHitPt = activeTargetMesh.position.clone();

        laserLine.visible = true;
        laserMat.color.setHex(accentHex);
        laserGeom.setFromPoints([droneBayOrigin, targetHitPt]);

        ballisticArc.visible = true;
        ballisticMat.color.setHex(accentHex);
        const curvePts: THREE.Vector3[] = [];
        for (let i = 0; i <= 24; i++) {
          const u = i / 24;
          const bx = THREE.MathUtils.lerp(droneBayOrigin.x, targetHitPt.x, u);
          const bz = THREE.MathUtils.lerp(droneBayOrigin.z, targetHitPt.z, u);
          const arcLift = Math.sin(u * Math.PI) * (isAttack ? 14 : 6);
          const by = THREE.MathUtils.lerp(droneBayOrigin.y, targetHitPt.y, u) + arcLift;
          curvePts.push(new THREE.Vector3(bx, by, bz));
        }
        ballisticGeom.setFromPoints(curvePts);
      }

      renderer.render(scene, camera);

      // Sync 2D Projected Target Lock Boxes & HUD Telemetry at ~30 FPS
      if (elapsed - lastHudSync > 0.033) {
        lastHudSync = elapsed;
        const activeIdx = p < 0.48 ? 0 : p < 0.75 ? 1 : 2;

        const nextProjected: ProjectedTarget[] = activeTargets.map((tSpec, idx) => {
          const worldPos = targetMeshes[idx].position;
          const proj = projectWorldToScreen(worldPos, w, h);
          const dist = Math.max(12, Math.round(camera.position.distanceTo(worldPos) * 1.4));
          return {
            ...tSpec,
            screenX: proj.x,
            screenY: proj.y,
            inFront: proj.inFront,
            distanceMeters: dist,
            isPrimaryLock: p >= 0.16 && idx === activeIdx,
          };
        });
        setProjectedTargets(nextProjected);

        const secLabels = SCENARIO_CONFIGS[curScenario].secondaryLabels;
        const nextSec = secondaryNodes.map((sn, idx) => {
          const proj = projectWorldToScreen(sn.mesh.position, w, h);
          return {
            id: `sec-${idx}`,
            label: secLabels[idx] || `TRACK #0${idx + 5}`,
            x: proj.x,
            y: proj.y,
            visible: p >= 0.18 && proj.inFront && proj.x > 40 && proj.x < w - 40 && proj.y > 80 && proj.y < h - 120,
          };
        });
        setSecondaryTracks(nextSec);
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

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const isPovActive = scrollProgress >= 0.16;
  const activePhaseIndex =
    scrollProgress < 0.18 ? 1 : scrollProgress < 0.48 ? 2 : scrollProgress < 0.75 ? 3 : 4;

  const isAttack = missionMode === 'attack';
  const accentColor = isAttack ? '#ef4444' : '#00ff41';
  const accentBorderClass = isAttack ? 'border-red-500/60' : 'border-[#00ff41]/60';
  const accentTextClass = isAttack ? 'text-red-400' : 'text-[#00ff41]';
  const accentBgClass = isAttack ? 'bg-red-500/15' : 'bg-[#00ff41]/15';

  const currentScenarioData = SCENARIO_CONFIGS[scenario];
  const primaryLockedTarget =
    projectedTargets.find((t) => t.isPrimaryLock) || projectedTargets[0] || null;

  const phases = [
    {
      phase: 1,
      shortTitle: 'POV Entry',
      range: '0% – 18%',
      targetP: 0.04,
      title: 'SA-1 Optical Gimbal Entry',
      metric: '3RD-PERSON → 4K POV ZOOM',
    },
    {
      phase: 2,
      shortTitle: 'Sensor Fusion',
      range: '18% – 48%',
      targetP: 0.32,
      title: '120 FPS Multi-Spectral Lock',
      metric: '4K + THERMAL IR + SAR',
    },
    {
      phase: 3,
      shortTitle: 'Neural Track',
      range: '48% – 75%',
      targetP: 0.61,
      title: 'GPS-Denied VIO & EW Uplink',
      metric: '64 TARGETS // AES-256 FHSS',
    },
    {
      phase: 4,
      shortTitle: 'Edge Strike',
      range: '75% – 100%',
      targetP: 0.88,
      title: 'Sub-5ms TPU & Dual-Mode Lock',
      metric: '< 5 MS TPU // VENTRAL BAY',
    },
  ];

  // Clamp primary target screen coordinates so HUD reticles stay inside the viewport
  const clampedTargetX = primaryLockedTarget
    ? Math.max(70, Math.min(viewportSize.width - 70, primaryLockedTarget.screenX))
    : viewportSize.width * 0.5;
  const clampedTargetY = primaryLockedTarget
    ? Math.max(120, Math.min(viewportSize.height - 210, primaryLockedTarget.screenY))
    : viewportSize.height * 0.45;

  return (
    <div ref={containerRef} className="relative w-full h-[380vh] sm:h-[440vh] lg:h-[520vh]">
      {/* Sticky Full-Viewport 3D A.V.I.A.R.S. Tactical POV Stage */}
      <div className="sticky top-16 sm:top-20 lg:top-24 w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden bg-[#07090D] border-y border-white/10">
        {/* Three.js WebGL Canvas */}
        <div ref={canvasWrapperRef} className="relative z-10 w-full h-full" />

        {/* Optical Lens Vignette & Tactical Scanline Overlay when inside Camera POV */}
        <div
          className="pointer-events-none absolute inset-0 z-15 transition-opacity duration-500"
          style={{
            opacity: isPovActive ? 1 : 0.35,
            background: isAttack
              ? 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.03) 0%, rgba(7, 9, 13, 0.78) 92%)'
              : 'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.03) 0%, rgba(7, 9, 13, 0.78) 92%)',
          }}
        />

        {/* SVG Tactical HUD Overlay — Crosshairs, Target Lock Reticles & 1px Leader Lines */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 w-full h-full"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
        >
          {/* Center Optical Gimbal Bore-Sight Crosshair (Active in POV) */}
          {isPovActive && (
            <g opacity="0.45">
              <circle
                cx={viewportSize.width / 2}
                cy={viewportSize.height / 2}
                r="34"
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={viewportSize.width / 2 - 48}
                y1={viewportSize.height / 2}
                x2={viewportSize.width / 2 - 18}
                y2={viewportSize.height / 2}
                stroke={accentColor}
                strokeWidth="1"
              />
              <line
                x1={viewportSize.width / 2 + 18}
                y1={viewportSize.height / 2}
                x2={viewportSize.width / 2 + 48}
                y2={viewportSize.height / 2}
                stroke={accentColor}
                strokeWidth="1"
              />
              <line
                x1={viewportSize.width / 2}
                y1={viewportSize.height / 2 - 48}
                x2={viewportSize.width / 2}
                y2={viewportSize.height / 2 - 18}
                stroke={accentColor}
                strokeWidth="1"
              />
              <line
                x1={viewportSize.width / 2}
                y1={viewportSize.height / 2 + 18}
                x2={viewportSize.width / 2}
                y2={viewportSize.height / 2 + 48}
                stroke={accentColor}
                strokeWidth="1"
              />
            </g>
          )}

          {/* Secondary Multi-Target Neural Tracks (Up to 64 Simultaneous Targets Demo) */}
          {secondaryTracks.map((st) =>
            st.visible ? (
              <g key={st.id} opacity="0.65">
                <rect
                  x={st.x - 16}
                  y={st.y - 16}
                  width="32"
                  height="32"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
                <circle cx={st.x} cy={st.y} r="2.5" fill="#38bdf8" />
                <text
                  x={st.x + 20}
                  y={st.y + 4}
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {st.label}
                </text>
              </g>
            ) : null
          )}

          {/* Primary Locked Target Bounding Reticle + Leader Line to Explainer Card */}
          {isPovActive && primaryLockedTarget && (
            <g>
              {/* Outer Target Lock Box */}
              <rect
                x={clampedTargetX - 38}
                y={clampedTargetY - 38}
                width="76"
                height="76"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
              />
              {/* Inner Target Diamond / Pip */}
              <circle
                cx={clampedTargetX}
                cy={clampedTargetY}
                r="5"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
              />
              <circle cx={clampedTargetX} cy={clampedTargetY} r="2" fill={accentColor} />

              {/* Leader Line on Desktop (lg+) connecting Target Lock Box to the Right-Hand Explainer Card */}
              {viewportSize.width >= 1024 ? (
                <polyline
                  points={`${clampedTargetX + 38},${clampedTargetY} ${clampedTargetX + 82},${clampedTargetY - 22} ${
                    viewportSize.width - 440
                  },${Math.max(190, Math.min(viewportSize.height - 260, clampedTargetY - 22))}`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                />
              ) : (
                /* Leader Line on Mobile/Tablet (< lg) connecting Target Lock Box down to the Active Card */
                <polyline
                  points={`${clampedTargetX},${clampedTargetY + 38} ${
                    viewportSize.width * 0.5
                  },${viewportSize.height - 215}`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          )}
        </svg>

        {/* =====================================================================
            TOP BAR HUD — Scenario Switcher (Land / Air / Naval) + Mode Toggle (Recon / Attack)
           ===================================================================== */}
        <div className="pointer-events-none absolute z-30 top-3 sm:top-5 lg:top-6 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3">
          {/* Left: Active Sector & Camera POV Status */}
          <div className="pointer-events-auto flex items-center justify-between sm:justify-start gap-3 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <div className="min-w-0">
                <p
                  className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] font-bold truncate ${accentTextClass}`}
                >
                  {isPovActive
                    ? `A.V.I.A.R.S. CAMERA POV // ${currentScenarioData.sectorName}`
                    : 'SA-1 VANGUARD // EXTERNAL AIRFRAME VIEW (SCROLL TO ENTER POV)'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {phases[activePhaseIndex - 1].title}{' '}
                  <span className="text-white/45 font-mono text-[11px] ml-1.5">
                    [{currentScenarioData.altitudeLabel}]
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Scenario Tabs (Land / Air / Naval) + Recon vs Attack Mode Switcher */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            {/* 3 Scenario Tabs */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              {(['land', 'air', 'naval'] as ScenarioType[]).map((sc) => {
                const active = scenario === sc;
                return (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setScenario(sc)}
                    className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                      active
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-white/65 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="sm:hidden">{SCENARIO_CONFIGS[sc].shortLabel}</span>
                    <span className="hidden sm:inline">{SCENARIO_CONFIGS[sc].label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dual Operational Mode Switcher: Recon Mode vs Attack Mode */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMissionMode('recon')}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  missionMode === 'recon'
                    ? 'bg-[#00ff41] text-black font-bold shadow-[0_0_16px_rgba(0,255,65,0.4)]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Recon Mode (ISR)
              </button>
              <button
                type="button"
                onClick={() => setMissionMode('attack')}
                className={`rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  missionMode === 'attack'
                    ? 'bg-red-500 text-white font-bold shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Attack Mode
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            PHASE 1 PROMPT OVERLAY (When viewing external SA-1 Drone before POV)
           ===================================================================== */}
        {!isPovActive && (
          <div className="pointer-events-none absolute inset-x-0 top-[24%] sm:top-[22%] z-25 flex justify-center px-4">
            <div className="bg-black/75 backdrop-blur-xl border border-sky-400/40 rounded-2xl px-5 py-3.5 sm:px-7 sm:py-4 text-center max-w-xl shadow-2xl">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-sky-400 font-bold mb-1">
                SA-1 &ldquo;VANGUARD&rdquo; // FORWARD 4K OPTICAL SPHERE
              </p>
              <p className="text-xs sm:text-sm text-white/85">
                Scroll down to turn the SA-1 airframe and zoom directly into the{' '}
                <strong className="text-sky-300">A.V.I.A.R.S. First-Person Battlefield POV</strong>.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            FLOATING TARGET LOCK TELEMETRY TAG BELOW RETICLE (Shows Target + Component)
           ===================================================================== */}
        {isPovActive && primaryLockedTarget && (
          <div
            className="pointer-events-none absolute z-25 hidden sm:block transition-all duration-150"
            style={{
              left: `${Math.max(20, Math.min(viewportSize.width - 340, clampedTargetX - 145))}px`,
              top: `${Math.max(90, Math.min(viewportSize.height - 230, clampedTargetY + 44))}px`,
              width: '290px',
            }}
          >
            <div
              className={`bg-black/88 backdrop-blur-md border ${accentBorderClass} rounded-xl px-3.5 py-2.5 font-mono text-[10px] shadow-2xl`}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className={`font-bold ${accentTextClass}`}>{primaryLockedTarget.code}</span>
                <span className="text-white/60">RNG: {primaryLockedTarget.distanceMeters}M</span>
              </div>
              <p className="text-white text-xs font-sans font-bold truncate mb-1">
                {primaryLockedTarget.name}
              </p>
              <p className="text-[10px] font-sans text-white/75 leading-snug line-clamp-2 mb-1.5">
                {isAttack
                  ? primaryLockedTarget.howItWorksAttack
                  : primaryLockedTarget.howItWorksRecon}
              </p>
              <div className="border-t border-white/15 pt-1 flex items-center gap-1.5 text-[9px] text-sky-400 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span className="truncate font-bold">{primaryLockedTarget.componentName}</span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESKTOP TARGET LOCK & COMPONENT EXPLAINER CARD (lg+)
           ===================================================================== */}
        {isPovActive && primaryLockedTarget && (
          <div className="pointer-events-none absolute inset-y-0 right-7 xl:right-12 z-30 hidden lg:flex items-center">
            <div
              className={`pointer-events-auto w-[390px] xl:w-[420px] bg-black/85 backdrop-blur-2xl border ${accentBorderClass} rounded-2xl p-6 shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded ${accentBgClass} ${accentTextClass}`}
                >
                  {isAttack ? 'ATTACK LOCK // TERMINAL GUIDANCE' : 'RECON LOCK // PASSIVE ISR'}
                </span>
                <span className="text-xs font-mono text-white/55">
                  RNG: <strong className="text-white">{primaryLockedTarget.distanceMeters} m</strong>
                </span>
              </div>

              <p className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-2">
                {primaryLockedTarget.capabilityLayer}
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1 mb-1">
                {primaryLockedTarget.name}
              </h3>
              <p className={`text-xs font-mono mb-4 ${accentTextClass}`}>
                {isAttack
                  ? primaryLockedTarget.telemetryAttack
                  : primaryLockedTarget.telemetryRecon}
              </p>

              {/* How A.V.I.A.R.S. Performs This Action */}
              <div className="border-t border-white/10 pt-3.5 mb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/45 mb-1.5">
                  HOW A.V.I.A.R.S. EXECUTES THIS LOCK
                </p>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {isAttack
                    ? primaryLockedTarget.howItWorksAttack
                    : primaryLockedTarget.howItWorksRecon}
                </p>
              </div>

              {/* Hardware / Software Subsystem Component Badge */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold mb-1">
                  ACTIVE HARDWARE / SOFTWARE COMPONENT
                </p>
                <p className="text-xs font-bold text-white mb-0.5">
                  {primaryLockedTarget.componentName}
                </p>
                <p className="text-[11px] font-mono text-white/55">
                  {primaryLockedTarget.componentSpec}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            BOTTOM DOCK — Mobile Target Lock Explainer Card (< lg) + 4-Phase Stepper
           ===================================================================== */}
        <div className="pointer-events-auto absolute z-30 bottom-3 sm:bottom-5 lg:bottom-6 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10">
          <div className="max-w-6xl mx-auto space-y-2.5">
            {/* Mobile & Tablet Active Target Lock Explainer Card (< lg) */}
            {isPovActive && primaryLockedTarget && (
              <div
                className={`lg:hidden bg-black/88 backdrop-blur-xl border ${accentBorderClass} rounded-xl p-3.5 sm:p-4 shadow-2xl`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-bold ${accentTextClass}`}
                  >
                    {primaryLockedTarget.code} // {primaryLockedTarget.name}
                  </span>
                  <span className="text-[10px] font-mono text-white/60 shrink-0">
                    RNG: {primaryLockedTarget.distanceMeters}m
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/80 leading-snug mb-2">
                  {isAttack
                    ? primaryLockedTarget.howItWorksAttack
                    : primaryLockedTarget.howItWorksRecon}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                  <span className="text-sky-400 font-bold">
                    COMPONENT: {primaryLockedTarget.componentName}
                  </span>
                  <span className="text-white/50 hidden sm:inline">
                    {primaryLockedTarget.componentSpec}
                  </span>
                </div>
              </div>
            )}

            {/* 4-Phase Interactive Stepper Bar */}
            <div className="bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-2xl">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                {phases.map((ph) => {
                  const isCurrent = activePhaseIndex === ph.phase;
                  return (
                    <button
                      key={ph.phase}
                      type="button"
                      onClick={() => jumpToProgress(ph.targetP)}
                      className={`text-left rounded-lg sm:rounded-xl p-2 sm:p-3 border transition-all ${
                        isCurrent
                          ? `${accentBgClass} ${accentBorderClass}`
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5">
                        <span className={isCurrent ? `${accentTextClass} font-bold` : 'text-white/50'}>
                          <span className="sm:hidden">0{ph.phase}</span>
                          <span className="hidden sm:inline">
                            Phase 0{ph.phase} ({ph.range})
                          </span>
                        </span>
                        {isCurrent && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: accentColor }}
                          />
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-white truncate">
                        <span className="sm:hidden">{ph.shortTitle}</span>
                        <span className="hidden sm:inline">{ph.title}</span>
                      </p>
                      <p className="hidden md:block text-[10px] font-mono text-white/50 truncate mt-0.5">
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
