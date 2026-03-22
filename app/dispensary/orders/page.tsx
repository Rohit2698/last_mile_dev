"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Table } from "lucide-react"
import { useOrdersPage } from "./useOrdersPage"
import { OrderCardView } from "./OrderCardView"
import { OrderTableView } from "./OrderTableView"
import { CreateOrderModal } from "./CreateOrderModal"
import { ViewOrderDetailsModal } from "./ViewOrderDetailsModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { useDeleteOrderMutation } from "@/app/api/react-query/orders"
import { toast } from "react-toastify"

export default function OrdersPage() {
  const {
    viewMode,
    toggleViewMode,
    orders,
    meta,
    isLoading,
    isError,
    currentPage,
    handlePageChange,
    isCreateModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    editingOrder,
    deletingOrder,
    openDeleteModal,
    closeDeleteModal,
    viewingOrder,
    openViewModal,
    closeViewModal,
  } = useOrdersPage()

  const deleteOrderMutation = useDeleteOrderMutation()

  const handleDeleteOrder = () => {
    if (!deletingOrder) return

    deleteOrderMutation.mutate(deletingOrder.id, {
      onSuccess: () => {
        toast.success("Order deleted successfully")
        closeDeleteModal()
      },
      onError: () => {
        toast.error("Failed to delete order")
      },
    })
  }

  return (
    <DashboardLayout role="dispensary">
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              Manage and track all your orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleViewMode}
              title={viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
            >
              {viewMode === "card" ? <Table className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            <Button onClick={openCreateModal}>Create New Order</Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive">
              Failed to load orders. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {viewMode === "card" ? (
              <OrderCardView
                orders={orders}
                onViewOrder={openViewModal}
                onEditOrder={openEditModal}
                onDeleteOrder={openDeleteModal}
              />
            ) : (
              <OrderTableView
                orders={orders}
                onViewOrder={openViewModal}
                onEditOrder={openEditModal}
                onDeleteOrder={openDeleteModal}
              />
            )}

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {orders.length} of {meta.total} orders
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= meta.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateOrderModal
        open={isCreateModalOpen}
        onOpenChange={closeModal}
        order={editingOrder}
      />

      <ViewOrderDetailsModal
        open={!!viewingOrder}
        onOpenChange={(open) => !open && closeViewModal()}
        order={viewingOrder}
      />

      <ConfirmationModal
        open={!!deletingOrder}
        onOpenChange={(open) => !open && closeDeleteModal()}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        description={`Are you sure you want to delete order ${deletingOrder?.posOrderId || deletingOrder?.id.slice(0, 8)}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteOrderMutation.isPending}
        variant="destructive"
      />
    </DashboardLayout>
  )
}
