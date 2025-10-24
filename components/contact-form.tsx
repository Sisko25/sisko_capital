"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitContactForm } from "@/app/actions/contact"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitContactForm(formData)

    setResult(response)
    setIsSubmitting(false)

    if (response.success) {
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <div className="space-y-6">
      {result && (
        <Alert
          className={
            result.success
              ? "bg-[hsl(150_100%_40%)]/10 border-[hsl(150_100%_40%)]/50 backdrop-blur-xl"
              : "bg-destructive/10 border-destructive/50 backdrop-blur-xl"
          }
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-[hsl(150_100%_40%)]" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          <AlertDescription className={result.success ? "text-[hsl(150_100%_40%)]" : "text-destructive"}>
            {result.success ? result.message : result.error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground/90">
              First name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              required
              disabled={isSubmitting}
              className="glass border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground/90">
              Last name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              required
              disabled={isSubmitting}
              className="glass border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
              placeholder="Doe"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground/90">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
            className="glass border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground/90">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            disabled={isSubmitting}
            className="min-h-[120px] glass border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
            placeholder="Tell us how we can help..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full px-6 py-3 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-[hsl(270_100%_60%)]" />
          <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xl" />
          <span className="relative flex items-center justify-center gap-2 text-primary-foreground font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </span>
        </button>
      </form>
    </div>
  )
}
