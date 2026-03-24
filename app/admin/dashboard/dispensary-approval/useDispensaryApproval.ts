import { useState, useEffect } from "react"
import apiClient from "@/lib/apiClient"
import { toast } from "react-toastify"
import type { Dispensary, ViewMode } from "./types"

export function useDispensaryApproval() {
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [reviewDocumentId, setReviewDocumentId] = useState<string | null>(null)

  useEffect(() => {
    fetchDispensaries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  const fetchDispensaries = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get("/admin/dispensaries", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setDispensaries(response.data.data)
        setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.limit))
      }
    } catch (error) {
      console.error("Error fetching dispensaries:", error)
      toast.error("Failed to fetch dispensaries")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (dispensaryId: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.post(
        `/admin/dispensaries/${dispensaryId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data.success) {
        toast.success("Dispensary verified successfully")
        fetchDispensaries()
        setIsDetailOpen(false)
      }
    } catch (error) {
      console.error("Error verifying dispensary:", error)
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message // eslint-disable-line @typescript-eslint/no-explicit-any
        : "Failed to verify dispensary"
      toast.error(errorMessage)
    }
  }

  const handleUnverify = async (dispensaryId: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.post(
        `/admin/dispensaries/${dispensaryId}/unverify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data.success) {
        toast.success("Dispensary verification revoked")
        fetchDispensaries()
        setIsDetailOpen(false)
      }
    } catch (error) {
      console.error("Error unverifying dispensary:", error)
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message // eslint-disable-line @typescript-eslint/no-explicit-any
        : "Failed to unverify dispensary"
      toast.error(errorMessage)
    }
  }

  const viewDetails = async (dispensary: Dispensary) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get(`/admin/dispensaries/${dispensary.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSelectedDispensary(response.data.data)
        setIsDetailOpen(true)
      }
    } catch (error) {
      console.error("Error fetching dispensary details:", error)
      toast.error("Failed to fetch dispensary details")
    }
  }

  const refreshSelectedDispensary = async (dispensaryId: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get(`/admin/dispensaries/${dispensaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSelectedDispensary(response.data.data)
      }
    } catch (error) {
      console.error("Error refreshing dispensary details:", error)
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
      const token = localStorage.getItem("adminToken")
      const endpoint = reviewAction === "approve"
        ? `/admin/verification-documents/${reviewDocumentId}/approve`
        : `/admin/verification-documents/${reviewDocumentId}/reject`

      const response = await apiClient.post(
        endpoint,
        { notes: notes || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success(`Document ${reviewAction === "approve" ? "approved" : "rejected"} successfully`)
        handleCloseReviewDialog()

        if (selectedDispensary) {
          await refreshSelectedDispensary(selectedDispensary.id)
        }
      }
    } catch (error) {
      console.error("Error reviewing document:", error)
      const errorMessage = error instanceof Error && "response" in error
        ? (error as any).response?.data?.message // eslint-disable-line @typescript-eslint/no-explicit-any
        : `Failed to ${reviewAction} document`
      toast.error(errorMessage)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const closeDetailDialog = () => {
    setIsDetailOpen(false)
  }

  return {
    dispensaries,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    selectedDispensary,
    isDetailOpen,
    viewMode,
    isReviewDialogOpen,
    reviewAction,
    handleVerify,
    handleUnverify,
    viewDetails,
    handleSearchChange,
    handlePageChange,
    handleViewModeChange,
    closeDetailDialog,
    handleOpenReviewDialog,
    handleCloseReviewDialog,
    handleConfirmReview,
  }
}
