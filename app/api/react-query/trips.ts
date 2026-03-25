import { useQuery } from "@tanstack/react-query"
import deliveryApiClient from "@/lib/deliveryApiClient"
import { Order } from "./orders"

export interface TripDriver {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

export interface DriverTrip {
  driver: TripDriver
  orders: Order[]
}

export interface TripsResponse {
  success: boolean
  message: string
  data: {
    orders: Order[]
    grouped: DriverTrip[]
    total: number
  }
}

export interface TripsQueryParams {
  dispensaryId?: string
  dateFrom?: string
  dateTo?: string
  driverId?: string
  status?: string
  search?: string
}

export const useTripsQuery = (params?: TripsQueryParams) =>
  useQuery({
    queryKey: ["trips", params?.dispensaryId, params?.dateFrom, params?.dateTo, params?.driverId, params?.status, params?.search],
    queryFn: async () => {
      const res = await deliveryApiClient.get<TripsResponse>("/trips", {
        params: {
          ...(params?.dispensaryId ? { dispensaryId: params.dispensaryId } : {}),
          ...(params?.dateFrom ? { dateFrom: params.dateFrom } : {}),
          ...(params?.dateTo ? { dateTo: params.dateTo } : {}),
          ...(params?.driverId ? { driverId: params.driverId } : {}),
          ...(params?.status ? { status: params.status } : {}),
          ...(params?.search ? { search: params.search } : {}),
        },
      })
      return res.data.data
    },
  })
