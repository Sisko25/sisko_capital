import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="site-container py-16">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Logo + Info + Socials */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/images/sisko-aerospace-logo.jpg"
                width={40}
                height={40}
                alt="Sisko Aerospace"
                className="invert rounded"
              />
              <span className="text-white text-lg font-semibold tracking-wide">
                Sisko Aerospace
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Sovereign AI-powered aerial intelligence, real-time multi-spectral sensor fusion, and autonomous defense solutions engineered in Singapore.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/sisko.aero/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@SiskoAerospacellp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://sg.linkedin.com/company/sisko-capital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00ff41] hover:border-[#00ff41]/40 hover:bg-[#00ff41]/10 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {/* Column 1 — Platform */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-wider text-white mb-4">
                Platform
              </h4>
              <Link href="/about" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                About Us
              </Link>
              <Link href="/aviars" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                AVIARS
              </Link>
              <Link href="/future" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                Our Future
              </Link>
            </div>

            {/* Column 2 — Company */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-wider text-white mb-4">
                Company
              </h4>
              <Link href="/why-sisko" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                Why Sisko?
              </Link>
              <Link href="/singapore" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                Why Singapore?
              </Link>
              <a href="mailto:sisko@duck.com?subject=Procurement%20Inquiry" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                Procurement
              </a>
            </div>

            {/* Column 3 — Legal */}
            <div>
              <h4 className="uppercase text-xs font-bold tracking-wider text-white mb-4">
                Connect
              </h4>
              <a href="https://www.instagram.com/sisko.aero/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                Instagram
              </a>
              <a href="https://www.youtube.com/@SiskoAerospacellp" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                YouTube
              </a>
              <a href="https://sg.linkedin.com/company/sisko-capital" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2.5">
                LinkedIn
              </a>
            </div>
          </div>

          {/* NDP 61 Badge */}
          <div className="flex flex-col items-start lg:items-end justify-start">
            <Image
              src="/images/ndp61.png"
              width={80}
              height={80}
              alt="NDP 61"
              className="rounded-lg opacity-85 shadow-lg border border-white/10"
            />
            <span className="text-[11px] uppercase tracking-widest text-[#c8102e] font-bold mt-2">Majulah Singapura</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Sisko Aerospace LLP. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Sovereign Singapore Defense Tech</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
