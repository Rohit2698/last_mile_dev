import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Order } from "@/app/api/react-query/orders"
import {
  formatStatus,
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
} from "./util"
import { OrderActionsMenu } from "./OrderActionsMenu"
import { formatPhone } from "@/lib/utils"

interface OrderTableViewProps {
  orders: Order[]
  onEditOrder?: (order: Order) => void
}

export const OrderTableView = ({ orders, onEditOrder }: OrderTableViewProps) => {
  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Time Slot</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                #{order.posOrderId || order.id.slice(0, 8)}
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{formatPhone(order.customerPhone)}</TableCell>
              <TableCell>{formatDate(order.deliveryDate)}</TableCell>
              <TableCell>{order.primaryTimeSlot}</TableCell>
              <TableCell className="text-right">{order.noOfItems}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(order.productTotal) + Number(order.deliveryFee))}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <OrderActionsMenu order={order} onEditDetails={onEditOrder} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
