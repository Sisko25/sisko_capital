import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="site-container py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Logo + Name */}
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

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Column 1 — Platform */}
            <div>
              <h4 className="uppercase text-sm font-bold tracking-wider text-white mb-4">
                Platform
              </h4>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                About Us
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                AVIARS
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Our Future
              </Link>
            </div>

            {/* Column 2 — Company */}
            <div>
              <h4 className="uppercase text-sm font-bold tracking-wider text-white mb-4">
                Company
              </h4>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Why Sisko?
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Why Singapore?
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Procurement
              </Link>
            </div>

            {/* Column 3 — Legal */}
            <div>
              <h4 className="uppercase text-sm font-bold tracking-wider text-white mb-4">
                Legal
              </h4>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Terms of Use
              </Link>
              <Link href="#" className="text-sm text-white/60 hover:text-[#00ff41] transition block mb-2">
                Contact Us
              </Link>
            </div>
          </div>

          {/* NDP 61 Badge */}
          <div>
            <Image
              src="/images/ndp61.png"
              width={80}
              height={80}
              alt="NDP 61"
              className="rounded-lg opacity-80"
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-white/40">
            © 2026 Sisko Aerospace LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
