"use client"

import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Order } from "@/app/api/react-query/orders"

interface OrderActionsMenuProps {
  order: Order
  onViewDetails?: (order: Order) => void
  onEditDetails?: (order: Order) => void
  onDeleteOrder?: (order: Order) => void
}

export const OrderActionsMenu = ({
  order,
  onViewDetails,
  onEditDetails,
  onDeleteOrder,
}: OrderActionsMenuProps) => {


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
        <DropdownMenuItem onClick={(e) =>{
            e.stopPropagation()
            onEditDetails?.(order)}}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onDeleteOrder?.(order)}}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
