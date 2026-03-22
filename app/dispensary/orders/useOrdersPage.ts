import { useState } from "react"
import { useOrdersQuery, Order } from "@/app/api/react-query/orders"
import { ViewMode } from "./util"

export const useOrdersPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const pageSize = 20

  const { data, isLoading, isError, error } = useOrdersQuery({
    page: currentPage,
    limit: pageSize,
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
  }
}
