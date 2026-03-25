export type ViewMode = "table" | "card" | "dispensary"

export const getStatusBadgeVariant = (
  status: string,
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


export const COLUMN_COLORS = [
  {
    border: "border-l-blue-500",
    header: "bg-blue-50 dark:bg-blue-950/30",
    badge: "bg-blue-500",
  },
  {
    border: "border-l-green-500",
    header: "bg-green-50 dark:bg-green-950/30",
    badge: "bg-green-500",
  },
  {
    border: "border-l-purple-500",
    header: "bg-purple-50 dark:bg-purple-950/30",
    badge: "bg-purple-500",
  },
  {
    border: "border-l-orange-500",
    header: "bg-orange-50 dark:bg-orange-950/30",
    badge: "bg-orange-500",
  },
  {
    border: "border-l-teal-500",
    header: "bg-teal-50 dark:bg-teal-950/30",
    badge: "bg-teal-500",
  },
  {
    border: "border-l-red-500",
    header: "bg-red-50 dark:bg-red-950/30",
    badge: "bg-red-500",
  },
]

export const STATUS_STYLES: Record<string, string> = {
  confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  delivered: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  processing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
}


export const getStatusStyle = (status: string) => {
  return (
    STATUS_STYLES[status.toLowerCase()] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  )
}