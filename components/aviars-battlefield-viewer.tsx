'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ScenarioType = 'land' | 'air' | 'naval';
type MissionMode = 'recon' | 'attack';
type SensorVisionMode = 'optical' | 'thermal' | 'sar';

interface StrikeHudState {
  status: 'idle' | 'inbound' | 'impact';
  progress: number;
  screenX: number;
  screenY: number;
  visible: boolean;
}

interface TargetSpec {
  id: string;
  code: string;
  sector: ScenarioType;
  sectorLabel: string;
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
  scrollRange: [number, number];
}

interface ProjectedTarget extends TargetSpec {
  screenX: number;
  screenY: number;
  inFront: boolean;
  distanceMeters: number;
  isPrimaryLock: boolean;
}

const MISSION_TARGETS: TargetSpec[] = [
  // =========================================================================
  // SECTOR 01: LAND // URBAN & GROUND BATTLEFIELD (Scroll 16% -> 44%)
  // =========================================================================
  {
    id: 'land-sam',
    code: 'LAND-01 // TELAR SAM',
    sector: 'land',
    sectorLabel: 'SECTOR 01 // LAND — CONTESTED URBAN CORRIDOR',
    name: '8×8 Mobile SAM Launcher & Radar',
    classification: 'THERMAL + SAR SIGNATURE CONFIRMED',
    telemetryRecon: 'PASSIVE LWIR LOCK // CANISTER TEMP: 84°C // COORDS ENCRYPTED',
    telemetryAttack: 'TERMINAL SEEKER LOCK // WARHEAD BAY TARGETED // CEP < 0.15m',
    capabilityLayer: 'LAYER 01 — 120 FPS MULTI-SPECTRAL SENSOR FUSION',
    howItWorksRecon:
      'Simultaneously fuses 4K optical video, thermal infrared (LWIR), and synthetic aperture radar (SAR) feeds at 120 FPS to expose the camouflaged 8×8 launcher through urban smoke.',
    howItWorksAttack:
      'Co-aligns 3D LiDAR surface geometry with thermal exhaust hotspots at 120 FPS to lock onto the elevated 4-tube missile canister assembly for surgical kinetic interdiction.',
    componentName: 'Forward 4K Sapphire Gimbal + 3× Quartz LiDAR Array',
    componentSpec: '24.0 mm 2-Axis Spherical Gimbal // -36° / 0° / +36° Solid-State LiDAR',
    worldPos: [-32, -28, -260],
    scrollRange: [0.16, 0.30],
  },
  {
    id: 'land-tank',
    code: 'LAND-02 // MBT CONVOY',
    sector: 'land',
    sectorLabel: 'SECTOR 01 // LAND — CONTESTED URBAN CORRIDOR',
    name: 'Armored Main Battle Tank (Moving)',
    classification: 'GPS-DENIED VISUAL ODOMETRY LOCK [14/64 TRACKS]',
    telemetryRecon: 'VIO TRACKING // VEL: 48 KM/H // AES-256 FHSS UPLINK',
    telemetryAttack: 'TOP-ATTACK BALLISTIC SOLUTION // LASER DESIGNATOR ACTIVE',
    capabilityLayer: 'LAYER 02 — AUTONOMOUS MULTI-TARGET NEURAL TRACKING',
    howItWorksRecon:
      'Deep neural networks lock onto moving armored vehicles in GPS-denied urban canyons using Visual Inertial Odometry (VIO), streaming encrypted coordinates to command.',
    howItWorksAttack:
      'Computes a predictive lead-pursuit top-attack trajectory onto the thinner turret roof armor while defeating local GPS spoofing via onboard stereo visual-inertial lock.',
    componentName: 'Dual 3.0 mm Stereo VIO Cameras + 4× ToF Sensors',
    componentSpec: 'GPS-Denied Visual Inertial Odometry // Up to 64 Simultaneous Tracks',
    worldPos: [34, -28, -500],
    scrollRange: [0.30, 0.44],
  },

  // =========================================================================
  // SECTOR 02: AIR // CONTESTED AIRSPACE INTERCEPT (Scroll 44% -> 72%)
  // =========================================================================
  {
    id: 'air-ucav',
    code: 'AIR-01 // STEALTH UCAV',
    sector: 'air',
    sectorLabel: 'SECTOR 02 // AIR — LOW-ALTITUDE CONTESTED AIRSPACE',
    name: 'Hostile Swept-Wing UCAV & Swarm',
    classification: 'LOW-RCS AERIAL INTRUDER [38/64 TRACKS]',
    telemetryRecon: 'MICRO-DOPPLER LOCK // RCS: 0.002 m² // CLOSING: 72 M/S',
    telemetryAttack: 'AIR-TO-AIR INTERCEPT VECTOR // LEAD RETICLE LOCKED',
    capabilityLayer: 'LAYER 02 & 03 — HIGH-VELOCITY AERIAL SWARM TRACKING',
    howItWorksRecon:
      'Combines high-frequency micro-Doppler wake signatures with 120 FPS thermal plume detection to lock onto low-observable flying-wing drones against cloud clutter.',
    howItWorksAttack:
      'Autonomously ranks hostile swarm threats by kinematic time-to-intercept and maintains sub-milliradian optical lock during high-G evasive maneuvers.',
    componentName: '4K Sapphire Aspheric Optics + Solid-State LiDAR Ring',
    componentSpec: '120 FPS High-Speed Optical Lock // 3× Gold-Dichroic Quartz Windows',
    worldPos: [-30, 42, -780],
    scrollRange: [0.44, 0.58],
  },
  {
    id: 'air-ew',
    code: 'AIR-02 // EW RELAY',
    sector: 'air',
    sectorLabel: 'SECTOR 02 // AIR — LOW-ALTITUDE CONTESTED AIRSPACE',
    name: 'Twin-Boom Airborne EW Jamming Platform',
    classification: 'ACTIVE ELECTRONIC WARFARE EMITTER',
    telemetryRecon: 'MIL-STD-461G JAMMING DEFEATED // FHSS LINK HARDENED',
    telemetryAttack: 'HOME-ON-JAM TERMINAL GUIDANCE // VENTRAL BAY ARMED',
    capabilityLayer: 'LAYER 03 — QUANTUM-SAFE ENCRYPTION & ANTI-JAMMING UPLINK',
    howItWorksRecon:
      'Maintains full telemetry under aggressive electronic warfare jamming using adaptive frequency-hopping spread spectrum (FHSS) and quantum-resistant AES-256 encryption.',
    howItWorksAttack:
      'Switches seamlessly to passive Home-On-Jam (HOJ) optical + RF triangulation, turning the hostile aircraft’s own jamming emissions into a precision terminal guidance beacon.',
    componentName: 'Conformal GNSS/FHSS Patch + AES-256 Crypto Enclave',
    componentSpec: 'MIL-STD-461G EW Resistance // Quantum-Resistant Encrypted Telemetry',
    worldPos: [32, 46, -1040],
    scrollRange: [0.58, 0.72],
  },

  // =========================================================================
  // SECTOR 03: NAVAL // SINGAPORE STRAIT MARITIME OVERWATCH (Scroll 72% -> 100%)
  // =========================================================================
  {
    id: 'naval-corvette',
    code: 'NAVAL-01 // DARK SHIP',
    sector: 'naval',
    sectorLabel: 'SECTOR 03 // NAVAL — SINGAPORE STRAIT MARITIME OVERWATCH',
    name: 'Unregistered Stealth Corvette (AIS Spoofed)',
    classification: 'DARK-SHIP AIS ANOMALY DETECTED',
    telemetryRecon: 'SAR WAKE + THERMAL HULL MATCH // AIS OFFSET: 1.8 NM',
    telemetryAttack: 'RADAR MAST & VLS DECK TARGETED // LOCK CONFIRMED',
    capabilityLayer: 'LAYER 01 & 04 — ALL-WEATHER MARITIME SENSOR FUSION',
    howItWorksRecon:
      'Penetrates tropical monsoon downpours and sea haze by fusing synthetic aperture radar (SAR) kelvin-wake profiling with thermal IR hull signatures at 120 FPS.',
    howItWorksAttack:
      'Isolates the warship’s primary phased-array radar mast and vertical launch system (VLS) deck hatches using co-aligned 4K optical and LiDAR point-cloud segmentation.',
    componentName: 'Multi-Spectral SAR/IR Fusion + Neuromorphic Edge TPU',
    componentSpec: 'All-Weather 24/7 Maritime Clarity // 130,000+ Annual Vessel Overwatch',
    worldPos: [-34, -27, -1340],
    scrollRange: [0.72, 0.86],
  },
  {
    id: 'naval-fac',
    code: 'NAVAL-02 // FAST ATTACK',
    sector: 'naval',
    sectorLabel: 'SECTOR 03 // NAVAL — SINGAPORE STRAIT MARITIME OVERWATCH',
    name: 'High-Speed Littoral Fast Attack Craft (46 Kts)',
    classification: 'TERMINAL EDGE TPU LOCK [< 4.2 MS LATENCY]',
    telemetryRecon: 'AIR-GAPPED ONBOARD TPU // < 5 MS DECISION LOOP // 18W PEAK',
    telemetryAttack: 'VENTRAL MICRO-MUNITION DEPLOYED // FAIL-SAFE ABORT READY',
    capabilityLayer: 'LAYER 04 — SUB-5MS NEUROMORPHIC EDGE AI & KINETIC STRIKE',
    howItWorksRecon:
      'Executes complete vessel classification and kinematic wake tracking 100% onboard the neuromorphic TPU in under 5 milliseconds with 0% cloud leak risk.',
    howItWorksAttack:
      'Releases the precision-guided micro-munition from the zero-drag internal ventral bay, computing real-time wave-crest compensation and automated fail-safe abort control.',
    componentName: 'A.V.I.A.R.S. Neuromorphic TPU + Modular Ventral Hardpoint',
    componentSpec: '< 5 ms Onboard Inference (18W) // Zero-Drag Internal Flush Weapon Bay',
    worldPos: [28, -28, -1600],
    scrollRange: [0.86, 1.01],
  },
];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Helper to add a mesh together with crisp technical wireframe edges
function addMeshWithEdges(
  parent: THREE.Object3D,
  geom: THREE.BufferGeometry,
  mat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial,
  pos: [number, number, number] = [0, 0, 0],
  rot: [number, number, number] = [0, 0, 0]
): THREE.Mesh {
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.set(rot[0], rot[1], rot[2]);
  parent.add(mesh);

  const edges = new THREE.EdgesGeometry(geom, 24);
  const line = new THREE.LineSegments(edges, edgeMat);
  mesh.add(line);
  return mesh;
}

