"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Plus, Trash2, ToggleRight, ToggleLeft, Phone, MessageSquare } from "lucide-react"

interface Connection {
  id: string
  phoneNumber: string
  businessName: string
  status: "active" | "inactive" | "pending"
  automationEnabled: boolean
  messageCount: number
  lastActive: string
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)

  const toggleAutomation = (id: string) => {
    setConnections(
      connections.map((conn) =>
        conn.id === id ? { ...conn, automationEnabled: !conn.automationEnabled } : conn
      )
    )
  }

  const deleteConnection = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Connections</h1>
          <p className="text-muted-foreground text-sm">Manage your WhatsApp business connections</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus size={18} className="mr-2" />
          New Connection
        </Button>
      </div>

      {connections.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-primary/60" />
              </div>
              <div>
                <p className="text-lg font-medium">No connections yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first WhatsApp connection to get started with automations
                </p>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                Add Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{connection.businessName}</h3>
                        <p className="text-sm text-muted-foreground">{connection.phoneNumber}</p>
                      </div>
                      <Badge 
                        variant={connection.status === "active" ? "default" : "secondary"}
                      >
                        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex gap-8 text-sm">
                      <div>
                        <p className="text-muted-foreground">Messages Processed</p>
                        <p className="font-semibold">{connection.messageCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-semibold">{connection.lastActive}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAutomation(connection.id)}
                      title={connection.automationEnabled ? "Disable automation" : "Enable automation"}
                    >
                      {connection.automationEnabled ? (
                        <ToggleRight size={20} className="text-primary" />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteConnection(connection.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Connection</CardTitle>
              <CardDescription>Connect your WhatsApp Business account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="business-name">Business Name</FieldLabel>
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="My Business"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
              </FieldGroup>
              
              <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Next Steps:</p>
                <ol className="space-y-1 text-muted-foreground text-xs">
                  <li>1. Scan the QR code with WhatsApp</li>
                  <li>2. Confirm the connection</li>
                  <li>3. Set up your automations</li>
                </ol>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowAddDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
