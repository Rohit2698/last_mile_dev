"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import axios from "axios"
import {
  useBasicInfo,
  useUpdateBasicInfo,
  useVerificationDocuments,
  useUploadVerificationDocument,
  useDeleteVerificationDocument,
} from "@/app/api/react-query/profile"
import { basicInfoSchema, BasicInfoFormData } from "./util"

export function useProfileWizard() {
  const { data: basicInfo, isLoading: isLoadingInfo } = useBasicInfo()
  const { data: documents, isLoading: isLoadingDocs } = useVerificationDocuments()
  const updateInfoMutation = useUpdateBasicInfo()
  const uploadDocMutation = useUploadVerificationDocument()
  const deleteDocMutation = useDeleteVerificationDocument()

  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const basicInfoForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: { name: "", phone: "", address: "", licenseNumber: "" },
  })

  useEffect(() => {
    if (!basicInfo) return
    basicInfoForm.reset({
      name: basicInfo.name ?? "",
      phone: basicInfo.phone ?? "",
      address: basicInfo.address ?? "",
      licenseNumber: basicInfo.licenseNumber ?? "",
    })
  }, [basicInfo, basicInfoForm])

  const onUpdateBasicInfo = async (data: BasicInfoFormData) => {
    try {
      await updateInfoMutation.mutateAsync(data)
      toast.success("Basic info updated successfully!")
    } catch (error: unknown) {
      let message = "Failed to update info. Please try again."
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      toast.error(message)
    }
  }

  const onUploadDocument = async (documentType: string, file: File) => {
    setUploadingType(documentType)
    try {
      await uploadDocMutation.mutateAsync({ documentType, file })
      toast.success("Document uploaded successfully!")
    } catch (error: unknown) {
      let message = "Failed to upload document. Please try again."
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      toast.error(message)
    } finally {
      setUploadingType(null)
    }
  }

  const onDeleteDocument = async () => {
    if (!deleteConfirmId) return
    try {
      await deleteDocMutation.mutateAsync(deleteConfirmId)
      toast.success("Document deleted successfully!")
    } catch (error: unknown) {
      let message = "Failed to delete document. Please try again."
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      toast.error(message)
    } finally {
      setDeleteConfirmId(null)
    }
  }

  return {
    basicInfoForm,
    basicInfo,
    documents,
    isLoadingInfo,
    isLoadingDocs,
    onUpdateBasicInfo,
    onUploadDocument,
    onDeleteDocument,
    isUpdatingInfo: updateInfoMutation.isPending,
    uploadingType,
    isDeletingDoc: deleteDocMutation.isPending,
    deleteConfirmId,
    setDeleteConfirmId,
  }
}
