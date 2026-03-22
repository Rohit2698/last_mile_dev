import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Order } from "@/app/api/react-query/orders"
import {
  formatStatus,
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
} from "./util"

interface OrderCardViewProps {
  orders: Order[]
}

export const OrderCardView = ({ orders }: OrderCardViewProps) => {
  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {orders.map(order => (
        <Card key={order.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold">
                  Order #{order.posOrderId || order.id.slice(0, 8)}
                </h3>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Customer:
                  </span>
                  <span>{order.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Phone:
                  </span>
                  <span>{order.customerPhone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Delivery Address:
                  </span>
                  <span className="line-clamp-1">{order.deliveryAddress}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Delivery Date:
                  </span>
                  <span>{formatDate(order.deliveryDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Time Slot:
                  </span>
                  <span>{order.primaryTimeSlot}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Items:
                  </span>
                  <span>{order.noOfItems}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Total:
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(order.productTotal + order.deliveryFee)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    (Product: {formatCurrency(order.productTotal)}, Delivery:{" "}
                    {formatCurrency(order.deliveryFee)})
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Created {formatDate(order.createdAt)}
              </p>
            </div>

            <Button variant="outline" className="ml-4">
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
