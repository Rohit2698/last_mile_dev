import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatPhone = (phone: string): string => {
  if (!phone) return "N/A"

  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.length === 10) {
    const area = cleaned.slice(0, 3)
    const exchange = cleaned.slice(3, 6)
    const subscriber = cleaned.slice(6)
    return `${area} ${exchange} ${subscriber}`
  }

  if (cleaned.length === 11) {
    const country = cleaned.slice(0, 1)
    const area = cleaned.slice(1, 4)
    const exchange = cleaned.slice(4, 7)
    const subscriber = cleaned.slice(7)
    return `+${country} ${area} ${exchange} ${subscriber}`
  }

  if (cleaned.length === 12) {
    const country = cleaned.slice(0, 2)
    const area = cleaned.slice(2, 5)
    const exchange = cleaned.slice(5, 8)
    const subscriber = cleaned.slice(8)
    return `+${country} ${area} ${exchange} ${subscriber}`
  }

  return phone
}