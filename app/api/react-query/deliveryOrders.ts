import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import deliveryApiClient from "@/lib/deliveryApiClient"
import { Order } from "./orders"

interface DeliveryOrdersResponse {
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

interface DeliveryOrdersQueryParams {
  page?: number
  limit?: number
  search?: string
  dispensaryId?: string
  deliveryDateFrom?: string
  deliveryDateTo?: string
}

export const useDeliveryOrdersQuery = (params?: DeliveryOrdersQueryParams) => {
  return useQuery({
    queryKey: [
      "delivery-orders",
      params?.page,
      params?.limit,
      params?.search,
      params?.dispensaryId,
      params?.deliveryDateFrom,
      params?.deliveryDateTo,
    ],
    queryFn: async () => {
      const response = await deliveryApiClient.get<DeliveryOrdersResponse>(
        "/delivery-partner/orders",
        {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 20,
            ...(params?.search ? { search: params.search } : {}),
            ...(params?.dispensaryId ? { dispensaryId: params.dispensaryId } : {}),
            ...(params?.deliveryDateFrom ? { deliveryDateFrom: params.deliveryDateFrom } : {}),
            ...(params?.deliveryDateTo ? { deliveryDateTo: params.deliveryDateTo } : {}),
          },
        },
      )
      return response.data
    },
  })
}

export interface CreateDeliveryOrderData {
  dispensaryId: string
  noOfItems: number
  customerName: string
  customerEmail?: string
  customerPhone: string
  customerType?: "MED" | "REC"
  deliveryAddress: string
  primaryTimeSlot: string
  productTotal: number
  deliveryFee: number
  deliveryDate: string
  deliveryNotes?: string
  posOrderId?: string
}

interface CreateDeliveryOrderResponse {
  success: boolean
  message: string
  data: Order
}

export const useCreateDeliveryOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateDeliveryOrderData) => {
      const response = await deliveryApiClient.post<CreateDeliveryOrderResponse>(
        "/delivery-partner/orders",
        data,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] })
    },
  })
}

export interface UpdateDeliveryOrderData extends Partial<Omit<CreateDeliveryOrderData, "dispensaryId">> {
  status?: string
}

export const useUpdateDeliveryOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: UpdateDeliveryOrderData }) => {
      const response = await deliveryApiClient.put<CreateDeliveryOrderResponse>(
        `/delivery-partner/orders/${orderId}`,
        data,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] })
    },
  })
}

export const useDeleteDeliveryOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await deliveryApiClient.delete(`/delivery-partner/orders/${orderId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] })
    },
  })
}
