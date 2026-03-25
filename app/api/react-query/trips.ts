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

// ─── Trip Detail ─────────────────────────────────────────────────────────────

export interface RouteStopDetail {
  id: string
  sequenceNumber: number
  status: string
  eta?: string | null
  arrivedAt?: string | null
  completedAt?: string | null
  failedAt?: string | null
  failureReason?: string | null
  deliveryNotes?: string | null
}

export interface TripDetailDriver {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  licenseNumber?: string | null
  licenseExpiration?: string | null
  status: string
}

export interface TripDetailOrder {
  id: string
  dispensaryId: string
  orderNumber: string
  noOfItems: number
  customerName: string
  customerEmail?: string | null
  customerPhone: string
  customerType: "MED" | "REC"
  deliveryAddress: string
  deliveryLatitude?: number | null
  deliveryLongitude?: number | null
  pickupAddress?: string | null
  pickupLatitude?: number | null
  pickupLongitude?: number | null
  primaryTimeSlot: string
  productTotal: number
  deliveryFee: number
  deliveryDate: string
  deliveryNotes?: string | null
  status: string
  posOrderId?: string | null
  biotrackManifestId?: string | null
  biotrackManifestStatus?: string | null
  assignedDriverId?: string | null
  assignedVehicleId?: string | null
  routeId?: string | null
  createdAt: string
  updatedAt: string
  dispensary?: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
  } | null
  vehicle?: {
    id: string
    name: string
    make?: string | null
    model?: string | null
    plateNumber: string
  } | null
  routeStop?: RouteStopDetail | null
}

export interface TripTimelineEvent {
  status: string
  label: string
  timestamp: string
  description?: string
}

export interface TripDetail {
  order: TripDetailOrder
  driver: TripDetailDriver | null
  timeline: TripTimelineEvent[]
}

interface TripDetailResponse {
  success: boolean
  message: string
  data: TripDetail
}

export const useTripDetailQuery = (id: string) =>
  useQuery({
    queryKey: ["trips", id],
    queryFn: async () => {
      const res = await deliveryApiClient.get<TripDetailResponse>(`/trips/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })

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
