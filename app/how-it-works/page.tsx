"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Cpu, Database, Network, Shield, RefreshCw, Layers, CheckCircle2, ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
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
            <Link
              href="/philosophy"
              className="group relative rounded-full px-4 py-2 transition-all duration-350 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-350 group-hover:opacity-100" />
              <span className="relative text-sm font-medium text-muted-foreground transition-colors duration-350 group-hover:text-foreground">
                Philosophy
              </span>
            </Link>
            <Link href="/how-it-works" className="group relative rounded-full px-4 py-2 transition-all duration-350">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-xl" />
              <span className="relative text-sm font-medium text-foreground">How It Works</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative px-6 pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="container mx-auto text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_50%)]" />
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-2xl backdrop-blur-xl">
              <Layers className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-card-foreground">System Architecture & Pipeline</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              <span className="mb-2 block text-foreground">The Quantitative</span>
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Execution Pipeline
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              A high-frequency, multi-tiered data ingestion, machine learning inference, and risk auditing platform designed to run 24/7/365 with sub-millisecond precision.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── 5-STEP PIPELINE ─────────────────────────── */}
      <section className="px-6 py-20 md:py-32 bg-card/20 backdrop-blur-md border-y border-border">
        <div className="container mx-auto">
          <div className="mb-20 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl">Our 5-Step Process</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From raw telemetry ingestion to high-speed order execution.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl space-y-12">
            {/* Connecting line */}
            <div className="absolute left-[39px] top-8 bottom-8 -z-10 w-[2px] bg-gradient-to-b from-primary via-purple-500 to-accent opacity-30 hidden md:block" />

            {[
              {
                step: "01",
                icon: Database,
                title: "Data Ingestion & Normalization",
                description: "Ingests tens of millions of raw data points per day including level-2/3 orderbook depth, tick data, alternative data, social telemetry, news sentiment, and economic indices. All signals are cleaned, timestamped, and structured in real-time.",
                gradient: "bg-gradient-brand-blue",
              },
              {
                step: "02",
                icon: Cpu,
                title: "Multi-Timeframe Feature Engineering",
                description: "Calculates complex statistical and mathematical features across microsecond, second, minute, and daily timeframes. Identifies deviations in distribution, correlation spikes, volatility regimes, and institutional liquidity clusters.",
                gradient: "bg-gradient-brand-purple",
              },
              {
                step: "03",
                icon: Network,
                title: "Ensemble Model Inference",
                description: "Features are fed into our ensemble neural network models (Deep Q-networks, Transformer architectures, and GARCH statistical predictors). These systems perform inference in parallel to generate independent directional conviction metrics.",
                gradient: "bg-gradient-brand-indigo",
              },
              {
                step: "04",
                icon: Shield,
                title: "Risk Engine Audit & Validation",
                description: "Prior to execution, every signal is subjected to a zero-trust real-time risk audit. The engine evaluates Value-at-Risk limits, leverage boundaries, correlation clusters, and liquidity impact, rejecting any trades that breach strict safety parameters.",
                gradient: "bg-gradient-brand-teal",
              },
              {
                step: "05",
                icon: RefreshCw,
                title: "Execution & Continuous Monitoring",
                description: "Approved orders are executed via smart order routing (SOR) protocols to minimize slippage. Execution metrics are fed back into our models for continuous learning, reinforcement tuning, and market impact adjustment.",
                gradient: "bg-gradient-brand-pink",
              },
            ].map((item, idx) => (
              <div key={item.step} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start group">
                {/* Step circle */}
                <div className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${item.gradient} text-primary-foreground font-black text-2xl shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className="absolute -top-3 -right-3 h-7 w-7 rounded-xl bg-card p-1.5 border border-border text-foreground transition-transform duration-500 group-hover:rotate-12" />
                  {item.step}
                </div>

                <div className="glass-card flex-1 rounded-[2rem] p-8 md:p-10 transition-all duration-350 hover:bg-card">
                  <h3 className="mb-4 text-2xl font-bold text-foreground flex items-center gap-3">
                    {item.title}
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{item.description}</p>
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
