import Link from "next/link"
import Image from "next/image"

export default function CompanyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-darkblue-950 text-white">
      {/* Navigation */}
      <header className="border-b border-darkblue-800">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/sisko-capital-logo-final.png"
              alt="Sisko Capital Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold">Sisko Capital</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-12 md:px-6 md:py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Company Policy</h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                At Sisko Capital, we are committed to maintaining the highest standards of professional conduct, ethical
                behavior, and regulatory compliance. This Company Policy outlines our core principles and operational
                guidelines that govern our business practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Code of Conduct</h2>
              <p className="mb-4">All employees, contractors, and representatives of Sisko Capital must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Act with integrity, honesty, and fairness in all business dealings</li>
                <li>Treat all stakeholders with respect and professionalism</li>
                <li>Avoid any conduct that could damage the firm's reputation</li>
                <li>Comply with all applicable laws, regulations, and internal policies</li>
                <li>Report any suspected violations of this policy or applicable laws immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Conflict of Interest</h2>
              <p className="mb-4">
                Employees must avoid situations where personal interests conflict or appear to conflict with the
                interests of Sisko Capital or its clients. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Outside business activities that compete with or interfere with duties at Sisko Capital</li>
                <li>Financial interests in clients, competitors, or service providers</li>
                <li>Personal relationships that could influence professional judgment</li>
                <li>Accepting gifts, entertainment, or favors that could influence business decisions</li>
              </ul>
              <p className="mt-4">
                All potential conflicts of interest must be disclosed to management immediately for review and
                appropriate action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Confidentiality and Data Protection</h2>
              <p className="mb-4">Protecting confidential information is critical to our business. Employees must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Safeguard all confidential and proprietary information</li>
                <li>Not disclose confidential information to unauthorized parties</li>
                <li>Use confidential information only for legitimate business purposes</li>
                <li>Comply with all data protection and privacy regulations, including PDPA in Singapore</li>
                <li>Report any suspected data breaches or security incidents immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Compliance and Regulatory Adherence</h2>
              <p className="mb-4">Sisko Capital operates under strict regulatory oversight. We are committed to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Complying with all applicable securities laws and regulations</li>
                <li>Maintaining appropriate licenses and registrations</li>
                <li>Cooperating fully with regulatory authorities</li>
                <li>Implementing robust compliance monitoring and testing programs</li>
                <li>Providing regular compliance training to all employees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Anti-Money Laundering (AML) and Know Your Client (KYC)
              </h2>
              <p className="mb-4">
                We maintain comprehensive AML and KYC procedures to prevent financial crimes. Our policies include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Thorough client identification and verification procedures</li>
                <li>Ongoing monitoring of client transactions and activities</li>
                <li>Reporting of suspicious activities to relevant authorities</li>
                <li>Regular training on AML/KYC requirements and red flags</li>
                <li>Maintaining detailed records of all client due diligence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Trading and Investment Policies</h2>
              <p className="mb-4">
                Our trading and investment activities are governed by strict policies to ensure fair and ethical
                practices:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All investment decisions must be in the best interests of our clients</li>
                <li>Trading must be conducted fairly, transparently, and in accordance with applicable regulations</li>
                <li>Market manipulation, insider trading, and other prohibited practices are strictly forbidden</li>
                <li>Best execution practices must be followed for all client transactions</li>
                <li>Appropriate risk management controls must be maintained</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Personal Trading</h2>
              <p className="mb-4">
                Employee personal trading is subject to restrictions to prevent conflicts of interest and insider
                trading:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pre-clearance required for personal securities transactions</li>
                <li>Blackout periods during which personal trading is prohibited</li>
                <li>Restrictions on trading securities on the firm's restricted list</li>
                <li>Prohibition on front-running or trading ahead of client orders</li>
                <li>Regular reporting of personal holdings and transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                9. Environmental, Social, and Governance (ESG) Considerations
              </h2>
              <p>
                Sisko Capital is committed to incorporating ESG factors into our investment processes. We evaluate
                potential investments not only on financial metrics but also on their environmental impact, social
                responsibility, and governance practices. We believe that sustainable and responsible investing
                contributes to long-term value creation for our clients.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Whistleblowing</h2>
              <p className="mb-4">
                We encourage employees to report any suspected violations of laws, regulations, or company policies.
                Sisko Capital maintains a whistleblowing policy that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provides multiple confidential reporting channels</li>
                <li>Protects whistleblowers from retaliation</li>
                <li>Ensures all reports are investigated thoroughly and promptly</li>
                <li>Maintains the confidentiality of whistleblowers to the extent possible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Policy Review and Updates</h2>
              <p>
                This Company Policy is reviewed and updated regularly to ensure it remains current with evolving laws,
                regulations, and business practices. All employees are required to acknowledge receipt and understanding
                of this policy and any updates. Questions regarding this policy should be directed to the Compliance
                Department.
              </p>
            </section>

            <section className="pt-8 border-t border-darkblue-700">
              <p className="text-sm text-gray-400">Last Updated: January 2025</p>
              <p className="text-sm text-gray-400 mt-2">
                For questions or concerns about this policy, please contact our Compliance Department at{" "}
                <a href="mailto:compliance@siskocapital.com" className="text-blue-400 hover:underline">
                  compliance@siskocapital.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-darkblue-800 bg-darkblue-950">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/sisko-capital-logo-final.png"
                alt="Sisko Capital Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">Sisko Capital</span>
            </div>
            <p className="text-sm text-gray-300">AI-powered investing for superior returns.</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>UEN: T25LL0878B</p>
              <p>177 Tanjong Rhu Road, Singapore</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-300 hover:text-white hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-gray-300 hover:text-white hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="/disclaimer"
              className="text-sm text-gray-300 hover:text-white hover:underline underline-offset-4"
            >
              Disclaimer
            </Link>
            <Link
              href="/company-policy"
              className="text-sm text-gray-300 hover:text-white hover:underline underline-offset-4"
            >
              Company Policy
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/siskocapital?utm_source=ig_web_button_share_sheet&igsh=OHIzcmJ4ZmZxbHM0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/siskomore-capital/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-darkblue-800 py-6">
          <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
            <p className="text-center text-sm text-gray-300">© 2025 Sisko Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
