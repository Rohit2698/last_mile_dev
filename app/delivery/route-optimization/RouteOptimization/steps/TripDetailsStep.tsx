"use client"

import React, { useState } from "react"
import { Clock, MapPin, Package, User, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"
import { useAssignDriverToOrderMutation } from "@/app/api/react-query/deliveryOrders"
import { TripAssignment } from "../type"

interface TripDetailsStepProps {
  tripAssignments: TripAssignment[]
  onBack: () => void
  onConfirmed?: () => void
}

function AssignmentCard({ assignment }: { assignment: TripAssignment }) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {assignment.driver.firstName} {assignment.driver.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {assignment.driver.phone}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Clock size={14} className="text-muted-foreground" />
            <span>Est. finish: {assignment.estimatedFinishTime}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {assignment.deliveryCount} deliver
            {assignment.deliveryCount !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {assignment.orders.map((order, idx) => (
          <div
            key={order.id}
            className="flex items-start gap-2 text-xs text-muted-foreground pl-11"
          >
            <span className="shrink-0 font-medium text-foreground">
              #{idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {order.customerName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                <span className="truncate">{order.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  {order.customerType}
                </Badge>
                <span className="flex items-center gap-0.5">
                  <Package size={10} />
                  {order.noOfItems} items
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TripDetailsStep: React.FC<TripDetailsStepProps> = ({
  tripAssignments,
  onBack,
  onConfirmed,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const assignDriver = useAssignDriverToOrderMutation()

  const totalDeliveries = tripAssignments.reduce(
    (sum, a) => sum + a.deliveryCount,
    0,
  )

  const handleConfirm = async () => {
    const pairs: { orderId: string; driverId: string }[] = []
    for (const assignment of tripAssignments) {
      for (const order of assignment.orders) {
        pairs.push({ orderId: order.id, driverId: assignment.driver.id })
      }
    }

    try {
      await Promise.all(pairs.map((p) => assignDriver.mutateAsync(p)))
      setIsConfirmed(true)
      toast.success(`${pairs.length} order${pairs.length !== 1 ? "s" : ""} assigned successfully`)
      onConfirmed?.()
    } catch {
      toast.error("Failed to assign some orders. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tripAssignments.length} driver
          {tripAssignments.length !== 1 ? "s" : ""} assigned &mdash;{" "}
          {totalDeliveries} total deliver
          {totalDeliveries !== 1 ? "ies" : "y"}
        </p>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
        {tripAssignments.map((assignment) => (
          <AssignmentCard key={assignment.driver.id} assignment={assignment} />
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={assignDriver.isPending || isConfirmed}>
          ← Back
        </Button>
        {isConfirmed ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <CheckCircle size={16} />
            <span>All orders assigned!</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={assignDriver.isPending}
          >
            {assignDriver.isPending ? "Assigning..." : "Confirm & Start"}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TripDetailsStep
