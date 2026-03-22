import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

interface OrderTableViewProps {
  orders: Order[]
}

export const OrderTableView = ({ orders }: OrderTableViewProps) => {
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
              <TableCell>{order.customerPhone}</TableCell>
              <TableCell>{formatDate(order.deliveryDate)}</TableCell>
              <TableCell>{order.primaryTimeSlot}</TableCell>
              <TableCell className="text-right">{order.noOfItems}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.productTotal + order.deliveryFee)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
