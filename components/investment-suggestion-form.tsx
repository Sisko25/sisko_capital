"use client"

import type React from "react"

import { useState } from "react"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function InvestmentSuggestionForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    ticker: "",
    companyName: "",
    sector: "",
    investmentType: "stock",
    allocationPercentage: "",
    rationale: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to the server
    console.log("Submitted:", formData)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (submitted) {
    return (
      <Card className="bg-darkblue-800 border-darkblue-700">
        <CardHeader>
          <CardTitle>Investment Suggestion</CardTitle>
          <CardDescription className="text-gray-300">Suggest investments for SM Capital to consider</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-green-600/20 p-3 mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Suggestion Submitted</h3>
          <p className="text-center text-gray-300 max-w-md">
            Thank you for your investment suggestion. Our team and AI models will analyze your recommendation and
            consider it for inclusion in your portfolio.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-darkblue-700"
            onClick={() => {
              setSubmitted(false)
              setFormData({
                ticker: "",
                companyName: "",
                sector: "",
                investmentType: "stock",
                allocationPercentage: "",
                rationale: "",
              })
            }}
          >
            Submit Another Suggestion
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="bg-darkblue-800 border-darkblue-700">
      <CardHeader>
        <CardTitle>Investment Suggestion</CardTitle>
        <CardDescription className="text-gray-300">
          Suggest investments for Siskomore Capital to consider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                name="ticker"
                placeholder="e.g., AAPL"
                value={formData.ticker}
                onChange={handleChange}
                required
                className="bg-darkblue-900 border-darkblue-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g., Apple Inc."
                value={formData.companyName}
                onChange={handleChange}
                required
                className="bg-darkblue-900 border-darkblue-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select value={formData.sector} onValueChange={(value) => handleSelectChange("sector", value)} required>
                <SelectTrigger id="sector" className="bg-darkblue-900 border-darkblue-700 text-white">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent className="bg-darkblue-800 border-darkblue-700 text-white">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="consumer">Consumer Goods</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="communication">Communication Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="allocationPercentage">Suggested Allocation</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                        <Info className="h-3 w-3 text-gray-400" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-darkblue-700 text-white border-darkblue-600">
                      <p className="text-xs">
                        What percentage of your portfolio should be allocated to this investment?
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="allocationPercentage"
                name="allocationPercentage"
                placeholder="e.g., 5%"
                value={formData.allocationPercentage}
                onChange={handleChange}
                required
                className="bg-darkblue-900 border-darkblue-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Investment Type</Label>
            <RadioGroup
              defaultValue="stock"
              value={formData.investmentType}
              onValueChange={(value) => handleSelectChange("investmentType", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stock" id="stock" className="border-white" />
                <Label htmlFor="stock" className="font-normal">
                  Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="etf" id="etf" className="border-white" />
                <Label htmlFor="etf" className="font-normal">
                  ETF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="crypto" id="crypto" className="border-white" />
                <Label htmlFor="crypto" className="font-normal">
                  Cryptocurrency
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" className="border-white" />
                <Label htmlFor="other" className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rationale">Investment Rationale</Label>
            <Textarea
              id="rationale"
              name="rationale"
              placeholder="Why do you believe this would be a good investment? What factors support your recommendation?"
              value={formData.rationale}
              onChange={handleChange}
              required
              className="min-h-[120px] bg-darkblue-900 border-darkblue-700 text-white"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
          Submit Suggestion
        </Button>
      </CardFooter>
    </Card>
  )
}
