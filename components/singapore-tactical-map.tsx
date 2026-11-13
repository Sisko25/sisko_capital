'use client';

import React, { useState } from 'react';

interface ChokepointSector {
  id: string;
  code: string;
  name: string;
  coords: string;
  domain: 'MARITIME OVERWATCH' | 'INFRASTRUCTURE C-UAS' | 'URBAN EW RESILIENCE' | 'EASTERN AIR-SEA GATE';
  mapX: number;
  mapY: number;
  radarRadius: number;
  threatTitle: string;
  threatTelemetry: string;
  aviarsSolution: string;
  subsystemUsed: string;
  metrics: { label: string; value: string }[];
}

const SINGAPORE_SECTORS: ChokepointSector[] = [
  {
    id: 'tuas-strait',
    code: 'SG-01 // WEST',
    name: 'Tuas Mega Port & Western Strait Funnel',
    coords: '01°15\'54"N 103°37\'15"E',
    domain: 'MARITIME OVERWATCH',
    mapX: 165,
    mapY: 315,
    radarRadius: 95,
    threatTitle: 'Dark-Ship AIS Transponder Spoofing (Offset: 1.8 NM)',
    threatTelemetry: 'SAR KELVIN-WAKE ANOMALY // THERMAL HULL SIGNATURE MISMATCH',
    aviarsSolution:
      'Automatically cross-checks AIS broadcast coordinates against 120 FPS Synthetic Aperture Radar (SAR) wake geometry and thermal IR hull profiles, flagging ghost vessels and unauthorized course deviations before they enter port approaches.',
    subsystemUsed: '120 FPS SAR + LWIR Thermal Sensor Fusion',
    metrics: [
      { label: 'Annual Vessels Monitored', value: '130,000+' },
      { label: 'AIS Spoof Detection', value: '< 4.2 ms' },
      { label: 'Strait Overwatch', value: '24/7 All-Weather' },
    ],
  },
  {
    id: 'jurong-island',
    code: 'SG-02 // SOUTH-WEST',
    name: 'Jurong Island Energy & Refinery Complex',
    coords: '01°15\'58"N 103°41\'56"E',
    domain: 'INFRASTRUCTURE C-UAS',
    mapX: 295,
    mapY: 335,
    radarRadius: 85,
    threatTitle: 'Ultra-Low Altitude Hostile Micro-Drone Swarm in Monsoon Rain',
    threatTelemetry: 'RCS: 0.002 m² // MICRO-DOPPLER ROTOR WAKE LOCKED',
    aviarsSolution:
      'Penetrates heavy tropical monsoonal downpours and sea haze by combining micro-Doppler blade-flash detection with the 3× gold-dichroic quartz solid-state LiDAR array to track and interdict miniature drones hugging the waterline.',
    subsystemUsed: 'Forward 4K Sapphire Gimbal + 3× Quartz LiDAR Ring',
    metrics: [
      { label: 'Early Warning Range', value: '15.0 km' },
      { label: 'Simultaneous Tracks', value: 'Up to 64 Targets' },
      { label: 'Rain/Haze Clarity', value: '100% Zero-Blindspot' },
    ],
  },
  {
    id: 'marina-urban',
    code: 'SG-03 // CENTRAL',
    name: 'Marina Bay & Southern Strait Urban Corridor',
    coords: '01°16\'58"N 103°51\'36"E',
    domain: 'URBAN EW RESILIENCE',
    mapX: 525,
    mapY: 305,
    radarRadius: 80,
    threatTitle: 'GPS-Denied Urban Canyon & Active RF Jamming Interference',
    threatTelemetry: 'GNSS SPOOFING REJECTED // VIO + AES-256 FHSS LINK ACTIVE',
    aviarsSolution:
      'Maintains pinpoint autonomous flight and target tracking between high-rise towers without satellite dependency using Dual 3.0 mm Stereo Visual Inertial Odometry (VIO), while serrated toroidal ducts keep acoustic signature whispers-quiet.',
    subsystemUsed: 'Dual Stereo VIO + Flush Serrated Acoustic Nacelles',
    metrics: [
      { label: 'Navigation Drift', value: '< 0.05% (GPS-Denied)' },
      { label: 'Encryption Standard', value: 'Quantum-Safe AES-256' },
      { label: 'Acoustic Footprint', value: 'Near-Silent Urban' },
    ],
  },
  {
    id: 'changi-east',
    code: 'SG-04 // EAST',
    name: 'Changi Air Corridor & Eastern Singapore Strait',
    coords: '01°20\'02"N 104°01\'05"E',
    domain: 'EASTERN AIR-SEA GATE',
    mapX: 735,
    mapY: 235,
    radarRadius: 95,
    threatTitle: 'High-Speed Littoral Fast Attack Craft (46 Kts) & Air Intruder',
    threatTelemetry: 'AIR-GAPPED EDGE TPU // < 5 MS TERMINAL INTERCEPT SOLUTION',
    aviarsSolution:
      'Executes real-time multi-domain threat prioritization 100% onboard the SA-1 aircraft via custom neuromorphic TPUs. Zero external cloud dependency guarantees sovereign data security and sub-5ms reaction speeds.',
    subsystemUsed: 'A.V.I.A.R.S. Neuromorphic TPU + Modular Ventral Hardpoint',
    metrics: [
      { label: 'Onboard AI Latency', value: '< 5 ms (18W TPU)' },
      { label: 'Cloud Leak Risk', value: '0% (100% Air-Gapped)' },
      { label: 'Payload Drag Penalty', value: '0% (Internal Flush Bay)' },
    ],
  },
];

