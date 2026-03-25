import { Order } from "@/app/api/react-query/orders"
import { Driver } from "@/app/api/react-query/drivers"

export type WizardStep = 1 | 2 | 3 | 4

export interface TripAssignment {
  driver: Driver
  orders: Order[]
  estimatedFinishTime: string
  deliveryCount: number
}
