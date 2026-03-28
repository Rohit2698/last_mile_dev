"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { FormDateRangePicker } from "@/components/fields/FormDateRangePicker"
import type { DateRange } from "react-day-picker"

interface OrderFiltersProps {
  searchInput: string
  onSearchChange: (value: string) => void
  filterDispensaryId: string
  onDispensaryChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  filterDateType: string
  onDateTypeChange: (value: string) => void
  filterDateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  dispensaryOptions: { value: string; label: string }[]
  hasActiveFilters: boolean
  onClearFilters: () => void
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
]

const DATE_TYPES = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "old", label: "Past Orders" },
  { value: "custom", label: "Custom Range" },
]

export function OrderFilters({
  searchInput,
  onSearchChange,
  filterDispensaryId,
  onDispensaryChange,
  filterStatus,
  onStatusChange,
  filterDateType,
  onDateTypeChange,
  filterDateRange,
  onDateRangeChange,
  dispensaryOptions,
  hasActiveFilters,
  onClearFilters,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-50 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, address..."
          value={searchInput}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 flex-1"
        />
      </div>

      <Select
        value={filterDispensaryId || "all"}
        onValueChange={val => onDispensaryChange(val === "all" ? "" : val)}
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

      <Select
        value={filterStatus || "all"}
        onValueChange={val => onStatusChange(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {ORDER_STATUSES.map(status => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filterDateType}
        onValueChange={onDateTypeChange}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Dates" />
        </SelectTrigger>
        <SelectContent>
          {DATE_TYPES.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filterDateType === "custom" && (
        <FormDateRangePicker
          dateRange={filterDateRange}
          onDateRangeChange={onDateRangeChange}
          onApply={onDateRangeChange}
          placeholder="Select date range"
          className="w-64"
        />
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
