"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Copy, Check, Sparkles, ArrowUpRight } from "lucide-react"

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [verifyToken, setVerifyToken] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/whatsapp/webhook`)
    }
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verifyToken.trim() || !apiKey.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSaving(true)

    try {
      console.log("[v0] Saving settings:", { verifyToken: "***", apiKey: "***" })
      
      const response = await fetch("/api/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifyToken,
          apiKey,
          webhookUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      const data = await response.json()
      console.log("[v0] Settings saved successfully:", data)
      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your WhatsApp and API settings</p>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Set up your Meta Business API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="webhook-url">Webhook URL</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add this URL to your Meta App Webhooks configuration
              </p>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="verify-token">Webhook Verify Token</FieldLabel>
              <Input
                id="verify-token"
                type="password"
                placeholder="Your verify token"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use this token when setting up webhooks in Meta App
              </p>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="api-key">Access Token</FieldLabel>
              <Input
                id="api-key"
                type="password"
                placeholder="Your Meta access token"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Get this from your Meta App Settings
              </p>
            </Field>
          </FieldGroup>

          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* OpenAI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Model Settings
          </CardTitle>
          <CardDescription>Configure OpenAI for automated responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              OmniFlow uses OpenAI GPT-4o-mini model to generate intelligent responses to your WhatsApp messages.
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>Model: GPT-4o-mini</p>
              <p>Max tokens: 150 (keeps responses concise)</p>
              <p>Temperature: 0.7 (balanced creativity)</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your OpenAI API key is securely stored. Set it via environment variables for production.
          </p>
        </CardContent>
      </Card>

      {/* Pro Features */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>Unlock advanced features and higher limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5 text-sm mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Unlimited connections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>10,000 messages/month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Priority support</span>
            </div>
          </div>
          <Button className="w-full">
            Upgrade Now
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
