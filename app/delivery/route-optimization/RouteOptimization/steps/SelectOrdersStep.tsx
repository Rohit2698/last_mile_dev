"use client"

import React from "react"
import { format } from "date-fns"
import { MapPin, Package, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/app/api/react-query/orders"
import { useDeliveryOrdersQuery } from "@/app/api/react-query/deliveryOrders"
import { CreateRouteFormValues } from "../util"

interface SelectOrdersStepProps {
  routeValues: CreateRouteFormValues
  selectedOrders: Order[]
  onToggleOrder: (order: Order) => void
  onSubmit: () => void
  onBack: () => void
}

function OrderRow({
  order,
  isSelected,
  onToggle,
}: {
  order: Order
  isSelected: boolean
  onToggle: () => void
}) {
    console.log("debug:order", order)
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={onToggle}
    >
      <div className="mt-0.5 shrink-0 text-primary">
        {isSelected ? (
          <CheckSquare size={18} />
        ) : (
          <Square size={18} className="text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{order.customerName}</p>
          <Badge variant="outline" className="text-xs">
            {order.customerType}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span className="truncate">{order.deliveryAddress}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package size={12} />
            {order.noOfItems} items
          </span>
          {order.primaryTimeSlot && (
            <span>Slot: {order.primaryTimeSlot}</span>
          )}
        </div>
      </div>
      <div className="text-right text-xs shrink-0">
        <p className="font-medium">${Number(order.productTotal)?.toFixed(2)}</p>
      </div>
    </div>
  )
}

const SelectOrdersStep: React.FC<SelectOrdersStepProps> = ({
  routeValues,
  selectedOrders,
  onToggleOrder,
  onSubmit,
  onBack,
}) => {
  const { data, isLoading, isError } = useDeliveryOrdersQuery({
    dispensaryId: routeValues.dispensaryId,
    deliveryDateFrom: routeValues.deliveryDate,
    deliveryDateTo: routeValues.deliveryDate,
    limit: 100,
  })

  const orders = data?.data || []

  const selectedIds = new Set(selectedOrders.map((o) => o.id))

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading orders...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-sm text-destructive">
        Failed to load orders. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} found for{" "}
          {routeValues.deliveryDate
            ? format(new Date(routeValues.deliveryDate), "PPP")
            : "selected date"}
        </p>
        {selectedOrders.length > 0 && (
          <Badge>{selectedOrders.length} selected</Badge>
        )}
      </div>

      {orders.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          No orders found matching the selected date and dispensary.
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            isSelected={selectedIds.has(order.id)}
            onToggle={() => onToggleOrder(order)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={selectedOrders.length === 0}
        >
          Next → ({selectedOrders.length} orders)
        </Button>
      </div>
    </div>
  )
}

export default SelectOrdersStep
