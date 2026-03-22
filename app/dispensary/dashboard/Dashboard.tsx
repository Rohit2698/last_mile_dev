"use client"

import { useAuth } from "@/context/AuthContext"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

export function Dashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout role="dispensary">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">User ID:</span> {user?.id}
            </p>
          </div>
        </Card>

        {/* Dashboard Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-muted-foreground">
              Manage your dispensary orders
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Configuration</h3>
            <p className="text-muted-foreground">
              Update your dispensary settings
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
            <p className="text-muted-foreground">
              Manage payment information
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Discount Schedules</h3>
            <p className="text-muted-foreground">
              Set up discount schedules
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Windows</h3>
            <p className="text-muted-foreground">
              Configure delivery time windows
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              View performance metrics
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
