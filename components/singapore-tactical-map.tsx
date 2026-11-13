'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type CameraViewMode = 'tactical' | 'island';
type DefensePosture = 'intercept' | 'overwatch';

interface MilitaryBaseSpec {
  id: string;
  code: string;
  name: string;
  role: string;
  lon: number;
  lat: number;
  type: 'coastal-hive' | 'airbase-camp';
}

interface InterceptMissionSpec {
  id: string;
  code: string;
  sectorTitle: string;
  scrollRange: [number, number];
  primaryBaseId: string;
  secondaryBaseId: string;
  targetName: string;
  targetType: 'maritime-usv' | 'air-swarm' | 'ew-vessel' | 'fast-attack';
  targetLon: number;
  targetLat: number;
  targetAltY: number;
  threatTelemetry: string;
  scrambleSummary: string;
  takedownMechanics: string;
  subsystemBadge: string;
  interceptTimeSec: string;
  distanceKm: string;
   cameraOffset: [number, number, number];
}

interface ProjectedBaseHud extends MilitaryBaseSpec {
  x: number;
  y: number;
  inFront: boolean;
  isScrambling: boolean;
}

interface ProjectedTargetHud {
  x: number;
  y: number;
  inFront: boolean;
  droneX: number;
  droneY: number;
  droneInFront: boolean;
  phase: 'scrambling' | 'locking' | 'impact';
  progress: number;
}

