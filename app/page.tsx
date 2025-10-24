import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, BarChart3, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Fixed Navigation */}
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
            {["About", "Our Approach", "Philosophy", "How It Works", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="group relative rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100 text-transparent" />
                <span className="relative text-sm font-medium transition-colors duration-300 group-hover:text-foreground text-slate-300">
                  {item}
                </span>
              </Link>
            ))}
            <Link
              href="/intelligence"
              className="group relative rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100 text-transparent" />
              <span className="relative text-sm font-medium transition-colors duration-300 group-hover:text-foreground text-slate-300">
                Intelligence
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-2xl backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                <span className="mb-2 block text-foreground">AI-Powered Investing</span>
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  for Superior Returns
                </span>
              </h1>

              <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
                Sisko Capital leverages advanced AI algorithms to identify market inefficiencies and generate alpha in
                all market conditions.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/50" asChild>
                  <Link href="#about" className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 px-8 py-6 text-lg backdrop-blur-xl bg-transparent"
                  asChild
                >
                  <Link href="#contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats Card */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
              <div className="relative glass-card rounded-[3rem] p-8">
                <div className="space-y-6">
                  <div className="flex h-48 items-center justify-center">
                    <svg className="h-full w-full text-primary/50" viewBox="0 0 100 50" fill="none">
                      <path
                        d="M 0,40 L 20,35 L 40,25 L 60,30 L 80,20 L 100,15"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M 0,40 L 20,35 L 40,25 L 60,30 L 80,20 L 100,15 L 100,50 L 0,50 Z"
                        fill="url(#gradient)"
                        opacity="0.3"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-4 text-center transition-transform duration-300 hover:scale-105">
                      <div className="bg-gradient-brand-blue bg-clip-text text-3xl font-bold text-foreground">27%</div>
                      <div className="mt-2 text-xs text-muted-foreground">Annual Return</div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 text-center transition-transform duration-300 hover:scale-105">
                      <div className="bg-gradient-brand-purple bg-clip-text text-3xl font-bold text-foreground">
                        0.82
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Sharpe Ratio</div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 text-center transition-transform duration-300 hover:scale-105">
                      <div className="bg-gradient-brand-indigo bg-clip-text text-3xl font-bold text-foreground">
                        12%
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Volatility</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">About Sisko Capital</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              We are a quantitative hedge fund that uses artificial intelligence to make investment decisions.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <div className="glass-card space-y-6 rounded-[2rem] p-8 transition-transform duration-500 hover:scale-105">
              <h3 className="bg-gradient-brand-blue bg-clip-text text-3xl font-bold bg-foreground text-foreground">
                Our Mission
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                To deliver consistent, market-beating returns by leveraging cutting-edge AI technology to identify and
                exploit market inefficiencies.
              </p>

              <h3 className="bg-gradient-brand-purple bg-clip-text text-3xl font-bold text-foreground">Our Vision</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                To become the leading AI-powered hedge fund, setting new standards for quantitative investing in the
                digital age.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Founded", value: "2025", gradient: "bg-gradient-brand-blue" },
                { label: "AUM", value: "$xM+", gradient: "bg-gradient-brand-purple" },
                { label: "Team", value: "10+", gradient: "bg-gradient-brand-indigo" },
                { label: "Markets", value: "Global", gradient: "bg-gradient-brand-teal" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card rounded-3xl p-6 text-center transition-transform duration-500 hover:scale-105"
                >
                  <div className={`mb-2 text-black ${item.gradient} bg-clip-text text-4xl font-bold text-foreground`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="our-approach" className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Our Investment Approach</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              We combine AI, machine learning, and traditional financial analysis to create a robust investment
              strategy.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Driven Analysis",
                description:
                  "Our proprietary AI models analyze vast amounts of market data to identify patterns and opportunities.",
                gradient: "bg-gradient-brand-blue",
              },
              {
                icon: BarChart3,
                title: "Quantitative Strategies",
                description:
                  "We deploy multiple quantitative strategies across different asset classes and time horizons.",
                gradient: "bg-gradient-brand-purple",
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Sophisticated risk models protect capital and ensure consistent performance.",
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

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20 md:py-32">
        <div className="container mx-auto">
          <div className="mb-16 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Contact Us</h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Interested in learning more about Sisko Capital? Get in touch with our team.
            </p>
          </div>

          <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="bg-gradient-brand-blue rounded-xl p-3">
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span>sisko@duck.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/20 backdrop-blur-xl">
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
