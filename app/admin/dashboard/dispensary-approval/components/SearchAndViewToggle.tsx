import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, LayoutGrid, LayoutList } from "lucide-react"
import type { ViewMode } from "../types"

interface SearchAndViewToggleProps {
  searchTerm: string
  viewMode: ViewMode
  onSearchChange: (value: string) => void
  onViewModeChange: (mode: ViewMode) => void
}

export function SearchAndViewToggle({
  searchTerm,
  viewMode,
  onSearchChange,
  onViewModeChange,
}: SearchAndViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-1 border rounded-md">
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("table")}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "card" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("card")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
