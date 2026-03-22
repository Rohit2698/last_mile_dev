"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"

export default function MapPage() {
  return (
    <DashboardLayout role="dispensary">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Map</h2>
          <p className="text-muted-foreground">
            View and track deliveries on the map
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
            <p className="text-muted-foreground">Map view coming soon...</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
