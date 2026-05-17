"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Shield, Target, Compass, Award, Brain, Info, Sparkles, TrendingUp, Zap, HelpCircle } from "lucide-react"

export default function PhilosophyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─────────────────────────── NAVBAR ─────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/20 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl transition-all duration-500 group-hover:bg-primary/40" />
              <Image
                src="/images/sisko-capital-logo-final.png"
                alt="Sisko Capital"
                width={48}
                height={48}
                className="relative h-12 w-12 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground">Sisko Capital</span>
          </Link>

          <nav className="hidden gap-2 md:flex">
            <Link
              href="/"
              className="group relative rounded-full px-4 py-2 transition-all duration-350 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-350 group-hover:opacity-100" />
              <span className="relative text-sm font-medium text-muted-foreground transition-colors duration-350 group-hover:text-foreground">
                Home
              </span>
            </Link>
            <Link
              href="/intelligence"
              className="group relative rounded-full px-4 py-2 transition-all duration-350 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-350 group-hover:opacity-100" />
              <span className="relative text-sm font-medium text-muted-foreground transition-colors duration-350 group-hover:text-foreground">
                Intelligence
              </span>
            </Link>
            <Link href="/philosophy" className="group relative rounded-full px-4 py-2 transition-all duration-350">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-xl" />
              <span className="relative text-sm font-medium text-foreground">Philosophy</span>
            </Link>
            <Link
              href="/how-it-works"
              className="group relative rounded-full px-4 py-2 transition-all duration-350 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-350 group-hover:opacity-100" />
              <span className="relative text-sm font-medium text-muted-foreground transition-colors duration-350 group-hover:text-foreground">
                How It Works
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative px-6 pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="container mx-auto text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-2xl backdrop-blur-xl">
              <Compass className="h-4 w-4 text-primary animate-spin-slow" />
              <span className="text-sm font-medium text-card-foreground">Our Investment Philosophy</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              <span className="mb-2 block text-foreground">Conviction-Driven</span>
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Systematic Alpha Generation
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              We reject short-term speculation. Instead, Sisko Capital operates on a foundation of scientific inquiry, market regime-awareness, and absolute structural discipline.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CORE PILLARS ─────────────────────────── */}
      <section className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">First Principles of Sisko Capital</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Four fundamental rules guiding our capital deployment and risk mitigation frameworks.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {[
              {
                icon: Brain,
                title: "First Principles Thinking",
                description: "We view financial markets as complex adaptive systems, not rational machines. Price discovery is driven by flows, institutional constraints, and human behavior. Sisko Capital exploits structural anomalies arising from index tracking, margin constraints, and liquidity requirements.",
                gradient: "bg-gradient-brand-blue",
              },
              {
                icon: Target,
                title: "Asymmetric Payoffs",
                description: "We design every transaction around structural convexity — limiting downside tail risk while retaining exponential upside. Using advanced derivatives overlays and dynamic sizing, we target trades where the potential return is a multi-fold of the capital at risk.",
                gradient: "bg-gradient-brand-purple",
              },
              {
                icon: Shield,
                title: "Intellectual Humility",
                description: "We prioritize risk management over returns. Sisko Capital encodes uncertainty into all predictive outputs. Portfolio concentration, leverage limits, and VaR models are continuously adjusted under zero-trust assumptions to ensure long-term capital preservation.",
                gradient: "bg-gradient-brand-indigo",
              },
              {
                icon: Award,
                title: "Long-Term Compounding",
                description: "Compounding is mathematically sensitive to significant drawdowns. A 50% loss requires a 100% gain to break even. We optimize portfolios for high geometric mean returns by systematically eliminating tail-risk exposures and correlation collapses.",
                gradient: "bg-gradient-brand-teal",
              },
            ].map((pillar, i) => (
              <div
                key={pillar.title}
                className="glass-card group flex flex-col justify-between rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div>
                  <div
                    className={`mb-6 inline-flex rounded-2xl ${pillar.gradient} p-4 transition-transform duration-500 group-hover:scale-110`}
                  >
                    <pillar.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="leading-relaxed text-muted-foreground text-base">{pillar.description}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-sm font-semibold text-primary">
                  <span>Pillar 0{i + 1}</span>
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FOOTER ─────────────────────────── */}
      <footer className="mt-auto border-t border-border bg-background/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/sisko-capital-logo-final.png"
                  alt="Sisko Capital"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-foreground">Sisko Capital</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered investing for superior returns.</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>UEN: T25LL0878B</p>
                <p>177 Tanjong Rhu Road, Singapore</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-center">
              {["Privacy Policy", "Terms of Service", "Disclaimer", "Company Policy"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex gap-4 md:justify-end">
              <Link
                href="https://www.instagram.com/siskocapital"
                target="_blank"
                className="glass-card rounded-xl p-3 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="20"
                    height="20"
                    x="2"
                    y="2"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Link>

              <Link
                href="https://www.linkedin.com/company/siskomore-capital"
                target="_blank"
                className="glass-card rounded-xl p-3 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect width="4" height="12" x="2" y="9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2025 Sisko Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
