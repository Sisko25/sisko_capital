import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* SECTION 1 — Hero Banner */}
      <section
        className="hero-banner relative bg-black flex flex-col justify-between items-center text-center min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] lg:min-h-[calc(100vh-6rem)]"
        style={{
          backgroundImage: "url('/images/hero-banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-banner-overlay absolute inset-0 bg-black/60" />

        {/* Top balance spacer */}
        <div className="h-8 sm:h-16" />

        {/* Hero Central Content */}
        <div className="hero-banner-content relative z-10 site-container py-8 sm:py-12 flex justify-center text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 max-w-4xl mx-auto text-center bg-black/45 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none px-6 py-6 sm:p-0 rounded-2xl border border-white/10 sm:border-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md">
              <Image
                src="/images/diya.svg"
                alt="Deepavali Diya"
                width={72}
                height={72}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400 font-bold mb-1.5 sm:mb-2">
                Festival of Lights
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
                Happy Deepavali
              </h1>
            </div>
          </div>
        </div>

        {/* Scroll Chevron - Positioned safely at bottom */}
        <div className="relative z-10 pb-8 sm:pb-12 flex flex-col items-center justify-center text-center mx-auto">
          <p className="text-[11px] sm:text-xs text-white/80 uppercase tracking-[0.25em] font-semibold mb-2.5 sm:mb-3">
            Scroll for More
          </p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
            style={{ animation: 'bounce-chevron 2s infinite' }}
          >
            <path d="M7.35 9L15 16.417L22.65 9L25 11.2834L15 21L5 11.2834L7.35 9Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* SECTION 2 — Statement Block */}
      <section className="statement-block py-20 sm:py-28 lg:py-44 bg-black text-center">
        <div className="site-container">
          <p className="statement-block-label text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-4 sm:mb-6">
            Who We Are
          </p>
          <h2 className="statement-block-heading text-white font-bold max-w-4xl mx-auto mb-8 sm:mb-12 text-2xl sm:text-4xl md:text-5xl leading-tight">
            Defining the future of aerial intelligence.
          </h2>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-8 md:gap-12 pt-2 sm:pt-4">
            <Link
              href="/about"
              className="text-xs sm:text-sm uppercase tracking-widest text-white/75 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]"
            >
              About Us
            </Link>
            <Link
              href="/aviars"
              className="text-xs sm:text-sm uppercase tracking-widest text-white/75 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]"
            >
              About A.V.I.A.R.S
            </Link>
            <Link
              href="/vanguard"
              className="text-xs sm:text-sm uppercase tracking-widest text-white/75 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]"
            >
              SA-1 &ldquo;Vanguard&rdquo;
            </Link>
            <Link
              href="/why-sisko"
              className="text-xs sm:text-sm uppercase tracking-widest text-white/75 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]"
            >
              Why Sisko Aerospace?
            </Link>
            <Link
              href="/singapore"
              className="text-xs sm:text-sm uppercase tracking-widest text-white/75 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]"
            >
              Why AVIARS for Singapore
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Feature Carousel (5 horizontal cards) */}
      <section className="py-20 sm:py-28 lg:py-36 bg-[#141414] overflow-hidden border-y border-white/10">
        <div className="site-container mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-2 sm:mb-3">
              Capabilities &amp; Platforms
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Mission Focus Areas
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-white/45 lg:hidden">
            Swipe to explore →
          </p>
        </div>
        <div className="flex overflow-x-auto gap-5 sm:gap-7 lg:gap-10 px-5 sm:px-8 lg:px-10 pb-4 snap-x snap-mandatory hide-scrollbar">
          {[
            { category: 'Tactical Stealth Micro-UAV', title: 'SA-1 "Vanguard"', image: '/images/card-drone-future.jpg', href: '/vanguard' },
            { category: 'AVIARS Platform', title: 'AI-Powered Detection', image: '/images/card-ai-detection.jpg', href: '/aviars' },
            { category: 'Edge Computing', title: 'Real-Time Sensor Fusion', image: '/images/card-sensor-fusion.jpg', href: '/aviars' },
            { category: 'Regional Defense', title: "Singapore's Next-Gen Defense", image: '/images/card-singapore-defense.jpg', href: '/singapore' },
            { category: 'Mission Solutions', title: 'Why Sisko Aerospace?', image: '/images/card-why-sisko.jpg', href: '/why-sisko' },
          ].map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="flex-none w-[82vw] max-w-[330px] sm:w-[350px] sm:max-w-none lg:w-[calc(33.333%-1.75rem)] lg:min-w-[360px] h-[350px] sm:h-[420px] relative rounded-xl overflow-hidden block snap-start border border-white/10 group hover:border-[#00ff41]/50 transition-all duration-300 shadow-2xl"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-[2]">
                <p className="text-[#00ff41] text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold mb-2">
                  {card.category}
                </p>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 leading-snug">
                  {card.title}
                </h3>
                <span className="text-white/85 text-xs uppercase tracking-[0.1em] inline-flex items-center gap-2 font-semibold">
                  Learn More
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.99388 11.6127L0.48224 20.1243L3.24954 22.8916L11.7612 14.38L14.3801 11.761L11.6129 8.99371L2.61914 0L0.00017293 2.61897L8.99388 11.6127Z"
                      fill="#00ff41"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4 — CTA Banner */}
      <section className="py-20 sm:py-28 lg:py-44 bg-[#0a0a0a] text-center">
        <div className="site-container">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-12 max-w-3xl mx-auto leading-tight">
            Ready to deploy next-generation aerial intelligence?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/aviars"
              className="w-full sm:w-auto text-center bg-[#00ff41] text-black px-8 sm:px-10 py-4 font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]"
            >
              Platform Telemetry
            </Link>
            <a
              href="mailto:sisko@duck.com?subject=Procurement%20Inquiry"
              className="w-full sm:w-auto text-center border border-white/40 text-white px-8 sm:px-10 py-4 font-bold uppercase tracking-widest text-xs rounded hover:bg-white hover:text-black transition-all"
            >
              Procurement Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
