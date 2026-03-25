"use client"

import React from "react"
import { MapPin, Package, Calendar, Clock, Store } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Order } from "@/app/api/react-query/orders"
import { formatDeliveryDate, formatStatus, getStatusColor, formatCurrency } from "./util"

interface TripListViewProps {
  orders: Order[]
}

function EmptyState() {
  return (
    <div className="border rounded-lg p-12 text-center">
      <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-muted-foreground">No assigned trips found</p>
    </div>
  )
}

const TripListView: React.FC<TripListViewProps> = ({ orders }) => {
  if (orders.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Dispensary</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Delivery Address</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time Slot</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium whitespace-nowrap">
                #{order.posOrderId || order.id.slice(0, 8)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {order.primaryDriver
                  ? `${order.primaryDriver.firstName} ${order.primaryDriver.lastName}`
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Store size={13} className="text-muted-foreground shrink-0" />
                  <span className="truncate max-w-32">{order.dispensary?.name ?? "—"}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{order.customerName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin size={13} className="text-muted-foreground shrink-0" />
                  <span className="truncate max-w-40">{order.deliveryAddress}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Calendar size={13} className="text-muted-foreground" />
                  {formatDeliveryDate(order.deliveryDate)}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-muted-foreground" />
                  {order.primaryTimeSlot}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Package size={13} className="text-muted-foreground" />
                  {order.noOfItems}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.productTotal)}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TripListView
