import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

interface CreateOrderResponse {
  success: boolean
  message: string
  data: Order
}

export interface CreateOrderData {
  noOfItems: number
  customerName: string
  customerPhone: string
  deliveryAddress: string
  primaryTimeSlot: string
  secondaryTimeSlot?: string
  productTotal: number
  deliveryFee: number
  deliveryDate: string
  deliveryNotes?: string
  posOrderId?: string
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

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiClient.post<CreateOrderResponse>(
        "/dispensary/orders",
        data
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

interface UpdateOrderStatusData {
  orderId: string
  status: string
}

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ orderId, status }: UpdateOrderStatusData) => {
      const response = await apiClient.patch<CreateOrderResponse>(
        `/dispensary/orders/${orderId}`,
        { status }
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export interface UpdateOrderData extends CreateOrderData {
  status?: string
}

interface UpdateOrderParams {
  orderId: string
  data: UpdateOrderData
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ orderId, data }: UpdateOrderParams) => {
      const response = await apiClient.put<CreateOrderResponse>(
        `/dispensary/orders/${orderId}`,
        data
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

interface DeleteOrderResponse {
  success: boolean
  message: string
  data: null
}

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.delete<DeleteOrderResponse>(
        `/dispensary/orders/${orderId}`
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
