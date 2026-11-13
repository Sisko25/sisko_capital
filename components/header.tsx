'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { openProcurementModal } from '@/components/procurement-modal';

const navLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'About A.V.I.A.R.S', href: '/aviars' },
  { label: 'SA-1 Vanguard', href: '/vanguard' },
  { label: 'Why Sisko Aerospace?', href: '/why-sisko' },
  { label: 'Why AVIARS for Singapore', href: '/singapore' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main header bar */}
      <div className="bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-[1536px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 py-2">
              <Image
                src="/images/sisko-aerospace-logo.jpg"
                width={44}
                height={44}
                alt="Sisko Aerospace"
                className="w-9 h-9 sm:w-11 sm:h-11 invert rounded-lg shadow-md"
              />
              <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em]">
                Sisko Aerospace
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center lg:gap-4 xl:gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative uppercase text-[11px] xl:text-xs font-semibold tracking-[0.11em] whitespace-nowrap py-2 px-2 transition-colors duration-300 ${
                      isActive
                        ? 'text-[#00ff41]'
                        : 'text-white/80 hover:text-[#00ff41]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#00ff41]" />
                    )}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => openProcurementModal('Defense Procurement Briefing')}
                className="ml-2 rounded-lg bg-[#00ff41]/15 hover:bg-[#00ff41] border border-[#00ff41]/50 text-[#00ff41] hover:text-black px-3.5 py-2 text-[11px] font-mono font-bold uppercase tracking-[0.14em] transition-all whitespace-nowrap"
              >
                Procurement
              </button>
            </nav>

            {/* Mobile & Tablet hamburger button */}
            <button
              type="button"
              className="inline-flex lg:hidden items-center justify-center w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] text-white/85 hover:text-[#00ff41] hover:border-[#00ff41]/40 transition-colors duration-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle green accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent" />

      {/* Mobile & Tablet menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[66px] sm:top-[82px] bottom-0 bg-[#0a0a0a]/98 backdrop-blur-xl lg:hidden z-40 overflow-y-auto border-t border-white/10">
          <nav className="flex flex-col justify-between min-h-full px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-3 px-3">
                Navigation Directory
              </p>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-4 text-sm sm:text-base uppercase tracking-[0.14em] font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'text-[#00ff41] bg-[#00ff41]/10 border-[#00ff41]/40'
                        : 'text-white/85 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:text-[#00ff41]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className={isActive ? 'text-[#00ff41]' : 'text-white/30'}>→</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#00ff41]">
                  Sisko Aerospace LLP
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Sovereign AI Aerial Intelligence — Singapore
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProcurementModal('Procurement Inquiry');
                }}
                className="w-full sm:w-auto text-center bg-[#00ff41] text-black px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest"
              >
                Procurement Inquiry
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
