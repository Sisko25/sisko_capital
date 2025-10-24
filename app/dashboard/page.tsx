"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LogOut,
  Settings,
  TrendingUp,
  User,
  Bell,
  HelpCircle,
  Palette,
  Lock,
  Mail,
  CreditCard,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InvestmentChatbot } from "@/components/investment-chatbot"
import { InvestmentSuggestionForm } from "@/components/investment-suggestion-form"
import { PortfolioPerformance } from "@/components/portfolio-performance"
import { InvestmentHoldings } from "@/components/investment-holdings"
import { AddFundsModal } from "@/components/add-funds-modal"
import { PnLChart } from "@/components/pnl-chart"
import { logout } from "@/app/actions/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [notificationCount] = useState(3)

  // Handle logout using the server action
  const handleLogout = async () => {
    try {
      await logout()
      // The logout function will handle the redirect
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback client-side redirect if the server action fails
      router.push("/login")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-darkblue-950 text-white">
      <header className="border-b border-darkblue-800">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/sisko-capital-logo-final.png"
              alt="SM Capital Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold">SM Capital</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 mr-auto ml-10">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white hover:text-white hover:underline underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              href="/intelligence"
              className="text-sm font-medium text-gray-300 hover:text-white hover:underline underline-offset-4"
            >
              Intelligence
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-darkblue-800 border-darkblue-700 text-white">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-darkblue-700" />
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Appearance</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-darkblue-700" />
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-darkblue-800 border-darkblue-700 text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-darkblue-700" />
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing & Payments</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Communication Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-darkblue-700" />
                <DropdownMenuItem className="hover:bg-darkblue-700 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notification Badge */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  {notificationCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Investor</h1>
            <p className="text-gray-300">Here's the latest on your investments with SM Capital</p>
          </div>
          <AddFundsModal />
        </div>

        {/* ROI Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-darkblue-800 border-darkblue-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$250,000.00</div>
              <p className="text-sm text-gray-300 mt-1">Initial investment: $200,000.00</p>
            </CardContent>
          </Card>
          <Card className="bg-darkblue-800 border-darkblue-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$327,500.00</div>
              <div className="flex items-center mt-1">
                <span className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +31.0%
                </span>
                <span className="text-gray-300 text-sm ml-2">Since inception</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-darkblue-800 border-darkblue-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">YTD Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+18.2%</div>
              <p className="text-sm text-gray-300 mt-1">vs. S&P 500: +9.7%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="bg-darkblue-800 border border-darkblue-700">
            <TabsTrigger value="performance" className="data-[state=active]:bg-darkblue-700">
              Performance
            </TabsTrigger>
            <TabsTrigger value="pnl" className="data-[state=active]:bg-darkblue-700">
              P&L Analysis
            </TabsTrigger>
            <TabsTrigger value="holdings" className="data-[state=active]:bg-darkblue-700">
              Holdings
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-darkblue-700">
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="suggest" className="data-[state=active]:bg-darkblue-700">
              Suggest Investment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-4">
            <PortfolioPerformance />
          </TabsContent>
          <TabsContent value="pnl" className="mt-4">
            <PnLChart />
          </TabsContent>
          <TabsContent value="holdings" className="mt-4">
            <InvestmentHoldings />
          </TabsContent>
          <TabsContent value="ai-assistant" className="mt-4">
            <InvestmentChatbot />
          </TabsContent>
          <TabsContent value="suggest" className="mt-4">
            <InvestmentSuggestionForm />
          </TabsContent>
        </Tabs>
      </div>
      <footer className="mt-auto border-t border-darkblue-800 py-6">
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