// Convert real Singapore Longitude / Latitude into 3D Scene (X, Z) coordinates
// Center: 103.825° E, 1.345° N
function lonLatToXZ(lon: number, lat: number): [number, number] {
  const x = (lon - 103.825) * 1150;
  const z = -(lat - 1.345) * 1150;
  return [x, z];
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// ============================================================================
// REAL GEOGRAPHIC COASTLINE COORDINATES FOR SINGAPORE & SURROUNDING ISLANDS
// ============================================================================
const SG_MAIN_ISLAND_LON_LAT: [number, number][] = [
  // Tuas South Finger Piers (SW Tip)
  [103.605, 1.242],
  [103.618, 1.238],
  [103.628, 1.245],
  [103.622, 1.268],
  [103.635, 1.275],
  [103.625, 1.298],
  // Tuas West Coast & Raffles Marina
  [103.632, 1.325],
  [103.636, 1.348],
  // Tengah / Western Catchment Coast
  [103.652, 1.375],
  [103.668, 1.402],
  [103.688, 1.425],
  // Lim Chu Kang & Kranji (NW)
  [103.708, 1.442],
  [103.732, 1.448],
  [103.755, 1.446],
  // Woodlands & Causeway (North)
  [103.772, 1.454],
  [103.798, 1.458],
  // Sembawang Naval Base & Senoko (North Tip)
  [103.822, 1.468],
  [103.845, 1.462],
  // Yishun / Seletar / Punggol (NE)
  [103.868, 1.438],
  [103.888, 1.425],
  [103.912, 1.418],
  [103.932, 1.402],
  // Pasir Ris & Loyang
  [103.958, 1.388],
  [103.982, 1.392],
  // Changi North & Changi Airport Peninsula (East)
  [104.005, 1.394],
  [104.028, 1.375],
  [104.042, 1.348],
  [104.035, 1.318],
  [104.008, 1.314],
  // Tanah Merah & East Coast Parkway (SE)
  [103.972, 1.312],
  [103.935, 1.304],
  [103.902, 1.296],
  // Marina East & Marina Barrage / Marina Bay
  [103.878, 1.282],
  [103.862, 1.276],
  [103.852, 1.279],
  // Tanjong Pagar & Keppel Terminal / HarbourFront
  [103.838, 1.264],
  [103.816, 1.265],
  // Pasir Panjang Terminal & West Coast
  [103.788, 1.274],
  [103.762, 1.288],
  [103.738, 1.302],
  // Jurong Port & Pioneer
  [103.708, 1.304],
  [103.678, 1.302],
  [103.652, 1.298],
  [103.638, 1.285],
];

const JURONG_ISLAND_LON_LAT: [number, number][] = [
  [103.662, 1.258],
  [103.688, 1.248],
  [103.722, 1.262],
  [103.726, 1.284],
  [103.696, 1.288],
  [103.668, 1.276],
];

const SENTOSA_ISLAND_LON_LAT: [number, number][] = [
  [103.808, 1.254],
  [103.828, 1.241],
  [103.848, 1.244],
  [103.842, 1.257],
  [103.818, 1.259],
];

const PULAU_TEKONG_LON_LAT: [number, number][] = [
  [104.018, 1.405],
  [104.042, 1.388],
  [104.076, 1.396],
  [104.072, 1.426],
  [104.035, 1.432],
];

const PULAU_UBIN_LON_LAT: [number, number][] = [
  [103.952, 1.412],
  [103.978, 1.404],
  [103.998, 1.410],
  [103.992, 1.422],
  [103.962, 1.421],
];

const SOUTHERN_ISLANDS_LON_LAT: [number, number][][] = [
  // Pulau Bukom
  [
    [103.758, 1.232],
    [103.776, 1.226],
    [103.778, 1.238],
    [103.762, 1.241],
  ],
  // Pulau Semakau
  [
    [103.752, 1.198],
    [103.772, 1.195],
    [103.775, 1.214],
    [103.756, 1.216],
  ],
  // St John's & Lazarus
  [
    [103.845, 1.218],
    [103.862, 1.215],
    [103.864, 1.228],
    [103.848, 1.229],
  ],
];

// ============================================================================
// 7 STRATEGIC SA-1 COASTAL DRONE HIVES & SAF MILITARY CAMPS / AIRBASES
// ============================================================================
const SINGAPORE_BASES: MilitaryBaseSpec[] = [
  {
    id: 'tuas-naval',
    code: 'HIVE-01 // TUAS NAVAL',
    name: 'Tuas Naval Base & Finger Pier Drone Hive',
    role: 'Western Strait & Malacca Funnel Overwatch',
    lon: 103.622,
    lat: 1.268,
    type: 'coastal-hive',
  },
  {
    id: 'jurong-battery',
    code: 'HIVE-02 // JURONG COAST',
    name: 'Jurong Island Coastal Defense Battery',
    role: 'Petrochemical Complex & Southern Channel Shield',
    lon: 103.695,
    lat: 1.265,
    type: 'coastal-hive',
  },
  {
    id: 'tengah-airbase',
    code: 'CAMP-03 // TENGAH AB',
    name: 'Tengah Air Base & Lim Chu Kang Camp',
    role: 'High-Readiness Autonomous Interceptor Wing',
    lon: 103.708,
    lat: 1.388,
    type: 'airbase-camp',
  },
  {
    id: 'sembawang-camp',
    code: 'HIVE-04 // SEMBAWANG',
    name: 'Sembawang Naval & Northern Coastal Hive',
    role: 'Johor Strait Northern Perimeter Overwatch',
    lon: 103.826,
    lat: 1.458,
    type: 'coastal-hive',
  },
  {
    id: 'sentosa-marina',
    code: 'HIVE-05 // MARINA SOUTH',
    name: 'Marina Barrage & Sentosa Coastal Hive',
    role: 'Central Strait & CBD Urban Electronic Shield',
    lon: 103.852,
    lat: 1.262,
    type: 'coastal-hive',
  },
  {
    id: 'paya-lebar',
    code: 'CAMP-06 // PAYA LEBAR AB',
    name: 'Paya Lebar Command & Rapid Scramble Camp',
    role: 'Central Island Multi-Domain AI Command Core',
    lon: 103.906,
    lat: 1.358,
    type: 'airbase-camp',
  },
  {
    id: 'changi-naval',
    code: 'HIVE-07 // CHANGI EAST',
    name: 'Changi Naval Base & Eastern Coastal Hive',
    role: 'Eastern Singapore Strait & Air Corridor Gate',
    lon: 104.026,
    lat: 1.326,
    type: 'coastal-hive',
  },
];

// ============================================================================
// 4 SEQUENTIAL SCROLL-DRIVEN SCRAMBLE & TARGET TAKEDOWN MISSIONS
// ============================================================================
const INTERCEPT_MISSIONS: InterceptMissionSpec[] = [
  {
    id: 'west-dark-ship',
    code: 'INTERCEPT 01 // WESTERN APPROACH',
    sectorTitle: 'Tuas Mega Port & Western Strait Funnel',
    scrollRange: [0.16, 0.37],
    primaryBaseId: 'tuas-naval',
    secondaryBaseId: 'jurong-battery',
    targetName: 'AIS-Spoofing Dark Ship & Explosive USV Swarm',
    targetType: 'maritime-usv',
    targetLon: 103.565,
    targetLat: 1.205,
    targetAltY: 1.5,
    threatTelemetry: 'AIS TRANSPONDER MISMATCH (1.8 NM) // 3× HOSTILE USVs DETECTED',
    scrambleSummary:
      'SA-1 interceptors launch simultaneously from Tuas Naval Base (HIVE-01) and Jurong Island Battery (HIVE-02), flying a pincer trajectory 8.4 km into the Western Singapore Strait.',
    takedownMechanics:
      'A.V.I.A.R.S. cross-correlates 120 FPS SAR Kelvin-wake geometry with LWIR thermal signatures to isolate the explosive USVs and deploys ventral micro-munitions before port entry.',
    subsystemBadge: 'Tuas Coastal Hive → 120 FPS SAR/LWIR Lock → Ventral Kinetic Takedown',
    interceptTimeSec: '38.4 SEC',
    distanceKm: '8.4 KM OFFSHORE',
    cameraOffset: [-215, 135, 225],
  },
  {
    id: 'jurong-swarm',
    code: 'INTERCEPT 02 // INFRASTRUCTURE C-UAS',
    sectorTitle: 'Jurong Island & Southern Anchorage Airspace',
    scrollRange: [0.37, 0.58],
    primaryBaseId: 'tengah-airbase',
    secondaryBaseId: 'jurong-battery',
    targetName: 'Low-Altitude Hostile Micro-Drone Swarm (RCS 0.002m²)',
    targetType: 'air-swarm',
    targetLon: 103.685,
    targetLat: 1.195,
    targetAltY: 26.0,
    threatTelemetry: 'MONSOON RAIN PENETRATED // 18× MICRO-DOPPLER ROTOR LOCKS',
    scrambleSummary:
      'High-speed SA-1 flight scrambles south from Tengah Air Base Camp (CAMP-03) while Jurong Coastal Hive (HIVE-02) elevates into a vertical counter-UAS intercept curtain.',
    takedownMechanics:
      '3× gold-dichroic quartz solid-state LiDAR windows + micro-Doppler radar track every hostile rotor through zero-visibility tropical downpours for rapid mid-air interdiction.',
    subsystemBadge: 'Tengah Air Base Scramble → 3× Quartz LiDAR Ring → Mid-Air Swarm Takedown',
    interceptTimeSec: '24.1 SEC',
    distanceKm: '6.2 KM SOUTH',
    cameraOffset: [-110, 145, 235],
  },
  {
    id: 'marina-ew',
    code: 'INTERCEPT 03 // CENTRAL STRAIT & CBD',
    sectorTitle: 'Marina Bay Urban Corridor & Southern Strait',
    scrollRange: [0.58, 0.79],
    primaryBaseId: 'sentosa-marina',
    secondaryBaseId: 'paya-lebar',
    targetName: 'Offshore EW Jamming Vessel & GNSS Spoofing Relay',
    targetType: 'ew-vessel',
    targetLon: 103.868,
    targetLat: 1.198,
    targetAltY: 2.0,
    threatTelemetry: 'GPS SPOOFING REJECTED // HOME-ON-JAM TRIANGULATION LOCKED',
    scrambleSummary:
      'SA-1 units launch from Marina/Sentosa Coastal Hive (HIVE-05) and Paya Lebar Air Base (CAMP-06), navigating GPS-denied urban canyons via Dual 3.0 mm Stereo Visual Inertial Odometry.',
    takedownMechanics:
      'Quantum-resistant AES-256 FHSS telemetry defeats hostile RF jamming while passive Home-On-Jam triangulation guides the SA-1 directly onto the vessel’s primary jamming mast.',
    subsystemBadge: 'Marina Hive + Paya Lebar Camp → Stereo VIO + Home-On-Jam Strike',
    interceptTimeSec: '29.8 SEC',
    distanceKm: '7.1 KM STRAIT',
    cameraOffset: [45, 138, 230],
  },
  {
    id: 'changi-fac',
    code: 'INTERCEPT 04 // EASTERN STRAIT GATE',
    sectorTitle: 'Changi Naval Base & Eastern Strait Corridor',
    scrollRange: [0.79, 1.01],
    primaryBaseId: 'changi-naval',
    secondaryBaseId: 'paya-lebar',
    targetName: '46-Knot Hostile Littoral Fast Attack Craft',
    targetType: 'fast-attack',
    targetLon: 104.065,
    targetLat: 1.245,
    targetAltY: 1.5,
    threatTelemetry: 'ONBOARD EDGE TPU LOCK [< 4.2 MS] // TERMINAL INTERCEPT ARMED',
    scrambleSummary:
      'SA-1 interceptors launch from Changi Eastern Coastal Hive (HIVE-07) and Paya Lebar Camp (CAMP-06), streaking down the Eastern Singapore Strait approach at maximum dash speed.',
    takedownMechanics:
      '100% air-gapped onboard neuromorphic TPU computes wave-crest lead compensation in under 5 milliseconds, neutralizing the fast attack craft before it breaches territorial waters.',
    subsystemBadge: 'Changi Naval Hive → < 5 ms Neuromorphic TPU → Terminal Strike',
    interceptTimeSec: '31.2 SEC',
    distanceKm: '9.0 KM EAST',
    cameraOffset: [215, 140, 220],
  },
];

// Helper to create an extruded 3D landmass mesh + glowing shoreline outline from [lon, lat] polygon
function createExtrudedIsland(
  coords: [number, number][],
  height: number,
  topMat: THREE.Material,
  sideMat: THREE.Material,
  shoreColorHex: number
): THREE.Group {
  const group = new THREE.Group();
  const shape = new THREE.Shape();

  coords.forEach(([lon, lat], idx) => {
    const [x, z] = lonLatToXZ(lon, lat);
    // In THREE.Shape (XY plane), we map X -> x and Y -> -z so when rotated -PI/2 around X, Y becomes +Z
    if (idx === 0) {
      shape.moveTo(x, -z);
    } else {
      shape.lineTo(x, -z);
    }
  });
  shape.closePath();

  const extrudeGeom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.8,
    bevelThickness: 0.8,
  });
  extrudeGeom.rotateX(-Math.PI / 2);

  const mesh = new THREE.Mesh(extrudeGeom, [topMat, sideMat]);
  group.add(mesh);

  // Glowing precision coastline perimeter line at top surface
  const pts3D: THREE.Vector3[] = coords.map(([lon, lat]) => {
    const [x, z] = lonLatToXZ(lon, lat);
    return new THREE.Vector3(x, height + 0.9, z);
  });
  pts3D.push(pts3D[0].clone());

  const lineGeom = new THREE.BufferGeometry().setFromPoints(pts3D);
  const lineMat = new THREE.LineBasicMaterial({
    color: shoreColorHex,
    transparent: true,
    opacity: 0.85,
  });
  group.add(new THREE.Line(lineGeom, lineMat));

  return group;
}