export default function SingaporeTacticalMap() {
  const [selectedId, setSelectedId] = useState<string>(SINGAPORE_SECTORS[0].id);
  const [interceptSimulated, setInterceptSimulated] = useState<boolean>(false);

  const activeSector =
    SINGAPORE_SECTORS.find((s) => s.id === selectedId) || SINGAPORE_SECTORS[0];

  const handleSelectSector = (id: string) => {
    setSelectedId(id);
    setInterceptSimulated(false);
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#07090D] border-y border-white/10">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 px-3.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#00ff41] font-bold">
                INTERACTIVE SOVEREIGN DEFENSE DOME // 734 KM²
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Singapore Strait &amp; Airspace Chokepoint Command
            </h2>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed">
              Select any strategic chokepoint across the Singapore Strait and sovereign approaches to
              inspect how SA-1 &ldquo;Vanguard&rdquo; and A.V.I.A.R.S. neutralize maritime, aerial,
              and electronic warfare threats in real time.
            </p>
          </div>

          {/* Sector Quick-Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {SINGAPORE_SECTORS.map((sec) => {
              const isSelected = sec.id === activeSector.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleSelectSector(sec.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                    isSelected
                      ? 'bg-[#00ff41] text-black border-[#00ff41] font-bold shadow-[0_0_20px_rgba(0,255,65,0.35)]'
                      : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-[#00ff41]/40 hover:text-white'
                  }`}
                >
                  {sec.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Map + Telemetry Dossier Grid */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left 7 Cols: Interactive Dark-Mode Singapore Strait Radar & AIS Map */}
          <div className="lg:col-span-7 bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-2xl">
            {/* Top Telemetry Bar inside Map */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 text-[10px] sm:text-xs font-mono">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
                <span className="font-bold">LIVE SINGAPORE STRAIT TSS OVERWATCH</span>
              </div>
              <div className="text-white/50">
                COORDS: <span className="text-white/85">{activeSector.coords}</span>
              </div>
            </div>

            {/* Interactive SVG Tactical Map */}
            <div className="relative w-full aspect-[16/10] bg-[#060A10]">
              <svg
                viewBox="0 0 920 520"
                className="w-full h-full select-none"
                role="img"
                aria-label="Singapore Strait Interactive Defense Chokepoint Map"
              >
                <defs>
                  <radialGradient id="sgRadarGlow" cx="50%" cy="50%" r="50%">
                    <stop
                      offset="0%"
                      stopColor={interceptSimulated ? '#ef4444' : '#00ff41'}
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="70%"
                      stopColor={interceptSimulated ? '#ef4444' : '#00ff41'}
                      stopOpacity="0.06"
                    />
                    <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="sgTacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.07)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                {/* Tactical Coordinate Grid Background */}
                <rect width="920" height="520" fill="url(#sgTacticalGrid)" />

                {/* Johor / Northern Coastline Silhouette */}
                <path
                  d="M 40,20 L 880,20 L 880,125 L 790,145 L 710,115 L 615,105 L 520,82 L 410,68 L 295,88 L 195,128 L 95,180 L 40,175 Z"
                  fill="#0D1522"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
                <text
                  x="440"
                  y="48"
                  fill="rgba(148,163,184,0.28)"
                  fontSize="11"
                  fontFamily="monospace"
                  letterSpacing="4"
                >
                  JOHOR STRAIT // NORTHERN APPROACH
                </text>

                {/* Singapore Main Sovereign Island Polygon */}
                <path
                  d="M 135,235 L 205,155 L 305,115 L 420,98 L 535,120 L 645,148 L 745,175 L 775,212 L 730,248 L 625,268 L 525,292 L 435,298 L 345,278 L 245,275 L 155,288 Z"
                  fill="#132032"
                  stroke="#00ff41"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                />

                {/* Jurong Island */}
                <path
                  d="M 255,296 L 325,292 L 335,325 L 272,332 Z"
                  fill="#172840"
                  stroke="#38bdf8"
                  strokeOpacity="0.65"
                  strokeWidth="1.5"
                />

                {/* Sentosa & Southern Islands */}
                <path
                  d="M 455,310 L 508,306 L 515,322 L 462,326 Z"
                  fill="#172840"
                  stroke="#38bdf8"
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                />

                {/* Pulau Tekong & Pulau Ubin (North-East) */}
                <path
                  d="M 665,122 L 712,118 L 718,136 L 670,140 Z"
                  fill="#152338"
                  stroke="#38bdf8"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                />
                <path
                  d="M 755,132 L 820,126 L 832,162 L 762,168 Z"
                  fill="#152338"
                  stroke="#00ff41"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />

                {/* Southern Riau Archipelago / Batam-Bintan Strait Boundary */}
                <path
                  d="M 180,485 L 420,455 L 680,445 L 890,465 L 890,520 L 180,520 Z"
                  fill="#0B121D"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />

                {/* Singapore Strait Traffic Separation Scheme (TSS) Shipping Lanes */}
                <path
                  d="M 35,385 Q 290,395 540,368 T 895,285"
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
                <path
                  d="M 35,418 Q 295,428 548,400 T 895,318"
                  fill="none"
                  stroke="#00ff41"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
                <text
                  x="430"
                  y="428"
                  fill="rgba(56,189,248,0.55)"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="2"
                >
                  SINGAPORE STRAIT TSS // 130,000+ VESSELS ANNUALLY
                </text>

                {/* Simulated Commercial Vessel AIS Tracks along TSS */}
                {[
                  { x: 110, y: 392, label: 'AIS-OK // VLCC' },
                  { x: 385, y: 388, label: 'AIS-OK // CONTAINER' },
                  { x: 635, y: 348, label: 'AIS-OK // LNG CARRIER' },
                  { x: 825, y: 302, label: 'AIS-OK // BULK' },
                ].map((v, idx) => (
                  <g key={idx} opacity="0.65">
                    <polygon
                      points={`${v.x},${v.y - 4} ${v.x + 8},${v.y} ${v.x},${v.y + 4}`}
                      fill="#38bdf8"
                    />
                    <text
                      x={v.x + 12}
                      y={v.y + 3}
                      fill="#38bdf8"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {v.label}
                    </text>
                  </g>
                ))}

                {/* Active Chokepoint Radar Dome & Threat Lock Visualization */}
                <g>
                  <circle
                    cx={activeSector.mapX}
                    cy={activeSector.mapY}
                    r={activeSector.radarRadius}
                    fill="url(#sgRadarGlow)"
                    stroke={interceptSimulated ? '#ef4444' : '#00ff41'}
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <circle
                    cx={activeSector.mapX}
                    cy={activeSector.mapY}
                    r={activeSector.radarRadius * 0.55}
                    fill="none"
                    stroke={interceptSimulated ? '#ef4444' : '#00ff41'}
                    strokeOpacity="0.3"
                    strokeWidth="1"
                  />

                  {/* Simulated Hostile Target Offset from Chokepoint + Intercept Vector */}
                  <line
                    x1={activeSector.mapX}
                    y1={activeSector.mapY}
                    x2={activeSector.mapX + 46}
                    y2={activeSector.mapY + 42}
                    stroke={interceptSimulated ? '#ef4444' : '#fbbf24'}
                    strokeWidth="1.8"
                    strokeDasharray={interceptSimulated ? 'none' : '4 3'}
                  />
                  <rect
                    x={activeSector.mapX + 36}
                    y={activeSector.mapY + 32}
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx={activeSector.mapX + 46}
                    cy={activeSector.mapY + 42}
                    r="3.5"
                    fill="#ef4444"
                  />
                  <text
                    x={activeSector.mapX + 62}
                    y={activeSector.mapY + 45}
                    fill={interceptSimulated ? '#00ff41' : '#ef4444'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {interceptSimulated
                      ? 'THREAT INTERDICTED [< 5ms]'
                      : 'HOSTILE ANOMALY LOCKED'}
                  </text>
                </g>

                {/* All 4 Interactive Chokepoint Nodes */}
                {SINGAPORE_SECTORS.map((sec) => {
                  const isSelected = sec.id === activeSector.id;
                  return (
                    <g
                      key={sec.id}
                      onClick={() => handleSelectSector(sec.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={sec.mapX}
                        cy={sec.mapY}
                        r={isSelected ? 14 : 10}
                        fill={isSelected ? 'rgba(0,255,65,0.22)' : 'rgba(15,23,42,0.85)'}
                        stroke={isSelected ? '#00ff41' : '#38bdf8'}
                        strokeWidth={isSelected ? 2.2 : 1.5}
                      />
                      <circle
                        cx={sec.mapX}
                        cy={sec.mapY}
                        r={isSelected ? 4.5 : 3}
                        fill={isSelected ? '#00ff41' : '#38bdf8'}
                      />
                      <rect
                        x={sec.mapX - 48}
                        y={sec.mapY - 34}
                        width="96"
                        height="16"
                        rx="4"
                        fill="rgba(5, 8, 14, 0.88)"
                        stroke={isSelected ? '#00ff41' : 'rgba(255,255,255,0.18)'}
                        strokeWidth="1"
                      />
                      <text
                        x={sec.mapX}
                        y={sec.mapY - 23}
                        textAnchor="middle"
                        fill={isSelected ? '#00ff41' : '#e2e8f0'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {sec.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Map Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-black/60 border-t border-white/10">
              <div className="flex items-center gap-4 text-[11px] font-mono text-white/65">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41]" /> SA-1 Overwatch Node
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Anomaly / Threat Lock
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInterceptSimulated((prev) => !prev)}
                className={`rounded-lg px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                  interceptSimulated
                    ? 'bg-[#00ff41] text-black shadow-[0_0_16px_rgba(0,255,65,0.4)]'
                    : 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/50'
                }`}
              >
                {interceptSimulated
                  ? '✓ Threat Neutralized — Reset Simulation'
                  : 'Simulate SA-1 Threat Intercept'}
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Active Chokepoint Tactical Dossier Card */}
          <div className="lg:col-span-5 bg-[#10141D] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/30 px-3 py-1 rounded-md font-bold">
                  {activeSector.domain}
                </span>
                <span className="text-xs font-mono text-white/45">{activeSector.code}</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
                  {activeSector.name}
                </h3>
                <p className="text-xs font-mono text-red-400">{activeSector.threatTelemetry}</p>
              </div>

              {/* Threat Scenario Box */}
              <div className="bg-red-500/[0.06] border border-red-500/25 rounded-xl p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold mb-1">
                  DETECTED CHOKEPOINT THREAT SCENARIO
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  {activeSector.threatTitle}
                </p>
              </div>

              {/* How A.V.I.A.R.S. + SA-1 Neutralizes It */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/45 mb-1.5">
                  AUTONOMOUS A.V.I.A.R.S. + SA-1 RESPONSE
                </p>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  {activeSector.aviarsSolution}
                </p>
              </div>

              {/* Active Hardware / Software Subsystem */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold mb-1">
                  PRIMARY SUBSYSTEM ENGAGED
                </p>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {activeSector.subsystemUsed}
                </p>
              </div>
            </div>

            {/* 3 Sector Telemetry Benchmarks */}
            <div className="grid grid-cols-3 gap-2.5 pt-6 mt-6 border-t border-white/10">
              {activeSector.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-black/45 border border-white/10 rounded-xl p-3 text-center"
                >
                  <p className="text-[10px] text-white/45 uppercase tracking-wider mb-1">
                    {m.label}
                  </p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-[#00ff41]">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
