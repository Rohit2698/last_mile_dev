"use client"

import React from "react"
import { MapPin, Package, Calendar, Clock, User, Store } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { DriverTrip } from "@/app/api/react-query/trips"
import { formatDeliveryDate, formatStatus, getStatusColor, formatCurrency } from "./util"

interface TripAccordionViewProps {
  grouped: DriverTrip[]
}

function EmptyState() {
  return (
    <div className="border rounded-lg p-12 text-center">
      <User className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-muted-foreground">No assigned trips found</p>
    </div>
  )
}

function OrderRow({ order }: { order: DriverTrip["orders"][number] }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b last:border-0">
      <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
        <div>
          <p className="font-medium">
            #{order.posOrderId || order.id.slice(0, 8)}
            <span className="text-muted-foreground font-normal ml-2">
              {order.customerName}
            </span>
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin size={11} />
            <span className="truncate">{order.deliveryAddress}</span>
          </div>
          {order.dispensary && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Store size={11} />
              <span>{order.dispensary.name}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground sm:items-end">
          <div className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDeliveryDate(order.deliveryDate)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={11} />
            {order.primaryTimeSlot}
          </div>
          <div className="flex items-center gap-1">
            <Package size={11} />
            {order.noOfItems} items · {formatCurrency(order.productTotal)}
          </div>
        </div>
      </div>
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
      >
        {formatStatus(order.status)}
      </span>
    </div>
  )
}

const TripAccordionView: React.FC<TripAccordionViewProps> = ({ grouped }) => {
  if (grouped.length === 0) {
    return <EmptyState />
  }

  return (
    <Accordion type="multiple" defaultValue={grouped.map((g) => g.driver.id)} className="space-y-2">
      {grouped.map((group) => (
        <AccordionItem
          key={group.driver.id}
          value={group.driver.id}
          className="border rounded-lg px-4 bg-background"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">
                  {group.driver.firstName} {group.driver.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{group.driver.phone}</p>
              </div>
              <Badge variant="secondary" className="ml-2 text-xs">
                {group.orders.length} order{group.orders.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="divide-y">
              {group.orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default TripAccordionView
