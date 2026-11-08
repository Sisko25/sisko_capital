import Image from 'next/image'
import Link from 'next/link'

export default function WhySiskoPage() {
  const comparisonRows = [
    { metric: 'Software Update Cycle', sisko: 'Weekly (OTA Edge Push)', legacy: '18 - 36 Months' },
    { metric: 'Sovereign IP Control', sisko: '100% Full Source Access', legacy: 'Restricted Black Box' },
    { metric: 'AI Decision Latency', sisko: '< 5 ms Onboard TPU', legacy: 'Cloud Dependent (150ms+)' },
    { metric: 'Unit Cost Efficiency', sisko: 'Asymmetric (High Scale)', legacy: 'Exquisite (Low Volume)' },
    { metric: 'GPS-Denied Navigation', sisko: 'Visual Inertial Neural Fusion', legacy: 'Basic Dead Reckoning' },
  ];

  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-black min-h-[380px] sm:min-h-[480px] lg:min-h-[560px]"
        style={{
          backgroundImage: "url('/images/why-sisko-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className="relative z-10 site-container flex flex-col justify-end min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] pb-10 sm:pb-14 lg:pb-18 pt-16">
          <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-4 sm:mb-6">Strategic Advantage</p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 sm:mb-6 tracking-tight">
            WHY SISKO AEROSPACE?
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/80 font-mono max-w-3xl leading-snug">
            Sovereign AI defense engineering built for the next century of autonomous warfare.
          </p>
        </div>
      </section>

      {/* Executive Overview */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-4 sm:space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Value Proposition</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Redefining how sovereign nations build &amp; control defense technology.
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
              Traditional defense procurement relies on multi-billion dollar legacy primes with decades-long development timelines
              and closed, foreign black-box software architecture. Sisko Aerospace LLP disrupts this paradigm by offering 
              agile, sovereign, software-defined aerial defense platforms designed, tested, and manufactured locally in Singapore.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 4 Core Differentiators */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Core Differentiators</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Why institutional partners choose Sisko.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">01 / Independence</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">100% Sovereign IP &amp; Local Ownership</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Zero foreign ITAR restrictions, external kill-switches, or black-box dependencies. Every neural network, flight control loop, and encryption module is written and owned in Singapore.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">02 / Agility</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Agile Hardware &amp; AI Development</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                We iterate software models in weeks and hardware airframes in months, bringing commercial Silicon Valley velocity to military-grade defense systems.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">03 / Asymmetry</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Cost-Effective Asymmetric Swarms</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Deploy 100 autonomous AI-networked drones for the cost of a single legacy fighter jet. Overwhelm conventional air defense networks with coordinated autonomous swarm tactics.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">04 / Precision</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Optimized for Singapore Geography</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Tailored specifically for dense tropical maritime straits, high-frequency littoral radar environments, and Singapore&apos;s urban terrain requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Matrix */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Industry Comparison</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Sisko Aerospace vs. Legacy Defense Primes</h2>
          </div>

          {/* Mobile Stacked Cards (< md) */}
          <div className="space-y-4 md:hidden">
            {comparisonRows.map((row, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-3">
                <p className="text-sm font-bold text-white border-b border-white/10 pb-2.5">{row.metric}</p>
                <div className="grid grid-cols-1 gap-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between gap-3 bg-[#00ff41]/[0.06] border border-[#00ff41]/25 rounded-lg px-3.5 py-2.5">
                    <span className="text-white/60 uppercase tracking-wider text-[10px]">Sisko Aerospace</span>
                    <span className="text-[#00ff41] font-bold text-right">{row.sisko}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-3.5 py-2">
                    <span className="text-white/40 uppercase tracking-wider text-[10px]">Legacy Primes</span>
                    <span className="text-white/50 text-right">{row.legacy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table (md+) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10 bg-[#0a0a0a]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-wider text-white/50 bg-white/[0.02]">
                  <th className="py-5 px-6">Capability Metric</th>
                  <th className="py-5 px-6 text-[#00ff41]">Sisko Aerospace</th>
                  <th className="py-5 px-6 text-white/40">Legacy Defense Primes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 font-semibold text-white">{row.metric}</td>
                    <td className="py-5 px-6 text-[#00ff41] font-mono font-bold">{row.sisko}</td>
                    <td className="py-5 px-6 text-white/40 font-mono">{row.legacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a] text-center">
        <div className="site-container space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            See why AVIARS is built for Singapore.
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Read our deep dive into how A.V.I.A.R.S directly protects Singapore&apos;s maritime trade routes and sovereign airspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-6 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/singapore"
              className="w-full sm:w-auto text-center bg-[#00ff41] text-black px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
            >
              Why AVIARS for Singapore
            </Link>
            <a
              href="mailto:sisko@duck.com?subject=Strategic%20Partnership%20Inquiry"
              className="w-full sm:w-auto text-center border border-white/30 text-white px-8 sm:px-10 py-4 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-colors"
            >
              Partner Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
