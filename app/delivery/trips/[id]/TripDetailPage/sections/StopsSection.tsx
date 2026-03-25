"use client"

import React from "react"
import { Download, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RouteStopDetail, TripDetailOrder } from "@/app/api/react-query/trips"
import { formatStatus, getStatusColor } from "../../../TripsPage/util"
import { format } from "date-fns"

interface StopsSectionProps {
  order: TripDetailOrder
  onDownloadManifest: () => void
}

function TimeField({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{format(new Date(value), "MMM d · h:mm a")}</p>
      </div>
    </div>
  )
}

function RouteStopCard({ stop, order }: { stop: RouteStopDetail; order: TripDetailOrder }) {
  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {stop.sequenceNumber}
          </span>
          <div>
            <p className="text-sm font-semibold">{order.customerName}</p>
            <p className="text-xs text-muted-foreground font-mono">ID: {stop.id.slice(0, 8)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(stop.status)}`}>
          {formatStatus(stop.status)}
        </span>
      </div>

      <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
        <MapPin size={13} className="mt-0.5 shrink-0" />
        <span>{order.deliveryAddress}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TimeField label="ETA" value={stop.eta} icon={<Clock size={14} />} />
        <TimeField label="Arrived" value={stop.arrivedAt} icon={<MapPin size={14} />} />
        {stop.completedAt && (
          <TimeField label="Completed" value={stop.completedAt} icon={<CheckCircle size={14} />} />
        )}
        {stop.failedAt && (
          <TimeField label="Failed" value={stop.failedAt} icon={<XCircle size={14} />} />
        )}
      </div>

      {stop.failureReason && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {stop.failureReason}
        </div>
      )}

      {stop.deliveryNotes && (
        <p className="text-xs text-muted-foreground italic">{stop.deliveryNotes}</p>
      )}
    </div>
  )
}

const StopsSection: React.FC<StopsSectionProps> = ({ order, onDownloadManifest }) => {
  const hasManifest = !!order.biotrackManifestId

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">Route Stop</h2>
          {order.biotrackManifestStatus && (
            <p className="text-xs text-muted-foreground">
              Manifest: {formatStatus(order.biotrackManifestStatus)}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant={hasManifest ? "default" : "outline"}
          onClick={onDownloadManifest}
          className="gap-1.5"
          title={hasManifest ? "Download manifest" : "No BioTrack manifest available"}
        >
          <Download size={14} />
          Download Manifest
        </Button>
      </div>

      {order.routeStop ? (
        <RouteStopCard stop={order.routeStop} order={order} />
      ) : (
        <div className="rounded-md border p-4 text-center">
          <p className="text-sm text-muted-foreground">No route stop assigned yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            This order hasn&apos;t been added to an optimized route.
          </p>
        </div>
      )}
    </div>
  )
}

export default StopsSection
