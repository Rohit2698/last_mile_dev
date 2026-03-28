import { useState, useEffect, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { format, startOfDay, endOfDay, addDays } from "date-fns"
import { Order } from "@/app/api/react-query/orders"
import { useDeliveryOrdersQuery } from "@/app/api/react-query/deliveryOrders"
import { ViewMode } from "./util"

export const useDeliveryOrdersPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("dispensary")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)

  // Filter state
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [filterDispensaryId, setFilterDispensaryId] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDateType, setFilterDateType] = useState("today")
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined)

  const handleFilterDispensaryId = (val: string) => {
    setFilterDispensaryId(val)
    setCurrentPage(1)
  }

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val)
    setCurrentPage(1)
  }

  const handleFilterDateType = (val: string) => {
    setFilterDateType(val)
    setCurrentPage(1)
    // Reset custom date range when switching away from custom
    if (val !== "custom") {
      setFilterDateRange(undefined)
    }
  }

  const handleFilterDateRange = (range: DateRange | undefined) => {
    setFilterDateRange(range)
    setCurrentPage(1)
  }

  // Compute the actual date range based on dateType
  const computedDateRange = useMemo(() => {
    const today = new Date()
    
    switch (filterDateType) {
      case "today":
        return {
          from: startOfDay(today),
          to: endOfDay(today),
        }
      case "upcoming":
        return {
          from: startOfDay(addDays(today, 1)),
          to: undefined,
        }
      case "old":
        return {
          from: undefined,
          to: endOfDay(addDays(today, -1)),
        }
      case "custom":
        return filterDateRange
      default:
        return undefined
    }
  }, [filterDateType, filterDateRange])

  const clearFilters = () => {
    setSearchInput("")
    setSearch("")
    setFilterDispensaryId("")
    setFilterStatus("")
    setFilterDateType("today")
    setFilterDateRange(undefined)
    setCurrentPage(1)
  }

  const hasActiveFilters = !!search || !!filterDispensaryId || !!filterStatus || filterDateType !== "today"

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
    status: filterStatus || undefined,
    deliveryDateFrom: computedDateRange?.from ? format(computedDateRange.from, "yyyy-MM-dd") : undefined,
    deliveryDateTo: computedDateRange?.to ? format(computedDateRange.to, "yyyy-MM-dd") : undefined,
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
    filterStatus,
    setFilterStatus: handleFilterStatus,
    filterDateType,
    setFilterDateType: handleFilterDateType,
    filterDateRange,
    setFilterDateRange: handleFilterDateRange,
    clearFilters,
    hasActiveFilters,
  }
}
