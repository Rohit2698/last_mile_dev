"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Table } from "lucide-react"
import { useOrdersPage } from "./useOrdersPage"
import { OrderCardView } from "./OrderCardView"
import { OrderTableView } from "./OrderTableView"

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
  } = useOrdersPage()

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
            <Button>Create New Order</Button>
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
              <OrderCardView orders={orders} />
            ) : (
              <OrderTableView orders={orders} />
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
    </DashboardLayout>
  )
}
