"use client"

import { MoreVertical, Eye, Edit, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Order, useUpdateOrderStatusMutation } from "@/app/api/react-query/orders"
import { getNextStatus, getNextStatusLabel } from "./util"
import { toast } from "react-toastify"

interface OrderActionsMenuProps {
  order: Order
  onViewDetails?: (order: Order) => void
  onEditDetails?: (order: Order) => void
}

export const OrderActionsMenu = ({
  order,
  onViewDetails,
  onEditDetails,
}: OrderActionsMenuProps) => {
  const updateStatusMutation = useUpdateOrderStatusMutation()
  const nextStatus = getNextStatus(order.status)
  const nextStatusLabel = getNextStatusLabel(order.status)

  const handleUpdateStatus = () => {
    if (!nextStatus) return

    updateStatusMutation.mutate(
      { orderId: order.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${nextStatusLabel}`)
        },
        onError: () => {
          toast.error("Failed to update order status")
        },
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetails?.(order)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditDetails?.(order)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </DropdownMenuItem>
        {nextStatus && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Update status to {nextStatusLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
