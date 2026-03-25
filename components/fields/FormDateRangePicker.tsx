import { useState, useEffect } from "react"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange: (range?: DateRange) => void
  onApply?: (range?: DateRange) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
  dateFormat?: string
}

export const FormDateRangePicker = ({
  dateRange,
  onDateRangeChange,
  onApply,
  placeholder = "Select date range",
  disabled = false,
  className,
  clearable = true,
  dateFormat = "dd/MM/yyyy",
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    dateRange,
  )

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) return placeholder

    if (!range.to) {
      return format(range.from, dateFormat)
    }

    return `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`
  }

  const handleClearRange = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTempDateRange(undefined)
    onDateRangeChange(undefined)
    if (onApply) {
      onApply(undefined)
    }
  }

  const handleDateSelect = (range?: DateRange) => {
    setTempDateRange(range)
  }

  const handleApply = () => {
    onDateRangeChange(tempDateRange)
    if (onApply) {
      onApply(tempDateRange)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDateRange(dateRange)
    setIsOpen(false)
  }

  useEffect(() => {
    setTempDateRange(dateRange)
  }, [dateRange])

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="h-9">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {formatDateRange(dateRange)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-0">
            <Calendar
              mode="range"
              defaultMonth={tempDateRange?.from || dateRange?.from}
              selected={tempDateRange}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              disabled={disabled}
              initialFocus
            />
            <div className="flex justify-between gap-2 p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={disabled || !tempDateRange?.from}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {clearable && dateRange?.from && !disabled && (
        <button
          type="button"
          onClick={handleClearRange}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 z-20 transition-colors"
          aria-label="Clear date range"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
