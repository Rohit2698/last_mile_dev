"use client"

import { DriverMap } from "@/app/dispensary/map/DriverMap"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MapPage() {
  return (
    <DashboardLayout role="delivery">
      <DriverMap />
    </DashboardLayout>
  )
}
