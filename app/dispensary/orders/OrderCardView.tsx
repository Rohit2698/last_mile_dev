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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map(order => (
        <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold truncate">
                #{order.posOrderId || order.id.slice(0, 8)}
              </h3>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                {formatStatus(order.status)}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium truncate">{order.customerName}</p>
                <p className="text-xs text-muted-foreground truncate">{order.customerPhone}</p>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Delivery Date</p>
                <p className="font-medium">{formatDate(order.deliveryDate)}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-semibold">
                  {formatCurrency(order.productTotal + order.deliveryFee)}
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
