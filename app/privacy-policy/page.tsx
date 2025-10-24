import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
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
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-gray-300">Last updated: January 2025</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                <p className="text-gray-300">
                  We collect information you provide directly to us, such as when you create an account, make an
                  investment, or contact us for support. This may include your name, email address, phone number,
                  financial information, and investment preferences.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                <p className="text-gray-300">
                  We use the information we collect to provide, maintain, and improve our investment services, process
                  transactions, communicate with you, and comply with legal and regulatory requirements.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                <p className="text-gray-300">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except as described in this policy or as required by law. We may share information with
                  service providers who assist us in operating our business.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. Data Security</h2>
                <p className="text-gray-300">
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Your Rights</h2>
                <p className="text-gray-300">
                  You have the right to access, update, or delete your personal information. You may also opt out of
                  certain communications from us. To exercise these rights, please contact us using the information
                  below.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at:
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