// Build a mini 3D SA-1 "Vanguard" quad-ducted stealth drone mesh for the trajectory animation
function buildMiniSa1DroneMesh(): THREE.Group {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ff41 });
  const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  // Blended quad-ducted fuselage
  const body = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.4, 6.2), hullMat);
  g.add(body);

  // Forward blue 4K optical sphere
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), lensMat);
  nose.position.set(0, 0, 3.2);
  g.add(nose);

  // 4 glowing rotor rings
  const ringCoords: [number, number][] = [
    [-2.2, 2.0],
    [2.2, 2.0],
    [-2.2, -2.0],
    [2.2, -2.0],
  ];
  ringCoords.forEach(([rx, rz]) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.35, 16), glowMat);
    r.rotation.x = -Math.PI / 2;
    r.position.set(rx, 0.8, rz);
    g.add(r);
  });

  return g;
}

// Build 3D Hostile Target Mesh in the Singapore Strait / Airspace
function buildHostileTarget3D(type: InterceptMissionSpec['targetType']): THREE.Group {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshPhysicalMaterial({
    color: 0x334155,
    metalness: 0.6,
    roughness: 0.35,
  });
  const hotMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.85,
  });

  const addPart = (geom: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
    const m = new THREE.Mesh(geom, mat);
    m.position.set(pos[0], pos[1], pos[2]);
    g.add(m);
    const e = new THREE.EdgesGeometry(geom);
    m.add(new THREE.LineSegments(e, edgeMat));
  };

  if (type === 'maritime-usv' || type === 'ew-vessel') {
    // Stealth Corvette / Dark Ship + 2 USV Escorts
    addPart(new THREE.BoxGeometry(7, 3.5, 22), hullMat, [0, 1.8, 0]);
    addPart(new THREE.BoxGeometry(5, 4.2, 8), hullMat, [0, 4.8, 2]);
    addPart(new THREE.CylinderGeometry(0.8, 1.2, 5, 8), hotMat, [0, 8.5, 2]);
    // Escort USVs
    addPart(new THREE.BoxGeometry(2.6, 1.4, 7), hotMat, [-9, 1.0, 5]);
    addPart(new THREE.BoxGeometry(2.6, 1.4, 7), hotMat, [9, 1.0, -4]);
  } else if (type === 'air-swarm') {
    // Swept-Wing Hostile UCAV + 3 Swarm Drones
    addPart(new THREE.BoxGeometry(14, 1.2, 6), hullMat, [0, 0, 0]);
    addPart(new THREE.SphereGeometry(1.6, 10, 10), hotMat, [0, 0.5, -3]);
    addPart(new THREE.BoxGeometry(5, 0.8, 4), hotMat, [-10, 2.5, -5]);
    addPart(new THREE.BoxGeometry(5, 0.8, 4), hotMat, [10, -2.0, -4]);
    addPart(new THREE.BoxGeometry(5, 0.8, 4), hotMat, [0, 4.0, -9]);
  } else {
    // High-Speed Littoral Fast Attack Craft
    addPart(new THREE.BoxGeometry(5.5, 2.8, 17), hullMat, [0, 1.4, 0]);
    addPart(new THREE.BoxGeometry(4.2, 2.5, 6), hullMat, [0, 3.8, 2]);
    addPart(new THREE.BoxGeometry(3.6, 2.2, 5), hotMat, [0, 3.6, -5]);
  }

  // Pulsing Red Target Ring on Water/Air Plane
  const ringG = new THREE.RingGeometry(13, 14.5, 32);
  ringG.rotateX(-Math.PI / 2);
  const ringM = new THREE.Mesh(
    ringG,
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    })
  );
  ringM.position.y = 0.4;
  g.add(ringM);

  return g;
}

