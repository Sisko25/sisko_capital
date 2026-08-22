import Image from 'next/image'
import Link from 'next/link'

export default function AviarsPage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-black"
        style={{
          backgroundImage: "url('/images/aviars-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '580px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className="relative z-10 site-container flex flex-col justify-end" style={{ minHeight: '580px', paddingBottom: '4.5rem' }}>
          <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-6">Flagship Technology</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
            A.V.I.A.R.S
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/85 font-mono max-w-3xl leading-relaxed">
            Autonomous Video &amp; Signal Aerial Recognition Software
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-28 md:py-40 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-8">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Software Architecture</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              The brain behind next-generation autonomous flight.
            </h2>
            <p className="text-white/70 text-base sm:text-lg md:text-xl leading-relaxed pt-2">
              A.V.I.A.R.S is Sisko Aerospace&apos;s proprietary artificial intelligence engine designed specifically for 
              unmanned aerial vehicles (UAVs) and reconnaissance assets. By combining multi-spectral computer vision, 
              radio frequency (RF) signal processing, and low-latency edge AI models, A.V.I.A.R.S turns raw sensor streams 
              into actionable tactical intelligence in milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 4 Core Technological Capabilities */}
      <section className="py-28 md:py-40 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="mb-16 md:mb-20 space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Capabilities Deep Dive</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Engineered for absolute air superiority.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            {/* Capability 1 */}
            <div className="bg-[#141414] border border-white/10 p-10 sm:p-12 md:p-14 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                01
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Real-Time Sensor Fusion</h3>
              <p className="text-white/70 text-base leading-relaxed">
                Fuses optical high-definition video, thermal infrared imagery, and synthetic aperture radar (SAR) feeds simultaneously at 120 FPS. Eliminates blind spots caused by smoke, fog, or night operations.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="bg-[#141414] border border-white/10 p-10 sm:p-12 md:p-14 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                02
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Autonomous Target Tracking</h3>
              <p className="text-white/70 text-base leading-relaxed">
                Utilizes deep neural networks to lock onto multiple hostile targets, naval vessels, and personnel simultaneously. Operates reliably in GPS-denied environments using visual inertial odometry.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="bg-[#141414] border border-white/10 p-10 sm:p-12 md:p-14 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                03
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Signal Encryption &amp; Hardened Uplink</h3>
              <p className="text-white/70 text-base leading-relaxed">
                Features quantum-resistant AES-256 encrypted telemetry and adaptive frequency-hopping spread spectrum (FHSS) radio links to maintain telemetry under aggressive electronic warfare (EW) jamming.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="bg-[#141414] border border-white/10 p-10 sm:p-12 md:p-14 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                04
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Edge AI Processing</h3>
              <p className="text-white/70 text-base leading-relaxed">
                Runs completely onboard the aircraft using custom Tensor processing units (TPUs), eliminating cloud dependency and latency. Decision loops complete in under 5 milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mission Profile: Recon & Attack */}
      <section className="py-28 md:py-40 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-4">Dual Operational Functions</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                  From Stealth Reconnaissance to Precision Engagement.
                </h2>
              </div>
              <div className="space-y-8 pt-4">
                <div className="border-l-2 border-[#00ff41] pl-8 py-2">
                  <h4 className="text-[#00ff41] font-bold text-lg mb-2 uppercase tracking-wider">1. Reconnaissance Mode (ISR)</h4>
                  <p className="text-white/70 text-base leading-relaxed">
                    Operates silent passive monitoring. Maps perimeter telemetry, detects unauthorized maritime intrusions, and automatically transmits encrypted threat coordinates to ground command centers.
                  </p>
                </div>
                <div className="border-l-2 border-red-600 pl-8 py-2">
                  <h4 className="text-red-500 font-bold text-lg mb-2 uppercase tracking-wider">2. Attack &amp; Kinetic Guidance Mode</h4>
                  <p className="text-white/70 text-base leading-relaxed">
                    Provides precision terminal guidance for strike platforms. Computes ballistic trajectories, laser target designation, and real-time damage assessment feeds with automated fail-safe abort protocols.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/aviars-edge.jpg"
                alt="AVIARS Edge Computing Module"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Table */}
      <section className="py-28 md:py-40 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Technical Specifications</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">System Telemetry Benchmarks</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {[
              { label: 'Inference Latency', value: '< 5 ms' },
              { label: 'Frame Rate', value: '120 FPS' },
              { label: 'Encryption', value: 'AES-256 Quantum-Safe' },
              { label: 'EW Resistance', value: 'MIL-STD-461G Jamming Proof' },
              { label: 'Multi-Target Tracking', value: 'up to 64 Targets' },
              { label: 'Power Consumption', value: '18W Peak' },
              { label: 'Operating Temp', value: '-40°C to +85°C' },
              { label: 'Architecture', value: 'Neuromorphic TPU Edge' },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#141414] p-8 md:p-10 rounded-xl border border-white/10 hover:border-[#00ff41]/40 transition-colors shadow-lg">
                <p className="text-xs uppercase tracking-wider text-white/50 mb-3 font-medium">{spec.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-[#00ff41] font-mono">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 md:py-40 bg-[#141414] text-center border-t border-white/10">
        <div className="site-container space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            See the future hardware platform.
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our upcoming full-fledged stealth drone equipped with dedicated optics and native A.V.I.A.R.S integration.
          </p>
          <div className="flex justify-center gap-6 flex-wrap pt-6">
            <Link
              href="/future"
              className="bg-[#00ff41] text-black px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]"
            >
              Our Future Platform
            </Link>
            <a
              href="mailto:sisko@duck.com?subject=AVIARS%20Technical%20Inquiry"
              className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-all"
            >
              Request Telemetry Brief
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
