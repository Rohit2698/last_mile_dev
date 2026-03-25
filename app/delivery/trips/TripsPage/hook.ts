import { useState, useEffect } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useTripsQuery } from "@/app/api/react-query/trips"
import { useDeliveryConnections } from "@/app/api/react-query/connections"
import { useDriversQuery } from "@/app/api/react-query/drivers"
import { TripsViewMode } from "./type"

export const useTripsPageWizard = () => {
  const [viewMode, setViewMode] = useState<TripsViewMode>("accordion")
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined)
  const [filterDriverId, setFilterDriverId] = useState("")
  const [filterDispensaryId, setFilterDispensaryId] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError } = useTripsQuery({
    dispensaryId: filterDispensaryId || undefined,
    driverId: filterDriverId || undefined,
    status: filterStatus || undefined,
    search: search || undefined,
    dateFrom: filterDateRange?.from ? format(filterDateRange.from, "yyyy-MM-dd") : undefined,
    dateTo: filterDateRange?.to
      ? format(filterDateRange.to, "yyyy-MM-dd")
      : filterDateRange?.from
        ? format(filterDateRange.from, "yyyy-MM-dd")
        : undefined,
  })

  const { data: connections } = useDeliveryConnections()
  const { data: drivers = [] } = useDriversQuery()

  const dispensaryOptions = (connections ?? [])
    .filter((c) => c.status === "ACTIVE")
    .map((c) => ({ value: c.dispensary!.id, label: c.dispensary!.name }))

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: `${d.firstName} ${d.lastName}`,
  }))

  const orders = data?.orders ?? []
  const grouped = data?.grouped ?? []
  const total = data?.total ?? 0

  const hasFilters =
    !!filterDriverId ||
    !!filterDispensaryId ||
    !!filterDateRange?.from ||
    !!filterStatus ||
    !!searchInput

  const clearFilters = () => {
    setFilterDriverId("")
    setFilterDispensaryId("")
    setFilterDateRange(undefined)
    setFilterStatus("")
    setSearchInput("")
    setSearch("")
  }

  return {
    viewMode,
    setViewMode,
    orders,
    grouped,
    total,
    isLoading,
    isError,
    filterDateRange,
    setFilterDateRange,
    filterDriverId,
    setFilterDriverId,
    filterDispensaryId,
    setFilterDispensaryId,
    filterStatus,
    setFilterStatus,
    searchInput,
    setSearchInput,
    dispensaryOptions,
    driverOptions,
    hasFilters,
    clearFilters,
  }
}
