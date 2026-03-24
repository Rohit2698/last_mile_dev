/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"
import type { DeliveryPartner } from "@/app/admin/dashboard/partner-approval/types"

interface PartnersResponse {
  success: boolean
  data: DeliveryPartner[]
  meta: {
    page: number
    limit: number
    total: number
  }
}


function adminHeaders() {
  const token = localStorage.getItem("adminToken")
  return { Authorization: `Bearer ${token}` }
}

export const useAdminPartnersQuery = (page: number, search: string) => {
  return useQuery({
    queryKey: ["admin", "delivery-partners", page, search],
    queryFn: async () => {
      const response = await apiClient.get<PartnersResponse>("/admin/delivery-partners", {
        params: { page, limit: 10, search: search || undefined },
        headers: adminHeaders(),
      })
      return response.data
    },
  })
}

export const useAdminPartnerDetailQuery = (partnerId: string | null) => {
  return useQuery({
    queryKey: ["admin", "delivery-partners", partnerId, "detail"],
    queryFn: async () => {
      const response = await apiClient.get<any>(
        `/admin/delivery-partners/${partnerId}`,
        { headers: adminHeaders() }
      )
      console.log("Partner Detail Response:", response.data)
      return {
        ...response.data.data,
        verificationDocuments: response.data.data.VerificationDocument || [],
      }
    },
    enabled: !!partnerId,
  })
}

export const useVerifyPartnerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partnerId: string) => {
      const response = await apiClient.post(
        `/admin/delivery-partners/${partnerId}/verify`,
        {},
        { headers: adminHeaders() }
      )
      return response.data
    },
    onSuccess: (_data, partnerId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "delivery-partners"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "delivery-partners", partnerId, "detail"] })
    },
  })
}

export const useUnverifyPartnerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (partnerId: string) => {
      const response = await apiClient.post(
        `/admin/delivery-partners/${partnerId}/unverify`,
        {},
        { headers: adminHeaders() }
      )
      return response.data
    },
    onSuccess: (_data, partnerId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "delivery-partners"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "delivery-partners", partnerId, "detail"] })
    },
  })
}

export const useReviewPartnerDocumentMutation = (partnerId: string | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ documentId, action, notes }: { documentId: string; action: "approve" | "reject"; notes?: string }) => {
      const response = await apiClient.post(
        `/admin/verification-documents/${documentId}/${action}`,
        { notes: notes || undefined },
        { headers: adminHeaders() }
      )
      return response.data
    },
    onSuccess: () => {
      if (partnerId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "delivery-partners", partnerId, "detail"] })
      }
    },
  })
}
