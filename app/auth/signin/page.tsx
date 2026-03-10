"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, ArrowRight, Sparkles } from "lucide-react"

export default function SignIn() {
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
      const response = await fetch("/api/whatsapp/send-code", {
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
      setError(err instanceof Error ? err.message : "Failed to generate OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/whatsapp/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Invalid OTP")
      }

      localStorage.setItem("omniflow_phone", phone)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-12 h-12 bg-accent/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-primary/15 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-accent/25 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-wiggle">
            <MessageSquare className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-3xl font-black tracking-tight">
            <span className="text-primary">Omni</span>
            <span className="text-foreground">Flow</span>
          </span>
        </div>

        {/* Main content card */}
        <div className="w-full max-w-md">
          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black leading-tight mb-4 text-balance">
              {step === "phone" ? (
                <>
                  <span className="text-foreground">LET'S</span>
                  <br />
                  <span className="gradient-text">GET YOU</span>
                  <br />
                  <span className="text-foreground">STARTED</span>
                </>
              ) : (
                <>
                  <span className="text-foreground">CHECK</span>
                  <br />
                  <span className="gradient-text">YOUR</span>
                  <br />
                  <span className="text-foreground">WHATSAPP</span>
                </>
              )}
            </h1>
            <p className="text-lg text-muted-foreground">
              {step === "phone" 
                ? "Sign in with your WhatsApp number"
                : "We sent a 6-digit code"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-accent/10 border-2 border-accent/30 rounded-2xl">
              <p className="text-sm text-accent font-semibold text-center">{error}</p>
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-18 pr-4 py-5 bg-card border-2 border-border rounded-2xl text-lg font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                  style={{ paddingLeft: "4.5rem" }}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Code
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-5 bg-card border-2 border-border rounded-2xl text-center text-4xl tracking-[0.5em] font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                  required
                  disabled={isLoading}
                />
                {demoOtp && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-xl">
                    <p className="text-sm text-primary font-semibold text-center">
                      Demo code: <span className="font-mono text-lg">{demoOtp}</span>
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify & Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone")
                  setOtp("")
                  setError("")
                }}
                className="w-full text-base text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Use a different number
              </button>
            </form>
          )}

          {/* Bottom text */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary font-medium hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Fun tagline at bottom */}
        <div className="mt-16 text-center">
          <p className="text-lg font-bold text-muted-foreground">
            AUTOMATE YOUR WHATSAPP
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Faster than you can say "BRB"
          </p>
        </div>
      </div>
    </div>
  )
}
