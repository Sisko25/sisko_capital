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
      <section
        className="relative border-b border-white/10 overflow-hidden bg-[#0B0C0E]"
        style={{ paddingTop: '5.5rem', paddingBottom: '7rem' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0, 255, 65, 0.08) 0%, rgba(11, 12, 14, 0) 70%)',
          }}
        />
        <div className="site-container relative z-10">
          <div
            className="flex flex-wrap items-center justify-between gap-6"
            style={{ marginBottom: '2.75rem' }}
          >
            <div
              className="inline-flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/10"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#00ff41] font-semibold">
                TACTICAL STEALTH MICRO-UAV // PROGRAM SA-1
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-white/50">
              <span>ENVELOPE: 160 × 180 × 42 MM</span>
              <span className="text-white/20">|</span>
              <span>DUAL-MODE RECON &amp; KINETIC INTERDICTION</span>
            </div>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]"
            style={{ marginBottom: '2.5rem' }}
          >
            SA-1 &ldquo;VANGUARD&rdquo;
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-5xl"
            style={{ marginBottom: '4.5rem', lineHeight: 1.75 }}
          >
            The SA-1 &ldquo;Vanguard&rdquo; is a low-observable tactical micro-UAV featuring a
            flush-ducted quad-rotor carbon chassis engineered for near-silent acoustic operation
            and minimal radar cross-section in contested urban airspace. Equipped with a
            forward-facing 4K optical gimbal encircled by an integrated multi-spectral LiDAR and
            sensor ring, the platform executes real-time target recognition and tracking directly
            at the edge via onboard autonomous vision software. Designed for both persistent
            reconnaissance and surgical kinetic interdiction, the airframe incorporates a modular
            ventral hardpoint for precision-guided micro-munitions with zero payload drag penalty.
          </p>

          {/* Key Architectural Telemetry Cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10"
            style={{ paddingTop: '3.5rem', gap: '2rem' }}
          >
            <div
              className="bg-[#111318] border border-white/10 rounded-xl"
              style={{ padding: '1.75rem 2rem' }}
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-2">
                Dimensional Footprint
              </p>
              <p className="text-2xl font-bold font-mono text-white">
                160 × 180 × 42 <span className="text-xs text-[#00ff41]">mm</span>
              </p>
            </div>
            <div
              className="bg-[#111318] border border-white/10 rounded-xl"
              style={{ padding: '1.75rem 2rem' }}
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-2">
                Propulsion Architecture
              </p>
              <p className="text-2xl font-bold font-mono text-white">
                4× 45mm <span className="text-xs text-[#00ff41]">Serrated Ducts</span>
              </p>
            </div>
            <div
              className="bg-[#111318] border border-white/10 rounded-xl"
              style={{ padding: '1.75rem 2rem' }}
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-2">
                Forward Sensor Ring
              </p>
              <p className="text-2xl font-bold font-mono text-white">
                4K Sapphire <span className="text-xs text-[#00ff41]">+ 3× LiDAR</span>
              </p>
            </div>
            <div
              className="bg-[#111318] border border-white/10 rounded-xl"
              style={{ padding: '1.75rem 2rem' }}
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/45 mb-2">
                Ventral Hardpoint Drag
              </p>
              <p className="text-2xl font-bold font-mono text-[#00ff41]">
                0.0% <span className="text-xs text-white/70">Internal Flush Bay</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Apple-Style Interactive 4-Phase Scroll Exploded View */}
      <VanguardExplodedViewer />

      {/* SECTION 3 — 4-Subsystem Engineering Deep Dive */}
      <section
        className="bg-[#0B0C0E] border-b border-white/10"
        style={{ paddingTop: '8.5rem', paddingBottom: '8.5rem' }}
      >
        <div className="site-container">
          <div className="max-w-3xl" style={{ marginBottom: '5rem' }}>
            <p
              className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold"
              style={{ marginBottom: '1.25rem' }}
            >
              Exploded Subsystem Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Every millimeter engineered for autonomous urban dominance.
            </h2>
          </div>

          <div className="grid md:grid-cols-2" style={{ gap: '3rem' }}>
            {subsystems.map((sub) => (
              <div
                key={sub.id}
                style={{ padding: '3rem' }}
                className="bg-[#111318] border border-white/10 rounded-2xl hover:border-[#00ff41]/45 transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div
                    className="flex items-center justify-between gap-4"
                    style={{ marginBottom: '2rem' }}
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center font-mono text-sm font-bold text-[#00ff41]">
                      {sub.id}
                    </span>
                    <span
                      className="text-[11px] font-mono uppercase tracking-wider text-white/55 bg-white/[0.03] rounded-lg border border-white/10"
                      style={{ padding: '0.4rem 0.85rem' }}
                    >
                      {sub.axisBadge}
                    </span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    {sub.title}
                  </h3>
                  <p
                    className="text-xs font-mono uppercase tracking-wider text-[#00ff41]"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    {sub.subtitle}
                  </p>
                  <p
                    className="text-white/70 text-base leading-relaxed"
                    style={{ marginBottom: '2.5rem', lineHeight: 1.8 }}
                  >
                    {sub.description}
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 border-t border-white/10"
                  style={{ paddingTop: '2rem', gap: '1.5rem' }}
                >
                  {sub.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-white/45 mb-1.5">
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

      {/* SECTION 4 — ISO-10303-21 STEP & 2-Manifold CAD Verification Matrix (No download buttons) */}
      <section
        className="bg-[#0E1014] border-b border-white/10"
        style={{ paddingTop: '8.5rem', paddingBottom: '8.5rem' }}
      >
        <div className="site-container">
          <div className="max-w-3xl" style={{ marginBottom: '4.5rem' }}>
            <p
              className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold"
              style={{ marginBottom: '1.25rem' }}
            >
              Digital Twin &amp; B-Rep Verification
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
              style={{ marginBottom: '1.5rem' }}
            >
              100% Watertight 2-Manifold CAD Assembly
            </h2>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed">
              Verified across 7 primary structural component groups with zero boundary edges and
              zero non-manifold edges, combining OpenCASCADE ISO-10303-21 STEP B-Rep precision with
              hierarchical real-time glTF 2.0 telemetry.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0C0E] shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-white/15 text-xs font-mono uppercase tracking-wider text-white/50 bg-white/[0.02]">
                  <th style={{ padding: '1.35rem 2rem' }}>Subsystem Node</th>
                  <th style={{ padding: '1.35rem 2rem' }}>Material &amp; Structural Role</th>
                  <th style={{ padding: '1.35rem 2rem' }}>Bounding Envelope</th>
                  <th style={{ padding: '1.35rem 2rem' }}>Polygon Topology</th>
                  <th style={{ padding: '1.35rem 2rem' }} className="text-[#00ff41]">
                    Manifold Audit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                {cadManifest.map((row) => (
                  <tr key={row.group} className="hover:bg-white/[0.02] transition-colors">
                    <td style={{ padding: '1.35rem 2rem' }} className="font-bold text-white">
                      {row.group}
                    </td>
                    <td
                      style={{ padding: '1.35rem 2rem' }}
                      className="text-white/70 font-sans"
                    >
                      {row.role}
                    </td>
                    <td style={{ padding: '1.35rem 2rem' }} className="text-white/80">
                      {row.dims}
                    </td>
                    <td style={{ padding: '1.35rem 2rem' }} className="text-white/70">
                      {row.polys}
                    </td>
                    <td
                      style={{ padding: '1.35rem 2rem' }}
                      className="text-[#00ff41] font-bold"
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Procurement & Briefing CTA */}
      <section
        className="bg-[#0B0C0E] text-center"
        style={{ paddingTop: '8.5rem', paddingBottom: '9.5rem' }}
      >
        <div className="site-container">
          <p
            className="text-[#00ff41] font-mono uppercase tracking-[0.25em] text-xs font-semibold"
            style={{ marginBottom: '1.5rem' }}
          >
            Sovereign Tactical Hardware
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight"
            style={{ marginBottom: '1.75rem' }}
          >
            Request an SA-1 &ldquo;Vanguard&rdquo; hardware &amp; telemetry evaluation.
          </h2>
          <p
            className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ marginBottom: '3rem' }}
          >
            Available for institutional defense partners and sovereign security agencies with full
            native A.V.I.A.R.S. onboard edge autonomy.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="mailto:sisko@duck.com?subject=SA-1%20Vanguard%20Procurement%20Evaluation"
              style={{ padding: '1.1rem 2.5rem' }}
              className="bg-[#00ff41] text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]"
            >
              Request Evaluation Unit
            </a>
            <Link
              href="/aviars"
              style={{ padding: '1.1rem 2.5rem' }}
              className="border border-white/30 text-white font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-all"
            >
              Explore A.V.I.A.R.S. Core
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
