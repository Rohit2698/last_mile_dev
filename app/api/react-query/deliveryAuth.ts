import { useMutation } from "@tanstack/react-query"
import deliveryApiClient from "@/lib/deliveryApiClient"

interface DeliveryRegisterData {
  email: string
  password: string
  companyName: string
  phone?: string
  address?: string
}

interface DeliveryLoginData {
  email: string
  password: string
}

interface DeliveryAuthResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    companyName: string
    token: string
  }
}

export const useDeliveryRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: DeliveryRegisterData) => {
      const response = await deliveryApiClient.post<DeliveryAuthResponse>(
        "/delivery-partner/register",
        data
      )
      return response.data
    },
  })
}

export const useDeliveryLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: DeliveryLoginData) => {
      const response = await deliveryApiClient.post<DeliveryAuthResponse>(
        "/delivery-partner/login",
        data
      )
      return response.data
    },
  })
}
