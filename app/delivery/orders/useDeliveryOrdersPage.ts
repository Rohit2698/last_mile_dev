import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Order } from "@/app/api/react-query/orders"
import { useDeliveryOrdersQuery } from "@/app/api/react-query/deliveryOrders"
import { ViewMode } from "./util"

export const useDeliveryOrdersPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)

  // Filter state
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [filterDispensaryId, setFilterDispensaryId] = useState("")
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined)

  const handleFilterDispensaryId = (val: string) => {
    setFilterDispensaryId(val)
    setCurrentPage(1)
  }

  const handleFilterDateRange = (range: DateRange | undefined) => {
    setFilterDateRange(range)
    setCurrentPage(1)
  }

  const pageSize = 20

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError, error } = useDeliveryOrdersQuery({
    page: currentPage,
    limit: pageSize,
    search: search || undefined,
    dispensaryId: filterDispensaryId || undefined,
    deliveryDateFrom: filterDateRange?.from ? format(filterDateRange.from, "yyyy-MM-dd") : undefined,
    deliveryDateTo: filterDateRange?.to ? format(filterDateRange.to, "yyyy-MM-dd") : undefined,
  })

  const toggleViewMode = () => {
    setViewMode(prev => (prev === "table" ? "card" : "table"))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const openViewModal = (order: Order) => {
    setViewingOrder(order)
  }

  const closeViewModal = () => {
    setViewingOrder(null)
  }

  const openCreateModal = () => {
    setEditingOrder(null)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setEditingOrder(null)
  }

  const openEditModal = (order: Order) => {
    setEditingOrder(order)
    setIsCreateModalOpen(true)
  }

  const openDeleteModal = (order: Order) => {
    setDeletingOrder(order)
  }

  const closeDeleteModal = () => {
    setDeletingOrder(null)
  }

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    orders: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
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
    // filters
    searchInput,
    setSearchInput,
    filterDispensaryId,
    setFilterDispensaryId: handleFilterDispensaryId,
    filterDateRange,
    setFilterDateRange: handleFilterDateRange,
  }
}
