"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, MessageSquare, Zap, Users, ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Connections",
      value: "0",
      description: "+0 this week",
      icon: Users,
    },
    {
      title: "Messages Processed",
      value: "0",
      description: "+0 today",
      icon: MessageSquare,
    },
    {
      title: "Automations",
      value: "0",
      description: "Active rules",
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Console - Large Card */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Console
              </CardTitle>
              <CardDescription>Real-time automation activity</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-secondary/50 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-primary/50" />
                </div>
                <p className="text-muted-foreground text-sm">No activity yet</p>
                <p className="text-muted-foreground/60 text-xs max-w-[200px]">
                  Connect WhatsApp and enable automations to see live updates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-between">
              <Link href="/dashboard/connections">
                New Connection
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full justify-between">
              <Link href="/dashboard/settings">
                Configure AI
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-between">
              <Link href="/dashboard/messages">
                View Messages
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Business context for AI responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              placeholder="Add business info, FAQs, or context to improve AI responses..."
              className="w-full h-28 bg-secondary/50 border border-border rounded-lg p-3 text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button variant="secondary" className="w-full">
              Save Knowledge Base
            </Button>
          </CardContent>
        </Card>

        {/* Pro Upgrade Banner */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    Free Plan
                  </span>
                </div>
                <h3 className="text-lg font-semibold">Upgrade to Pro for unlimited power</h3>
                <p className="text-sm text-muted-foreground">
                  Get unlimited connections, messages, and advanced AI features.
                </p>
                <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                  <span>1 connection</span>
                  <span>100 msgs/mo</span>
                  <span>Basic AI</span>
                </div>
              </div>
              <Button className="shrink-0">
                Upgrade to Pro
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
