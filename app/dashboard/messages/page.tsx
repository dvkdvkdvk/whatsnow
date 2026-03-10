"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, ArrowRight } from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  phoneNumber: string
  incomingMessage: string
  outgoingMessage: string
  status: "sent" | "failed" | "pending"
  timestamp: string
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [messages] = useState<Message[]>([])

  const filteredMessages = messages.filter((msg) =>
    msg.phoneNumber.includes(searchTerm) ||
    msg.incomingMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm">View all automated responses</p>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-muted-foreground" />
            <Input
              placeholder="Search by phone number or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </CardContent>
      </Card>

      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-primary/60" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {messages.length === 0 ? "No messages yet" : "No matching messages"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {messages.length === 0
                    ? "Automated messages will appear here when you enable automations"
                    : "Try adjusting your search"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="overflow-hidden">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">{message.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                  </div>
                  <Badge 
                    variant={message.status === "sent" ? "default" : message.status === "failed" ? "destructive" : "secondary"}
                  >
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Incoming</p>
                    <p className="text-sm">{message.incomingMessage}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
                    <p className="text-sm text-primary">{message.outgoingMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
