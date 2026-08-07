import Image from 'next/image'
import Link from 'next/link'

export default function FuturePage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-black"
        style={{
          backgroundImage: "url('/images/future-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '520px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className="relative z-10 site-container flex flex-col justify-end" style={{ minHeight: '520px', paddingBottom: '3.5rem' }}>
          <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-6">Future Hardware Platform</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            SISKO KESTREL-1
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-mono max-w-3xl leading-snug">
            The world&apos;s first native A.V.I.A.R.S-powered autonomous stealth UAV.
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Next-Gen Hardware</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Merging stealth aerodynamics with deep AI intelligence.
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed pt-2">
              The Sisko Kestrel-1 is our flagship hardware project currently under active development.
              Designed from the ground up to house a military-grade multi-spectral camera payload, the Kestrel-1
              integrates our A.V.I.A.R.S AI detection software directly into its primary flight avionics bus.
              The result is a fully autonomous aerial platform capable of long-endurance reconnaissance,
              real-time threat identification, and precision target engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* High-End Optics & Camera System Deep Dive */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Optics Payload Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl order-2 md:order-1">
              <Image
                src="/images/future-optics.jpg"
                alt="Sisko Kestrel-1 High-End Camera Payload"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Description */}
            <div className="space-y-6 order-1 md:order-2">
              <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Sensor Payload</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                High-End Multi-Spectral Optics &amp; Laser Targeting.
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                At the core of the Kestrel-1 is a custom-engineered 3-axis gyro-stabilized optical gimbal payload.
                Housing an ultra-high-definition 8K optical sensor, FLIR thermal imaging array, and Class 4 laser target designator,
                the optics unit streams uncompressed multi-spectral video directly into onboard A.V.I.A.R.S neural processors.
              </p>
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  <p className="text-sm font-medium text-white/90">8K Ultra-HD Optical Sensor with 50x Continuous Optical Zoom</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  <p className="text-sm font-medium text-white/90">FLIR Boson Long-Wave Infrared (LWIR) Thermal Array</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  <p className="text-sm font-medium text-white/90">MIL-STD Precision Laser Target Designator &amp; Rangefinder</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Airframe & Autonomous Flight Features */}
      <section className="py-20 md:py-28 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Platform Architecture</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Engineering Highlights</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Low-RCS Stealth Airframe',
                description:
                  'Constructed from radar-absorbent carbon-composite materials with a stealth blended-wing body, minimizing radar cross-section (RCS) against enemy air defense radars.',
              },
              {
                title: 'Native A.V.I.A.R.S Avionics',
                description:
                  'The A.V.I.A.R.S AI engine is hardwired into the primary flight computer, enabling autonomous path planning, target lock-on, and collision avoidance without human intervention.',
              },
              {
                title: '14-Hour Flight Endurance',
                description:
                  'High-efficiency hybrid propulsion system provides over 14 hours of continuous loiter time, allowing persistent overwatch across Singapore maritime boundaries.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-lg hover:border-[#00ff41]/40 transition-all duration-300 space-y-8"
              >
                <div className="w-8 h-8 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded flex items-center justify-center text-[#00ff41] font-mono text-xs font-bold">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Benchmarks Table */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Target Specifications</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Kestrel-1 Telemetry Profile</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: 'Flight Endurance', value: '14+ Hours' },
              { label: 'Operational Ceiling', value: '45,000 FT' },
              { label: 'Combat Radius', value: '1,800 KM' },
              { label: 'Max Airspeed', value: 'Mach 0.85' },
              { label: 'Optics Resolution', value: '8K Ultra-HD' },
              { label: 'Payload Capacity', value: '150 KG' },
              { label: 'Radar Cross-Section', value: '< 0.001 m²' },
              { label: 'AI Processor', value: 'Dual TPU Edge Bus' },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#141414] p-8 md:p-10 rounded-lg border border-white/10 hover:border-[#00ff41]/30 transition-colors">
                <p className="text-[11px] uppercase tracking-wider text-white/50 mb-2 font-medium">{spec.label}</p>
                <p className="text-lg sm:text-xl font-bold text-[#00ff41] font-mono">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[#141414] text-center border-t border-white/10">
        <div className="site-container space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Learn why Sisko Aerospace is the ideal partner.
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Discover our commitment to defense engineering excellence, sovereign technology ownership, and agile development.
          </p>
          <div className="flex justify-center gap-5 flex-wrap pt-4">
            <Link
              href="/why-sisko"
              className="bg-[#00ff41] text-black px-8 py-3.5 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
            >
              Why Sisko Aerospace?
            </Link>
            <a
              href="mailto:sisko@duck.com?subject=Kestrel-1%20Procurement%20Inquiry"
              className="border border-white/30 text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-colors"
            >
              Procurement Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
