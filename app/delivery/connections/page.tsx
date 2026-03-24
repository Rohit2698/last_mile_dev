/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  useDeliveryConnectionCode,
  useRegenerateDeliveryCode,
  useDeliveryConnections,
  useDeliveryConnectionRequests,
  useConnectToDispensary,
  useApproveDeliveryRequest,
  useRejectDeliveryRequest,
  useDisconnectFromDispensary,
} from "@/app/api/react-query/connections"
import { toast } from "react-toastify"
import { Check, Copy, RefreshCw, Store, UserCheck, UserX, X } from "lucide-react"

function CodeDisplay({ code, onRegenerate, isRegenerating }: { code: string; onRegenerate: () => void; isRegenerating: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg border bg-muted px-4 py-3">
        {code.split("").map((digit, i) => (
          <span key={i} className="w-8 text-center text-2xl font-bold tracking-widest font-mono">
            {digit}
          </span>
        ))}
      </div>
      <Button variant="outline" size="icon" onClick={handleCopy} title="Copy code">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" onClick={onRegenerate} disabled={isRegenerating} title="Regenerate code">
        <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}

export default function DeliveryConnectionsPage() {
  const [codeInput, setCodeInput] = useState("")

  const { data: codeData, isLoading: codeLoading } = useDeliveryConnectionCode()
  const { data: connections, isLoading: connectionsLoading } = useDeliveryConnections()
  const { data: requests, isLoading: requestsLoading } = useDeliveryConnectionRequests()

  const regenerateMutation = useRegenerateDeliveryCode()
  const connectMutation = useConnectToDispensary()
  const approveMutation = useApproveDeliveryRequest()
  const rejectMutation = useRejectDeliveryRequest()
  const disconnectMutation = useDisconnectFromDispensary()

  const handleConnect = () => {
    if (!/^\d{6}$/.test(codeInput)) {
      toast.error("Please enter a valid 6-digit code")
      return
    }
    connectMutation.mutate(codeInput, {
      onSuccess: () => {
        toast.success("Connection request sent! Awaiting dispensary approval.")
        setCodeInput("")
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? "Failed to send connection request")
      },
    })
  }

  const handleRegenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => toast.success("Connection code regenerated"),
      onError: () => toast.error("Failed to regenerate code"),
    })
  }

  const handleApprove = (linkId: string) => {
    approveMutation.mutate(linkId, {
      onSuccess: () => toast.success("Connection approved!"),
      onError: () => toast.error("Failed to approve connection"),
    })
  }

  const handleReject = (linkId: string) => {
    rejectMutation.mutate(linkId, {
      onSuccess: () => toast.success("Request rejected"),
      onError: () => toast.error("Failed to reject request"),
    })
  }

  const handleDisconnect = (linkId: string) => {
    disconnectMutation.mutate(linkId, {
      onSuccess: () => toast.success("Disconnected successfully"),
      onError: () => toast.error("Failed to disconnect"),
    })
  }

  return (
    <DashboardLayout role="delivery">
      <div className="space-y-6 p-4 max-w-3xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Connections</h2>
          <p className="text-muted-foreground">
            Connect with dispensaries using 6-digit codes
          </p>
        </div>

        {/* Your Code */}
        <Card className="p-6 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Your Connection Code</h3>
            <p className="text-sm text-muted-foreground">
              Share this code with a dispensary so they can connect with you.
            </p>
          </div>
          {codeLoading ? (
            <p className="text-muted-foreground text-sm">Loading code…</p>
          ) : codeData?.connectionCode ? (
            <CodeDisplay
              code={codeData.connectionCode}
              onRegenerate={handleRegenerate}
              isRegenerating={regenerateMutation.isPending}
            />
          ) : (
            <p className="text-muted-foreground text-sm">No code yet</p>
          )}
        </Card>

        {/* Add Connection */}
        <Card className="p-6 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Connect to a Dispensary</h3>
            <p className="text-sm text-muted-foreground">
              Enter the dispensary&apos;s 6-digit code to send a connection request.
            </p>
          </div>
          <div className="flex gap-2 max-w-xs">
            <Input
              placeholder="Enter 6-digit code"
              value={codeInput}
              maxLength={6}
              onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="font-mono tracking-widest text-center"
            />
            <Button onClick={handleConnect} disabled={connectMutation.isPending || codeInput.length !== 6}>
              {connectMutation.isPending ? "Sending…" : "Send Request"}
            </Button>
          </div>
        </Card>

        {/* Pending Requests (incoming from dispensaries) */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Incoming Requests</h3>
            <p className="text-sm text-muted-foreground">
              Dispensaries requesting to connect with you.
            </p>
          </div>
          {requestsLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !requests?.length ? (
            <p className="text-sm text-muted-foreground">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{req.dispensary?.name}</p>
                      <p className="text-xs text-muted-foreground">{req.dispensary?.email}</p>
                      {req.dispensary?.address && (
                        <p className="text-xs text-muted-foreground">{req.dispensary.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleApprove(req.id)}
                      disabled={approveMutation.isPending}
                    >
                      <UserCheck className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleReject(req.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <UserX className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Connections */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Active Connections</h3>
            <p className="text-sm text-muted-foreground">
              Dispensaries you are currently working with.
            </p>
          </div>
          {connectionsLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !connections?.length ? (
            <p className="text-sm text-muted-foreground">No active connections yet</p>
          ) : (
            <div className="space-y-3">
              {connections.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{link.dispensary?.name}</p>
                        {link.dispensary?.isVerified && (
                          <Badge className="bg-green-500 text-white text-xs">Verified</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{link.dispensary?.email}</p>
                      {link.dispensary?.phone && (
                        <p className="text-xs text-muted-foreground">{link.dispensary.phone}</p>
                      )}
                      {link.dispensary?.address && (
                        <p className="text-xs text-muted-foreground">{link.dispensary.address}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDisconnect(link.id)}
                    disabled={disconnectMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" /> Disconnect
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
