import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AviarsBattlefieldViewer from '@/components/aviars-battlefield-viewer'

export default function AviarsPage() {
  return (
    <>
      {/* Hero Header — Compact Luxury Intro Above Interactive 3D POV Stage */}
      <section className="relative bg-[#07090D] border-b border-white/10 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0, 255, 65, 0.08) 0%, rgba(7, 9, 13, 0) 70%)',
          }}
        />
        <div className="relative z-10 site-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] shrink-0" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#00ff41] font-semibold">
                FLAGSHIP AUTONOMOUS AI ENGINE // A.V.I.A.R.S.
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/50">
              SCROLL BELOW TO ENTER SA-1 CAMERA POV // LAND • AIR • NAVAL
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4 sm:mb-5">
            A.V.I.A.R.S
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-[#00ff41] font-mono max-w-3xl leading-relaxed mb-4">
            Autonomous Video &amp; Signal Aerial Recognition Software
          </p>
          <p className="text-white/75 text-sm sm:text-base md:text-lg max-w-4xl leading-relaxed">
            A.V.I.A.R.S is Sisko Aerospace&apos;s proprietary artificial intelligence engine designed
            specifically for unmanned aerial vehicles (UAVs) and reconnaissance assets. By combining
            multi-spectral computer vision, radio frequency (RF) signal processing, and low-latency
            edge AI models, A.V.I.A.R.S turns raw sensor streams into actionable tactical
            intelligence in milliseconds.
          </p>
        </div>
      </section>

      {/* Interactive 3D SA-1 Drone → First-Person Camera POV Battlefield Simulator */}
      <Suspense
        fallback={
          <div className="w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] bg-[#090B10] border-y border-white/10" />
        }
      >
        <AviarsBattlefieldViewer />
      </Suspense>

      {/* Executive Summary */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-5 sm:space-y-8">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Software Architecture</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              The brain behind next-generation autonomous flight.
            </h2>
            <p className="text-white/70 text-sm sm:text-lg md:text-xl leading-relaxed pt-1">
              Engineered to run 100% onboard the SA-1 &ldquo;Vanguard&rdquo; without external cloud
              dependencies, A.V.I.A.R.S. fuses 4K sapphire optical imagery, thermal infrared,
              solid-state LiDAR, and synthetic aperture radar (SAR) streams at 120 FPS—executing
              autonomous target recognition, GPS-denied visual-inertial navigation, and precision
              terminal guidance in under 5 milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 4 Core Technological Capabilities */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Capabilities Deep Dive</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Engineered for absolute air superiority.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Capability 1 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-6 sm:mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5">Real-Time Sensor Fusion</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Fuses optical high-definition video, thermal infrared imagery, and synthetic aperture radar (SAR) feeds simultaneously at 120 FPS. Eliminates blind spots caused by smoke, fog, or night operations.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-6 sm:mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5">Autonomous Target Tracking</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Utilizes deep neural networks to lock onto multiple hostile targets, naval vessels, and personnel simultaneously. Operates reliably in GPS-denied environments using visual inertial odometry.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-6 sm:mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5">Signal Encryption &amp; Hardened Uplink</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Features quantum-resistant AES-256 encrypted telemetry and adaptive frequency-hopping spread spectrum (FHSS) radio links to maintain telemetry under aggressive electronic warfare (EW) jamming.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/50 transition-all duration-300 shadow-xl group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg flex items-center justify-center text-[#00ff41] font-mono text-sm font-bold mb-6 sm:mb-8 group-hover:bg-[#00ff41] group-hover:text-black transition-colors">
                04
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5">Edge AI Processing</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Runs completely onboard the aircraft using custom Tensor processing units (TPUs), eliminating cloud dependency and latency. Decision loops complete in under 5 milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mission Profile: Recon & Attack */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-3 sm:mb-4">Dual Operational Functions</p>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                  From Stealth Reconnaissance to Precision Engagement.
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8 pt-2">
                <div className="border-l-2 border-[#00ff41] pl-5 sm:pl-8 py-1.5">
                  <h4 className="text-[#00ff41] font-bold text-base sm:text-lg mb-2 uppercase tracking-wider">1. Reconnaissance Mode (ISR)</h4>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    Operates silent passive monitoring. Maps perimeter telemetry, detects unauthorized maritime intrusions, and automatically transmits encrypted threat coordinates to ground command centers.
                  </p>
                </div>
                <div className="border-l-2 border-red-600 pl-5 sm:pl-8 py-1.5">
                  <h4 className="text-red-500 font-bold text-base sm:text-lg mb-2 uppercase tracking-wider">2. Attack &amp; Kinetic Guidance Mode</h4>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
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
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Table */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold">Technical Specifications</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">System Telemetry Benchmarks</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
              <div key={spec.label} className="bg-[#141414] p-6 sm:p-8 rounded-xl border border-white/10 hover:border-[#00ff41]/40 transition-colors shadow-lg">
                <p className="text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">{spec.label}</p>
                <p className="text-lg sm:text-xl font-bold text-[#00ff41] font-mono break-words">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#141414] text-center border-t border-white/10">
        <div className="site-container space-y-5 sm:space-y-7">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Experience A.V.I.A.R.S. onboard the SA-1 &ldquo;Vanguard&rdquo;.
          </h2>
          <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the interactive 3D exploded view of our low-observable tactical micro-UAV with native A.V.I.A.R.S. edge autonomy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-6 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/vanguard"
              className="w-full sm:w-auto text-center bg-[#00ff41] text-black px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]"
            >
              Explore SA-1 &ldquo;Vanguard&rdquo;
            </Link>
            <a
              href="mailto:sisko@duck.com?subject=AVIARS%20Technical%20Inquiry"
              className="w-full sm:w-auto text-center border border-white/30 text-white px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-all"
            >
              Request Telemetry Brief
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