export default function SingaporeTacticalMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('tactical');
  const [posture, setPosture] = useState<DefensePosture>('intercept');
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 800 });
  const [projectedBases, setProjectedBases] = useState<ProjectedBaseHud[]>([]);
  const [targetHud, setTargetHud] = useState<ProjectedTargetHud>({
    x: 640,
    y: 400,
    inFront: false,
    droneX: 640,
    droneY: 400,
    droneInFront: false,
    phase: 'scrambling',
    progress: 0,
  });

  const progressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const cameraModeRef = useRef<CameraViewMode>('tactical');
  const postureRef = useRef<DefensePosture>('intercept');
  const scrambleResetClockRef = useRef<number>(-1);
  const lastMissionIdxRef = useRef<number>(-1);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    postureRef.current = posture;
  }, [posture]);

  const triggerManualReScramble = () => {
    setPosture('intercept');
    postureRef.current = 'intercept';
    scrambleResetClockRef.current = -2;
  };

  const jumpToScrollProgress = (targetP: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = rect.height - window.innerHeight;
    window.scrollTo({
      top: docTop + targetP * scrollable,
      behavior: 'smooth',
    });
  };

  // Track Window Scroll Progress (0.0 -> 1.0)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      setScrollProgress(clamp01(-rect.top / totalScrollable));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Initialize Three.js 3D Singapore Sovereign Defense Theater
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const width = wrapper.clientWidth || 1280;
    const height = wrapper.clientHeight || 800;
    setViewportSize({ width, height });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060A11');
    scene.fog = new THREE.FogExp2('#060A11', 0.0011);

    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 2400);
    camera.position.set(0, 320, 390);
    camera.lookAt(0, 0, 15);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.style.touchAction = 'pan-y';

    wrapper.innerHTML = '';
    wrapper.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x060a11, 1.35));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight.position.set(180, 380, 260);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x00ff41, 1.2);
    rimLight.position.set(-220, 180, -200);
    scene.add(rimLight);

    // =========================================================================
    // 1. SINGAPORE STRAIT OCEAN SURFACE & SHIPPING LANE TSS GRID
    // =========================================================================
    const seaGrid = new THREE.GridHelper(1100, 55, 0x0ea5e9, 0x0d1b2a);
    seaGrid.position.y = -0.5;
    (seaGrid.material as THREE.Material).transparent = true;
    (seaGrid.material as THREE.Material).opacity = 0.35;
    scene.add(seaGrid);

    const seaGeom = new THREE.PlaneGeometry(1100, 750, 48, 36);
    seaGeom.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const seaMesh = new THREE.Mesh(seaGeom, seaMat);
    seaMesh.position.y = -0.8;
    scene.add(seaMesh);

    // Singapore Strait Traffic Separation Scheme (TSS) Shipping Corridor Lines
    const tssWaypoints: [number, number][] = [
      [103.52, 1.18],
      [103.65, 1.20],
      [103.78, 1.21],
      [103.90, 1.23],
      [104.08, 1.27],
    ];
    const tssPts1 = tssWaypoints.map(([lon, lat]) => {
      const [x, z] = lonLatToXZ(lon, lat);
      return new THREE.Vector3(x, 0.2, z);
    });
    const tssPts2 = tssWaypoints.map(([lon, lat]) => {
      const [x, z] = lonLatToXZ(lon, lat - 0.018);
      return new THREE.Vector3(x, 0.2, z);
    });
    const tssLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tssPts1), tssLineMat));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tssPts2), tssLineMat));

    // =========================================================================
    // 2. HIGH-PRECISION 3D EXTRUDED SINGAPORE LANDMASS & OFFSHORE ISLANDS
    // =========================================================================
    const sgTopMat = new THREE.MeshPhysicalMaterial({
      color: 0x111e30,
      roughness: 0.55,
      metalness: 0.35,
      clearcoat: 0.3,
    });
    const sgSideMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a192f,
      emissive: 0x00ff41,
      emissiveIntensity: 0.14,
      roughness: 0.4,
    });
    const islandTopMat = new THREE.MeshPhysicalMaterial({
      color: 0x15253b,
      roughness: 0.5,
      metalness: 0.4,
    });
    const neighborMat = new THREE.MeshBasicMaterial({
      color: 0x09101a,
      transparent: true,
      opacity: 0.75,
    });

    // Main Singapore Island (Extruded to height 6.0)
    const mainIslandGroup = createExtrudedIsland(
      SG_MAIN_ISLAND_LON_LAT,
      6.0,
      sgTopMat,
      sgSideMat,
      0x00ff41
    );
    scene.add(mainIslandGroup);

    // Jurong Island, Sentosa, Pulau Tekong, Pulau Ubin & Southern Islands
    scene.add(createExtrudedIsland(JURONG_ISLAND_LON_LAT, 4.5, islandTopMat, sgSideMat, 0x38bdf8));
    scene.add(createExtrudedIsland(SENTOSA_ISLAND_LON_LAT, 4.5, islandTopMat, sgSideMat, 0x38bdf8));
    scene.add(createExtrudedIsland(PULAU_TEKONG_LON_LAT, 5.0, islandTopMat, sgSideMat, 0x00ff41));
    scene.add(createExtrudedIsland(PULAU_UBIN_LON_LAT, 4.2, islandTopMat, sgSideMat, 0x38bdf8));
    SOUTHERN_ISLANDS_LON_LAT.forEach((poly) => {
      scene.add(createExtrudedIsland(poly, 3.5, islandTopMat, sgSideMat, 0x38bdf8));
    });

    // Northern Johor Coastline Context Silhouette
    const johorCoords: [number, number][] = [
      [103.52, 1.42],
      [103.65, 1.43],
      [103.75, 1.468],
      [103.85, 1.482],
      [103.96, 1.445],
      [104.12, 1.38],
      [104.12, 1.56],
      [103.52, 1.56],
    ];
    scene.add(createExtrudedIsland(johorCoords, 3.0, neighborMat, neighborMat, 0x1e293b));

    // 3D Urban Skyline Massing Blocks (Marina Bay CBD, Jurong/Tuas, Changi)
    const cityClusters: { lon: number; lat: number; count: number; maxH: number }[] = [
      { lon: 103.854, lat: 1.284, count: 24, maxH: 22 }, // Marina Bay & Raffles Place CBD
      { lon: 103.835, lat: 1.305, count: 14, maxH: 14 }, // Orchard / Central
      { lon: 103.698, lat: 1.272, count: 14, maxH: 11 }, // Jurong Island Refineries
      { lon: 103.622, lat: 1.262, count: 12, maxH: 10 }, // Tuas Mega Port Cranes
      { lon: 103.992, lat: 1.355, count: 12, maxH: 10 }, // Changi Airport Complex
    ];
    const bldgMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const bldgEdgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });

    cityClusters.forEach((cl) => {
      const [cx, cz] = lonLatToXZ(cl.lon, cl.lat);
      for (let i = 0; i < cl.count; i++) {
        const ox = ((i * 37) % 26) - 13;
        const oz = ((i * 53) % 22) - 11;
        const bh = 4 + ((i * 19) % cl.maxH);
        const bw = 2.4 + (i % 3) * 1.1;
        const geom = new THREE.BoxGeometry(bw, bh, bw);
        const mesh = new THREE.Mesh(geom, bldgMat);
        mesh.position.set(cx + ox, 6.0 + bh / 2, cz + oz);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom), bldgEdgeMat));
        scene.add(mesh);
      }
    });

    // =========================================================================
    // 3. 7 COASTAL DRONE HIVES & SAF MILITARY CAMPS AROUND SINGAPORE
    // =========================================================================
    const base3DNodes: {
      spec: MilitaryBaseSpec;
      worldPos: THREE.Vector3;
      pulseRing: THREE.Mesh;
      radarDish: THREE.Object3D;
    }[] = [];

    SINGAPORE_BASES.forEach((bSpec) => {
      const [bx, bz] = lonLatToXZ(bSpec.lon, bSpec.lat);
      const baseGroup = new THREE.Group();
      const baseY = 6.8;
      baseGroup.position.set(bx, baseY, bz);

      const isCoastal = bSpec.type === 'coastal-hive';
      const padColor = isCoastal ? 0x00ff41 : 0x38bdf8;

      // Hexagonal Armored Drone Hive Launch Pad
      const hexGeom = new THREE.CylinderGeometry(6.2, 7.2, 2.2, 6);
      const hexMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        emissive: padColor,
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.2,
      });
      const hexMesh = new THREE.Mesh(hexGeom, hexMat);
      baseGroup.add(hexMesh);

      // Glowing Hex Launch Ring
      const ringG = new THREE.RingGeometry(8.5, 9.8, 6);
      ringG.rotateX(-Math.PI / 2);
      const ringM = new THREE.Mesh(
        ringG,
        new THREE.MeshBasicMaterial({
          color: padColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      ringM.position.y = 1.2;
      baseGroup.add(ringM);

      // Expanding Radar Dome Pulse Ring
      const pulseG = new THREE.RingGeometry(11, 12.2, 32);
      pulseG.rotateX(-Math.PI / 2);
      const pulseM = new THREE.Mesh(
        pulseG,
        new THREE.MeshBasicMaterial({
          color: padColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
        })
      );
      pulseM.position.y = 0.8;
      baseGroup.add(pulseM);

      // Rotating Phased-Array Radar Tower on Base
      const radarMast = new THREE.Group();
      radarMast.position.set(0, 2.5, 0);
      const dish = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 2.0, 0.8),
        new THREE.MeshBasicMaterial({ color: padColor })
      );
      dish.position.y = 2.0;
      radarMast.add(dish);
      baseGroup.add(radarMast);

      scene.add(baseGroup);
      base3DNodes.push({
        spec: bSpec,
        worldPos: new THREE.Vector3(bx, baseY + 2.0, bz),
        pulseRing: pulseM,
        radarDish: radarMast,
      });
    });

    // Sovereign Coastal Defense Mesh Network (Faint glowing links between all 7 bases)
    const networkPts: THREE.Vector3[] = base3DNodes.map((b) => b.worldPos.clone());
    networkPts.push(base3DNodes[0].worldPos.clone());
    const networkLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(networkPts),
      new THREE.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.22 })
    );
    scene.add(networkLine);

    // =========================================================================
    // 4. 4 HOSTILE TARGET MODELS + PERSISTENT CORRIDORS + SMOOTH BANKING DRONES
    // =========================================================================
    const missionTargetGroups: { mesh: THREE.Group; worldPos: THREE.Vector3 }[] =
      INTERCEPT_MISSIONS.map((m) => {
        const [tx, tz] = lonLatToXZ(m.targetLon, m.targetLat);
        const tg = buildHostileTarget3D(m.targetType);
        tg.position.set(tx, m.targetAltY, tz);
        scene.add(tg);
        return {
          mesh: tg,
          worldPos: new THREE.Vector3(tx, m.targetAltY + 3.0, tz),
        };
      });

    // Evaluate a 3D parabolic flight trajectory between Base and Target at u in [0, 1]
    const evalTrajectoryPoint = (
      origin: THREE.Vector3,
      dest: THREE.Vector3,
      u: number,
      cruiseApex: number
    ): THREE.Vector3 => {
      const x = THREE.MathUtils.lerp(origin.x, dest.x, u);
      const z = THREE.MathUtils.lerp(origin.z, dest.z, u);
      const baseAlt = THREE.MathUtils.lerp(origin.y, dest.y + 12, u);
      const arc = Math.sin(u * Math.PI) * cruiseApex;
      return new THREE.Vector3(x, baseAlt + arc, z);
    };

    // Persistent Island-Wide Tactical Trajectory Corridors for all 4 Missions
    const sectorCorridorLines: { primary: THREE.Line; secondary: THREE.Line }[] =
      INTERCEPT_MISSIONS.map((m, idx) => {
        const b1 = base3DNodes.find((b) => b.spec.id === m.primaryBaseId) || base3DNodes[0];
        const b2 = base3DNodes.find((b) => b.spec.id === m.secondaryBaseId) || base3DNodes[1];
        const tPos = missionTargetGroups[idx].worldPos;
        const pts1: THREE.Vector3[] = [];
        const pts2: THREE.Vector3[] = [];
        for (let i = 0; i <= 28; i++) {
          const u = i / 28;
          pts1.push(evalTrajectoryPoint(b1.worldPos, tPos, u, 38));
          pts2.push(evalTrajectoryPoint(b2.worldPos, tPos, u, 30));
        }
        const l1 = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts1),
          new THREE.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.18 })
        );
        const l2 = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts2),
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14 })
        );
        scene.add(l1);
        scene.add(l2);
        return { primary: l1, secondary: l2 };
      });

    // Primary & Wingman Scrambling SA-1 Drones
    const primarySa1Drone = buildMiniSa1DroneMesh();
    const secondarySa1Drone = buildMiniSa1DroneMesh();
    scene.add(primarySa1Drone);
    scene.add(secondarySa1Drone);

    // Active Smoothly Morphing & Progressively Drawn 3D Flight Trajectory Arcs
    const trajMatPrimary = new THREE.LineBasicMaterial({
      color: 0x00ff41,
      transparent: true,
      opacity: 0.95,
    });
    const trajGeomPrimary = new THREE.BufferGeometry();
    const trajLinePrimary = new THREE.Line(trajGeomPrimary, trajMatPrimary);
    scene.add(trajLinePrimary);

    const trajMatSecondary = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const trajGeomSecondary = new THREE.BufferGeometry();
    const trajLineSecondary = new THREE.Line(trajGeomSecondary, trajMatSecondary);
    scene.add(trajLineSecondary);

    // 3D Kinetic Micro-Munition Dart (Streaks from SA-1 Drone into Target)
    const munitionDartGroup = new THREE.Group();
    munitionDartGroup.visible = false;
    const dartConeG = new THREE.ConeGeometry(1.1, 5.2, 10);
    dartConeG.rotateX(Math.PI / 2);
    munitionDartGroup.add(
      new THREE.Mesh(dartConeG, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    );
    munitionDartGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(2.1, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 })
      )
    );
    scene.add(munitionDartGroup);

    // Terminal Laser Lock Beam & Kinetic Takedown Shockwave at Target
    const strikeLaserMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.95,
    });
    const strikeLaserGeom = new THREE.BufferGeometry();
    const strikeLaserLine = new THREE.Line(strikeLaserGeom, strikeLaserMat);
    scene.add(strikeLaserLine);

    const shockwaveRingG = new THREE.RingGeometry(2.0, 4.2, 36);
    shockwaveRingG.rotateX(-Math.PI / 2);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveRingG, shockwaveMat);
    scene.add(shockwaveMesh);

    const explosionCoreG = new THREE.SphereGeometry(5.0, 18, 18);
    const explosionCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.0,
    });
    const explosionCoreMesh = new THREE.Mesh(explosionCoreG, explosionCoreMat);
    scene.add(explosionCoreMesh);

    // =========================================================================
    // 5. ANIMATION LOOP — CONTINUOUS SMOOTH CAMERA, BANKING DRONE & TAKEDOWN
    // =========================================================================
    let isDisposed = false;
    let animId = 0;
    let lastHudSync = 0;
    let missionCycleStart = 0;
    const clock = new THREE.Clock();

    // Persistent smoothed vectors so transitions between missions NEVER cut or snap
    const firstBase1 =
      base3DNodes.find((b) => b.spec.id === INTERCEPT_MISSIONS[0].primaryBaseId) || base3DNodes[0];
    const firstBase2 =
      base3DNodes.find((b) => b.spec.id === INTERCEPT_MISSIONS[0].secondaryBaseId) || base3DNodes[1];
    const smoothedOrigin1 = firstBase1.worldPos.clone();
    const smoothedOrigin2 = firstBase2.worldPos.clone();
    const smoothedTargetPos = missionTargetGroups[0].worldPos.clone();
    const smoothedLookAt = new THREE.Vector3(0, 0, 20);
    const smoothedDrone1Pos = firstBase1.worldPos.clone();
    const smoothedDrone2Pos = firstBase2.worldPos.clone();
    let smoothedCamRoll = 0;

    const projectToScreen = (worldVec: THREE.Vector3, w: number, h: number) => {
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
      smoothedProgressRef.current += (progressRef.current - smoothedProgressRef.current) * 0.075;
      const p = smoothedProgressRef.current;

      // Rotate all 7 base radars & pulse coastal defense rings
      base3DNodes.forEach((b, idx) => {
        b.radarDish.rotation.y = elapsed * 2.0 + idx;
        const pulsePhase = (elapsed * 0.8 + idx * 0.25) % 1.0;
        const s = 1.0 + pulsePhase * 2.6;
        b.pulseRing.scale.set(s, s, s);
        (b.pulseRing.material as THREE.MeshBasicMaterial).opacity = (1.0 - pulsePhase) * 0.55;
      });

      // Gentle motion on hostile targets
      missionTargetGroups.forEach((tg, idx) => {
        tg.mesh.position.x = tg.worldPos.x + Math.sin(elapsed * 0.9 + idx) * 3.5;
      });

      // Determine active intercept mission index (0..3) and local scroll progress within mission
      const activeMissionIdx =
        p < 0.37 ? 0 : p < 0.58 ? 1 : p < 0.79 ? 2 : 3;
      const activeMission = INTERCEPT_MISSIONS[activeMissionIdx];
      const activeTarget = missionTargetGroups[activeMissionIdx];

      // Smoothly cross-fade persistent corridor lines so active sector glows while others stay visible
      sectorCorridorLines.forEach((corridor, idx) => {
        const targetOp1 = idx === activeMissionIdx ? 0.38 : 0.14;
        const targetOp2 = idx === activeMissionIdx ? 0.28 : 0.1;
        const m1 = corridor.primary.material as THREE.LineBasicMaterial;
        const m2 = corridor.secondary.material as THREE.LineBasicMaterial;
        m1.opacity += (targetOp1 - m1.opacity) * 0.08;
        m2.opacity += (targetOp2 - m2.opacity) * 0.08;
      });

      const primaryBase =
        base3DNodes.find((b) => b.spec.id === activeMission.primaryBaseId) || base3DNodes[0];
      const secondaryBase =
        base3DNodes.find((b) => b.spec.id === activeMission.secondaryBaseId) || base3DNodes[1];

      const rawTargetPos = new THREE.Vector3(
        activeTarget.mesh.position.x,
        activeTarget.worldPos.y,
        activeTarget.mesh.position.z
      );

      // Smoothly morph trajectory origins & target position so switching sectors sweeps smoothly
      smoothedOrigin1.lerp(primaryBase.worldPos, 0.08);
      smoothedOrigin2.lerp(secondaryBase.worldPos, 0.08);
      smoothedTargetPos.lerp(rawTargetPos, 0.085);

      // Reset scramble cycle only when clicking Re-Launch or starting fresh, keeping transitions fluid
      if (lastMissionIdxRef.current !== activeMissionIdx || scrambleResetClockRef.current === -2) {
        lastMissionIdxRef.current = activeMissionIdx;
        missionCycleStart = elapsed;
        scrambleResetClockRef.current = 0;
      }

      const w = wrapper.clientWidth || 1280;
      const h = Math.max(1, wrapper.clientHeight || 800);
      const aspect = w / h;
      const portraitZoom = aspect < 1.0 ? Math.min(1.55, 0.95 / Math.max(aspect, 0.48)) : 1.0;

      // =======================================================================
      // CAMERA POSITIONING: SMOOTH GLIDE + AERODYNAMIC ROLL (ZERO CUTS)
      // =======================================================================
      const prevCamX = camera.position.x;
      if (p < 0.16 || cameraModeRef.current === 'island') {
        const targetCamPos = new THREE.Vector3(
          0,
          310 * portraitZoom,
          375 * portraitZoom
        );
        camera.position.lerp(targetCamPos, 0.065);
        const desiredLook = new THREE.Vector3(0, 0, 20);
        smoothedLookAt.lerp(desiredLook, 0.075);
      } else {
        // Swoop camera smoothly to frame both the scrambling coastal/military bases AND the offshore target
        const midX = (smoothedOrigin1.x + smoothedTargetPos.x) * 0.5;
        const midZ = (smoothedOrigin1.z + smoothedTargetPos.z) * 0.5;
        const desiredCam = new THREE.Vector3(
          midX * 0.65 + activeMission.cameraOffset[0] * 0.45,
          activeMission.cameraOffset[1] * portraitZoom,
          midZ + 185 * portraitZoom
        );
        camera.position.lerp(desiredCam, 0.065);
        const desiredLook = new THREE.Vector3(midX, 4, midZ + 12);
        smoothedLookAt.lerp(desiredLook, 0.075);
      }

      // Subtle aerodynamic camera roll when panning between coastal sectors
      const camVelX = camera.position.x - prevCamX;
      const targetRoll = THREE.MathUtils.clamp(-camVelX * 0.012, -0.14, 0.14);
      smoothedCamRoll += (targetRoll - smoothedCamRoll) * 0.1;
      camera.up.set(Math.sin(smoothedCamRoll), Math.cos(smoothedCamRoll), 0);
      camera.lookAt(smoothedLookAt);

      // =======================================================================
      // SMOOTH DRONE SCRAMBLE, PROGRESSIVE TRAIL & KINETIC DART TAKEDOWN
      // =======================================================================
      // Cycle time: 0.0s -> 2.4s (Drone Scrambling along Trajectory),
      //             2.4s -> 3.1s (AGM-M1 Dart Launch down Laser Beam),
      //             3.1s -> 4.5s (Detonation Shockwave & Fireball)
      const cycleDuration = 4.5;
      const cycleTime = (elapsed - missionCycleStart) % cycleDuration;
      const isInterceptMode = postureRef.current === 'intercept';

      let hudPhase: 'scrambling' | 'locking' | 'impact' = 'scrambling';
      let hudProgress = 0;

      const u1 = cycleTime < 2.4 ? smoothstep(0.0, 2.4, cycleTime) : 1.0;
      const u2 = cycleTime < 2.4 ? smoothstep(0.12, 2.4, cycleTime) : 1.0;

      const desiredD1 = evalTrajectoryPoint(smoothedOrigin1, smoothedTargetPos, u1 * 0.86, 38);
      const desiredD1Look = evalTrajectoryPoint(
        smoothedOrigin1,
        smoothedTargetPos,
        Math.min(1, u1 * 0.86 + 0.06),
        38
      );
      const desiredD2 = evalTrajectoryPoint(smoothedOrigin2, smoothedTargetPos, u2 * 0.8, 30);
      const desiredD2Look = evalTrajectoryPoint(
        smoothedOrigin2,
        smoothedTargetPos,
        Math.min(1, u2 * 0.8 + 0.06),
        30
      );

      // Smoothly glide the 3D SA-1 Drones so they physically bank & fly across sectors instead of cutting
      const prevD1X = smoothedDrone1Pos.x;
      smoothedDrone1Pos.lerp(desiredD1, 0.14);
      smoothedDrone2Pos.lerp(desiredD2, 0.14);

      primarySa1Drone.position.copy(smoothedDrone1Pos);
      primarySa1Drone.lookAt(desiredD1Look);
      // Add realistic bank angle when turning toward next target
      const droneTurnRate = THREE.MathUtils.clamp((smoothedDrone1Pos.x - prevD1X) * -0.18, -0.55, 0.55);
      primarySa1Drone.rotateZ(droneTurnRate);

      secondarySa1Drone.position.copy(smoothedDrone2Pos);
      secondarySa1Drone.lookAt(desiredD2Look);
      secondarySa1Drone.rotateZ(droneTurnRate * 0.8);

      // Progressively draw the active glowing 3D trajectory arcs from Base up to the Drone's nose
      // (and full path during terminal lock/strike)
      const trailLimit1 = Math.max(0.12, u1 * 0.88);
      const trailLimit2 = Math.max(0.12, u2 * 0.82);
      const primaryCurvePts: THREE.Vector3[] = [];
      const secondaryCurvePts: THREE.Vector3[] = [];
      for (let i = 0; i <= 32; i++) {
        const frac = i / 32;
        primaryCurvePts.push(
          evalTrajectoryPoint(smoothedOrigin1, smoothedTargetPos, frac * trailLimit1, 38)
        );
        secondaryCurvePts.push(
          evalTrajectoryPoint(smoothedOrigin2, smoothedTargetPos, frac * trailLimit2, 30)
        );
      }
      trajGeomPrimary.setFromPoints(primaryCurvePts);
      trajGeomSecondary.setFromPoints(secondaryCurvePts);

      if (cycleTime < 2.4) {
        // Phase A: SA-1 Drones scrambling smoothly toward Target
        hudPhase = 'scrambling';
        hudProgress = u1;

        strikeLaserLine.visible = u1 > 0.68;
        if (strikeLaserLine.visible) {
          strikeLaserMat.color.setHex(isInterceptMode ? 0xef4444 : 0x00ff41);
          strikeLaserGeom.setFromPoints([smoothedDrone1Pos, smoothedTargetPos]);
        }
        munitionDartGroup.visible = false;
        shockwaveMesh.visible = false;
        explosionCoreMesh.visible = false;
      } else if (cycleTime < 3.1 && isInterceptMode) {
        // Phase B1: AGM-M1 Kinetic Micro-Munition Dart streaks from SA-1 Drone into Target
        const dartT = clamp01((cycleTime - 2.4) / 0.7);
        hudPhase = 'locking';
        hudProgress = dartT;

        strikeLaserLine.visible = true;
        strikeLaserMat.color.setHex(0xef4444);
        strikeLaserGeom.setFromPoints([smoothedDrone1Pos, smoothedTargetPos]);

        munitionDartGroup.visible = true;
        const dartPos = new THREE.Vector3().lerpVectors(smoothedDrone1Pos, smoothedTargetPos, dartT);
        munitionDartGroup.position.copy(dartPos);
        munitionDartGroup.lookAt(smoothedTargetPos);

        shockwaveMesh.visible = false;
        explosionCoreMesh.visible = false;
      } else {
        // Phase B2: Kinetic Detonation Shockwave & Fireball at Target
        const impactT = clamp01((cycleTime - (isInterceptMode ? 3.1 : 2.4)) / 1.4);
        hudPhase = isInterceptMode ? 'impact' : 'locking';
        hudProgress = impactT;

        munitionDartGroup.visible = false;
        strikeLaserLine.visible = true;
        strikeLaserMat.color.setHex(isInterceptMode ? 0xef4444 : 0x00ff41);
        strikeLaserGeom.setFromPoints([smoothedDrone1Pos, smoothedTargetPos]);

        if (isInterceptMode) {
          shockwaveMesh.visible = true;
          shockwaveMesh.position.set(smoothedTargetPos.x, 1.2, smoothedTargetPos.z);
          const sScale = 1.0 + impactT * 11.5;
          shockwaveMesh.scale.set(sScale, sScale, sScale);
          shockwaveMat.opacity = (1.0 - impactT) * 0.9;

          explosionCoreMesh.visible = true;
          explosionCoreMesh.position.copy(smoothedTargetPos);
          const cScale = 0.5 + Math.sin(impactT * Math.PI) * 2.6;
          explosionCoreMesh.scale.set(cScale, cScale, cScale);
          explosionCoreMat.opacity = (1.0 - impactT) * 0.85;
        } else {
          shockwaveMesh.visible = false;
          explosionCoreMesh.visible = false;
        }
      }

      renderer.render(scene, camera);

      // Sync 2D Projected Labels for Coastal Hives, Military Camps, Scrambling Drone & Target (~30 FPS)
      if (elapsed - lastHudSync > 0.033) {
        lastHudSync = elapsed;

        const nextBases: ProjectedBaseHud[] = base3DNodes.map((b) => {
          const proj = projectToScreen(b.worldPos, w, h);
          const isScrambling =
            b.spec.id === activeMission.primaryBaseId ||
            b.spec.id === activeMission.secondaryBaseId;
          return {
            ...b.spec,
            x: proj.x,
            y: proj.y,
            inFront: proj.inFront,
            isScrambling,
          };
        });
        setProjectedBases(nextBases);

        const tProj = projectToScreen(smoothedTargetPos, w, h);
        const dProj = projectToScreen(smoothedDrone1Pos, w, h);
        setTargetHud({
          x: tProj.x,
          y: tProj.y,
          inFront: tProj.inFront,
          droneX: dProj.x,
          droneY: dProj.y,
          droneInFront: dProj.inFront,
          phase: hudPhase,
          progress: hudProgress,
        });
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

  const isSectorZoom = scrollProgress >= 0.16;
  const activeMissionIdx =
    scrollProgress < 0.37 ? 0 : scrollProgress < 0.58 ? 1 : scrollProgress < 0.79 ? 2 : 3;
  const activeMission = INTERCEPT_MISSIONS[activeMissionIdx];
  const primaryBaseSpec =
    SINGAPORE_BASES.find((b) => b.id === activeMission.primaryBaseId) || SINGAPORE_BASES[0];
  const secondaryBaseSpec =
    SINGAPORE_BASES.find((b) => b.id === activeMission.secondaryBaseId) || SINGAPORE_BASES[1];

  const isIntercept = posture === 'intercept';
  const accentColor = isIntercept ? '#ef4444' : '#00ff41';
  const accentBorderClass = isIntercept ? 'border-red-500/60' : 'border-[#00ff41]/60';
  const accentTextClass = isIntercept ? 'text-red-400' : 'text-[#00ff41]';
  const accentBgClass = isIntercept ? 'bg-red-500/15' : 'bg-[#00ff41]/15';

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] sm:h-[560vh] lg:h-[640vh]">
      {/* Sticky Full-Viewport 3D Singapore Coastal Hive & Airbase Intercept Stage */}
      <div className="sticky top-16 sm:top-20 lg:top-24 w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden bg-[#060A11] border-y border-white/10">
        {/* Three.js 3D Singapore Map & Trajectory Canvas */}
        <div ref={canvasWrapperRef} className="relative z-10 w-full h-full" />

        {/* Subtle Tactical Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-15"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.02) 0%, rgba(6, 10, 17, 0.68) 94%)',
          }}
        />

        {/* =====================================================================
            2D SVG TACTICAL HUD OVERLAY — Base Markers, Scrambling Drone & Target
           ===================================================================== */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 w-full h-full"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
        >
          {/* Projected 2D Callout Badges for all 7 Coastal Hives & SAF Airbases */}
          {projectedBases.map((base) => {
            if (
              !base.inFront ||
              base.x < 40 ||
              base.x > viewportSize.width - 40 ||
              base.y < 70 ||
              base.y > viewportSize.height - 80
            ) {
              return null;
            }
            const badgeColor = base.isScrambling
              ? '#00ff41'
              : base.type === 'coastal-hive'
              ? '#38bdf8'
              : '#94a3b8';
            return (
              <g key={base.id} opacity={base.isScrambling || !isSectorZoom ? 0.95 : 0.45}>
                <circle
                  cx={base.x}
                  cy={base.y}
                  r={base.isScrambling ? 8 : 4.5}
                  fill="none"
                  stroke={badgeColor}
                  strokeWidth={base.isScrambling ? 2 : 1.2}
                />
                <circle cx={base.x} cy={base.y} r="2.5" fill={badgeColor} />
                <rect
                  x={base.x - 62}
                  y={base.y - 28}
                  width="124"
                  height="16"
                  rx="4"
                  fill="rgba(6, 10, 17, 0.88)"
                  stroke={badgeColor}
                  strokeWidth={base.isScrambling ? 1.4 : 0.8}
                />
                <text
                  x={base.x}
                  y={base.y - 17}
                  textAnchor="middle"
                  fill={badgeColor}
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {base.isScrambling ? `▲ SCRAMBLE: ${base.code}` : base.code}
                </text>
              </g>
            );
          })}

          {/* Projected Scrambling SA-1 Drone In-Flight Reticle */}
          {targetHud.droneInFront && (
            <g>
              <circle
                cx={targetHud.droneX}
                cy={targetHud.droneY}
                r="11"
                fill="none"
                stroke="#00ff41"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <circle cx={targetHud.droneX} cy={targetHud.droneY} r="3" fill="#00ff41" />
              <text
                x={targetHud.droneX + 15}
                y={targetHud.droneY + 3}
                fill="#00ff41"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {targetHud.phase === 'scrambling'
                  ? `SA-1 INTERCEPTOR [EN ROUTE ${(targetHud.progress * 100).toFixed(0)}%]`
                  : 'SA-1 ON STATION // WEAPONS FREE'}
              </text>
            </g>
          )}

          {/* Projected Hostile Target Reticle + Dashed Trajectory Vector */}
          {targetHud.inFront && (
            <g>
              {targetHud.droneInFront && (
                <line
                  x1={targetHud.droneX}
                  y1={targetHud.droneY}
                  x2={targetHud.x}
                  y2={targetHud.y}
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />
              )}

              <rect
                x={targetHud.x - 32}
                y={targetHud.y - 32}
                width="64"
                height="64"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.8"
              />
              <circle cx={targetHud.x} cy={targetHud.y} r="4" fill="#ef4444" />

              {targetHud.phase === 'impact' && isIntercept && (
                <>
                  <circle
                    cx={targetHud.x}
                    cy={targetHud.y}
                    r={22 + targetHud.progress * 48}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    opacity={Math.max(0, 1 - targetHud.progress)}
                  />
                  <text
                    x={targetHud.x}
                    y={targetHud.y - 42}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="10.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ✓ TARGET NEUTRALIZED // STRAIT SECURED
                  </text>
                </>
              )}
            </g>
          )}
        </svg>

        {/* =====================================================================
            TOP BAR HUD — Active Singapore Sector + Camera Mode + Posture Toggle
           ===================================================================== */}
        <div className="pointer-events-none absolute z-30 top-3 sm:top-5 lg:top-6 left-3 right-3 sm:left-6 sm:right-6 lg:left-10 lg:right-10 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3">
          {/* Left: Active Singapore Intercept Sector Status */}
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
                  {isSectorZoom
                    ? `${activeMission.code} // SCRAMBLE FROM ${primaryBaseSpec.code}`
                    : 'SINGAPORE SOVEREIGN DEFENSE DOME // 7 COASTAL HIVES & SAF AIRBASES'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {isSectorZoom
                    ? `TARGET: ${activeMission.targetName}`
                    : 'Scroll Down to Scramble SA-1 Drones from Coastal Bases to Intercept Threats'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Sector Quick-Jump Pills + Camera View Toggle + Takedown Mode */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            {/* Sector Quick-Jump Buttons */}
            <div className="hidden md:flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1 text-[10px] font-mono uppercase">
              {[
                { label: 'Overview', p: 0.02, active: !isSectorZoom },
                { label: '01 Tuas', p: 0.24, active: isSectorZoom && activeMissionIdx === 0 },
                { label: '02 Tengah/Jurong', p: 0.46, active: isSectorZoom && activeMissionIdx === 1 },
                { label: '03 Marina/PLAB', p: 0.67, active: isSectorZoom && activeMissionIdx === 2 },
                { label: '04 Changi', p: 0.88, active: isSectorZoom && activeMissionIdx === 3 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => jumpToScrollProgress(btn.p)}
                  className={`rounded-lg px-2.5 py-1.5 transition-all whitespace-nowrap ${
                    btn.active
                      ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50 font-bold'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Camera View Toggle (Sector Follow vs Full Island Map) */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setCameraMode('tactical')}
                className={`rounded-lg px-2.5 py-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  cameraMode === 'tactical'
                    ? 'bg-sky-400 text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                3D Sector Zoom
              </button>
              <button
                type="button"
                onClick={() => setCameraMode('island')}
                className={`rounded-lg px-2.5 py-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  cameraMode === 'island'
                    ? 'bg-sky-400 text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Full Island Map
              </button>
            </div>

            {/* Defense Posture Toggle: Kinetic Takedown vs ISR Overwatch */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setPosture('intercept')}
                className={`rounded-lg px-3 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  posture === 'intercept'
                    ? 'bg-red-500 text-white font-bold shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Kinetic Takedown
              </button>
              <button
                type="button"
                onClick={() => setPosture('overwatch')}
                className={`rounded-lg px-3 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  posture === 'overwatch'
                    ? 'bg-[#00ff41] text-black font-bold shadow-[0_0_16px_rgba(0,255,65,0.4)]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Recon Overwatch
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            PHASE 0 PROMPT OVERLAY (Full Island Overview 0% - 16%)
           ===================================================================== */}
        {!isSectorZoom && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-10 z-25 flex justify-center px-4">
            <div className="bg-black/85 backdrop-blur-xl border border-[#00ff41]/40 rounded-2xl px-5 py-3.5 sm:px-7 sm:py-4 text-center max-w-2xl shadow-2xl">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#00ff41] font-bold mb-1">
                7 COASTAL DRONE HIVES &amp; SAF AIRBASES // 360° SOVEREIGN PERIMETER
              </p>
              <p className="text-xs sm:text-sm text-white/85">
                Scroll down to watch <strong className="text-[#00ff41]">SA-1 &ldquo;Vanguard&rdquo;</strong>{' '}
                interceptors scramble from <strong className="text-sky-300">Tuas Naval Base, Tengah AB, Jurong Island, Marina South, Paya Lebar AB, and Changi</strong> along 3D trajectories to neutralize incoming threats.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESKTOP SCRAMBLE & TARGET TAKEDOWN DOSSIER CARD (lg+)
           ===================================================================== */}
        {isSectorZoom && (
          <div className="pointer-events-none absolute inset-y-0 right-7 xl:right-12 z-30 hidden lg:flex items-center">
            <div
              className={`pointer-events-auto w-[395px] xl:w-[430px] bg-black/88 backdrop-blur-2xl border ${accentBorderClass} rounded-2xl p-6 shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono uppercase tracking-[0.18em] font-bold px-2.5 py-1 rounded ${accentBgClass} ${accentTextClass}`}
                >
                  {activeMission.code}
                </span>
                <span className="text-xs font-mono text-white/60">
                  INTERCEPT: <strong className="text-[#00ff41]">{activeMission.interceptTimeSec}</strong>
                </span>
              </div>

              <p className="text-[11px] font-mono uppercase tracking-wider text-white/45 mt-1">
                {activeMission.sectorTitle} ({activeMission.distanceKm})
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1 mb-1">
                {activeMission.targetName}
              </h3>
              <p className={`text-xs font-mono mb-4 ${accentTextClass}`}>
                {activeMission.threatTelemetry}
              </p>

              {/* Launching Coastal Hives & Military Camps */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 mb-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#00ff41] font-bold mb-1.5">
                  SCRAMBLING COASTAL HIVE &amp; MILITARY BASE
                </p>
                <div className="space-y-1 text-xs">
                  <p className="text-white font-semibold flex items-center justify-between">
                    <span>1. {primaryBaseSpec.name}</span>
                    <span className="text-[10px] font-mono text-[#00ff41]">PRIMARY</span>
                  </p>
                  <p className="text-white/75 flex items-center justify-between">
                    <span>2. {secondaryBaseSpec.name}</span>
                    <span className="text-[10px] font-mono text-sky-400">WINGMAN</span>
                  </p>
                </div>
              </div>

              {/* Trajectory & Takedown Execution */}
              <div className="border-t border-white/10 pt-3.5 mb-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/45 mb-1">
                  3D TRAJECTORY &amp; TARGET TAKEDOWN
                </p>
                <p className="text-xs text-white/80 leading-relaxed mb-2">
                  {activeMission.scrambleSummary}
                </p>
                <p className="text-xs text-white/70 leading-relaxed">
                  {activeMission.takedownMechanics}
                </p>
              </div>

              {/* Active Hardware / Software Chain + Re-Launch Button */}
              <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-sky-400 font-bold truncate">
                  {activeMission.subsystemBadge}
                </span>
                <button
                  type="button"
                  onClick={triggerManualReScramble}
                  className="shrink-0 rounded-lg bg-red-500/20 hover:bg-red-500 border border-red-500/60 text-red-300 hover:text-white px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Re-Launch Drone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MOBILE & TABLET SCRAMBLE CARD (< lg)
           ===================================================================== */}
        {isSectorZoom && (
          <div className="pointer-events-auto lg:hidden absolute z-30 bottom-3 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6">
            <div className="max-w-6xl mx-auto">
              <div
                className={`bg-black/90 backdrop-blur-xl border ${accentBorderClass} rounded-xl p-3.5 sm:p-4 shadow-2xl`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-bold ${accentTextClass}`}
                  >
                    {activeMission.code} // {activeMission.targetName}
                  </span>
                  <span className="text-[10px] font-mono text-[#00ff41] shrink-0">
                    {activeMission.interceptTimeSec}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-sky-300 mb-1">
                  LAUNCHING FROM: {primaryBaseSpec.name} + {secondaryBaseSpec.code}
                </p>
                <p className="text-[11px] sm:text-xs text-white/80 leading-snug mb-2">
                  {activeMission.scrambleSummary}
                </p>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-white/60 truncate">
                    {activeMission.subsystemBadge}
                  </span>
                  <button
                    type="button"
                    onClick={triggerManualReScramble}
                    className="shrink-0 rounded bg-red-500/25 hover:bg-red-500 border border-red-500/60 text-red-300 hover:text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider transition-all"
                  >
                    Re-Launch Drone
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