// ============================================================================
// DETAILED 3D MILITARY & MARITIME TARGET BUILDERS
// ============================================================================

function buildSamLauncherModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): { group: THREE.Group; radarDish: THREE.Object3D } {
  const g = new THREE.Group();

  // 8x8 Heavy TELAR Truck Chassis Frame
  addMeshWithEdges(g, new THREE.BoxGeometry(16, 4.5, 44), darkMat, edgeMat, [0, 3.5, 0]);
  // Forward Armored Twin-Window Cab
  addMeshWithEdges(g, new THREE.BoxGeometry(15.5, 8.5, 11), armorMat, edgeMat, [0, 8.5, 15.5]);
  // Sloped Windshield Visor
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(14.8, 3.2, 1.5),
    thermalMat,
    edgeMat,
    [0, 9.8, 21.1],
    [-0.25, 0, 0]
  );
  // Central Engine & Generator Housing
  addMeshWithEdges(g, new THREE.BoxGeometry(14, 6.5, 10), armorMat, edgeMat, [0, 8.0, 3.5]);

  // 8 Heavy Tactical Wheels (4 Axles)
  const wheelGeom = new THREE.CylinderGeometry(3.4, 3.4, 2.6, 16);
  wheelGeom.rotateZ(Math.PI / 2);
  const axleZ = [-16, -7, 6, 15];
  axleZ.forEach((z) => {
    addMeshWithEdges(g, wheelGeom, darkMat, edgeMat, [-8.5, 3.4, z]);
    addMeshWithEdges(g, wheelGeom, darkMat, edgeMat, [8.5, 3.4, z]);
  });

  // Hydraulic Stabilizer Outriggers
  addMeshWithEdges(g, new THREE.BoxGeometry(22, 1.2, 2.2), darkMat, edgeMat, [0, 1.2, -19]);
  addMeshWithEdges(g, new THREE.BoxGeometry(22, 1.2, 2.2), darkMat, edgeMat, [0, 1.2, 0]);

  // Turntable & Elevated 4x Cylindrical SAM Missile Canister Tubes (Angled at 38 deg)
  addMeshWithEdges(g, new THREE.CylinderGeometry(6.5, 7.2, 3.0, 12), armorMat, edgeMat, [0, 7.2, -11]);

  const canisterGroup = new THREE.Group();
  canisterGroup.position.set(0, 11.5, -12);
  canisterGroup.rotation.x = 0.62; // Angled upward toward sky
  g.add(canisterGroup);

  // Support Cradle
  addMeshWithEdges(canisterGroup, new THREE.BoxGeometry(13.5, 2.2, 22), darkMat, edgeMat, [0, -2.2, 2]);

  // 4x Missile Launch Tubes + Thermal Seeker/Exhaust Caps
  const tubeGeom = new THREE.CylinderGeometry(2.3, 2.3, 26, 12);
  tubeGeom.rotateX(Math.PI / 2);
  const tubeOffsets: [number, number][] = [
    [-4.2, 0],
    [0, 0],
    [4.2, 0],
    [-2.1, 3.8],
    [2.1, 3.8],
  ];
  tubeOffsets.slice(0, 4).forEach(([ox, oy], idx) => {
    const px = -4.5 + idx * 3.0;
    addMeshWithEdges(canisterGroup, tubeGeom, armorMat, edgeMat, [px, oy, 2]);
    // Glowing thermal nose cap
    const capGeom = new THREE.CylinderGeometry(2.0, 2.0, 1.2, 12);
    capGeom.rotateX(Math.PI / 2);
    addMeshWithEdges(canisterGroup, capGeom, thermalMat, edgeMat, [px, oy, 15.2]);
  });

  // Rotating Phased-Array Acquisition Radar Mast
  const radarGroup = new THREE.Group();
  radarGroup.position.set(0, 13.5, 3.5);
  g.add(radarGroup);
  addMeshWithEdges(radarGroup, new THREE.CylinderGeometry(1.2, 1.5, 5.5, 8), darkMat, edgeMat, [0, 2.2, 0]);
  addMeshWithEdges(
    radarGroup,
    new THREE.BoxGeometry(11.5, 5.2, 1.6),
    thermalMat,
    edgeMat,
    [0, 6.0, 0],
    [-0.18, 0, 0]
  );

  return { group: g, radarDish: radarGroup };
}

function buildArmoredTankModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): THREE.Group {
  const g = new THREE.Group();

  // Main Sloped Armored Hull
  addMeshWithEdges(g, new THREE.BoxGeometry(18, 5.5, 34), armorMat, edgeMat, [0, 5.2, 0]);
  // Glacis Front Sloped Armor Plate
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(17.5, 4.2, 9.5),
    armorMat,
    edgeMat,
    [0, 6.2, 14.5],
    [0.35, 0, 0]
  );

  // Left & Right Armored Track Assemblies + Roadwheels
  addMeshWithEdges(g, new THREE.BoxGeometry(4.2, 5.2, 36), darkMat, edgeMat, [-10.2, 3.4, 0]);
  addMeshWithEdges(g, new THREE.BoxGeometry(4.2, 5.2, 36), darkMat, edgeMat, [10.2, 3.4, 0]);

  const roadWheelG = new THREE.CylinderGeometry(2.4, 2.4, 4.6, 12);
  roadWheelG.rotateZ(Math.PI / 2);
  for (let w = -13; w <= 13; w += 5.2) {
    addMeshWithEdges(g, roadWheelG, darkMat, edgeMat, [-10.2, 2.6, w]);
    addMeshWithEdges(g, roadWheelG, darkMat, edgeMat, [10.2, 2.6, w]);
  }

  // Rear Thermal Engine Deck Plume
  addMeshWithEdges(g, new THREE.BoxGeometry(12, 1.2, 7.5), thermalMat, edgeMat, [0, 8.1, -11.5]);

  // Angular Composite Main Turret
  const turretGroup = new THREE.Group();
  turretGroup.position.set(0, 8.2, 1.0);
  turretGroup.rotation.y = -0.18;
  g.add(turretGroup);

  const turretG = new THREE.CylinderGeometry(8.5, 10.5, 5.2, 6);
  addMeshWithEdges(turretGroup, turretG, armorMat, edgeMat, [0, 2.6, 0]);
  // Turret Rear Bustle Rack
  addMeshWithEdges(turretGroup, new THREE.BoxGeometry(12, 4.4, 8.5), armorMat, edgeMat, [0, 2.8, -8.5]);

  // 120mm Smoothbore Main Gun Barrel + Thermal Sleeve + Muzzle Brake
  const barrelG = new THREE.CylinderGeometry(0.95, 1.15, 26, 12);
  barrelG.rotateX(Math.PI / 2);
  addMeshWithEdges(turretGroup, barrelG, darkMat, edgeMat, [0, 3.0, 18.5]);
  // Bore Evacuator / Thermal Sleeve
  const sleeveG = new THREE.CylinderGeometry(1.45, 1.45, 5.5, 12);
  sleeveG.rotateX(Math.PI / 2);
  addMeshWithEdges(turretGroup, sleeveG, thermalMat, edgeMat, [0, 3.0, 15.0]);

  // Commander Panoramic CITV Sight & Remote Weapon Station
  addMeshWithEdges(turretGroup, new THREE.CylinderGeometry(2.0, 2.2, 2.8, 10), thermalMat, edgeMat, [3.5, 6.4, -1.5]);

  return g;
}

function buildHostileUcavModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): THREE.Group {
  const g = new THREE.Group();

  // Blended Stealth Flying-Wing Center Fuselage
  const bodyG = new THREE.ConeGeometry(10, 28, 4);
  bodyG.rotateX(-Math.PI / 2);
  bodyG.scale(1.4, 0.38, 1.0);
  addMeshWithEdges(g, bodyG, armorMat, edgeMat, [0, 0, 2]);

  // Swept Lambda / Delta Stealth Wings (Left & Right)
  const wingG = new THREE.BoxGeometry(46, 1.4, 14);
  addMeshWithEdges(g, wingG, armorMat, edgeMat, [0, 0, -2]);

  // Forward Swept Leading-Edge Chines
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(24, 1.2, 8),
    darkMat,
    edgeMat,
    [-12, 0, 3],
    [0, 0.48, 0]
  );
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(24, 1.2, 8),
    darkMat,
    edgeMat,
    [12, 0, 3],
    [0, -0.48, 0]
  );

  // Canted Twin Stealth V-Tails
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(1.0, 7.5, 8.5),
    darkMat,
    edgeMat,
    [-5.5, 3.2, -9],
    [0, 0, 0.45]
  );
  addMeshWithEdges(
    g,
    new THREE.BoxGeometry(1.0, 7.5, 8.5),
    darkMat,
    edgeMat,
    [5.5, 3.2, -9],
    [0, 0, -0.45]
  );

  // Dorsal Submerged S-Duct Intake & Glowing Aft Thermal Jet Exhaust Nozzle
  addMeshWithEdges(g, new THREE.BoxGeometry(6.5, 2.4, 9.0), darkMat, edgeMat, [0, 2.2, 3]);
  const nozzleG = new THREE.CylinderGeometry(2.6, 3.2, 4.5, 12);
  nozzleG.rotateX(Math.PI / 2);
  addMeshWithEdges(g, nozzleG, thermalMat, edgeMat, [0, 0.2, -12.5]);

  // 2 Escorting Hostile Swarm Wingman Micro-Drones
  [-28, 28].forEach((offsetX) => {
    const mini = new THREE.Group();
    mini.position.set(offsetX, 4, -12);
    addMeshWithEdges(mini, new THREE.BoxGeometry(7, 2.2, 9), darkMat, edgeMat);
    addMeshWithEdges(mini, new THREE.SphereGeometry(1.8, 10, 10), thermalMat, edgeMat, [0, 0, 4.8]);
    g.add(mini);
  });

  return g;
}

function buildEwAircraftModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): { group: THREE.Group; rotodome: THREE.Object3D } {
  const g = new THREE.Group();

  // Central Surveillance Fuselage Pod
  const fuseG = new THREE.CylinderGeometry(4.2, 4.2, 32, 12);
  fuseG.rotateX(Math.PI / 2);
  addMeshWithEdges(g, fuseG, armorMat, edgeMat, [0, 0, 0]);

  // Bulbous Radome Nose
  addMeshWithEdges(g, new THREE.SphereGeometry(4.2, 16, 16), thermalMat, edgeMat, [0, 0, 16]);

  // High-Aspect-Ratio Straight Wings (52m scaled span)
  addMeshWithEdges(g, new THREE.BoxGeometry(54, 1.4, 7.5), armorMat, edgeMat, [0, 1.2, 1]);

  // Under-Wing Electronic Warfare Jamming Pods (Left & Right)
  const podG = new THREE.CylinderGeometry(1.4, 1.4, 11, 10);
  podG.rotateX(Math.PI / 2);
  addMeshWithEdges(g, podG, thermalMat, edgeMat, [-16, -2.0, 2]);
  addMeshWithEdges(g, podG, thermalMat, edgeMat, [16, -2.0, 2]);

  // Twin Tail Booms + Horizontal Tailplane
  const boomG = new THREE.CylinderGeometry(1.1, 1.1, 26, 8);
  boomG.rotateX(Math.PI / 2);
  addMeshWithEdges(g, boomG, darkMat, edgeMat, [-10, 0.8, -11]);
  addMeshWithEdges(g, boomG, darkMat, edgeMat, [10, 0.8, -11]);
  addMeshWithEdges(g, new THREE.BoxGeometry(1.0, 7.5, 5.5), armorMat, edgeMat, [-10, 4.2, -22]);
  addMeshWithEdges(g, new THREE.BoxGeometry(1.0, 7.5, 5.5), armorMat, edgeMat, [10, 4.2, -22]);
  addMeshWithEdges(g, new THREE.BoxGeometry(22, 1.0, 4.5), armorMat, edgeMat, [0, 7.5, -22]);

  // Dorsal Rotating AWACS / EW Saucer Rotodome Dish
  const domeGroup = new THREE.Group();
  domeGroup.position.set(0, 6.8, -1);
  g.add(domeGroup);
  addMeshWithEdges(domeGroup, new THREE.CylinderGeometry(1.0, 1.4, 4.2, 8), darkMat, edgeMat, [0, -2.0, 0]);
  const saucerG = new THREE.CylinderGeometry(11.5, 11.5, 2.2, 24);
  addMeshWithEdges(domeGroup, saucerG, armorMat, edgeMat, [0, 0, 0]);
  addMeshWithEdges(domeGroup, new THREE.BoxGeometry(22.5, 2.4, 2.0), thermalMat, edgeMat, [0, 0, 0]);

  return { group: g, rotodome: domeGroup };
}

function buildNavalWarshipModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): { group: THREE.Group; navalRadar: THREE.Object3D } {
  const g = new THREE.Group();

  // Stealth Warship Lower Hull & Flared Bow
  addMeshWithEdges(g, new THREE.BoxGeometry(18, 7.5, 62), darkMat, edgeMat, [0, 3.5, 0]);
  // Raked Clipper Bow Wedge
  const bowG = new THREE.ConeGeometry(12.8, 22, 4);
  bowG.rotateX(Math.PI / 2);
  bowG.rotateZ(Math.PI / 4);
  bowG.scale(1.0, 1.0, 0.35);
  addMeshWithEdges(g, bowG, darkMat, edgeMat, [0, 3.8, 36]);

  // Stealth Tumblehome Superstructure Deckhouse
  addMeshWithEdges(g, new THREE.BoxGeometry(15.5, 7.0, 32), armorMat, edgeMat, [0, 10.5, 1]);
  // Forward Bridge & Illuminated Bridge Windows
  addMeshWithEdges(g, new THREE.BoxGeometry(13.5, 4.8, 12), armorMat, edgeMat, [0, 15.8, 7]);
  addMeshWithEdges(g, new THREE.BoxGeometry(12.2, 1.4, 1.2), thermalMat, edgeMat, [0, 16.5, 13.1]);

  // Forward 76mm Stealth Naval Gun Turret + Barrel
  addMeshWithEdges(g, new THREE.CylinderGeometry(3.2, 4.2, 3.2, 6), armorMat, edgeMat, [0, 8.8, 25]);
  const gunBarrel = new THREE.CylinderGeometry(0.45, 0.55, 10, 8);
  gunBarrel.rotateX(Math.PI / 2);
  addMeshWithEdges(g, gunBarrel, thermalMat, edgeMat, [0, 9.4, 30.5]);

  // 8-Cell VLS (Vertical Launch System) Missile Hatch Deck
  addMeshWithEdges(g, new THREE.BoxGeometry(9.5, 1.2, 8.5), thermalMat, edgeMat, [0, 7.6, 16.5]);

  // Integrated Stealth Mainmast + Spinning Phased-Array Radar
  addMeshWithEdges(g, new THREE.ConeGeometry(4.8, 14, 4), armorMat, edgeMat, [0, 24.5, 5]);
  const radarGroup = new THREE.Group();
  radarGroup.position.set(0, 32.0, 5);
  g.add(radarGroup);
  addMeshWithEdges(radarGroup, new THREE.BoxGeometry(8.5, 2.2, 1.4), thermalMat, edgeMat, [0, 0, 0]);

  // Aft Exhaust Stack (Thermal Hotspot) & Helicopter Flight Deck
  addMeshWithEdges(g, new THREE.BoxGeometry(9.5, 5.5, 8.0), thermalMat, edgeMat, [0, 15.5, -7]);

  return { group: g, navalRadar: radarGroup };
}

function buildFastAttackCraftModel(
  armorMat: THREE.Material,
  darkMat: THREE.Material,
  thermalMat: THREE.Material,
  edgeMat: THREE.LineBasicMaterial
): THREE.Group {
  const g = new THREE.Group();

  // Sleek Wave-Piercing Planing Hull
  addMeshWithEdges(g, new THREE.BoxGeometry(13, 4.8, 38), darkMat, edgeMat, [0, 2.4, 0]);
  const bowG = new THREE.ConeGeometry(9.2, 16, 4);
  bowG.rotateX(Math.PI / 2);
  bowG.rotateZ(Math.PI / 4);
  bowG.scale(1.0, 1.0, 0.28);
  addMeshWithEdges(g, bowG, darkMat, edgeMat, [0, 2.5, 23]);

  // Low-Observable Raked Pilothouse Cabin
  addMeshWithEdges(g, new THREE.BoxGeometry(10.5, 4.8, 14), armorMat, edgeMat, [0, 7.0, 4]);
  addMeshWithEdges(g, new THREE.BoxGeometry(9.2, 1.3, 1.0), thermalMat, edgeMat, [0, 7.8, 11.1]);

  // Electro-Optical Sensor Mast
  addMeshWithEdges(g, new THREE.CylinderGeometry(0.9, 1.2, 7.5, 8), armorMat, edgeMat, [0, 12.8, 3]);
  addMeshWithEdges(g, new THREE.SphereGeometry(1.6, 12, 12), thermalMat, edgeMat, [0, 16.8, 3]);

  // Twin Aft Inclined Anti-Ship Missile Quad-Pack Canisters
  const launcherG = new THREE.BoxGeometry(3.8, 3.8, 13);
  addMeshWithEdges(g, launcherG, thermalMat, edgeMat, [-3.4, 7.5, -9], [0.42, 0, 0]);
  addMeshWithEdges(g, launcherG, thermalMat, edgeMat, [3.4, 7.5, -9], [0.42, 0, 0]);

  return g;
}

