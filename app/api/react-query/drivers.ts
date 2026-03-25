import { useQuery } from "@tanstack/react-query"
import deliveryApiClient from "@/lib/deliveryApiClient"

export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiration?: string | null
  biotrackDriverId?: string | null
  deliveryPartnerId: string
  createdAt: string
  updatedAt: string
}

interface DriversResponse {
  success: boolean
  message: string
  data: Driver[]
}

export const useDriversQuery = () =>
  useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const res = await deliveryApiClient.get<DriversResponse>("/drivers")
      return res.data.data
    },
  })
