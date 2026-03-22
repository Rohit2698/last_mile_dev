"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

export default function DeliveryDashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout role="delivery">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> Delivery Partner
            </p>
          </div>
        </Card>

        {/* Dashboard Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Active Deliveries</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Currently in progress
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Completed Today</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Deliveries completed
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground mt-2">
              This month
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
