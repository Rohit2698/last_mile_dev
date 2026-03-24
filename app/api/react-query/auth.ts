import { useMutation } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  address?: string
  licenseNumber?: string
}

interface LoginData {
  email: string
  password: string
}

export type VerificationStatusType = "WAITING_FOR_DOCUMENT" | "SENT_FOR_APPROVAL" | "REJECTED" | "APPROVED" | "APPROVED_WITH_SOME_CHANGES"
interface AuthResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    name: string
    token: string
    isVerified: boolean
    verificationStatus: VerificationStatusType
  }
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post<AuthResponse>(
        "/dispensary/register",
        data
      )
      return response.data
    },
  })
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post<AuthResponse>(
        "/dispensary/login",
        data
      )
      return response.data
    },
  })
}
