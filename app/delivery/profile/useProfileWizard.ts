"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import axios from "axios"
import {
  usePartnerProfile,
  useUpdatePartnerProfile,
  usePartnerVerificationDocuments,
  useUploadPartnerVerificationDocument,
  useDeletePartnerVerificationDocument,
} from "@/app/api/react-query/deliveryProfile"
import { profileSchema, ProfileFormData } from "./util"

export function useProfileWizard() {
  const { data: profile, isLoading: isLoadingProfile } = usePartnerProfile()
  const { data: documents, isLoading: isLoadingDocs } = usePartnerVerificationDocuments()
  const updateProfileMutation = useUpdatePartnerProfile()
  const uploadDocMutation = useUploadPartnerVerificationDocument()
  const deleteDocMutation = useDeletePartnerVerificationDocument()

  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { companyName: "", phone: "", address: "" },
  })

  useEffect(() => {
    if (!profile) return
    profileForm.reset({
      companyName: profile.companyName ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
    })
  }, [profile, profileForm])

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      toast.success("Profile updated successfully!")
    } catch (error: unknown) {
      let message = "Failed to update profile. Please try again."
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
    profileForm,
    profile,
    documents,
    isLoadingProfile,
    isLoadingDocs,
    onUpdateProfile,
    onUploadDocument,
    onDeleteDocument,
    isUpdatingProfile: updateProfileMutation.isPending,
    uploadingType,
    isDeletingDoc: deleteDocMutation.isPending,
    deleteConfirmId,
    setDeleteConfirmId,
  }
}
