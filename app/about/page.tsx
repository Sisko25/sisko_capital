import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-black"
        style={{
          backgroundImage: "url('/images/about-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '520px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
        <div className="relative z-10 site-container flex flex-col justify-end" style={{ minHeight: '520px', paddingBottom: '3.5rem' }}>
          <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-6">Who We Are</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.2] max-w-3xl tracking-tight">
            Pioneering the future of autonomous aerial intelligence.
          </h1>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            
            {/* Our Mission */}
            <div className="space-y-8">
              <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Our Mission</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug tracking-tight">
                Protecting Singapore through innovation.
              </h2>
              <p className="text-white/70 text-base leading-relaxed pt-2">
                Sisko Aerospace LLP is a Singapore-based defense technology company dedicated to
                developing advanced AI-powered detection and reconnaissance systems. Founded with the
                vision of strengthening Singapore&apos;s national defense capabilities, we combine
                cutting-edge artificial intelligence with autonomous aerial platforms to deliver
                next-generation surveillance and threat detection solutions.
              </p>
            </div>

            {/* Our Vision */}
            <div className="space-y-8">
              <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Our Vision</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug tracking-tight">
                A smarter, safer nation.
              </h2>
              <p className="text-white/70 text-base leading-relaxed pt-2">
                We envision a future where autonomous AI systems work alongside Singapore&apos;s
                armed forces to provide real-time situational awareness across land, sea, and air.
                Our flagship platform, A.V.I.A.R.S, represents a paradigm shift in how nations
                approach reconnaissance — moving from reactive surveillance to predictive,
                AI-driven intelligence that anticipates threats before they materialize.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="site-container">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-6">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">Core Values</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">What drives us forward.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                number: '01',
                title: 'Innovation First',
                description:
                  'We push the boundaries of what AI can achieve in defense applications. Every system we build is designed to outperform legacy solutions by orders of magnitude.',
              },
              {
                number: '02',
                title: 'National Security',
                description:
                  "Singapore's safety is our north star. We develop technology specifically optimized for the unique geographic and strategic challenges our nation faces.",
              },
              {
                number: '03',
                title: 'Operational Excellence',
                description:
                  'From edge computing to real-time sensor fusion, every component of our systems is engineered for reliability under the most demanding operational conditions.',
              },
            ].map((value) => (
              <div
                key={value.number}
                className="bg-[#141414] border border-white/10 p-8 md:p-10 rounded-lg hover:border-[#00ff41]/40 transition-all duration-300 group"
              >
                <span className="text-4xl font-mono font-bold text-[#00ff41]/40 group-hover:text-[#00ff41] transition-colors duration-300">
                  {value.number}
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-6">{value.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { stat: '2026', label: 'Founded' },
              { stat: 'SG', label: 'Headquarters' },
              { stat: 'AVIARS', label: 'Flagship Platform' },
              { stat: '24/7', label: 'Operational Readiness' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#00ff41] font-mono tracking-tight">{item.stat}</p>
                <p className="text-xs uppercase tracking-widest text-white/50 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] text-center">
        <div className="site-container space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Explore our flagship platform.
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Learn how A.V.I.A.R.S is redefining autonomous aerial reconnaissance with real-time
            AI-powered detection, sensor fusion, and edge computing.
          </p>
          <div className="flex justify-center gap-5 flex-wrap pt-4">
            <Link
              href="/aviars"
              className="bg-[#00ff41] text-black px-8 py-3.5 font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-colors"
            >
              About AVIARS
            </Link>
            <Link
              href="/future"
              className="border border-white/30 text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs rounded hover:bg-white hover:text-black transition-colors"
            >
              Our Future
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
