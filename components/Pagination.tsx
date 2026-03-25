import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Total number of items — shows "Showing X of Y [itemLabel]" when provided alongside `showing` */
  total?: number
  /** Number of items visible on the current page */
  showing?: number
  /** Label for the item type, e.g. "orders". Defaults to "items". */
  itemLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  showing,
  itemLabel = "items",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const controls = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  )

  if (total !== undefined && showing !== undefined) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {showing} of {total} {itemLabel}
        </p>
        {controls}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center mt-4">
      {controls}
    </div>
  )
}
