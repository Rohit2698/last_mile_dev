export type ViewMode = "table" | "card"

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
