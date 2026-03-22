import { z } from "zod"

export type ViewMode = "table" | "card"

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  primaryTimeSlot: z.string().min(1, "Primary time slot is required"),
  secondaryTimeSlot: z.string().optional(),
  noOfItems: z.union([z.string().min(1, "Number of items is required"), z.number().min(1, "At least 1 item is required")]),
  productTotal: z.union([z.string().min(1, "Product total is required"), z.number().min(0, "Product total must be positive")]),
  deliveryFee: z.union([z.string().min(1, "Delivery fee is required"), z.number().min(0, "Delivery fee must be positive")]),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryNotes: z.string().optional(),
  posOrderId: z.string().optional(),
})

export type CreateOrderFormData = z.infer<typeof createOrderSchema>

export const updateOrderSchema = createOrderSchema.extend({
  status: z.string().optional(),
})

export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>

export const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary"
    case "assigned":
      return "outline"
    case "in_transit":
      return "default"
    case "delivered":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))
}

export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

type OrderStatus = "PENDING" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED"

export const getNextStatus = (currentStatus: string): OrderStatus | null => {
  const status = currentStatus.toUpperCase()
  switch (status) {
    case "PENDING":
      return "ASSIGNED"
    case "ASSIGNED":
      return "IN_TRANSIT"
    case "IN_TRANSIT":
      return "DELIVERED"
    case "DELIVERED":
    case "CANCELLED":
      return null
    default:
      return "ASSIGNED"
  }
}

export const getNextStatusLabel = (currentStatus: string): string | null => {
  const nextStatus = getNextStatus(currentStatus)
  return nextStatus ? formatStatus(nextStatus) : null
}

export const orderStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
]
