import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="site-container py-24 md:py-32">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
          {/* Logo + Info + Socials */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-4">
              <Image
                src="/images/sisko-aerospace-logo.jpg"
                width={48}
                height={48}
                alt="Sisko Aerospace"
                className="invert rounded-lg shadow-md"
              />
              <span className="text-white text-xl font-bold tracking-wide">
                Sisko Aerospace
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Sovereign AI-powered aerial intelligence, real-time multi-spectral sensor fusion, and autonomous defense solutions engineered in Singapore.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-3">
              <a
                href="https://www.instagram.com/sisko.aero/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@SiskoAerospacellp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://sg.linkedin.com/company/sisko-capital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-16">
            {/* Column 1 — Platform */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-[0.2em] text-[#00ff41] mb-6">
                Platform
              </h4>
              <div className="space-y-3.5">
                <Link href="/about" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  About Us
                </Link>
                <Link href="/aviars" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  AVIARS
                </Link>
                <Link href="/future" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  Our Future
                </Link>
              </div>
            </div>

            {/* Column 2 — Company */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-[0.2em] text-[#00ff41] mb-6">
                Company
              </h4>
              <div className="space-y-3.5">
                <Link href="/why-sisko" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  Why Sisko?
                </Link>
                <Link href="/singapore" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  Why Singapore?
                </Link>
                <a href="mailto:sisko@duck.com?subject=Procurement%20Inquiry" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  Procurement
                </a>
              </div>
            </div>

            {/* Column 3 — Connect */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-[0.2em] text-[#00ff41] mb-6">
                Connect
              </h4>
              <div className="space-y-3.5">
                <a href="https://www.instagram.com/sisko.aero/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  Instagram
                </a>
                <a href="https://www.youtube.com/@SiskoAerospacellp" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  YouTube
                </a>
                <a href="https://sg.linkedin.com/company/sisko-capital" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#00ff41] transition block">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* NDP 61 Badge */}
          <div className="flex flex-col items-start lg:items-end justify-start">
            <Image
              src="/images/ndp61.png"
              width={90}
              height={90}
              alt="NDP 61"
              className="rounded-xl opacity-90 shadow-xl border border-white/10"
            />
            <span className="text-xs uppercase tracking-widest text-[#c8102e] font-bold mt-3">Majulah Singapura</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40">
            © 2026 Sisko Aerospace LLP. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span>Sovereign Singapore Defense Technology</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
