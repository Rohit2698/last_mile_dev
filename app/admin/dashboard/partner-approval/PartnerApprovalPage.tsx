"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePartnerApproval } from "./usePartnerApproval"
import { PartnerTableView } from "./components/PartnerTableView"
import { PartnerDetailDialog } from "./components/PartnerDetailDialog"
import { DocumentReviewDialog } from "./components/DocumentReviewDialog"
import { Pagination } from "@/components/Pagination"

export default function PartnerApprovalPage() {
  const {
    partners,
    isLoading,
    isDetailLoading,
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
  } = usePartnerApproval()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Delivery Partner Approval
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage delivery partner applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Delivery Partners</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by company or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading delivery partners...</p>
            </div>
          ) : (
            <PartnerTableView partners={partners} onViewDetails={viewDetails} />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <PartnerDetailDialog
        isOpen={isDetailOpen}
        isLoading={isDetailLoading}
        partner={selectedPartner}
        onClose={closeDetailDialog}
        onVerify={handleVerify}
        onUnverify={handleUnverify}
        onApproveDocument={(docId: string) => handleOpenReviewDialog(docId, "approve")}
        onRejectDocument={(docId: string) => handleOpenReviewDialog(docId, "reject")}
      />

      <DocumentReviewDialog
        isOpen={isReviewDialogOpen}
        action={reviewAction}
        onClose={handleCloseReviewDialog}
        onConfirm={handleConfirmReview}
      />
    </div>
  )
}
