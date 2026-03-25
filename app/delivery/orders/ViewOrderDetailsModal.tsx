"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Order } from "@/app/api/react-query/orders"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  formatStatus,
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
} from "./util"
import { formatPhone } from "@/lib/utils"

interface ViewOrderDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export const ViewOrderDetailsModal = ({
  open,
  onOpenChange,
  order,
}: ViewOrderDetailsModalProps) => {
  if (!order) return null

  const totalAmount = Number(order.productTotal) + Number(order.deliveryFee)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order Details</DialogTitle>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {formatStatus(order.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Order Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">
                  #{order.posOrderId || order.id.slice(0, 8)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Items</p>
                <p className="font-medium">{order.noOfItems}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dispensary Information */}
          {order.dispensary && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Dispensary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.dispensary.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.dispensary.email}</p>
                  </div>
                  {order.dispensary.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {formatPhone(order.dispensary.phone)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">
                  {formatPhone(order.customerPhone)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer Type</p>
                <p className="font-medium">{order.customerType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Delivery Date</p>
                <p className="font-medium">{formatDate(order.deliveryDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Slot</p>
                <p className="font-medium">{order.primaryTimeSlot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Product Total</p>
                <p className="font-medium">
                  {formatCurrency(Number(order.productTotal))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Fee</p>
                <p className="font-medium">
                  {formatCurrency(Number(order.deliveryFee))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              {order.deliveryNotes && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{order.deliveryNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          {(order.primaryDriver || order.vehicle || order.route) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Assignment
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {order.primaryDriver && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Primary Driver
                      </p>
                      <p className="font-medium">
                        {order.primaryDriver.firstName}{" "}
                        {order.primaryDriver.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPhone(order.primaryDriver.phone)}
                      </p>
                    </div>
                  )}
                  {order.secondaryDriver && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Secondary Driver
                      </p>
                      <p className="font-medium">
                        {order.secondaryDriver.firstName}{" "}
                        {order.secondaryDriver.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPhone(order.secondaryDriver.phone)}
                      </p>
                    </div>
                  )}
                  {order.vehicle && (
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{order.vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {[
                          order.vehicle.year,
                          order.vehicle.make,
                          order.vehicle.model,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        {order.vehicle.plateNumber &&
                          ` · ${order.vehicle.plateNumber}`}
                      </p>
                    </div>
                  )}
                  {order.route && (
                    <div>
                      <p className="text-sm text-muted-foreground">Route</p>
                      <p className="font-medium">
                        #{order.route.id.slice(0, 8)}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(order.route.status)}
                        className="mt-1"
                      >
                        {formatStatus(order.route.status)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
