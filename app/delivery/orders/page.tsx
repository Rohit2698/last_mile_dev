"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Table, Columns2 } from "lucide-react"
import { useDeliveryOrdersPage } from "./useDeliveryOrdersPage"
import { OrderCardView } from "./OrderCardView"
import { OrderTableView } from "./OrderTableView"
import { OrderDispensaryView } from "./OrderDispensaryView"
import { ViewOrderDetailsModal } from "./ViewOrderDetailsModal"
import { CreateOrderModal } from "./CreateOrderModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { Pagination } from "@/components/Pagination"
import { OrderFilters } from "./OrderFilters"
import { useDeleteDeliveryOrderMutation } from "@/app/api/react-query/deliveryOrders"
import { useDeliveryConnections } from "@/app/api/react-query/connections"
import { toast } from "react-toastify"

export default function DeliveryOrdersPage() {
  const {
    viewMode,
    setViewMode,
    orders,
    meta,
    isLoading,
    isError,
    currentPage,
    handlePageChange,
    viewingOrder,
    openViewModal,
    closeViewModal,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    editingOrder,
    openEditModal,
    deletingOrder,
    openDeleteModal,
    closeDeleteModal,
    searchInput,
    setSearchInput,
    filterDispensaryId,
    setFilterDispensaryId,
    filterStatus,
    setFilterStatus,
    filterDateType,
    setFilterDateType,
    filterDateRange,
    setFilterDateRange,
    clearFilters,
    hasActiveFilters,
  } = useDeliveryOrdersPage()

  const deleteOrderMutation = useDeleteDeliveryOrderMutation()
  const { data: connections } = useDeliveryConnections()

  const dispensaryOptions = (connections ?? [])
    .filter(c => c.status === "ACTIVE")
    .map(c => ({ value: c.dispensary!.id, label: c.dispensary!.name }))

  const handleConfirmDelete = async () => {
    if (!deletingOrder) return
    try {
      await deleteOrderMutation.mutateAsync(deletingOrder.id)
      toast.success("Order deleted successfully")
      closeDeleteModal()
    } catch {
      toast.error("Failed to delete order")
    }
  }

  return (
    <DashboardLayout role="delivery">
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <OrderFilters
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            filterDispensaryId={filterDispensaryId}
            onDispensaryChange={setFilterDispensaryId}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            filterDateType={filterDateType}
            onDateTypeChange={setFilterDateType}
            filterDateRange={filterDateRange}
            onDateRangeChange={setFilterDateRange}
            dispensaryOptions={dispensaryOptions}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
          
        </div>
        <div className="flex items-center justify-end">
            <Button
              variant={viewMode === "card" ? "secondary" : "outline"}
              size="icon"
              onClick={() => setViewMode("card")}
              title="Card View"
              className="rounded-none! rounded-bl-sm! rounded-tl-sm!"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              title="Table View"
              className="rounded-none!"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "dispensary" ? "secondary" : "outline"}
              size="icon"
              onClick={() => setViewMode("dispensary")}
              title="Dispensary View"
              className="rounded-none! rounded-br-sm! rounded-tr-sm!"
            >
              <Columns2 className="h-4 w-4" />
            </Button>
            <Button className="ml-4" onClick={openCreateModal}>Create New Order</Button>
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
            ) : viewMode === "table" ? (
              <OrderTableView
                orders={orders}
                onViewOrder={openViewModal}
                onEditOrder={openEditModal}
                onDeleteOrder={openDeleteModal}
              />
            ) : (
              <OrderDispensaryView
                orders={orders}
                onViewOrder={openViewModal}
                onEditOrder={openEditModal}
                onDeleteOrder={openDeleteModal}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={meta?.totalPages ?? 0}
              onPageChange={handlePageChange}
              total={meta?.total}
              showing={orders.length}
              itemLabel="orders"
            />
          </>
        )}
      </div>

      <ViewOrderDetailsModal
        open={!!viewingOrder}
        onOpenChange={open => !open && closeViewModal()}
        order={viewingOrder}
      />

      <CreateOrderModal
        open={isCreateModalOpen}
        onOpenChange={closeCreateModal}
        order={editingOrder}
      />

      <ConfirmationModal
        open={!!deletingOrder}
        onOpenChange={open => !open && closeDeleteModal()}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order #${
          deletingOrder?.posOrderId || deletingOrder?.id?.slice(0, 8)
        }? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteOrderMutation.isPending}
        variant="destructive"
      />
    </DashboardLayout>
  )
}
