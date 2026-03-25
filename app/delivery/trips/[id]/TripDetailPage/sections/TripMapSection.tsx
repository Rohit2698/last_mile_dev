"use client"

import React, { useEffect, useRef, useState } from "react"
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api"
import { MapPin } from "lucide-react"
import { TripDetailOrder } from "@/app/api/react-query/trips"

interface TripMapSectionProps {
  order: TripDetailOrder
  isLoaded: boolean
}

const MAP_CONTAINER_STYLE = { width: "100%", height: "360px" }
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
}

const GREEN_PIN = { path: 0 /* CIRCLE */, scale: 10, fillColor: "#22c55e", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }
const RED_PIN   = { path: 0, scale: 10, fillColor: "#ef4444", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }

const TripMapSection: React.FC<TripMapSectionProps> = ({ order, isLoaded }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [mapError, setMapError] = useState(false)
  const directionsFetched = useRef(false)

  const origin = order.pickupAddress || order.dispensary?.address || order.dispensary?.name || null
  const destination = order.deliveryAddress

  useEffect(() => {
    if (!isLoaded || !origin || !destination || directionsFetched.current) return
    directionsFetched.current = true

    const service = new window.google.maps.DirectionsService()
    service.route(
      { origin, destination, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
        } else {
          setMapError(true)
        }
      },
    )
  }, [isLoaded, origin, destination])

  const defaultCenter = {
    lat: order.deliveryLatitude ?? 34.0522,
    lng: order.deliveryLongitude ?? -118.2437,
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <MapPin size={16} className="text-muted-foreground" />
        <h2 className="font-semibold text-base">Route Map</h2>
        {origin && (
          <span className="text-xs text-muted-foreground ml-auto truncate max-w-xs">
            {origin} → {destination}
          </span>
        )}
      </div>

      {!isLoaded && (
        <div className="flex items-center justify-center h-90 text-sm text-muted-foreground">
          Loading map…
        </div>
      )}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={defaultCenter}
          zoom={13}
          options={MAP_OPTIONS}
        >
          {directions && !mapError && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: { strokeColor: "#6366f1", strokeWeight: 4 },
              }}
            />
          )}

          {/* Fallback markers when directions unavailable */}
          {!directions && order.deliveryLatitude && order.deliveryLongitude && (
            <Marker
              position={{ lat: order.deliveryLatitude, lng: order.deliveryLongitude }}
              icon={RED_PIN}
              title="Delivery address"
            />
          )}
          {!directions && order.pickupLatitude && order.pickupLongitude && (
            <Marker
              position={{ lat: order.pickupLatitude, lng: order.pickupLongitude }}
              icon={GREEN_PIN}
              title="Pickup address"
            />
          )}
        </GoogleMap>
      )}
    </div>
  )
}

export default TripMapSection
