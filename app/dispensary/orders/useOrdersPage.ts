import { useState } from "react"
import { useOrdersQuery } from "@/app/api/react-query/orders"
import { ViewMode } from "./util"

export const useOrdersPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [currentPage, setCurrentPage] = useState(1)
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
  }
}
