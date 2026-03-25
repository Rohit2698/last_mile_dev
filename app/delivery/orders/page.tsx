"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LayoutGrid, Table, Columns2, Search, X } from "lucide-react"
import { useDeliveryOrdersPage } from "./useDeliveryOrdersPage"
import { OrderCardView } from "./OrderCardView"
import { OrderTableView } from "./OrderTableView"
import { OrderDispensaryView } from "./OrderDispensaryView"
import { ViewOrderDetailsModal } from "./ViewOrderDetailsModal"
import { CreateOrderModal } from "./CreateOrderModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { FormDateRangePicker } from "@/components/fields/FormDateRangePicker"
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
    filterDateRange,
    setFilterDateRange,
  } = useDeliveryOrdersPage()

  const deleteOrderMutation = useDeleteDeliveryOrderMutation()
  const { data: connections } = useDeliveryConnections()

  const dispensaryOptions = (connections ?? [])
    .filter(c => c.status === "ACTIVE")
    .map(c => ({ value: c.dispensary!.id, label: c.dispensary!.name }))

  const hasActiveFilters = !!searchInput || !!filterDispensaryId || !!filterDateRange?.from

  const clearFilters = () => {
    setSearchInput("")
    setFilterDispensaryId("")
    setFilterDateRange(undefined)
  }

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
          <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, address..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 flex-1"
            />
          </div>

          <Select
            value={filterDispensaryId || "all"}
            onValueChange={val => setFilterDispensaryId(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Dispensaries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dispensaries</SelectItem>
              {dispensaryOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormDateRangePicker
            dateRange={filterDateRange}
            onDateRangeChange={setFilterDateRange}
            onApply={setFilterDateRange}
            placeholder="Filter by delivery date"
            className="w-64"
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
          <div className="flex items-center">
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
        </div>

        {/* Filter bar */}
        

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