export default function AviarsBattlefieldViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [missionMode, setMissionMode] = useState<MissionMode>('recon');
  const [sensorVision, setSensorVision] = useState<SensorVisionMode>('optical');
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 800 });
  const [projectedTargets, setProjectedTargets] = useState<ProjectedTarget[]>([]);
  const [secondaryTracks, setSecondaryTracks] = useState<
    { id: string; label: string; x: number; y: number; visible: boolean }[]
  >([]);
  const [strikeHud, setStrikeHud] = useState<StrikeHudState>({
    status: 'idle',
    progress: 0,
    screenX: 640,
    screenY: 400,
    visible: false,
  });

  const progressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const missionModeRef = useRef<MissionMode>('recon');
  const sensorVisionRef = useRef<SensorVisionMode>('optical');
  const strikeStartElapsedRef = useRef<number>(-999);
  const lastAutoStrikeKeyRef = useRef<string>('');

  const triggerKineticStrike = () => {
    setMissionMode('attack');
    missionModeRef.current = 'attack';
    strikeStartElapsedRef.current = -1; // Signal animate() loop to start strike at current clock time
  };

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    missionModeRef.current = missionMode;
    if (missionMode === 'attack') {
      strikeStartElapsedRef.current = -1;
    }
  }, [missionMode]);

  useEffect(() => {
    sensorVisionRef.current = sensorVision;
  }, [sensorVision]);

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

  // Initialize Three.js WebGL Stage
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const width = wrapper.clientWidth || 1280;
    const height = wrapper.clientHeight || 800;
    setViewportSize({ width, height });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090B10');
    scene.fog = new THREE.FogExp2('#090B10', 0.0012);

    const camera = new THREE.PerspectiveCamera(36, width / height, 1, 2600);
    // Start zoomed out at an elevated 3/4 studio angle so the full SA-1 Vanguard looks hyper-realistic
    camera.position.set(240, 155, 340);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.style.touchAction = 'pan-y';

    wrapper.innerHTML = '';
    wrapper.appendChild(renderer.domElement);

    // =========================================================================
    // STUDIO KEY / RIM / FILL LIGHTING (For Hyper-Realistic Carbon & Titanium PBR)
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x0b0f19, 1.25);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 3.1);
    keyLight.position.set(280, 420, 350);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.4);
    rimLight.position.set(-320, 200, -280);
    scene.add(rimLight);

    const underFillLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
    underFillLight.position.set(0, -240, 180);
    scene.add(underFillLight);

    const noseSpot = new THREE.PointLight(0x38bdf8, 2.2, 320);
    noseSpot.position.set(0, 24, 180);
    scene.add(noseSpot);

    // =========================================================================
    // 1. HYPER-REALISTIC SA-1 "VANGUARD" DRONE ASSEMBLY (Phase 1 External View)
    // =========================================================================
    const droneRoot = new THREE.Group();
    scene.add(droneRoot);

    const buildMaterialForDroneNode = (name: string): THREE.MeshPhysicalMaterial => {
      if (name === 'Main_Hull_Top') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#2d3442'),
          metalness: 0.38,
          roughness: 0.36,
          clearcoat: 0.35,
          clearcoatRoughness: 0.32,
        });
      }
      if (name === 'Main_Hull_Ventral') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#202631'),
          metalness: 0.42,
          roughness: 0.42,
          clearcoat: 0.25,
        });
      }
      if (name.startsWith('Ducted_Propeller')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#3b4456'),
          metalness: 0.55,
          roughness: 0.28,
        });
      }
      if (name === 'Gimbal_Sphere_Assembly') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0284c7'),
          emissive: new THREE.Color('#0369a1'),
          emissiveIntensity: 0.38,
          metalness: 0.55,
          roughness: 0.16,
          clearcoat: 0.9,
        });
      }
      if (name === 'Primary_4K_Lens') {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#38bdf8'),
          emissive: new THREE.Color('#0ea5e9'),
          emissiveIntensity: 0.75,
          metalness: 0.15,
          roughness: 0.05,
          clearcoat: 1.0,
        });
      }
      if (name.startsWith('Sensor_Array')) {
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#f59e0b'),
          emissive: new THREE.Color('#d97706'),
          emissiveIntensity: 0.4,
          metalness: 0.85,
          roughness: 0.12,
          clearcoat: 1.0,
        });
      }
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#cbd5e1'),
        metalness: 0.92,
        roughness: 0.16,
      });
    };

    const fallbackDroneGroup = new THREE.Group();
    droneRoot.add(fallbackDroneGroup);
    const spinningRotors: { mesh: THREE.Object3D; dir: number }[] = [];

    // Instant 0ms multi-part fallback until /models/sa1_vanguard.glb finishes streaming
    const dorsalGeom = new THREE.CylinderGeometry(64, 86, 19, 8);
    dorsalGeom.scale(1.0, 1.0, 0.92);
    const dorsalMesh = new THREE.Mesh(dorsalGeom, buildMaterialForDroneNode('Main_Hull_Top'));
    dorsalMesh.position.set(0, 8, 0);
    fallbackDroneGroup.add(dorsalMesh);

    const ventralGeom = new THREE.CylinderGeometry(86, 68, 16, 8);
    ventralGeom.scale(1.0, 1.0, 0.92);
    const ventralMesh = new THREE.Mesh(ventralGeom, buildMaterialForDroneNode('Main_Hull_Ventral'));
    ventralMesh.position.set(0, -8, 0);
    fallbackDroneGroup.add(ventralMesh);

    const gimMesh = new THREE.Mesh(
      new THREE.SphereGeometry(12, 32, 32),
      buildMaterialForDroneNode('Gimbal_Sphere_Assembly')
    );
    gimMesh.position.set(0, 0, 62);
    fallbackDroneGroup.add(gimMesh);

    const lensG = new THREE.CylinderGeometry(8.5, 8.5, 5, 32);
    lensG.rotateX(Math.PI / 2);
    const lensM = new THREE.Mesh(lensG, buildMaterialForDroneNode('Primary_4K_Lens'));
    lensM.position.set(0, 0, 70);
    fallbackDroneGroup.add(lensM);

    const rotorCoords: [number, number, number, number][] = [
      [-52, -2.5, 33, 1],
      [52, -2.5, 33, -1],
      [-52, -2.5, -35, -1],
      [52, -2.5, -35, 1],
    ];
    rotorCoords.forEach(([rx, ry, rz, dir]) => {
      const rGroup = new THREE.Group();
      rGroup.position.set(rx, ry, rz);
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(6.5, 6.5, 7, 20),
        buildMaterialForDroneNode('Ducted_Propeller_L1')
      );
      rGroup.add(hub);
      for (let b = 0; b < 5; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(16, 1.2, 5.2),
          buildMaterialForDroneNode('Ducted_Propeller_L1')
        );
        const ang = (b * Math.PI * 2) / 5;
        blade.position.set(Math.cos(ang) * 13, 0, Math.sin(ang) * 13);
        blade.rotation.y = -ang;
        rGroup.add(blade);
      }
      fallbackDroneGroup.add(rGroup);
      spinningRotors.push({ mesh: rGroup, dir });
    });

    // Load authentic /models/sa1_vanguard.glb + /models/sa1_vanguard_step_edges.json
    let isDisposed = false;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/sa1_vanguard.glb',
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;
        const glbChildren: THREE.Object3D[] = [];
        root.children.forEach((c) => glbChildren.push(c));

        droneRoot.remove(fallbackDroneGroup);
        spinningRotors.length = 0;

        glbChildren.forEach((node) => {
          const name = node.name;
          node.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = buildMaterialForDroneNode(name);
            }
          });

          if (name.startsWith('Ducted_Propeller_')) {
            const dir = name.endsWith('L1') || name.endsWith('R2') ? 1 : -1;
            const box = new THREE.Box3().setFromObject(node);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const spinWrapper = new THREE.Group();
            spinWrapper.position.copy(center);
            node.position.sub(center);
            spinWrapper.add(node);
            droneRoot.add(spinWrapper);
            spinningRotors.push({ mesh: spinWrapper, dir });
          } else {
            droneRoot.add(node);
          }
        });
      },
      undefined,
      () => {}
    );

    // Subtle CAD B-Rep precision edge highlight on the SA-1 Vanguard
    fetch('/models/sa1_vanguard_step_edges.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((edgeGroups: Record<string, number[]> | null) => {
        if (!edgeGroups || isDisposed) return;
        const cadLineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#38bdf8'),
          transparent: true,
          opacity: 0.16,
        });
        Object.values(edgeGroups).forEach((flatPositions) => {
          if (!flatPositions || flatPositions.length === 0) return;
          const bGeom = new THREE.BufferGeometry();
          bGeom.setAttribute('position', new THREE.Float32BufferAttribute(flatPositions, 3));
          const seg = new THREE.LineSegments(bGeom, cadLineMat);
          droneRoot.add(seg);
        });
      })
      .catch(() => {});

    // =========================================================================
    // 2. CONTINUOUS MULTI-DOMAIN 3D WORLD (LAND -> AIR -> NAVAL ALONG -Z)
    // =========================================================================
    const worldRoot = new THREE.Group();
    scene.add(worldRoot);

    const armorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#273244'),
      metalness: 0.55,
      roughness: 0.38,
      clearcoat: 0.2,
    });
    const darkMetalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#151c28'),
      metalness: 0.65,
      roughness: 0.45,
    });
    const thermalHotspotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#10b981'),
      emissive: new THREE.Color('#00ff41'),
      emissiveIntensity: 0.75,
      metalness: 0.3,
      roughness: 0.2,
    });
    const targetEdgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00ff41'),
      transparent: true,
      opacity: 0.65,
    });

    // -------------------------------------------------------------------------
    // SECTOR 01 ENVIRONMENT: LAND // URBAN CANYON (Z: -80 to -620, Y: -28)
    // -------------------------------------------------------------------------
    const landSectorGroup = new THREE.Group();
    worldRoot.add(landSectorGroup);

    const landGrid = new THREE.GridHelper(640, 32, 0x00ff41, 0x162436);
    landGrid.position.set(0, -28, -350);
    (landGrid.material as THREE.Material).transparent = true;
    (landGrid.material as THREE.Material).opacity = 0.38;
    landSectorGroup.add(landGrid);

    // Central Highway Roadway & Lane Dividers
    const roadGeom = new THREE.PlaneGeometry(54, 620);
    roadGeom.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshBasicMaterial({
      color: 0x0d1520,
      transparent: true,
      opacity: 0.85,
    });
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.position.set(0, -27.9, -350);
    landSectorGroup.add(roadMesh);

    const bldgMat = new THREE.MeshPhysicalMaterial({
      color: 0x111927,
      roughness: 0.7,
      metalness: 0.3,
      transparent: true,
      opacity: 0.92,
    });
    const bldgEdgeMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.55,
    });

    for (let i = 0; i < 18; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const zPos = -130 - i * 28;
      const xPos = side * (78 + (i % 3) * 24);
      const bw = 32 + (i % 3) * 10;
      const bh = 42 + ((i * 19) % 72);
      const bd = 30 + (i % 2) * 12;

      addMeshWithEdges(
        landSectorGroup,
        new THREE.BoxGeometry(bw, bh, bd),
        bldgMat,
        bldgEdgeMat,
        [xPos, -28 + bh / 2, zPos]
      );

      // Rooftop comms tower on every 3rd building
      if (i % 3 === 0) {
        addMeshWithEdges(
          landSectorGroup,
          new THREE.CylinderGeometry(0.6, 1.2, 16, 6),
          darkMetalMat,
          bldgEdgeMat,
          [xPos, -28 + bh + 8, zPos]
        );
      }
    }

    // -------------------------------------------------------------------------
    // SECTOR 02 ENVIRONMENT: AIR // CONTESTED AIRSPACE (Z: -620 to -1180, Y: +42)
    // -------------------------------------------------------------------------
    const airSectorGroup = new THREE.Group();
    worldRoot.add(airSectorGroup);

    const airFloorGrid = new THREE.GridHelper(640, 24, 0x38bdf8, 0x111e30);
    airFloorGrid.position.set(0, 8, -900);
    (airFloorGrid.material as THREE.Material).transparent = true;
    (airFloorGrid.material as THREE.Material).opacity = 0.25;
    airSectorGroup.add(airFloorGrid);

    const airCeilingGrid = new THREE.GridHelper(640, 24, 0x38bdf8, 0x111e30);
    airCeilingGrid.position.set(0, 88, -900);
    (airCeilingGrid.material as THREE.Material).transparent = true;
    (airCeilingGrid.material as THREE.Material).opacity = 0.2;
    airSectorGroup.add(airCeilingGrid);

    const airCorridorMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.24,
    });
    for (let i = 0; i < 6; i++) {
      const hexRingG = new THREE.RingGeometry(64, 65.5, 6);
      const hexEdges = new THREE.EdgesGeometry(hexRingG);
      const hexLine = new THREE.LineSegments(hexEdges, airCorridorMat);
      hexLine.position.set(0, 44, -680 - i * 85);
      airSectorGroup.add(hexLine);
    }

    // -------------------------------------------------------------------------
    // SECTOR 03 ENVIRONMENT: NAVAL // SINGAPORE STRAIT (Z: -1180 to -1850, Y: -28)
    // -------------------------------------------------------------------------
    const navalSectorGroup = new THREE.Group();
    worldRoot.add(navalSectorGroup);

    const seaGeom = new THREE.PlaneGeometry(900, 780, 44, 48);
    seaGeom.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const seaMesh = new THREE.Mesh(seaGeom, seaMat);
    seaMesh.position.set(0, -28, -1500);
    navalSectorGroup.add(seaMesh);

    // Channel Navigation Buoys along the Singapore Strait shipping lane
    for (let b = 0; b < 6; b++) {
      const bz = -1240 - b * 95;
      [-95, 95].forEach((bx) => {
        addMeshWithEdges(
          navalSectorGroup,
          new THREE.ConeGeometry(3.2, 8, 8),
          armorMat,
          bldgEdgeMat,
          [bx, -24, bz]
        );
      });
    }

    // =========================================================================
    // 3. INSTANTIATE THE 6 DETAILED 3D TARGETS ACROSS LAND -> AIR -> NAVAL
    // =========================================================================
    const samBuilt = buildSamLauncherModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);
    const tankGroup = buildArmoredTankModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);
    const ucavGroup = buildHostileUcavModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);
    const ewBuilt = buildEwAircraftModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);
    const warshipBuilt = buildNavalWarshipModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);
    const facGroup = buildFastAttackCraftModel(armorMat, darkMetalMat, thermalHotspotMat, targetEdgeMat);

    const target3DObjects: THREE.Group[] = [
      samBuilt.group,
      tankGroup,
      ucavGroup,
      ewBuilt.group,
      warshipBuilt.group,
      facGroup,
    ];

    // Add a sleek 3D ground/air target lock ring around each of the 6 targets
    const targetRingMats: THREE.MeshBasicMaterial[] = [];
    target3DObjects.forEach((tObj, idx) => {
      const [wx, wy, wz] = MISSION_TARGETS[idx].worldPos;
      tObj.position.set(wx, wy, wz);
      // Angle vehicles naturally toward the corridor
      tObj.rotation.y = idx % 2 === 0 ? 0.32 : -0.28;

      const rMat = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      targetRingMats.push(rMat);

      const ringRadius = idx === 4 ? 34 : 24;
      const ringG = new THREE.RingGeometry(ringRadius, ringRadius + 1.8, 36);
      ringG.rotateX(-Math.PI / 2);
      const ringM = new THREE.Mesh(ringG, rMat);
      ringM.position.set(0, 0.8, 0);
      tObj.add(ringM);

      worldRoot.add(tObj);
    });

    // Secondary Peripheral Nodes (To demonstrate 64-Target Multi-Tracking)
    const secondaryNodes: { mesh: THREE.Group; label: string }[] = [];
    const secSpecs: { pos: [number, number, number]; label: string }[] = [
      { pos: [62, -26, -320], label: 'APC ESCORT [0.98]' },
      { pos: [-58, -26, -440], label: 'MOBILE RADAR [0.97]' },
      { pos: [58, 52, -840], label: 'SWARM DRONE #04 [0.99]' },
      { pos: [-56, 36, -980], label: 'DECOY UAV [0.95]' },
      { pos: [66, -27, -1420], label: 'CARGO VESSEL [AIS OK]' },
      { pos: [-62, -27, -1540], label: 'PATROL BOAT [0.98]' },
    ];
    secSpecs.forEach((sp) => {
      const sg = new THREE.Group();
      sg.position.set(sp.pos[0], sp.pos[1], sp.pos[2]);
      addMeshWithEdges(sg, new THREE.BoxGeometry(10, 5, 16), darkMetalMat, bldgEdgeMat, [0, 2.5, 0]);
      worldRoot.add(sg);
      secondaryNodes.push({ mesh: sg, label: sp.label });
    });

    // Laser Designator Beam & Ballistic Trajectory Arc
    const laserMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.9,
    });
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -100),
    ]);
    const laserLine = new THREE.Line(laserGeom, laserMat);
    scene.add(laserLine);

    const ballisticMat = new THREE.LineBasicMaterial({
      color: 0x00ff41,
      transparent: true,
      opacity: 0.75,
    });
    const ballisticGeom = new THREE.BufferGeometry();
    const ballisticArc = new THREE.Line(ballisticGeom, ballisticMat);
    scene.add(ballisticArc);

    // 3D Forward SA-1 Interceptor Drone that smoothly banks & flies from Target to Target in POV
    const forwardSa1Drone = new THREE.Group();
    forwardSa1Drone.visible = false;
    const fwdBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.75,
      roughness: 0.25,
    });
    const fwdEdgeMat = new THREE.LineBasicMaterial({
      color: 0x00ff41,
      transparent: true,
      opacity: 0.85,
    });
    const fwdCore = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.3, 8.8), fwdBodyMat);
    fwdCore.add(new THREE.LineSegments(new THREE.EdgesGeometry(fwdCore.geometry), fwdEdgeMat));
    forwardSa1Drone.add(fwdCore);

    const fwdNose = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    fwdNose.position.set(0, -0.1, -4.5);
    forwardSa1Drone.add(fwdNose);

    const fwdRotorCoords: [number, number][] = [
      [-5.2, -4.2],
      [5.2, -4.2],
      [-5.2, 4.2],
      [5.2, 4.2],
    ];
    fwdRotorCoords.forEach(([rx, rz]) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.35, 0.65), fwdBodyMat);
      arm.position.set(rx * 0.55, 0, rz * 0.55);
      arm.rotation.y = Math.atan2(rx, rz);
      forwardSa1Drone.add(arm);

      const shroud = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 2.1, 20),
        new THREE.MeshBasicMaterial({
          color: 0x00ff41,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      shroud.rotateX(-Math.PI / 2);
      shroud.position.set(rx, 0.25, rz);
      forwardSa1Drone.add(shroud);
    });
    scene.add(forwardSa1Drone);

    // 3D Precision Micro-Munition + Impact Shockwave Ring for Attack Mode Kinetic Intercept
    const munitionGroup = new THREE.Group();
    munitionGroup.visible = false;
    const munitionBodyMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const munitionGlowMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.9,
    });
    const dartCone = new THREE.ConeGeometry(1.4, 6.5, 12);
    dartCone.rotateX(Math.PI / 2);
    munitionGroup.add(new THREE.Mesh(dartCone, munitionBodyMat));
    const dartHalo = new THREE.SphereGeometry(2.6, 12, 12);
    munitionGroup.add(new THREE.Mesh(dartHalo, munitionGlowMat));
    scene.add(munitionGroup);

    const impactRingGeom = new THREE.RingGeometry(1.2, 2.6, 36);
    impactRingGeom.rotateX(-Math.PI / 2);
    const impactRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    const impactRingMesh = new THREE.Mesh(impactRingGeom, impactRingMat);
    impactRingMesh.visible = false;
    scene.add(impactRingMesh);

    const impactFlashGeom = new THREE.SphereGeometry(4.2, 18, 18);
    const impactFlashMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.0,
    });
    const impactFlashMesh = new THREE.Mesh(impactFlashGeom, impactFlashMat);
    impactFlashMesh.visible = false;
    scene.add(impactFlashMesh);

    // =========================================================================
    // 4. ANIMATION & CONTINUOUS SCROLL FLIGHT LOOP (LAND -> AIR -> NAVAL)
    // =========================================================================
    const clock = new THREE.Clock();
    let animId = 0;
    let lastHudSync = 0;

    // Persistent smoothed vectors so transitions between targets NEVER cut or snap
    const smoothedLookPt = new THREE.Vector3(0, 0, -110);
    const smoothedAimPt = target3DObjects[0].position.clone().add(new THREE.Vector3(0, 6, 0));
    const smoothedForwardDronePos = new THREE.Vector3(0, -6, -90);
    let smoothedCamRoll = 0;
    let smoothedDroneBank = 0;

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
      smoothedProgressRef.current += (targetP - smoothedProgressRef.current) * 0.08;
      const p = smoothedProgressRef.current;

      const curMode = missionModeRef.current;
      const curVision = sensorVisionRef.current;
      const isAttack = curMode === 'attack';
      const accentHex = isAttack ? 0xef4444 : 0x00ff41;

      // Apply Live Sensor-Fusion Vision Spectrum (4K Optical vs LWIR Thermal vs SAR Radar)
      if (curVision === 'thermal') {
        scene.background = new THREE.Color('#04040A');
        (scene.fog as THREE.FogExp2).color.setHex(0x04040a);
        bldgMat.color.setHex(0x090b16);
        bldgMat.opacity = 0.94;
        bldgMat.wireframe = false;
        bldgEdgeMat.color.setHex(0x312e81);
        bldgEdgeMat.opacity = 0.45;
        armorMat.color.setHex(0x4c1d95);
        armorMat.wireframe = false;
        darkMetalMat.color.setHex(0x1e1b4b);
        thermalHotspotMat.color.setHex(0xfef08a);
        thermalHotspotMat.emissive.setHex(isAttack ? 0xef4444 : 0xf59e0b);
        thermalHotspotMat.emissiveIntensity = 1.65;
        targetEdgeMat.color.setHex(0xfbbf24);
        targetEdgeMat.opacity = 0.9;
        seaMat.color.setHex(0x312e81);
      } else if (curVision === 'sar') {
        scene.background = new THREE.Color('#02080D');
        (scene.fog as THREE.FogExp2).color.setHex(0x02080d);
        bldgMat.color.setHex(0x041624);
        bldgMat.opacity = 0.28;
        bldgMat.wireframe = true;
        bldgEdgeMat.color.setHex(0x38bdf8);
        bldgEdgeMat.opacity = 0.82;
        armorMat.color.setHex(0x0c4a6e);
        armorMat.wireframe = true;
        darkMetalMat.color.setHex(0x082f49);
        thermalHotspotMat.color.setHex(0x38bdf8);
        thermalHotspotMat.emissive.setHex(accentHex);
        thermalHotspotMat.emissiveIntensity = 1.25;
        targetEdgeMat.color.setHex(0x38bdf8);
        targetEdgeMat.opacity = 0.95;
        seaMat.color.setHex(0x00ff41);
      } else {
        scene.background = new THREE.Color('#090B10');
        (scene.fog as THREE.FogExp2).color.setHex(0x090b10);
        bldgMat.color.setHex(0x111927);
        bldgMat.opacity = 0.92;
        bldgMat.wireframe = false;
        bldgEdgeMat.color.setHex(0x334155);
        bldgEdgeMat.opacity = 0.55;
        armorMat.color.setHex(0x273244);
        armorMat.wireframe = false;
        darkMetalMat.color.setHex(0x151c28);
        thermalHotspotMat.color.setHex(isAttack ? 0xf87171 : 0x10b981);
        thermalHotspotMat.emissive.setHex(accentHex);
        thermalHotspotMat.emissiveIntensity = 0.75;
        targetEdgeMat.color.setHex(accentHex);
        targetEdgeMat.opacity = 0.65;
        seaMat.color.setHex(0x0ea5e9);
      }
      targetRingMats.forEach((rm) => rm.color.setHex(accentHex));
      fwdEdgeMat.color.setHex(accentHex);

      // Spin SA-1 Vanguard rotors
      spinningRotors.forEach((r) => {
        r.mesh.rotation.y += 0.24 * r.dir;
      });

      // Spin Rotating Radar Dishes on SAM Launcher, EW Aircraft & Naval Warship
      samBuilt.radarDish.rotation.y = elapsed * 1.8;
      ewBuilt.rotodome.rotation.y = elapsed * 1.4;
      warshipBuilt.navalRadar.rotation.y = elapsed * 1.6;

      // Subtle kinematic motion on moving targets (Tank, UCAV, EW Plane, Fast Attack Craft)
      tankGroup.position.x = MISSION_TARGETS[1].worldPos[0] + Math.sin(elapsed * 0.7) * 4;
      ucavGroup.position.x = MISSION_TARGETS[2].worldPos[0] + Math.sin(elapsed * 1.2) * 8;
      ucavGroup.position.y = MISSION_TARGETS[2].worldPos[1] + Math.cos(elapsed * 1.5) * 3;
      ucavGroup.rotation.z = Math.cos(elapsed * 1.2) * -0.18;

      ewBuilt.group.position.x = MISSION_TARGETS[3].worldPos[0] + Math.cos(elapsed * 0.9) * 7;
      ewBuilt.group.position.y = MISSION_TARGETS[3].worldPos[1] + Math.sin(elapsed * 1.1) * 2.5;

      facGroup.position.x = MISSION_TARGETS[5].worldPos[0] + Math.sin(elapsed * 1.1) * 5;

      // Animate Sea Waves in Naval Sector
      const posAttr = seaGeom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        posAttr.setY(
          i,
          Math.sin(vx * 0.04 + elapsed * 1.8) * 1.6 + Math.cos(vz * 0.03 + elapsed * 1.4) * 1.6
        );
      }
      posAttr.needsUpdate = true;

      // Determine active target index (0..5) from continuous scroll progress
      const activeTargetIdx =
        p < 0.30
          ? 0
          : p < 0.44
          ? 1
          : p < 0.58
          ? 2
          : p < 0.72
          ? 3
          : p < 0.86
          ? 4
          : 5;

      const w = wrapper.clientWidth || 1280;
      const h = Math.max(1, wrapper.clientHeight || 800);
      const aspect = w / h;
      const portraitZoomMultiplier =
        aspect < 1.0 ? Math.min(1.65, Math.max(1.0, 0.95 / Math.max(aspect, 0.45))) : 1.0;

      // =======================================================================
      // PHASE 1 (p: 0.00 -> 0.16): ZOOMED-OUT HYPER-REALISTIC SA-1 DRONE
      //                            TURNS & ZOOMS INTO FORWARD 4K OPTICAL SPHERE
      // =======================================================================
      if (p < 0.16) {
        const tTurn = smoothstep(0.0, 0.11, p);
        const tZoomIntoLens = smoothstep(0.09, 0.16, p);

        droneRoot.visible = true;
        forwardSa1Drone.visible = false;
        const hoverY = Math.sin(elapsed * 2.2) * 2.0;
        droneRoot.position.set(0, hoverY, 0);

        // Start at a crisp 3/4 studio presentation angle (0.52 rad), then turn toward battlefield (PI rad)
        droneRoot.rotation.y = 0.52 * (1 - tTurn) + Math.PI * 0.88 * tTurn;
        droneRoot.rotation.z = Math.sin(tTurn * Math.PI) * -0.22;
        droneRoot.rotation.x = 0.12 * (1 - tTurn) + Math.sin(tTurn * Math.PI) * 0.16;

        // Start zoomed out at distance ~435 so the entire SA-1 Vanguard airframe is framed in full detail,
        // then swoop smoothly into the forward blue 4K optical gimbal at (0, 0, 58)
        const startCamX = 225 * portraitZoomMultiplier;
        const startCamY = 148 * portraitZoomMultiplier;
        const startCamZ = 335 * portraitZoomMultiplier;

        const midCamX = startCamX * (1 - tTurn);
        const midCamY = startCamY * (1 - tTurn * 0.65);
        const midCamZ = startCamZ * (1 - tTurn * 0.45);

        const camX = THREE.MathUtils.lerp(midCamX, 0, tZoomIntoLens);
        const camY = THREE.MathUtils.lerp(midCamY, hoverY + 2, tZoomIntoLens);
        const camZ = THREE.MathUtils.lerp(midCamZ, 15, tZoomIntoLens);

        camera.position.set(camX, camY, camZ);
        const studioLook = new THREE.Vector3(0, hoverY, -110 * tZoomIntoLens);
        smoothedLookPt.lerp(studioLook, 0.15);
        smoothedCamRoll += (0 - smoothedCamRoll) * 0.12;
        camera.up.set(Math.sin(smoothedCamRoll), Math.cos(smoothedCamRoll), 0);
        camera.lookAt(smoothedLookPt);

        // Pre-align smoothedAimPt with Target 0 so entry into POV is 100% seamless
        const firstAim = target3DObjects[0].position.clone().add(new THREE.Vector3(0, 6, 0));
        smoothedAimPt.lerp(firstAim, 0.15);
        smoothedForwardDronePos.set(0, hoverY - 4, -55);

        laserLine.visible = false;
        ballisticArc.visible = false;
        munitionGroup.visible = false;
        impactRingMesh.visible = false;
        impactFlashMesh.visible = false;
      } else {
        // =====================================================================
        // CONTINUOUS POV FLIGHT: LAND (16-44%) -> AIR (44-72%) -> NAVAL (72-100%)
        // SMOOTH GIMBAL SLEW, BANKING ROLL & FORWARD DRONE TRAJECTORY
        // =====================================================================
        droneRoot.visible = false;
        forwardSa1Drone.visible = true;

        const flightT = clamp01((p - 0.16) / 0.84);
        // Continuous downrange travel from Z = -40 to Z = -1410
        const camZ = -40 - flightT * 1370;

        // Altitude transitions smoothly:
        // Land (-4) -> Climb to Airspace (+54) -> Descend to Naval Overwatch (-2)
        const climbToAir = smoothstep(0.40, 0.48, p);
        const descendToNaval = smoothstep(0.68, 0.76, p);
        const baseAltY = -4 + climbToAir * 58 - descendToNaval * 56;
        const camY = baseAltY + Math.cos(elapsed * 1.5) * 1.2;
        const camX = Math.sin(flightT * Math.PI * 3.0) * 14;

        camera.position.set(camX, camY, camZ);

        // Smoothly slew camera gimbal lookAt & weapon aim point from current target to next target
        const activeTargetObj = target3DObjects[activeTargetIdx];
        const desiredLookPt = new THREE.Vector3(
          activeTargetObj.position.x * 0.55,
          activeTargetObj.position.y * 0.75,
          activeTargetObj.position.z
        );
        const desiredAimPt = activeTargetObj.position.clone().add(new THREE.Vector3(0, 6, 0));

        const prevLookX = smoothedLookPt.x;
        smoothedLookPt.lerp(desiredLookPt, 0.075);
        smoothedAimPt.lerp(desiredAimPt, 0.085);

        // Aerodynamic camera roll when gimbal pans across targets
        const panRateX = smoothedLookPt.x - prevLookX;
        const targetCamRoll = THREE.MathUtils.clamp(-panRateX * 0.045, -0.15, 0.15);
        smoothedCamRoll += (targetCamRoll - smoothedCamRoll) * 0.1;
        camera.up.set(Math.sin(smoothedCamRoll), Math.cos(smoothedCamRoll), 0);
        camera.lookAt(smoothedLookPt);

        // Position & smoothly bank the 3D Forward SA-1 Interceptor Drone along the curve toward smoothedAimPt
        const droneBayOrigin = new THREE.Vector3(camX, camY - 6, camZ - 10);
        const desiredFwdDrone = new THREE.Vector3(
          THREE.MathUtils.lerp(camX, smoothedAimPt.x, 0.34),
          THREE.MathUtils.lerp(camY - 3.5, smoothedAimPt.y + 8, 0.34) +
            Math.sin(elapsed * 2.4) * 1.1,
          THREE.MathUtils.lerp(camZ - 14, smoothedAimPt.z, 0.34)
        );
        const prevDroneX = smoothedForwardDronePos.x;
        smoothedForwardDronePos.lerp(desiredFwdDrone, 0.11);

        forwardSa1Drone.position.copy(smoothedForwardDronePos);
        forwardSa1Drone.lookAt(smoothedAimPt);
        const desiredBank = THREE.MathUtils.clamp(
          (smoothedForwardDronePos.x - prevDroneX) * -0.26,
          -0.62,
          0.62
        );
        smoothedDroneBank += (desiredBank - smoothedDroneBank) * 0.14;
        forwardSa1Drone.rotateZ(smoothedDroneBank);

        // Draw Smoothly Sweeping Laser Designator & Ballistic Trajectory Arc from Forward Drone to smoothedAimPt
        laserLine.visible = true;
        laserMat.color.setHex(accentHex);
        laserGeom.setFromPoints([smoothedForwardDronePos, smoothedAimPt]);

        ballisticArc.visible = true;
        ballisticMat.color.setHex(accentHex);
        const curvePts: THREE.Vector3[] = [];
        for (let i = 0; i <= 28; i++) {
          const u = i / 28;
          // Smooth two-segment curve: Camera Bay -> Forward Banking SA-1 Drone -> Target Aim Point
          const pA = new THREE.Vector3().lerpVectors(droneBayOrigin, smoothedForwardDronePos, u);
          const pB = new THREE.Vector3().lerpVectors(smoothedForwardDronePos, smoothedAimPt, u);
          const pt = new THREE.Vector3().lerpVectors(pA, pB, u);
          pt.y += Math.sin(u * Math.PI) * (isAttack ? 12 : 5);
          curvePts.push(pt);
        }
        ballisticGeom.setFromPoints(curvePts);

        // ===================================================================
        // ANIMATED KINETIC MICRO-MUNITION LAUNCH & SHOCKWAVE INTERCEPT
        // ===================================================================
        if (isAttack) {
          const autoKey = `attack-${activeTargetIdx}`;
          if (lastAutoStrikeKeyRef.current !== autoKey) {
            lastAutoStrikeKeyRef.current = autoKey;
            strikeStartElapsedRef.current = elapsed;
          } else if (strikeStartElapsedRef.current === -1) {
            strikeStartElapsedRef.current = elapsed;
          }

          const dtStrike = elapsed - strikeStartElapsedRef.current;
          const flightDuration = 1.15;
          const impactDuration = 1.15;

          if (dtStrike >= 0 && dtStrike <= flightDuration) {
            // Munition inbound from Forward SA-1 Interceptor along parabolic ballistic curve to smoothedAimPt
            const u = clamp01(dtStrike / flightDuration);
            const uNext = clamp01((dtStrike + 0.04) / flightDuration);
            const mx = THREE.MathUtils.lerp(smoothedForwardDronePos.x, smoothedAimPt.x, u);
            const mz = THREE.MathUtils.lerp(smoothedForwardDronePos.z, smoothedAimPt.z, u);
            const my =
              THREE.MathUtils.lerp(smoothedForwardDronePos.y, smoothedAimPt.y, u) +
              Math.sin(u * Math.PI) * 14;

            const nx = THREE.MathUtils.lerp(smoothedForwardDronePos.x, smoothedAimPt.x, uNext);
            const nz = THREE.MathUtils.lerp(smoothedForwardDronePos.z, smoothedAimPt.z, uNext);
            const ny =
              THREE.MathUtils.lerp(smoothedForwardDronePos.y, smoothedAimPt.y, uNext) +
              Math.sin(uNext * Math.PI) * 14;

            munitionGroup.visible = true;
            munitionGroup.position.set(mx, my, mz);
            munitionGroup.lookAt(nx, ny, nz);

            impactRingMesh.visible = false;
            impactFlashMesh.visible = false;
          } else if (dtStrike > flightDuration && dtStrike <= flightDuration + impactDuration) {
            // Kinetic Detonation Shockwave at smoothedAimPt
            const k = clamp01((dtStrike - flightDuration) / impactDuration);
            munitionGroup.visible = false;

            impactRingMesh.visible = true;
            impactRingMesh.position.copy(smoothedAimPt);
            const ringScale = 1.0 + k * 14.5;
            impactRingMesh.scale.set(ringScale, ringScale, ringScale);
            impactRingMat.opacity = (1.0 - k) * 0.92;

            impactFlashMesh.visible = true;
            impactFlashMesh.position.copy(smoothedAimPt);
            const flashScale = 0.6 + Math.sin(k * Math.PI) * 3.2;
            impactFlashMesh.scale.set(flashScale, flashScale, flashScale);
            impactFlashMat.opacity = (1.0 - k) * 0.85;
          } else {
            munitionGroup.visible = false;
            impactRingMesh.visible = false;
            impactFlashMesh.visible = false;
          }
        } else {
          lastAutoStrikeKeyRef.current = '';
          munitionGroup.visible = false;
          impactRingMesh.visible = false;
          impactFlashMesh.visible = false;
        }
      }

      renderer.render(scene, camera);

      // Sync 2D Projected Target Lock Boxes & HUD Telemetry (~30 FPS)
      // Use smoothedAimPt for the Primary Locked Target so the 2D HUD Reticle glides smoothly across the screen!
      if (elapsed - lastHudSync > 0.033) {
        lastHudSync = elapsed;

        const smoothAimProj = projectWorldToScreen(smoothedAimPt, w, h);
        const smoothAimDist = Math.max(18, Math.round(camera.position.distanceTo(smoothedAimPt) * 1.3));

        const nextProjected: ProjectedTarget[] = MISSION_TARGETS.map((tSpec, idx) => {
          const isPrimary = p >= 0.16 && idx === activeTargetIdx;
          if (isPrimary) {
            return {
              ...tSpec,
              screenX: smoothAimProj.x,
              screenY: smoothAimProj.y,
              inFront: smoothAimProj.inFront,
              distanceMeters: smoothAimDist,
              isPrimaryLock: true,
            };
          }
          const worldCenter = target3DObjects[idx].position.clone().add(new THREE.Vector3(0, 7, 0));
          const proj = projectWorldToScreen(worldCenter, w, h);
          const dist = Math.max(18, Math.round(camera.position.distanceTo(worldCenter) * 1.3));
          return {
            ...tSpec,
            screenX: proj.x,
            screenY: proj.y,
            inFront: proj.inFront,
            distanceMeters: dist,
            isPrimaryLock: false,
          };
        });
        setProjectedTargets(nextProjected);

        const nextSec = secondaryNodes.map((sn, idx) => {
          const proj = projectWorldToScreen(sn.mesh.position, w, h);
          const distZ = Math.abs(camera.position.z - sn.mesh.position.z);
          return {
            id: `sec-${idx}`,
            label: sn.label,
            x: proj.x,
            y: proj.y,
            visible:
              p >= 0.16 &&
              proj.inFront &&
              distZ < 420 &&
              proj.x > 40 &&
              proj.x < w - 40 &&
              proj.y > 80 &&
              proj.y < h - 140,
          };
        });
        setSecondaryTracks(nextSec);

        // Sync Kinetic Strike HUD Telemetry
        if (p >= 0.16 && isAttack) {
          const dtStrike = elapsed - strikeStartElapsedRef.current;
          if (dtStrike >= 0 && dtStrike <= 1.15 && munitionGroup.visible) {
            const mProj = projectWorldToScreen(munitionGroup.position, w, h);
            setStrikeHud({
              status: 'inbound',
              progress: clamp01(dtStrike / 1.15),
              screenX: mProj.x,
              screenY: mProj.y,
              visible: mProj.inFront,
            });
          } else if (dtStrike > 1.15 && dtStrike <= 2.9) {
            setStrikeHud({
              status: 'impact',
              progress: clamp01((dtStrike - 1.15) / 1.75),
              screenX: smoothAimProj.x,
              screenY: smoothAimProj.y,
              visible: smoothAimProj.inFront,
            });
          } else {
            setStrikeHud((prev) => (prev.status === 'idle' ? prev : { ...prev, status: 'idle', visible: false }));
          }
        } else {
          setStrikeHud((prev) => (prev.status === 'idle' ? prev : { ...prev, status: 'idle', visible: false }));
        }
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
  const activeSector: ScenarioType =
    scrollProgress < 0.44 ? 'land' : scrollProgress < 0.72 ? 'air' : 'naval';

  const isAttack = missionMode === 'attack';
  const accentColor = isAttack ? '#ef4444' : '#00ff41';
  const accentBorderClass = isAttack ? 'border-red-500/60' : 'border-[#00ff41]/60';
  const accentTextClass = isAttack ? 'text-red-400' : 'text-[#00ff41]';
  const accentBgClass = isAttack ? 'bg-red-500/15' : 'bg-[#00ff41]/15';

  const primaryLockedTarget =
    projectedTargets.find((t) => t.isPrimaryLock) || projectedTargets[0] || null;

  const clampedTargetX = primaryLockedTarget
    ? Math.max(75, Math.min(viewportSize.width - 75, primaryLockedTarget.screenX))
    : viewportSize.width * 0.5;
  const clampedTargetY = primaryLockedTarget
    ? Math.max(125, Math.min(viewportSize.height - 165, primaryLockedTarget.screenY))
    : viewportSize.height * 0.44;

  return (
    <div ref={containerRef} className="relative w-full h-[520vh] sm:h-[580vh] lg:h-[680vh]">
      {/* Sticky Full-Viewport 3D A.V.I.A.R.S. Tactical POV Stage */}
      <div className="sticky top-16 sm:top-20 lg:top-24 w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden bg-[#090B10] border-y border-white/10">
        {/* Three.js WebGL Canvas */}
        <div ref={canvasWrapperRef} className="relative z-10 w-full h-full" />

        {/* Subtle Optical / Thermal / SAR Spectrum Vignette & Scanline Filter */}
        <div
          className="pointer-events-none absolute inset-0 z-15 transition-all duration-500"
          style={{
            opacity: isPovActive ? 1 : 0.3,
            background:
              sensorVision === 'thermal'
                ? 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.08) 0%, rgba(18, 9, 36, 0.78) 92%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)'
                : sensorVision === 'sar'
                ? 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.09) 0%, rgba(2, 10, 18, 0.84) 92%), repeating-linear-gradient(90deg, rgba(56,189,248,0.03) 0px, rgba(56,189,248,0.03) 1px, transparent 1px, transparent 24px)'
                : isAttack
                ? 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.03) 0%, rgba(9, 11, 16, 0.72) 92%)'
                : 'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.03) 0%, rgba(9, 11, 16, 0.72) 92%)',
          }}
        />

        {/* Active Sensor Spectrum Calibration Badge (Left Side HUD in POV) */}
        {isPovActive && (
          <div className="pointer-events-none hidden md:flex flex-col gap-1.5 absolute left-6 lg:left-10 top-24 z-25 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    sensorVision === 'thermal'
                      ? '#fbbf24'
                      : sensorVision === 'sar'
                      ? '#38bdf8'
                      : '#00ff41',
                }}
              />
              <span className="text-white font-bold uppercase tracking-wider">
                {sensorVision === 'thermal'
                  ? 'LWIR THERMAL // 8–14 μm FLIR'
                  : sensorVision === 'sar'
                  ? 'SAR X-BAND // DOPPLER POINT CLOUD'
                  : '4K SAPPHIRE // MULTI-SPECTRAL RGB'}
              </span>
            </div>
            {sensorVision === 'thermal' && (
              <div className="space-y-1 pt-0.5">
                <div className="h-1.5 w-44 rounded-full bg-gradient-to-r from-indigo-950 via-purple-700 to-yellow-300" />
                <div className="flex justify-between text-[9px] text-amber-300/80">
                  <span>285K COLD</span>
                  <span>335K</span>
                  <span>395K HOT</span>
                </div>
              </div>
            )}
            {sensorVision === 'sar' && (
              <p className="text-[9px] text-sky-300/80">
                 SYNTHETIC APERTURE RADAR // ZERO-VISIBILITY PENETRATION: 100%
              </p>
            )}
            {sensorVision === 'optical' && (
              <p className="text-[9px] text-white/55">
                120 FPS CO-ALIGNED OPTICAL + 3× QUARTZ LIDAR LOCK
              </p>
            )}
          </div>
        )}

        {/* SVG Tactical HUD Overlay — Bore-Sight, Target Reticles & Leader Lines */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 w-full h-full"
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          preserveAspectRatio="none"
        >
          {/* Center Optical Gimbal Bore-Sight Crosshair */}
          {isPovActive && (
            <g opacity="0.4">
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
            </g>
          )}

          {/* Secondary Multi-Target Neural Tracks */}
          {secondaryTracks.map((st) =>
            st.visible ? (
              <g key={st.id} opacity="0.7">
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

          {/* Primary Locked Target Bounding Reticle + Leader Line */}
          {isPovActive && primaryLockedTarget && (
            <g>
              <rect
                x={clampedTargetX - 42}
                y={clampedTargetY - 42}
                width="84"
                height="84"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
              />
              <circle
                cx={clampedTargetX}
                cy={clampedTargetY}
                r="5"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
              />
              <circle cx={clampedTargetX} cy={clampedTargetY} r="2" fill={accentColor} />

              {viewportSize.width >= 1024 ? (
                <polyline
                  points={`${clampedTargetX + 42},${clampedTargetY} ${clampedTargetX + 86},${
                    clampedTargetY - 22
                  } ${viewportSize.width - 440},${Math.max(
                    190,
                    Math.min(viewportSize.height - 260, clampedTargetY - 22)
                  )}`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                />
              ) : (
                <polyline
                  points={`${clampedTargetX},${clampedTargetY + 42} ${viewportSize.width * 0.5},${
                    viewportSize.height - 215
                  }`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          )}

          {/* Animated Kinetic Micro-Munition In-Flight Reticle & Impact Shockwave HUD */}
          {isPovActive && isAttack && strikeHud.visible && strikeHud.status === 'inbound' && (
            <g>
              <circle
                cx={strikeHud.screenX}
                cy={strikeHud.screenY}
                r="12"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.8"
              />
              <circle cx={strikeHud.screenX} cy={strikeHud.screenY} r="3.5" fill="#ef4444" />
              <text
                x={strikeHud.screenX + 16}
                y={strikeHud.screenY + 4}
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {`AGM-M1 INBOUND [T-${((1 - strikeHud.progress) * 1.1).toFixed(1)}s]`}
              </text>
            </g>
          )}

          {isPovActive && isAttack && strikeHud.visible && strikeHud.status === 'impact' && (
            <g>
              <circle
                cx={clampedTargetX}
                cy={clampedTargetY}
                r={26 + strikeHud.progress * 58}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.2"
                opacity={Math.max(0, 1 - strikeHud.progress)}
              />
              <circle
                cx={clampedTargetX}
                cy={clampedTargetY}
                r={14 + strikeHud.progress * 34}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                opacity={Math.max(0, 1 - strikeHud.progress)}
              />
              <text
                x={clampedTargetX - 88}
                y={clampedTargetY - 52}
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                KINETIC IMPACT CONFIRMED // CEP 0.12m
              </text>
            </g>
          )}
        </svg>

        {/* =====================================================================
            TOP BAR HUD — Live Scroll Sector + Sensor Spectrum + Recon / Attack
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
                  {isPovActive && primaryLockedTarget
                    ? primaryLockedTarget.sectorLabel
                    : 'SA-1 "VANGUARD" // EXTERNAL STUDIO AIRFRAME (SCROLL TO ENTER POV)'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {isPovActive && primaryLockedTarget
                    ? `LOCKED: ${primaryLockedTarget.name}`
                    : '3/4 Isometric Airframe Inspection → 4K Optical Gimbal Zoom'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Domain Progression + Sensor Vision Toggle + Recon/Attack Mode Switcher */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            {/* Scroll-Driven Domain Progression Badge (Land → Air → Naval) */}
            <div className="hidden md:flex items-center gap-1.5 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider">
              <span
                className={
                  isPovActive && activeSector === 'land'
                    ? 'text-[#00ff41] font-bold'
                    : 'text-white/40'
                }
              >
                01 LAND
              </span>
              <span className="text-white/25">→</span>
              <span
                className={
                  isPovActive && activeSector === 'air'
                    ? 'text-[#00ff41] font-bold'
                    : 'text-white/40'
                }
              >
                02 AIR
              </span>
              <span className="text-white/25">→</span>
              <span
                className={
                  isPovActive && activeSector === 'naval'
                    ? 'text-[#00ff41] font-bold'
                    : 'text-white/40'
                }
              >
                03 NAVAL
              </span>
            </div>

            {/* Interactive Sensor-Fusion Vision Toggle (Optical 4K / Thermal LWIR / SAR Radar) */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setSensorVision('optical')}
                className={`rounded-lg px-2.5 py-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  sensorVision === 'optical'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                4K Optical
              </button>
              <button
                type="button"
                onClick={() => setSensorVision('thermal')}
                className={`rounded-lg px-2.5 py-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  sensorVision === 'thermal'
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_14px_rgba(251,191,36,0.45)]'
                    : 'text-white/60 hover:text-amber-300'
                }`}
              >
                Thermal LWIR
              </button>
              <button
                type="button"
                onClick={() => setSensorVision('sar')}
                className={`rounded-lg px-2.5 py-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  sensorVision === 'sar'
                    ? 'bg-sky-400 text-black font-bold shadow-[0_0_14px_rgba(56,189,248,0.45)]'
                    : 'text-white/60 hover:text-sky-300'
                }`}
              >
                SAR Radar
              </button>
            </div>

            {/* Dual Operational Mode Switcher: Recon Mode vs Attack Mode */}
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMissionMode('recon')}
                className={`rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  missionMode === 'recon'
                    ? 'bg-[#00ff41] text-black font-bold shadow-[0_0_16px_rgba(0,255,65,0.4)]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Recon (ISR)
              </button>
              <button
                type="button"
                onClick={() => setMissionMode('attack')}
                className={`rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
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
            PHASE 1 PROMPT OVERLAY
           ===================================================================== */}
        {!isPovActive && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-10 z-25 flex justify-center px-4">
            <div className="bg-black/80 backdrop-blur-xl border border-sky-400/40 rounded-2xl px-5 py-3 sm:px-7 sm:py-3.5 text-center max-w-xl shadow-2xl">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-sky-400 font-bold mb-1">
                SA-1 &ldquo;VANGUARD&rdquo; // CONTINUOUS LAND → AIR → NAVAL MISSION
              </p>
              <p className="text-xs sm:text-sm text-white/85">
                Scroll down to bank the SA-1 airframe, zoom into the{' '}
                <strong className="text-sky-300">4K Sapphire Optical Gimbal</strong>, and fly
                through Land, Air, and Naval battlefields.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            FLOATING TARGET LOCK TAG DIRECTLY BELOW RETICLE (Target + Component)
           ===================================================================== */}
        {isPovActive && primaryLockedTarget && (
          <div
            className="pointer-events-none absolute z-25 hidden sm:block transition-all duration-150"
            style={{
              left: `${Math.max(20, Math.min(viewportSize.width - 340, clampedTargetX - 145))}px`,
              top: `${Math.max(95, Math.min(viewportSize.height - 235, clampedTargetY + 46))}px`,
              width: '295px',
            }}
          >
            <div
              className={`bg-black/90 backdrop-blur-md border ${accentBorderClass} rounded-xl px-3.5 py-2.5 font-mono text-[10px] shadow-2xl`}
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
              className={`pointer-events-auto w-[390px] xl:w-[420px] bg-black/88 backdrop-blur-2xl border ${accentBorderClass} rounded-2xl p-6 shadow-2xl transition-all duration-300`}
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
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3.5 mb-3.5">
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

              {/* Kinetic Strike Action Bar (Launch / Re-Engage Micro-Munition) */}
              <div className="flex items-center justify-between gap-2.5 pt-1">
                <div className="text-[10px] font-mono">
                  {isAttack ? (
                    strikeHud.status === 'inbound' ? (
                      <span className="text-amber-300 font-bold animate-pulse">
                        ● AGM-M1 MICRO-MUNITION INBOUND...
                      </span>
                    ) : strikeHud.status === 'impact' ? (
                      <span className="text-red-400 font-bold">
                        ✓ IMPACT CONFIRMED // TARGET NEUTRALIZED
                      </span>
                    ) : (
                      <span className="text-red-400/85">
                        ● VENTRAL BAY ARMED // TERMINAL SOLUTION READY
                      </span>
                    )
                  ) : (
                    <span className="text-[#00ff41]/85">
                      ● PASSIVE ISR TELEMETRY STREAMING
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={triggerKineticStrike}
                  className="shrink-0 rounded-lg bg-red-500/20 hover:bg-red-500 border border-red-500/60 text-red-300 hover:text-white px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                >
                  {isAttack ? 'Re-Fire Strike' : 'Engage Target'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            BOTTOM DOCK — Mobile Target Lock Explainer Card (< lg)
           ===================================================================== */}
        {isPovActive && primaryLockedTarget && (
          <div className="pointer-events-auto lg:hidden absolute z-30 bottom-3 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6">
            <div className="max-w-6xl mx-auto">
              <div
                className={`bg-black/90 backdrop-blur-xl border ${accentBorderClass} rounded-xl p-3.5 sm:p-4 shadow-2xl`}
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
                  <span className="text-sky-400 font-bold truncate">
                    COMPONENT: {primaryLockedTarget.componentName}
                  </span>
                  <button
                    type="button"
                    onClick={triggerKineticStrike}
                    className="rounded bg-red-500/25 hover:bg-red-500 border border-red-500/60 text-red-300 hover:text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider transition-all"
                  >
                    {isAttack ? 'Re-Fire Strike' : 'Engage Target'}
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
