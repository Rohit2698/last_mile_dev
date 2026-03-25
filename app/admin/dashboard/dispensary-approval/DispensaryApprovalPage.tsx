"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispensaryApproval } from "./useDispensaryApproval"
import { DispensaryHeader } from "./components/DispensaryHeader"
import { SearchAndViewToggle } from "./components/SearchAndViewToggle"
import { DispensaryCardView } from "./components/DispensaryCardView"
import { DispensaryTableView } from "./components/DispensaryTableView"
import { DispensaryDetailDialog } from "./components/DispensaryDetailDialog"
import { DocumentReviewDialog } from "./components/DocumentReviewDialog"
import { Pagination } from "@/components/Pagination"

export default function DispensaryApprovalPage() {
  const {
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
  } = useDispensaryApproval()

  function renderContent() {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dispensaries...</p>
        </div>
      )
    }

    if (viewMode === "table") {
      return (
        <DispensaryTableView
          dispensaries={dispensaries}
          onViewDetails={viewDetails}
          onVerify={handleVerify}
          onUnverify={handleUnverify}
        />
      )
    }

    return (
      <DispensaryCardView
        dispensaries={dispensaries}
        onViewDetails={viewDetails}
        onVerify={handleVerify}
        onUnverify={handleUnverify}
      />
    )
  }

  return (
    <div className="space-y-6">
      <DispensaryHeader />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Dispensaries</CardTitle>
            <SearchAndViewToggle
              searchTerm={searchTerm}
              viewMode={viewMode}
              onSearchChange={handleSearchChange}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <DispensaryDetailDialog
        isOpen={isDetailOpen}
        dispensary={selectedDispensary}
        onClose={closeDetailDialog}
        onVerify={handleVerify}
        onUnverify={handleUnverify}
        onApproveDocument={(documentId) => handleOpenReviewDialog(documentId, "approve")}
        onRejectDocument={(documentId) => handleOpenReviewDialog(documentId, "reject")}
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
