"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  return (
    <DashboardLayout role="dispensary">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              Manage and track all your orders
            </p>
          </div>
          <Button>Create New Order</Button>
        </div>

        <div className="grid gap-4">
          {/* Sample order cards */}
          {[1, 2, 3].map((order) => (
            <Card key={order} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Order #{order}001</h3>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customer Name • Order placed 2 hours ago
                  </p>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
