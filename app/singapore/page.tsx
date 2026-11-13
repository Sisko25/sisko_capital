import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SingaporeTacticalMap from '@/components/singapore-tactical-map'

export default function SingaporePage() {
  const coastalBases = [
    {
      code: 'HIVE-01 // WEST',
      name: 'Tuas Naval Base & Finger Pier Hive',
      sector: 'Western Strait & Malacca Funnel',
      detail:
        'Autonomous quad-ducted SA-1 launch cells positioned along Tuas Mega Port finger piers for immediate dark-ship and USV interdiction.',
    },
    {
      code: 'HIVE-02 // SOUTH-WEST',
      name: 'Jurong Island Coastal Battery',
      sector: 'Petrochemical & Refinery Perimeter',
      detail:
        'All-weather 120 FPS SAR + thermal overwatch dome shielding critical energy infrastructure against low-RCS micro-drone swarms.',
    },
    {
      code: 'CAMP-03 // NORTH-WEST',
      name: 'Tengah Air Base & Lim Chu Kang Camp',
      sector: 'High-Readiness Interceptor Wing',
      detail:
        'Rapid-scramble autonomous air defense squadron providing sub-30-second aerial intercept vectors across western and northern approaches.',
    },
    {
      code: 'HIVE-04 // NORTH',
      name: 'Sembawang Naval & Northern Coastal Hive',
      sector: 'Johor Strait Northern Overwatch',
      detail:
        'Continuous stereo visual-inertial and micro-Doppler surveillance across the northern maritime channel.',
    },
    {
      code: 'HIVE-05 // CENTRAL SOUTH',
      name: 'Marina Barrage & Sentosa Southern Hive',
      sector: 'Central Strait & CBD Urban Shield',
      detail:
        'Whisper-quiet serrated nacelle SA-1 units operating inside GPS-denied high-rise canyons with quantum-resistant AES-256 FHSS links.',
    },
    {
      code: 'HIVE-07 // EAST',
      name: 'Changi Naval Base & Paya Lebar Command',
      sector: 'Eastern Singapore Strait & Air Corridor',
      detail:
        'Air-gapped neuromorphic TPU command core and eastern maritime gate interdicting high-speed littoral threats in under 5 milliseconds.',
    },
  ]

  return (
    <>
      {/* Compact Luxury Defense-Tech Hero Header Above 3D Singapore Intercept Stage */}
      <section className="relative bg-[#060A11] border-b border-white/10 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(200, 16, 46, 0.10) 0%, rgba(0, 255, 65, 0.05) 45%, rgba(6, 10, 17, 0) 75%)',
          }}
        />
        <div className="relative z-10 site-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 w-fit">
              <Image
                src="/images/ndp61.png"
                alt="NDP 61"
                width={24}
                height={24}
                className="w-5 h-5 rounded"
              />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#c8102e] font-bold">
                MAJULAH SINGAPURA // SOVEREIGN DEFENSE DOME
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#00ff41]">
              SCROLL BELOW TO SCRAMBLE SA-1 DRONES FROM COASTAL HIVES &amp; SAF CAMPS
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4 sm:mb-5">
            WHY SINGAPORE
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-[#00ff41] font-mono max-w-4xl leading-relaxed mb-4">
            Coastal Autonomous Drone Hives &amp; Military Airbase Rapid-Intercept Network
          </p>
          <p className="text-white/75 text-sm sm:text-base md:text-lg max-w-4xl leading-relaxed">
            With just 734 km² of sovereign territory and zero strategic depth, Singapore requires
            autonomous defense assets pre-positioned around its coastline and military airbases.
            Scroll through the 3D command simulation below to see how SA-1 &ldquo;Vanguard&rdquo;
            drones scramble from coastal hives and SAF camps along real-time intercept trajectories
            to neutralize maritime and aerial threats before they reach shore.
          </p>
        </div>
      </section>

      {/* Interactive 3D Singapore Coastal Hive & Airbase Target Takedown Simulator */}
      <Suspense
        fallback={
          <div className="w-full h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] lg:h-[calc(100vh-6rem)] bg-[#060A11] border-y border-white/10" />
        }
      >
        <SingaporeTacticalMap />
      </Suspense>

      {/* Strategic Context & Coastal Hive Architecture */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#0a0a0a]">
        <div className="site-container">
          <div className="max-w-5xl space-y-4 sm:space-y-6 mb-14 sm:mb-20">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">
              Strategic Imperative &amp; Coastal Deployment
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Zero geographic depth requires instant coastal scramble.
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
              Sitting at the epicenter of the world&apos;s busiest maritime trade lane, Singapore
              cannot afford minutes of human operator delay. By housing SA-1 &ldquo;Vanguard&rdquo;
              interceptors inside weather-sealed coastal hives and SAF airbases around the island,
              A.V.I.A.R.S. creates a 360° autonomous perimeter—launching pincer intercept flights and
              computing terminal takedown trajectories in under 5 milliseconds.
            </p>
          </div>

          {/* 6 Coastal Hives & Military Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coastalBases.map((base) => (
              <div
                key={base.code}
                className="bg-[#12151E] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#00ff41]/45 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#00ff41] font-bold">
                      {base.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{base.name}</h3>
                  <p className="text-xs font-mono text-sky-400 mb-3">{base.sector}</p>
                  <p className="text-white/65 text-sm leading-relaxed">{base.detail}</p>
                </div>
              </div>
            ))}
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
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">
              National Security Pillars
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Singapore&apos;s unique operational environment.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#c8102e] font-mono font-bold block">
                01 / Maritime Overwatch
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Singapore Strait &amp; Malacca Protection
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Automatically monitors over 130,000 commercial vessels annually passing through
                Singapore waters. Instantly flags dark-ship AIS transponder spoofing and
                unauthorized speed anomalies in real time.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">
                02 / All-Weather Sensors
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Tropical Heavy Rain &amp; Haze Penetration
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Singapore&apos;s tropical climate experiences intense monsoonal downpours and
                seasonal haze. A.V.I.A.R.S. sensor fusion combines infrared thermal and synthetic
                radar feeds to maintain 100% clarity in zero-visibility weather.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#00ff41] font-mono font-bold block">
                03 / Airspace Defense
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Ultra-Low Altitude Counter-Drone Defense
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Detects miniature hostile drones hovering near critical national infrastructure
                (Jurong Island, Changi Airport, naval bases) using high-frequency micro-Doppler
                radar and visual tracking.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#141414] border border-white/10 p-6 sm:p-10 lg:p-12 rounded-xl hover:border-[#00ff41]/40 transition-all duration-300 space-y-4 sm:space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#c8102e] font-mono font-bold block">
                04 / Sovereign Resilience
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                100% Local Sovereign Control
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Built and maintained by Sisko Aerospace LLP in Singapore. All sensitive intelligence
                data remains strictly on sovereign air-gapped networks, protected from international
                cloud leaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Benchmark Grid */}
      <section className="py-16 sm:py-24 lg:py-36 bg-[#141414] border-y border-white/10">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <p className="text-[#00ff41] uppercase tracking-[0.2em] text-xs font-semibold">
              Impact Benchmarks
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Singapore Defense Readiness
            </h2>
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
              <div
                key={spec.label}
                className="bg-[#0a0a0a] p-6 sm:p-8 rounded-xl border border-white/10 hover:border-[#00ff41]/30 transition-colors"
              >
                <p className="text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">
                  {spec.label}
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#00ff41] font-mono break-words">
                  {spec.value}
                </p>
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
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#c8102e] font-bold">
              Majulah Singapura — SG61
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Partner with Sisko Aerospace.
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Contact our institutional defense procurement team for technical briefings, live
            telemetry demonstrations, and strategic partnership discussions.
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
