"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoOtp, setDemoOtp] = useState("")
  const [error, setError] = useState("")

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send OTP")
      }

      const data = await response.json()
      setDemoOtp(data.demo_otp)
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Invalid OTP")
      }

      // Store phone in localStorage for dashboard access
      localStorage.setItem("omniflow_phone", phone)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-primary">Omni</span>Flow
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Start automating your WhatsApp business
          </h1>
          <p className="text-lg text-muted-foreground">
            OmniFlow helps you reply to messages faster with AI-powered automation.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Setup takes less than 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Free trial included</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Join 1,000+ businesses using OmniFlow
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">Omni</span>Flow
            </span>
          </div>

          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground">
              {step === "phone" ? "Enter your WhatsApp number" : "Verify your phone number"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1.5">Include country code (e.g., +1 for USA, +44 for UK)</p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  required
                  disabled={isLoading}
                />
                {demoOtp && (
                  <p className="text-xs text-amber-600 mt-2 text-center">Demo code: <span className="font-mono font-semibold">{demoOtp}</span></p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground font-semibold"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Create Account"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone")
                  setOtp("")
                  setError("")
                }}
                className="w-full text-sm text-primary hover:underline font-medium"
              >
                Use a different number
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
