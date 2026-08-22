import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* SECTION 1 — Hero Banner */}
      <section className="hero-banner relative bg-black flex flex-col justify-between items-center text-center" style={{ backgroundImage: "url('/images/hero-banner.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
        <div className="hero-banner-overlay absolute inset-0 bg-black/60"></div>
        
        {/* Empty top spacing for header */}
        <div className="h-24"></div>

        {/* Hero Central Content */}
        <div className="hero-banner-content relative z-10 container mx-auto px-6 py-12 flex justify-center text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-4xl mx-auto text-center">
            <Image src="/images/ndp61.png" alt="NDP 61" width={80} height={80} className="rounded-xl shrink-0 shadow-2xl border border-white/20" />
            <div className="text-center sm:text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-[#c8102e] font-bold mb-2">Majulah Singapura</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-md">Happy 61st Birthday, Singapore</h2>
            </div>
          </div>
        </div>

        {/* Scroll Chevron - Positioned safely at bottom */}
        <div className="relative z-10 pb-12 flex flex-col items-center justify-center text-center mx-auto">
          <p className="text-xs text-white/80 uppercase tracking-[0.25em] font-semibold mb-3">Scroll for More</p>
          <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto" style={{ animation: 'bounce-chevron 2s infinite' }}>
            <path d="M7.35 9L15 16.417L22.65 9L25 11.2834L15 21L5 11.2834L7.35 9Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* SECTION 2 — Statement Block */}
      <section className="statement-block py-36 md:py-48 bg-black text-center">
        <div className="site-container">
          <p className="statement-block-label text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-6">Who We Are</p>
          <h2 className="statement-block-heading text-white font-bold max-w-4xl mx-auto mb-12 text-3xl sm:text-4xl md:text-5xl leading-tight">
            Defining the future of aerial intelligence.
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 pt-4">
            <Link href="/about" className="text-sm uppercase tracking-widest text-white/70 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]">About Us</Link>
            <Link href="/aviars" className="text-sm uppercase tracking-widest text-white/70 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]">About A.V.I.A.R.S</Link>
            <Link href="/future" className="text-sm uppercase tracking-widest text-white/70 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]">Our Future</Link>
            <Link href="/why-sisko" className="text-sm uppercase tracking-widest text-white/70 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]">Why Sisko Aerospace?</Link>
            <Link href="/singapore" className="text-sm uppercase tracking-widest text-white/70 hover:text-[#00ff41] transition-colors border-b border-white/20 pb-1.5 hover:border-[#00ff41]">Why AVIARS for Singapore</Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Feature Carousel (5 horizontal cards) */}
      <section className="py-28 md:py-36 bg-[#141414] overflow-hidden border-y border-white/10">
        <div className="site-container mb-10">
          <p className="text-[#00ff41] uppercase tracking-[0.25em] text-xs font-semibold mb-3">Capabilities &amp; Platforms</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Mission Focus Areas</h2>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '2.5rem', padding: '0 2.5rem', scrollSnapType: 'x mandatory' }} className="hide-scrollbar">
          {[
            { category: 'AVIARS Platform', title: 'AI-Powered Detection', image: '/images/card-ai-detection.jpg', href: '/aviars' },
            { category: 'Autonomous Systems', title: 'Next-Gen Reconnaissance', image: '/images/card-drone-future.jpg', href: '/future' },
            { category: 'Edge Computing', title: 'Real-Time Sensor Fusion', image: '/images/card-sensor-fusion.jpg', href: '/aviars' },
            { category: 'Regional Defense', title: "Singapore's Next-Gen Defense", image: '/images/card-singapore-defense.jpg', href: '/singapore' },
            { category: 'Mission Solutions', title: 'Why Sisko Aerospace?', image: '/images/card-why-sisko.jpg', href: '/why-sisko' },
          ].map((card, i) => (
            <Link
              key={i}
              href={card.href}
              style={{
                flex: '0 0 calc(33.333% - 2rem)',
                minWidth: '380px',
                height: '420px',
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'block',
                scrollSnapAlign: 'start',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textDecoration: 'none',
              }}
              className="group hover:border-[#00ff41]/50 transition-all duration-300 shadow-2xl"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 80vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', zIndex: 1 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem', zIndex: 2 }}>
                <p style={{ color: '#00ff41', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {card.category}
                </p>
                <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.2 }}>
                  {card.title}
                </h3>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  Learn More
                  <svg width="12" height="12" viewBox="0 0 15 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99388 11.6127L0.48224 20.1243L3.24954 22.8916L11.7612 14.38L14.3801 11.761L11.6129 8.99371L2.61914 0L0.00017293 2.61897L8.99388 11.6127Z" fill="#00ff41"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4 — CTA Banner */}
      <section className="py-36 md:py-48 bg-[#0a0a0a] text-center">
        <div className="site-container">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 max-w-3xl mx-auto leading-tight">
            Ready to deploy next-generation aerial intelligence?
          </h2>
          <div className="flex justify-center gap-6 flex-wrap pt-4">
            <Link href="/aviars" className="bg-[#00ff41] text-black px-10 py-4 font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,255,65,0.4)]">
              Platform Telemetry
            </Link>
            <a href="mailto:sisko@duck.com?subject=Procurement%20Inquiry" className="border border-white/40 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs rounded hover:bg-white hover:text-black transition-all">
              Procurement Inquiry
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
