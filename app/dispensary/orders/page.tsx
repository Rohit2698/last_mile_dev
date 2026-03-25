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
import { LayoutGrid, Table, Search, X } from "lucide-react"
import { useOrdersPage } from "./useOrdersPage"
import { OrderCardView } from "./OrderCardView"
import { OrderTableView } from "./OrderTableView"
import { CreateOrderModal } from "./CreateOrderModal"
import { ViewOrderDetailsModal } from "./ViewOrderDetailsModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { Pagination } from "@/components/Pagination"
import { FormDateRangePicker } from "@/components/fields/FormDateRangePicker"
import { useDeleteOrderMutation } from "@/app/api/react-query/orders"
import { orderStatusOptions } from "./util"
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
    searchInput,
    setSearchInput,
    filterStatus,
    setFilterStatus,
    filterDateRange,
    setFilterDateRange,
  } = useOrdersPage()

  const deleteOrderMutation = useDeleteOrderMutation()

  const hasActiveFilters = !!searchInput || !!filterStatus || !!filterDateRange?.from

  const clearFilters = () => {
    setSearchInput("")
    setFilterStatus("")
    setFilterDateRange(undefined)
  }

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

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, address..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={filterStatus || "all"}
            onValueChange={val => setFilterStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {orderStatusOptions.map(opt => (
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
