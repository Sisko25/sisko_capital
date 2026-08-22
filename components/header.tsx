'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'About A.V.I.A.R.S', href: '/aviars' },
  { label: 'Our Future', href: '/future' },
  { label: 'Why Sisko Aerospace?', href: '/why-sisko' },
  { label: 'Why AVIARS for Singapore', href: '/singapore' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main header bar */}
      <div className="bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center py-2 px-1">
              <Image
                src="/images/sisko-aerospace-logo.jpg"
                width={48}
                height={48}
                alt="Sisko Aerospace"
                className="invert rounded-lg shadow-md"
              />
            </Link>

            {/* Desktop navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '0.5rem 0.75rem',
                      letterSpacing: '0.12em',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}
                    className={`relative uppercase text-xs font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-[#00ff41]'
                        : 'text-white/80 hover:text-[#00ff41]'
                    }`}
                  >
                    {link.label}
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff41]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile hamburger button */}
            <button
              type="button"
              className="block md:hidden text-white/80 hover:text-[#00ff41] transition-colors duration-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                /* Close icon */
                <svg
                  className="w-6 h-6"
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
                /* Hamburger icon */
                <svg
                  className="w-6 h-6"
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[66px] bg-black/95 backdrop-blur-lg md:hidden z-40">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative uppercase text-lg tracking-widest transition-colors duration-300 ${
                    isActive
                      ? 'text-[#00ff41]'
                      : 'text-white/80 hover:text-[#00ff41]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00ff41]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
