import Link from 'next/link';
import VanguardExplodedViewer from '@/components/vanguard-exploded-viewer';

export default function VanguardPage() {
  const subsystems = [
    {
      id: '01',
      title: 'Multi-Spectral Edge Suite',
      subtitle: '4K Optical Lens + Solid-State LiDAR',
      axisBadge: '+Z AXIS // +120.0 MM EXTENSION',
      description:
        'Seated inside a 25.6 mm recessed nose pocket with a 0.8 mm dynamic clearance gap, the 24.0 mm 2-axis motorized spherical gimbal houses a 3-element aspheric 4K sapphire optical stack encircled by 3 trapezoidal gold-dichroic quartz solid-state LiDAR windows and dual 3.0 mm stereo visual inertial odometry (VIO) cameras.',
      metrics: [
        { label: 'Gimbal Diameter', value: '24.0 mm (2-Axis)' },
        { label: 'Primary Optics', value: '4K Sapphire Triple-Element' },
        { label: 'LiDAR Array', value: '3× Quartz Facet (-36° / 0° / +36°)' },
        { label: 'GPS-Denied Nav', value: 'Dual 3.0 mm Stereo VIO + 4× ToF' },
      ],
    },
    {
      id: '02',
      title: 'Flush Acoustic Nacelles',
      subtitle: 'Serrated Ducted Quad-Rotors',
      axisBadge: '+Y AXIS // +42.0 MM ROTOR ELEVATION',
      description:
        'Four 45.0 mm internal-diameter toroidal ducts are molded directly into the blended carbon-composite lifting body. Each duct throat incorporates 9 circumferential boundary-layer trip grooves and 36 axial micro-serrations to break up blade-tip vortices, paired with 5-blade swept counter-rotating micro-rotors for near-silent urban operation.',
      metrics: [
        { label: 'Duct Inner Bore', value: '45.00 mm Toroidal' },
        { label: 'Acoustic Serrations', value: '9 Rings / 36 Axial Notches' },
        { label: 'Rotor Architecture', value: '5-Blade Swept (0.65 mm Tip Gap)' },
        { label: 'Stator Assembly', value: '3× Swept Vanes per Nacelle' },
      ],
    },
    {
      id: '03',
      title: 'A.V.I.A.R.S. Core',
      subtitle: 'Onboard Autonomous Compute / Thermal Dissipation',
      axisBadge: '+Y AXIS // +150.0 MM DORSAL SEPARATION',
      description:
        'Protected beneath the 2.0 mm RAM-coated dorsal monocoque hull, the A.V.I.A.R.S. neural TPU compute module executes target recognition and multi-sensor fusion in under 5 ms. Passive-active thermal management channels cool air from twin ventral NACA submerged intakes across a 13-fin skived heatsink and out through six 30° rear dorsal exhaust micro-louvers.',
      metrics: [
        { label: 'Edge AI Latency', value: '< 5 ms Onboard TPU' },
        { label: 'Thermal Heatsink', value: '13-Fin Skived Array + NACA Intakes' },
        { label: 'Exhaust Louvers', value: '6× 30° Directional Dorsal Gills' },
        { label: 'Telemetry Uplink', value: 'Flush Conformal GNSS Patch (0.3 mm Rim)' },
      ],
    },
    {
      id: '04',
      title: 'Modular Ventral Hardpoint',
      subtitle: 'Low-Drag Kinetic Interdiction Payload',
      axisBadge: '-Y AXIS // -100.0 MM VENTRAL / -156.0 MM PAYLOAD',
      description:
        'Engineered for dual-role persistent ISR and surgical kinetic interdiction, the ventral chassis integrates an internal flush weapon bay with a 0.4 mm gasket-sealed quick-release hatch. The modular hardpoint deploys a precision-guided micro-munition featuring an optical/laser seeker dome and 4 cruciform pop-out tail fins with zero aerodynamic drag penalty while stowed.',
      metrics: [
        { label: 'Parasitic Drag Penalty', value: '0% (Internal Flush Bay)' },
        { label: 'Guidance Seeker', value: 'Semi-Active Optical / Terminal Lock' },
        { label: 'Release Mechanism', value: 'Zero-Retention Micro-Ejector Pylon' },
        { label: 'Ground Clearance', value: '5.0 mm Rubberized Nacelle Skids' },
      ],
    },
  ];

  const cadManifest = [
    {
      group: 'Main_Hull_Top',
      role: 'RAM-Coated Matte Carbon-Composite Dorsal Monocoque',
      dims: '160.0 × 180.0 × 21.0 mm',
      polys: '28,379 (53.7% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Main_Hull_Ventral',
      role: 'Carbon-Composite Ventral Chassis, Stators & Skid Pads',
      dims: '160.0 × 180.0 × 21.0 mm',
      polys: '30,742 (55.9% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Ducted_Propellers_L1_R2',
      role: '4× Carbon-Reinforced PEEK 5-Blade Swept Micro-Rotors',
      dims: '110.7 × 147.7 × 11.2 mm',
      polys: '13,920 (82.1% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Gimbal_Sphere_Assembly',
      role: 'Hard-Anodized 7075-T6 Aluminum 2-Axis Spherical Gimbal',
      dims: '20.8 × 24.6 × 24.0 mm',
      polys: '2,863 (78.9% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Primary_4K_Lens',
      role: 'Multi-Coated 4K Sapphire Aspheric Lens & Threaded Bezel',
      dims: '5.1 × 18.2 × 18.2 mm',
      polys: '2,109 (94.5% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Sensor_Array_Windows',
      role: '3× Quartz LiDAR Windows, 2× Stereo VIO & 4× ToF Ports',
      dims: '53.0 × 66.3 × 29.8 mm',
      polys: '1,616 (99.3% Quads)',
      status: '2-Manifold Watertight',
    },
    {
      group: 'Fasteners_Hardware',
      role: '28× Titanium Ti-6Al-4V Flush Torx T6 + 4× Rotor Locknuts',
      dims: '109.4 × 106.9 × 35.8 mm',
      polys: '6,912 (100% Quads)',
      status: '2-Manifold Watertight',
    },
  ];

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen">
      {/* SECTION 1 — Minimalist Luxury Defense-Tech Hero Header */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-white/10 overflow-hidden bg-[#0B0C0E]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0, 255, 65, 0.08) 0%, rgba(11, 12, 14, 0) 70%)',
          }}
        />
        <div className="site-container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#00ff41] font-semibold">
                TACTICAL STEALTH MICRO-UAV // PROGRAM SA-1
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-white/50">
              <span>ENVELOPE: 160 × 180 × 42 MM</span>
              <span className="text-white/20">|</span>
              <span>CAD: ISO-10303-21 STEP + GLTF 2.0</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-8">
            SA-1 &ldquo;VANGUARD&rdquo;
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-5xl mb-12">
            The SA-1 &ldquo;Vanguard&rdquo; is a low-observable tactical micro-UAV featuring a
            flush-ducted quad-rotor carbon chassis engineered for near-silent acoustic operation
            and minimal radar cross-section in contested urban airspace. Equipped with a
            forward-facing 4K optical gimbal encircled by an integrated multi-spectral LiDAR and
            sensor ring, the platform executes real-time target recognition and tracking directly
            at the edge via onboard autonomous vision software. Designed for both persistent
            reconnaissance and surgical kinetic interdiction, the airframe incorporates a modular
            ventral hardpoint for precision-guided micro-munitions with zero payload drag penalty.
          </p>

          {/* Key Architectural Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-1">
                Dimensional Footprint
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                160 × 180 × 42 <span className="text-xs text-[#00ff41]">mm</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-1">
                Propulsion Architecture
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                4× 45mm <span className="text-xs text-[#00ff41]">Serrated Ducts</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-1">
                Forward Sensor Ring
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                4K Sapphire <span className="text-xs text-[#00ff41]">+ 3× LiDAR</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-1">
                Ventral Hardpoint Drag
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#00ff41]">
                0.0% <span className="text-xs text-white/70">Internal Flush Bay</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Apple-Style Interactive 4-Phase Scroll Exploded View (.GLB + .STEP) */}
      <VanguardExplodedViewer />

      {/* SECTION 3 — 4-Subsystem Engineering Deep Dive */}
      <section className="py-28 md:py-40 bg-[#0B0C0E] border-b border-white/10">
        <div className="site-container">
          <div className="max-w-3xl mb-16 md:mb-20 space-y-4">
            <p className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold">
              Exploded Subsystem Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Every millimeter engineered for autonomous urban dominance.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {subsystems.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#111318] border border-white/10 rounded-2xl p-8 sm:p-10 md:p-12 hover:border-[#00ff41]/45 transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="w-11 h-11 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center font-mono text-sm font-bold text-[#00ff41]">
                      {sub.id}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/55 bg-white/[0.03] px-3 py-1 rounded border border-white/10">
                      {sub.axisBadge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{sub.title}</h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#00ff41] mb-5">
                    {sub.subtitle}
                  </p>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8">
                    {sub.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  {sub.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                        {m.label}
                      </p>
                      <p className="text-xs sm:text-sm font-mono font-bold text-white">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — ISO-10303-21 STEP & 2-Manifold CAD Verification Matrix */}
      <section className="py-28 md:py-40 bg-[#0E1014] border-b border-white/10">
        <div className="site-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
            <div className="space-y-4 max-w-2xl">
              <p className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold">
                Digital Twin &amp; B-Rep Verification
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                100% Watertight 2-Manifold CAD Assembly
              </h2>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                Verified across 7 primary structural component groups with zero boundary edges and
                zero non-manifold edges. Available in native OpenCASCADE ISO-10303-21 STEP B-Rep
                and hierarchical glTF 2.0 formats.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/models/sa1_vanguard.step"
                download="SA1_Vanguard_CAD.step"
                className="bg-[#00ff41] text-black px-6 py-3.5 rounded font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg"
              >
                Download .STEP (2.6 MB)
              </a>
              <a
                href="/models/sa1_vanguard.glb"
                download="SA1_Vanguard_3D.glb"
                className="border border-white/25 text-white px-6 py-3.5 rounded font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
              >
                Download .GLB (2.5 MB)
              </a>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0C0E]">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-white/15 text-[11px] font-mono uppercase tracking-wider text-white/45 bg-white/[0.02]">
                  <th className="py-4 px-6">GLTF / STEP Node</th>
                  <th className="py-4 px-6">Material &amp; Structural Role</th>
                  <th className="py-4 px-6">Bounding Envelope</th>
                  <th className="py-4 px-6">Polygon Topology</th>
                  <th className="py-4 px-6 text-[#00ff41]">Manifold Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                {cadManifest.map((row) => (
                  <tr key={row.group} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{row.group}</td>
                    <td className="py-4 px-6 text-white/65 font-sans">{row.role}</td>
                    <td className="py-4 px-6 text-white/80">{row.dims}</td>
                    <td className="py-4 px-6 text-white/70">{row.polys}</td>
                    <td className="py-4 px-6 text-[#00ff41] font-bold">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Procurement & Briefing CTA */}
      <section className="py-28 md:py-36 bg-[#0B0C0E] text-center">
        <div className="site-container space-y-8">
          <p className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold">
            Sovereign Tactical Hardware
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Request an SA-1 &ldquo;Vanguard&rdquo; hardware &amp; telemetry evaluation.
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Available for institutional defense partners and sovereign security agencies with full
            native A.V.I.A.R.S. onboard edge autonomy.
          </p>
          <div className="flex justify-center gap-6 flex-wrap pt-4">
            <a
              href="mailto:sisko@duck.com?subject=SA-1%20Vanguard%20Procurement%20Evaluation"
              className="bg-[#00ff41] text-black px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]"
            >
              Request Evaluation Unit
            </a>
            <Link
              href="/aviars"
              className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-all"
            >
              Explore A.V.I.A.R.S. Core
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
