"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DriverMap } from "./DriverMap"

export default function MapPage() {
  return (
    <DashboardLayout role="dispensary">
      <DriverMap />
    </DashboardLayout>
  )
}
