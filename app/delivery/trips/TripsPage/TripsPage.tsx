"use client"

import React from "react"
import { LayoutList, AlignJustify, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormDateRangePicker } from "@/components/fields/FormDateRangePicker"
import { useTripsPageWizard } from "./hook"
import TripListView from "./TripListView"
import TripAccordionView from "./TripAccordionView"

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
]

const TripsPage: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    orders,
    grouped,
    total,
    isLoading,
    isError,
    filterDateRange,
    setFilterDateRange,
    filterDispensaryId,
    setFilterDispensaryId,
    filterDriverId,
    setFilterDriverId,
    filterStatus,
    setFilterStatus,
    searchInput,
    setSearchInput,
    dispensaryOptions,
    driverOptions,
    hasFilters,
    clearFilters,
  } = useTripsPageWizard()

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search orders..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 w-52"
            />
          </div>

          <Select value={filterDispensaryId || "all"} onValueChange={(v) => setFilterDispensaryId(v === "all" ? "" : v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All dispensaries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dispensaries</SelectItem>
              {dispensaryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDriverId || "all"} onValueChange={(v) => setFilterDriverId(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All drivers</SelectItem>
              {driverOptions.map((opt) => (
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
            placeholder="Filter by date"
            className="w-56"
          />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {total} order{total !== 1 ? "s" : ""} assigned
            </span>
          )}
        </div>

        <div className="flex items-center">
          <Button
            variant={viewMode === "accordion" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("accordion")}
            title="Driver view"
            className="rounded-none! rounded-bl-sm! rounded-tl-sm!"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            title="List view"
            className="rounded-none! rounded-br-sm! rounded-tr-sm!"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading trips...
        </div>
      )}

      {isError && (
        <div className="py-16 text-center text-sm text-destructive">
          Failed to load trips. Please try again.
        </div>
      )}

      {!isLoading && !isError && viewMode === "accordion" && (
        <TripAccordionView grouped={grouped} />
      )}

      {!isLoading && !isError && viewMode === "list" && (
        <TripListView orders={orders} />
      )}
    </div>
  )
}

export default TripsPage
