import { format } from "date-fns"

export function formatDeliveryDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy")
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

export function getStatusColor(status: string): string {
  const s = status.toUpperCase()
  if (s === "DELIVERED") return "text-green-600 bg-green-50"
  if (s === "IN_TRANSIT") return "text-blue-600 bg-blue-50"
  if (s === "ASSIGNED") return "text-amber-600 bg-amber-50"
  if (s === "CANCELLED") return "text-red-600 bg-red-50"
  return "text-gray-600 bg-gray-50"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
