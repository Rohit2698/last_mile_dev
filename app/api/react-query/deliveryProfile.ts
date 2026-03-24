import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import deliveryApiClient from "@/lib/deliveryApiClient"
import { PartnerProfile, VerificationDocument } from "@/app/delivery/profile/types"

interface UpdateProfileData {
  companyName: string
  phone?: string
  address?: string
}

interface UploadDocumentData {
  documentType: string
  file: File
}

export const usePartnerProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["delivery", "profile"],
    queryFn: async () => {
      const response = await deliveryApiClient.get<{
        success: boolean
        data: PartnerProfile
      }>("/delivery-partner/profile")
      return response.data.data
    },
    enabled,
  })
}

export const useUpdatePartnerProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await deliveryApiClient.put("/delivery-partner/profile", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "profile"] })
    },
  })
}

export const usePartnerVerificationDocuments = () => {
  return useQuery({
    queryKey: ["delivery", "verification-documents"],
    queryFn: async () => {
      const response = await deliveryApiClient.get<{
        success: boolean
        data: VerificationDocument[]
      }>("/delivery-partner/verification-documents")
      return response.data.data
    },
  })
}

export const useUploadPartnerVerificationDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UploadDocumentData) => {
      const formData = new FormData()
      formData.append("documentType", data.documentType)
      formData.append("file", data.file)
      const response = await deliveryApiClient.post(
        "/delivery-partner/verification-documents",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "verification-documents"] })
      queryClient.invalidateQueries({ queryKey: ["delivery", "profile"] })
    },
  })
}

export const useDeletePartnerVerificationDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deliveryApiClient.delete(
        `/delivery-partner/verification-documents/${id}`,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "verification-documents"] })
      queryClient.invalidateQueries({ queryKey: ["delivery", "profile"] })
    },
  })
}
