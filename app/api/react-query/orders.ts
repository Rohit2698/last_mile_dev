import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"

export interface Order {
  id: string
  dispensaryId: string
  noOfItems: number
  customerName: string
  customerPhone: string
  deliveryAddress: string
  primaryTimeSlot: string
  secondaryTimeSlot?: string | null
  productTotal: number
  deliveryFee: number
  deliveryDate: string
  deliveryNotes?: string | null
  posOrderId?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface OrdersResponse {
  success: boolean
  message: string
  data: Order[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface OrdersQueryParams {
  page?: number
  limit?: number
}

export const useOrdersQuery = (params?: OrdersQueryParams) => {
  return useQuery({
    queryKey: ["orders", params?.page, params?.limit],
    queryFn: async () => {
      const response = await apiClient.get<OrdersResponse>("/dispensary/orders", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      })
      return response.data
    },
  })
}
