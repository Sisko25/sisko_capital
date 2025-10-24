"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { login } from "@/app/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/dashboard"

  const [email, setEmail] = useState("sisko@duck.com")
  const [password, setPassword] = useState("sisko09")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create form data to pass to server action
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      // Call the server action
      const result = await login(formData)

      if (result.success) {
        setIsSuccess(true)

        // If remember me is checked, we could set a longer cookie expiry
        // (this would be handled in the server action in a real app)

        // Redirect after a short delay
        setTimeout(() => {
          router.push(returnUrl)
        }, 1000)
      } else {
        setError(result.error || "Invalid email or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-darkblue-950">
      <header className="border-b border-darkblue-800">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/sisko-capital-logo-final.png"
              alt="Sisko Capital Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-white">SM Capital</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="mx-auto max-w-md w-full bg-darkblue-800 border-darkblue-700 text-white">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/sisko-capital-logo-final.png"
                alt="Sisko Capital Logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Investor Login</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Enter your credentials to access your investment dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="bg-green-900/20 border-green-900 text-green-300">
                <AlertDescription>Login successful! Redirecting to dashboard...</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="bg-darkblue-900 border-darkblue-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-darkblue-900 border-darkblue-700 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {isSuccess && (
              <div className="text-center mt-2">
                <p className="text-sm text-gray-300">
                  If you are not redirected automatically,
                  <Button
                    variant="link"
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                    onClick={() => router.push(returnUrl)}
                  >
                    click here
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-300">
              Don&apos;t have an account?{" "}
              <Link href="#contact" className="text-blue-400 hover:text-white">
                Contact us
              </Link>{" "}
              to become an investor.
            </div>
          </CardFooter>
        </Card>
      </main>
      <footer className="border-t border-darkblue-800 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/sisko-capital-logo-final.png"
                alt="Sisko Capital Logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-bold">Sisko Capital</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>UEN: T25LL0878B</p>
              <p>177 Tanjong Rhu Road, Singapore</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-300 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="text-sm text-gray-300 hover:text-white">
              Disclaimer
            </Link>
            <Link href="/company-policy" className="text-sm text-gray-300 hover:text-white">
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
                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
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
        <div className="border-t border-darkblue-800 py-4">
          <div className="container flex justify-center">
            <p className="text-center text-sm text-gray-300">© 2025 Sisko Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
