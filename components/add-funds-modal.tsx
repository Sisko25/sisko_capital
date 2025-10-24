"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, DollarSign, Info, Lock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AddFundsModal() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer")
  const [bankAccount, setBankAccount] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setOpen(false)

    // Reset form
    setAmount("")
    setPaymentMethod("bank-transfer")
    setBankAccount("")
    setAgreedToTerms(false)
  }

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    return numericValue ? Number.parseInt(numericValue).toLocaleString() : ""
  }

  const minimumInvestment = 50000
  const currentAmount = Number.parseInt(amount.replace(/,/g, "")) || 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-darkblue-800 border-darkblue-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-400" />
            Add Funds to Your Investment
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Increase your investment in SM Capital's AI-powered hedge fund
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investment Amount */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatAmount(e.target.value))}
                  placeholder="50,000"
                  className="pl-8 bg-darkblue-900 border-darkblue-700 text-white"
                  required
                />
              </div>
              {currentAmount > 0 && currentAmount < minimumInvestment && (
                <Alert className="bg-yellow-900/20 border-yellow-900 text-yellow-300">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Minimum additional investment is ${minimumInvestment.toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[50000, 100000, 250000, 500000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-darkblue-600 text-gray-300 hover:bg-darkblue-700"
                  onClick={() => setAmount(quickAmount.toLocaleString())}
                >
                  ${quickAmount / 1000}K
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-darkblue-700 bg-darkblue-900">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" className="border-white" />
                  <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bank Wire Transfer</p>
                        <p className="text-sm text-gray-400">Secure bank-to-bank transfer (3-5 business days)</p>
                      </div>
                      <div className="text-green-400 text-sm font-medium">Recommended</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-darkblue-700 bg-darkblue-900">
                  <RadioGroupItem value="ach" id="ach" className="border-white" />
                  <Label htmlFor="ach" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">ACH Transfer</p>
                      <p className="text-sm text-gray-400">Direct bank account transfer (1-3 business days)</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-darkblue-700 bg-darkblue-900 opacity-60">
                  <RadioGroupItem value="check" id="check" className="border-white" disabled />
                  <Label htmlFor="check" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Certified Check</p>
                      <p className="text-sm text-gray-400">Physical check delivery (5-10 business days)</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Bank Account Selection */}
          {(paymentMethod === "bank-transfer" || paymentMethod === "ach") && (
            <div className="space-y-2">
              <Label htmlFor="bank-account">Select Bank Account</Label>
              <Select value={bankAccount} onValueChange={setBankAccount} required>
                <SelectTrigger className="bg-darkblue-900 border-darkblue-700 text-white">
                  <SelectValue placeholder="Choose your bank account" />
                </SelectTrigger>
                <SelectContent className="bg-darkblue-800 border-darkblue-700 text-white">
                  <SelectItem value="chase-checking">Chase Bank - Checking ****1234</SelectItem>
                  <SelectItem value="wells-savings">Wells Fargo - Savings ****5678</SelectItem>
                  <SelectItem value="bofa-checking">Bank of America - Checking ****9012</SelectItem>
                  <SelectItem value="add-new">+ Add New Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Investment Summary */}
          {currentAmount >= minimumInvestment && (
            <Card className="bg-darkblue-900 border-darkblue-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Additional Investment:</span>
                  <span className="font-bold">${currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Portfolio Value:</span>
                  <span>$327,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Management Fee (2% annually):</span>
                  <span>${(currentAmount * 0.02).toLocaleString()}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Performance Fee:</span>
                  <span>20% of profits above high-water mark</span>
                </div>
                <div className="border-t border-darkblue-700 pt-3">
                  <div className="flex justify-between font-bold">
                    <span>New Portfolio Value:</span>
                    <span className="text-blue-400">${(327500 + currentAmount).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                I acknowledge that I have read and agree to the{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Investment Agreement
                </a>
                ,{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Private Placement Memorandum
                </a>
                , and{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Risk Disclosures
                </a>
                . I understand that this investment involves substantial risk and may result in loss of capital.
              </label>
            </div>

            <Alert className="bg-blue-900/20 border-blue-900 text-blue-300">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your funds will be invested according to SM Capital's AI-driven strategy. Investment decisions are made
                automatically by our proprietary algorithms.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-darkblue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={currentAmount < minimumInvestment || !agreedToTerms || !bankAccount || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add ${currentAmount.toLocaleString()}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
