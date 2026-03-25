"use client"

import React from "react"
import { Package, Phone, Mail, MapPin, Calendar, Clock, Store, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TripDetailOrder } from "@/app/api/react-query/trips"
import { formatDeliveryDate, formatStatus, getStatusColor, formatCurrency } from "../../../TripsPage/util"

interface OrderInfoSectionProps {
  order: TripDetailOrder
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ order }) => {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">Order Info</h2>
          <p className="text-xs text-muted-foreground">
            #{order.posOrderId || order.orderNumber}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={<Package size={15} />} label="Customer" value={order.customerName} />
        <InfoRow icon={<Phone size={15} />} label="Phone" value={order.customerPhone} />
        {order.customerEmail && (
          <InfoRow icon={<Mail size={15} />} label="Email" value={order.customerEmail} />
        )}
        <InfoRow icon={<MapPin size={15} />} label="Delivery Address" value={order.deliveryAddress} />
        {order.dispensary && (
          <InfoRow
            icon={<Store size={15} />}
            label="Dispensary"
            value={order.dispensary.name}
          />
        )}
        <InfoRow
          icon={<Calendar size={15} />}
          label="Delivery Date"
          value={formatDeliveryDate(order.deliveryDate)}
        />
        <InfoRow icon={<Clock size={15} />} label="Time Slot" value={order.primaryTimeSlot} />
        <InfoRow
          icon={<Hash size={15} />}
          label="Items"
          value={`${order.noOfItems} item${order.noOfItems !== 1 ? "s" : ""}`}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t text-sm">
        <div className="flex gap-4">
          <span className="text-muted-foreground">
            Product Total:{" "}
            <span className="font-semibold text-foreground">{formatCurrency(Number(order.productTotal))}</span>
          </span>
          <span className="text-muted-foreground">
            Delivery Fee:{" "}
            <span className="font-semibold text-foreground">{formatCurrency(Number(order.deliveryFee))}</span>
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {order.customerType}
        </Badge>
      </div>

      {order.deliveryNotes && (
        <p className="text-xs text-muted-foreground border-t pt-2 italic">
          Note: {order.deliveryNotes}
        </p>
      )}
    </div>
  )
}

export default OrderInfoSection
