import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { useOrdersQuery, Order } from "@/app/api/react-query/orders"
import { ViewMode } from "./util"

export const useOrdersPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  // Filter state
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined)

  const pageSize = 20

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val)
    setCurrentPage(1)
  }

  const handleFilterDateRange = (range: DateRange | undefined) => {
    setFilterDateRange(range)
    setCurrentPage(1)
  }

  const { data, isLoading, isError, error } = useOrdersQuery({
    page: currentPage,
    limit: pageSize,
    search: search || undefined,
    status: filterStatus || undefined,
    deliveryDateFrom: filterDateRange?.from ? format(filterDateRange.from, "yyyy-MM-dd") : undefined,
    deliveryDateTo: filterDateRange?.to ? format(filterDateRange.to, "yyyy-MM-dd") : undefined,
  })

  const toggleViewMode = () => {
    setViewMode(prevMode => (prevMode === "table" ? "card" : "table"))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const openCreateModal = () => {
    setEditingOrder(null)
    setIsCreateModalOpen(true)
  }

  const openEditModal = (order: Order) => {
    setEditingOrder(order)
    setIsCreateModalOpen(true)
  }

  const closeModal = () => {
    setIsCreateModalOpen(false)
    setEditingOrder(null)
  }

  const openDeleteModal = (order: Order) => {
    setDeletingOrder(order)
  }

  const closeDeleteModal = () => {
    setDeletingOrder(null)
  }

  const openViewModal = (order: Order) => {
    setViewingOrder(order)
  }

  const closeViewModal = () => {
    setViewingOrder(null)
  }

  return {
    viewMode,
    toggleViewMode,
    orders: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
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
    // filters
    searchInput,
    setSearchInput,
    filterStatus,
    setFilterStatus: handleFilterStatus,
    filterDateRange,
    setFilterDateRange: handleFilterDateRange,
  }
}
