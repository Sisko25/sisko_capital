import Image from 'next/image'
import Link from 'next/link'

export default function SingaporePage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-black min-h-[380px] sm:min-h-[480px] lg:min-h-[560px]"
        style={{
          backgroundImage: "url('/images/singapore-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className="relative z-10 site-container flex flex-col justify-end min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] pb-10 sm:pb-14 lg:pb-18 pt-16">
          <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-8">
            <Image src="/images/ndp61.png" alt="NDP 61" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 rounded" />
            <p className="text-[#c8102e] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[11px] sm:text-xs font-bold">
              Majulah Singapura — National Defense
            </p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 sm:mb-6 tracking-tight">
            WHY AVIARS IS PERFECT FOR SINGAPORE
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/80 font-mono max-w-3xl leading-snug">
            Securing the Singapore Strait and sovereign airspace with autonomous AI intelligence.
          </p>
        </div>
      </section>

      {/* Strategic Context */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-4 sm:space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Strategic Imperative</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Zero geographic depth requires instant situational awareness.
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
              With a total land area of just 734 square kilometers and sitting at the epicenter of the world&apos;s busiest maritime trade corridor, 
              Singapore cannot afford delays in threat detection. Traditional human-monitored surveillance is vulnerable to operator fatigue, 
              weather blind spots, and signal delay. A.V.I.A.R.S gives Singapore an instant, AI-driven defense dome capable of identifying airborne and maritime threats 
              before they cross sovereign boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 4 Pillars of Singapore Defense */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">National Security Pillars</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Engineered for Singapore&apos;s unique operational environment.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#c8102e] font-mono font-bold block">01 / Maritime Overwatch</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Singapore Strait &amp; Malacca Protection</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Automatically monitors over 130,000 commercial vessels annually passing through Singapore waters. Instantly flags dark-ship AIS transponder spoofing and unauthorized speed anomalies in real time.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">02 / All-Weather Sensors</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Tropical Heavy Rain &amp; Haze Penetration</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Singapore&apos;s tropical climate experiences intense monsoonal downpours and seasonal haze. AVIARS sensor fusion combines infrared thermal and synthetic radar feeds to maintain 100% clarity in zero-visibility weather.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">03 / Airspace Defense</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Ultra-Low Altitude Counter-Drone Defense</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Detects miniature hostile drones hovering near critical national infrastructure (Jurong Island, Changi Airport, naval bases) using high-frequency micro-Doppler radar and visual tracking.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#c8102e] font-mono font-bold block">04 / Sovereign Resilience</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">100% Local Sovereign Control</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Built and maintained by Sisko Aerospace LLP in Singapore. All sensitive intelligence data remains strictly on sovereign air-gapped networks, protected from international cloud leaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Benchmark Grid */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Impact Benchmarks</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Singapore Defense Readiness</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { label: 'Strait Coverage', value: '100% Continuous' },
              { label: 'Threat Reaction Time', value: '< 5 ms' },
              { label: 'Weather Operationality', value: 'All-Weather (24/7)' },
              { label: 'Cloud Leak Risk', value: '0% (Air-Gapped)' },
              { label: 'Multi-Sensor Streams', value: '120 FPS Fusion' },
              { label: 'Counter-Drone Range', value: '15 KM Early Warning' },
              { label: 'Sovereign IP Ownership', value: '100% Singapore' },
              { label: 'Deployment Status', value: 'Active R&D (2026)' },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#0a0a0a] p-6 sm:p-8 rounded-xl border border-white/10 hover:border-[#00ff41]/30 transition-colors">
                <p className="text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">{spec.label}</p>
                <p className="text-lg sm:text-xl font-bold text-[#00ff41] font-mono break-words">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patriotic Footer Banner */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a] text-center">
        <div className="site-container space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-3 bg-[#c8102e]/10 border border-[#c8102e]/30 px-4 py-1.5 rounded-full mb-1">
            <span className="w-2 h-2 rounded-full bg-[#c8102e]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#c8102e] font-bold">Majulah Singapura — SG61</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Partner with Sisko Aerospace.
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Contact our institutional defense procurement team for technical briefings, live telemetry demonstrations, and strategic partnership discussions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-6 max-w-md sm:max-w-none mx-auto">
            <a
              href="mailto:sisko@duck.com?subject=Singapore%20Defense%20Procurement%20Briefing"
              className="w-full sm:w-auto text-center bg-[#00ff41] text-black px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
            >
              Request Defense Briefing
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto text-center border border-white/30 text-white px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-colors"
            >
              Back to Command Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
