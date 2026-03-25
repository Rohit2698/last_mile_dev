'use client'

import React from "react"
import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api"
import { useDriverLocations } from "@/app/api/react-query/driverLocation"
import { useDriverMap } from "@/app/dispensary/map/DriverMap/hook"
import { generateMarkerIcon, getStatusColor, MAP_CONFIG } from "@/app/dispensary/map/DriverMap/util"
import { DriverLocation } from "@/app/api/react-query/driverLocation"
import { Phone, Star } from "lucide-react"

interface RouteOptimizationMapProps {
  isLoaded: boolean
}

const RouteOptimizationMap: React.FC<RouteOptimizationMapProps> = ({
  isLoaded,
}) => {
  const { data, isLoading } = useDriverLocations()
  const drivers = data?.drivers || []

  const { selectedDriver, handleDriverSelect, filteredDrivers } =
    useDriverMap(drivers)

  if (!isLoaded || isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  const mapContainerStyle = { width: "100%", height: "100%" }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      options={MAP_CONFIG.options}
    >
      {filteredDrivers.map((driver: DriverLocation) => {
        let markerIcon
        try {
          markerIcon = {
            url: generateMarkerIcon(driver),
            scaledSize: new window.google.maps.Size(36, 36),
          }
        } catch {
          markerIcon = {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="${getStatusColor(driver.status)}" stroke="white" stroke-width="2"/></svg>`,
            )}`,
            scaledSize: new window.google.maps.Size(20, 20),
          }
        }
        return (
          <Marker
            key={driver.id}
            position={driver.currentLocation}
            onClick={() => handleDriverSelect(driver)}
            icon={markerIcon}
          />
        )
      })}

      {selectedDriver && (
        <InfoWindow
          position={selectedDriver.currentLocation}
          onCloseClick={() => handleDriverSelect(null)}
        >
          <div className="p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: getStatusColor(selectedDriver.status),
                }}
              />
              <h3 className="font-semibold text-gray-900 text-sm">
                {selectedDriver.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 capitalize mb-1">
              {selectedDriver.status.replace("_", " ")}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Star size={12} className="text-yellow-500" />
              <span>{selectedDriver.rating}</span>
              <span className="ml-1">
                ({selectedDriver.totalDeliveries} deliveries)
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
              <Phone size={12} />
              <span>{selectedDriver.phone}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default RouteOptimizationMap
