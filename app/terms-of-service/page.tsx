import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
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
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-gray-300">Last updated: January 2025</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                <p className="text-gray-300">
                  By accessing and using Sisko Capital's services, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. Investment Services</h2>
                <p className="text-gray-300">
                  Sisko Capital provides AI-powered investment management services. All investments carry risk,
                  including the potential loss of principal. Past performance does not guarantee future results.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. Eligibility</h2>
                <p className="text-gray-300">
                  Our services are available only to qualified investors who meet certain financial and regulatory
                  requirements. By using our services, you represent that you meet these requirements.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. Fees and Charges</h2>
                <p className="text-gray-300">
                  We charge management fees and performance fees as outlined in your investment agreement. All fees will
                  be clearly disclosed before you invest.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
                <p className="text-gray-300">
                  Sisko Capital shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. Governing Law</h2>
                <p className="text-gray-300">
                  These terms shall be governed by and construed in accordance with the laws of Singapore, without
                  regard to its conflict of law provisions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">7. Contact Information</h2>
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
