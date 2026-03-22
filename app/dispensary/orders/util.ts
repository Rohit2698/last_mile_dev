import { z } from "zod"

export type ViewMode = "table" | "card"

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  primaryTimeSlot: z.string().min(1, "Primary time slot is required"),
  secondaryTimeSlot: z.string().optional(),
  noOfItems: z.number().min(1, "At least 1 item is required"),
  productTotal: z.number().min(0, "Product total must be positive"),
  deliveryFee: z.number().min(0, "Delivery fee must be positive"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryNotes: z.string().optional(),
  posOrderId: z.string().optional(),
})

export type CreateOrderFormData = z.infer<typeof createOrderSchema>

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
