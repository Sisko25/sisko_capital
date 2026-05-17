"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Brain, Database, LineChart, Network, Cpu, Zap, Lock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState("overview")
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
            {[
              { label: "About", href: "/#about" },
              { label: "Our Approach", href: "/#our-approach" },
              { label: "Philosophy", href: "/philosophy" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "Contact", href: "/#contact" },
              { label: "Intelligence", href: "/intelligence" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative rounded-full px-4 py-2 transition-all duration-300 hover:scale-105`}
              >
                {item.label === "Intelligence" ? (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-xl" />
                    <span className="relative text-sm font-medium text-foreground">{item.label}</span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative px-6 pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-2xl backdrop-blur-xl">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">Next-Generation AI Platform</span>
              </div>

              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                <span className="mb-2 block text-foreground">Sisko AI</span>
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Powering Market-Beating Strategies
                </span>
              </h1>

              <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
                Our proprietary AI platform leverages deep learning and quantitative analysis to generate superior
                returns across all market conditions.
              </p>

              {/* FinKing AI Button */}
              <Link
                href="https://finking-final.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-primary/50"
              >
                <Brain className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                <span>Try it out</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Right Column - AI Visualization */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
              <div className="relative glass-card rounded-[3rem] p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: "Neural Networks", gradient: "bg-gradient-brand-blue" },
                    { icon: Database, label: "Big Data", gradient: "bg-gradient-brand-purple" },
                    { icon: LineChart, label: "Analytics", gradient: "bg-gradient-brand-indigo" },
                    { icon: Network, label: "Deep Learning", gradient: "bg-gradient-brand-teal" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="glass-card group flex flex-col items-center justify-center rounded-2xl p-6 transition-all duration-500 hover:scale-105"
                    >
                      <div
                        className={`mb-3 rounded-xl ${item.gradient} p-3 transition-transform duration-500 group-hover:scale-110`}
                      >
                        <item.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <span className="text-center text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── TECHNOLOGY STACK ─────────────────────────── */}
      <section className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Advanced Technology Stack</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Built on cutting-edge infrastructure for maximum performance and reliability
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {[
              {
                icon: Cpu,
                title: "High-Performance Computing",
                description:
                  "Distributed computing clusters processing terabytes of market data in real-time with sub-millisecond latency.",
                gradient: "bg-gradient-brand-blue",
              },
              {
                icon: Zap,
                title: "Real-Time Execution",
                description:
                  "Lightning-fast order execution powered by co-located servers and optimized network infrastructure.",
                gradient: "bg-gradient-brand-purple",
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description:
                  "Bank-grade encryption and multi-layer security protocols protecting your investments 24/7.",
                gradient: "bg-gradient-brand-indigo",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card group rounded-[2rem] p-8 transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`mb-6 inline-flex rounded-2xl ${item.gradient} p-4 transition-transform duration-500 group-hover:scale-110`}
                >
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── TABS DEMO ─────────────────────────── */}
      <section className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Platform Architecture</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">Explore how our AI-powered system works</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass-card flex h-auto w-full items-center justify-between p-1 gap-2">
              <TabsTrigger
                value="overview"
                className="flex-1 py-3 text-center data-[state=active]:glass-card data-[state=active]:shadow-lg transition-all duration-300 cursor-pointer text-sm font-bold"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="flex-1 py-3 text-center data-[state=active]:glass-card data-[state=active]:shadow-lg transition-all duration-300 cursor-pointer text-sm font-bold"
              >
                Data Pipeline
              </TabsTrigger>
              <TabsTrigger
                value="risk"
                className="flex-1 py-3 text-center data-[state=active]:glass-card data-[state=active]:shadow-lg transition-all duration-300 cursor-pointer text-sm font-bold"
              >
                Risk Engine
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    How Sisko AI components work together seamlessly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h4 className="mb-4 text-lg font-semibold text-foreground">Multi-Model Architecture</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Our platform employs an ensemble of specialized deep learning models, each trained on different
                      aspects of market behavior. These models generate independent signals that are aggregated through
                      a sophisticated orchestration layer, applying portfolio constraints and risk limits before
                      outputting executable orders.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="glass-card rounded-2xl p-6">
                      <TrendingUp className="mb-3 h-8 w-8 text-primary" />
                      <h5 className="mb-2 font-semibold text-foreground">Signal Generation</h5>
                      <p className="text-sm text-muted-foreground">
                        AI models process market data to identify trading opportunities
                      </p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <Network className="mb-3 h-8 w-8 text-accent" />
                      <h5 className="mb-2 font-semibold text-foreground">Portfolio Optimization</h5>
                      <p className="text-sm text-muted-foreground">
                        Dynamic allocation across assets based on risk-adjusted returns
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-8">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-3">
                    <Database className="h-6 w-6 text-primary" />
                    Data Pipeline & Ingestion Engine
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    From sub-millisecond telemetry ingestion to high-dimensional feature engineering
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h4 className="mb-4 text-lg font-semibold text-foreground">Data Processing Flow</h4>
                    <div className="space-y-4">
                      {[
                        {
                          step: "1. Real-Time Ingestion",
                          desc: "Our globally co-located ingestion clusters consume Level 2/3 orderbook telemetry, tick-by-tick market data, macro indexes, and sentiment indicators. Using high-throughput Apache Kafka pipelines, we capture millions of events per second with sub-millisecond timestamps.",
                        },
                        {
                          step: "2. Stream Normalization",
                          desc: "Raw, multi-source telemetry is passed through automated schema validators, parsed, and normalized. Anomalous ticks and data gaps are cleaned and adjusted dynamically to ensure the downstream models process completely sanitized inputs.",
                        },
                        {
                          step: "3. High-Dimensional Feature Engineering",
                          desc: "Our computation engine calculates thousands of mathematical and statistical features in real-time. This includes multi-timeframe volatility proxies (GARCH), orderflow imbalance, institutional liquidity sweeps, and cross-venue correlation matrices.",
                        },
                        {
                          step: "4. Distributed Time-Series Storage",
                          desc: "Engineered features and structured logs are written concurrently to ultra-low-latency distributed memory grids and optimized ClickHouse clusters, providing instant retrieval for live model inference and backtesting engines.",
                        },
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="bg-gradient-brand-blue rounded-lg px-3 py-1 text-xs font-bold text-primary-foreground h-fit shrink-0">
                            {item.step}
                          </div>
                          <p className="flex-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">Real-Time Ingestion Volatility</span>
                      <span className="text-xl font-black text-primary">25TB+ Daily Telemetry</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="bg-gradient-brand-blue h-2 w-11/12 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="mt-8">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    Systematic Risk Auditing & Validation
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Zero-trust mathematical checks and real-time position constraints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h4 className="mb-4 text-lg font-semibold text-foreground">Zero-Trust Risk Control Framework</h4>
                    <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                      Sisko Capital prioritizes risk management over return generation. Our proprietary Risk Engine operates completely independently of the predictive models. Every order generated must pass a multi-layer validation audit. If an order breaches any portfolio constraint (leverage, exposure, sector correlation, or liquidity impact), the transaction is immediately gated and flagged for manual override.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "1-Day 99% VaR Limit", value: "2.0%", color: "text-primary" },
                      { label: "Absolute Drawdown Gate", value: "8.0%", color: "text-accent" },
                      { label: "Beta to S&P 500", value: "0.12", color: "text-primary" },
                    ].map((metric) => (
                      <div key={metric.label} className="glass-card rounded-2xl p-6 text-center">
                        <div className={`mb-2 text-2xl font-black ${metric.color}`}>{metric.value}</div>
                        <div className="text-xs font-semibold text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h5 className="mb-3 font-semibold text-foreground">Real-Time Auditing Modules</h5>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <p><strong>Position & Leverage Gating:</strong> Automatically monitors individual position sizing and total portfolio leverage, preventing excessive margin exposure.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0"></div>
                        <p><strong>Correlation Collapse Protection:</strong> Calculates live asset covariance and correlation structures. Automatically reduces sizes if diversification benefits degrade during regime shifts.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <p><strong>Liquidity & Slippage Impact Audit:</strong> Measures order size against current orderbook depth (L2/L3) to prevent market impact and execution slippage.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0"></div>
                        <p><strong>Black Swan Scenario Analysis:</strong> Simulates historical dislocations (e.g., 2008 Lehman collapse, 2020 pandemic crash) every 60 seconds to stress-test capital health.</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
