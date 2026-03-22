import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"
import { BasicInfo, VerificationDocument } from "@/app/dispensary/profile/types"

interface UpdateBasicInfoData {
  name: string
  phone?: string
  address?: string
  licenseNumber?: string
}

interface UploadDocumentData {
  documentType: string
  file: File
}

export const useBasicInfo = () => {
  return useQuery({
    queryKey: ["dispensary", "basic-info"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: BasicInfo }>(
        "/dispensary/basic-info"
      )
      return response.data.data
    },
  })
}

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateBasicInfoData) => {
      const response = await apiClient.put("/dispensary/basic-info", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "basic-info"] })
    },
  })
}

export const useVerificationDocuments = () => {
  return useQuery({
    queryKey: ["dispensary", "verification-documents"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: VerificationDocument[] }>(
        "/dispensary/verification-documents"
      )
      return response.data.data
    },
  })
}

export const useUploadVerificationDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UploadDocumentData) => {
      const formData = new FormData()
      formData.append("documentType", data.documentType)
      formData.append("file", data.file)
      const response = await apiClient.post("/dispensary/verification-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "verification-documents"] })
    },
  })
}

export const useDeleteVerificationDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/dispensary/verification-documents/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispensary", "verification-documents"] })
    },
  })
}
