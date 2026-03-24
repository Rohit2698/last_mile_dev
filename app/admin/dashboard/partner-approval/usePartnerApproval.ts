import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import type { DeliveryPartner } from "./types"
import {
  useAdminPartnersQuery,
  useAdminPartnerDetailQuery,
  useVerifyPartnerMutation,
  useUnverifyPartnerMutation,
  useReviewPartnerDocumentMutation,
} from "@/app/api/react-query/adminPartners"

export function usePartnerApproval() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [reviewDocumentId, setReviewDocumentId] = useState<string | null>(null)

  const partnersQuery = useAdminPartnersQuery(currentPage, searchTerm)
  const partnerDetailQuery = useAdminPartnerDetailQuery(selectedPartnerId)
  const verifyMutation = useVerifyPartnerMutation()
  const unverifyMutation = useUnverifyPartnerMutation()
  const reviewDocumentMutation = useReviewPartnerDocumentMutation(selectedPartnerId)

  const partners: DeliveryPartner[] = partnersQuery.data?.data ?? []
  const totalPages = partnersQuery.data
    ? Math.ceil(partnersQuery.data.meta.total / 10)
    : 1
  const selectedPartner = partnerDetailQuery.data ?? null

  const viewDetails = (partner: DeliveryPartner) => {
    setSelectedPartnerId(partner.id)
    setIsDetailOpen(true)
  }

  const handleVerify = async (partnerId: string) => {
    try {
      await verifyMutation.mutateAsync(partnerId)
      toast.success("Partner verified successfully!")
      setIsDetailOpen(false)
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to verify partner"
        : "Failed to verify partner"
      toast.error(msg)
    }
  }

  const handleUnverify = async (partnerId: string) => {
    try {
      await unverifyMutation.mutateAsync(partnerId)
      toast.success("Partner verification revoked.")
      setIsDetailOpen(false)
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to unverify partner"
        : "Failed to unverify partner"
      toast.error(msg)
    }
  }

  const handleOpenReviewDialog = (documentId: string, action: "approve" | "reject") => {
    setReviewDocumentId(documentId)
    setReviewAction(action)
    setIsReviewDialogOpen(true)
  }

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false)
    setReviewDocumentId(null)
    setReviewAction(null)
  }

  const handleConfirmReview = async (notes: string) => {
    if (!reviewDocumentId || !reviewAction) return
    try {
      await reviewDocumentMutation.mutateAsync({ documentId: reviewDocumentId, action: reviewAction, notes })
      toast.success(`Document ${reviewAction === "approve" ? "approved" : "rejected"} successfully`)
      handleCloseReviewDialog()
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message ?? `Failed to ${reviewAction} document`
        : `Failed to ${reviewAction} document`
      toast.error(msg)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const closeDetailDialog = () => {
    setIsDetailOpen(false)
    setSelectedPartnerId(null)
  }

  return {
    partners,
    isLoading: partnersQuery.isLoading,
    isDetailLoading: partnerDetailQuery.isLoading,
    searchTerm,
    currentPage,
    totalPages,
    selectedPartner,
    isDetailOpen,
    isReviewDialogOpen,
    reviewAction,
    handleVerify,
    handleUnverify,
    viewDetails,
    handleSearchChange,
    handlePageChange,
    closeDetailDialog,
    handleOpenReviewDialog,
    handleCloseReviewDialog,
    handleConfirmReview,
  }
}
