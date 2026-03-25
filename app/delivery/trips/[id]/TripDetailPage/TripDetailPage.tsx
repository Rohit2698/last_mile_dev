"use client"

import React from "react"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { useTripDetailPage } from "./hook"
import OrderInfoSection from "./sections/OrderInfoSection"
import DriverSection from "./sections/DriverSection"
import TripMapSection from "./sections/TripMapSection"
import TimelineSection from "./sections/TimelineSection"
import StopsSection from "./sections/StopsSection"

const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"]

interface TripDetailPageProps {
  id: string
}

const TripDetailPage: React.FC<TripDetailPageProps> = ({ id }) => {
  const router = useRouter()
  const { order, driver, timeline, isLoading, isError, downloadManifest } =
    useTripDetailPage(id)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Trip not found or failed to load.
        </p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="-ml-1"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-lg font-bold leading-tight">
            Trip #{order.posOrderId || order.orderNumber}
          </h1>
          <p className="text-xs text-muted-foreground">
            {order.customerName} · {order.deliveryAddress}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Section 1 — Order Info */}
        <OrderInfoSection order={order} />
        {/* Section 2 — Driver */}
        {driver ? (
          <DriverSection driver={driver} order={order} />
        ) : (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            No driver assigned to this trip yet.
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Section 3 — Map */}
        <TripMapSection order={order} isLoaded={isLoaded} />
        {/* Section 4 — Timeline */}
        <TimelineSection timeline={timeline} />
      </div>

      {/* Section 5 — Route Stop + Manifest */}
      <StopsSection order={order} onDownloadManifest={downloadManifest} />
    </div>
  )
}

export default TripDetailPage
