import { z } from "zod"
import { addMinutes, format } from "date-fns"
import { Driver } from "@/app/api/react-query/drivers"
import { Order } from "@/app/api/react-query/orders"
import { TripAssignment } from "./type"

export const createRouteSchema = z.object({
  dispensaryId: z.string().min(1, "Please select a dispensary"),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  ignoreTimeWindows: z.boolean(),
})

export type CreateRouteFormValues = z.infer<typeof createRouteSchema>

export const STEP_LABELS: Record<number, string> = {
  1: "Create Route",
  2: "Select Orders",
  3: "Select Drivers",
  4: "Trip Details",
}

export const TOTAL_STEPS = 4

export function generateTripAssignments(
  drivers: Driver[],
  orders: Order[],
): TripAssignment[] {
  if (!drivers.length || !orders.length) return []

  const assignments: TripAssignment[] = drivers.map((driver) => ({
    driver,
    orders: [],
    estimatedFinishTime: "",
    deliveryCount: 0,
  }))

  orders.forEach((order, idx) => {
    const target = assignments[idx % assignments.length]
    target.orders.push(order)
    target.deliveryCount++
  })

  const now = new Date()
  assignments.forEach((a) => {
    const finish = addMinutes(now, a.deliveryCount * 30)
    a.estimatedFinishTime = format(finish, "hh:mm a")
  })

  return assignments.filter((a) => a.deliveryCount > 0)
}
