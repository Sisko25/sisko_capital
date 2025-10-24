import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-darkblue-950 text-white">
      {/* Navigation */}
      <header className="border-b border-darkblue-800">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/sisko-capital-logo.png"
              alt="Sisko Capital Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold">Sisko Capital</span>
          </Link>
          <Button variant="outline" asChild className="border-white text-white hover:bg-darkblue-800 bg-transparent">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-4xl px-4 md:px-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Investment Disclaimer</h1>
              <p className="text-gray-300">Important information about investment risks</p>
            </div>

            <Alert className="bg-yellow-900/20 border-yellow-900 text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Risk Warning:</strong> All investments carry risk, including the potential loss of principal.
                Please read this disclaimer carefully before investing.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Investment Risks</h2>
                <p className="text-gray-300">
                  Investing in financial markets involves substantial risk and may not be suitable for all investors.
                  You could lose some or all of your investment. Past performance is not indicative of future results.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">AI-Powered Investment Strategy</h2>
                <p className="text-gray-300">
                  Our investment strategies are powered by artificial intelligence and machine learning algorithms.
                  While these technologies can identify patterns and opportunities, they are not infallible and may not
                  perform as expected in all market conditions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">No Guarantee of Returns</h2>
                <p className="text-gray-300">
                  We do not guarantee any specific investment returns or outcomes. All projected returns are estimates
                  based on historical data and modeling, and actual results may vary significantly.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Regulatory Compliance</h2>
                <p className="text-gray-300">
                  Sisko Capital operates under the regulatory framework of Singapore. Our services are only available to
                  qualified investors who meet specific criteria as defined by applicable regulations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Professional Advice</h2>
                <p className="text-gray-300">
                  This information does not constitute investment advice. You should consult with qualified financial
                  advisors and conduct your own due diligence before making any investment decisions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Market Volatility</h2>
                <p className="text-gray-300">
                  Financial markets can be highly volatile and unpredictable. Economic events, market sentiment, and
                  other factors can significantly impact investment performance.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-gray-300">
                  For questions about our investment strategies or risk disclosures, please contact us:
                </p>
                <div className="text-gray-300">
                  <p>Email: contact@siskocapital.com</p>
                  <p>Address: 177 Tanjong Rhu Road, Singapore</p>
                  <p>UEN: T25LL0878B</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-darkblue-800 py-6">
        <div className="container flex justify-center">
          <p className="text-center text-sm text-gray-300">© 2025 Sisko Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
