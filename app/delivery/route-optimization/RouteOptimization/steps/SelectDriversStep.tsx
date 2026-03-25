"use client"

import React from "react"
import { User, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Driver } from "@/app/api/react-query/drivers"
import { useDriversQuery } from "@/app/api/react-query/drivers"

interface SelectDriversStepProps {
  selectedDriverIds: string[]
  onToggleDriver: (driverId: string) => void
  onSubmit: (allDrivers: Driver[]) => void
  onBack: () => void
  suggestedDriverCount?: number
}

function DriverCard({
  driver,
  isSelected,
  onToggle,
}: {
  driver: Driver
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={onToggle}
    >
      <div className="shrink-0 text-primary">
        {isSelected ? (
          <CheckSquare size={18} />
        ) : (
          <Square size={18} className="text-muted-foreground" />
        )}
      </div>
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <User size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">
          {driver.firstName} {driver.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">{driver.email}</p>
      </div>
      <div className="text-right text-xs text-muted-foreground shrink-0">
        <p>{driver.phone}</p>
      </div>
    </div>
  )
}

const SelectDriversStep: React.FC<SelectDriversStepProps> = ({
  selectedDriverIds,
  onToggleDriver,
  onSubmit,
  onBack,
  suggestedDriverCount = 2,
}) => {
  const { data: drivers = [], isLoading, isError } = useDriversQuery()

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading drivers...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-sm text-destructive">
        Failed to load drivers. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {drivers.length} driver{drivers.length !== 1 ? "s" : ""} available
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Suggested: {suggestedDriverCount} drivers
          </Badge>
          {selectedDriverIds.length > 0 && (
            <Badge>{selectedDriverIds.length} selected</Badge>
          )}
        </div>
      </div>

      {drivers.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          No drivers found. Please add drivers to your account first.
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            isSelected={selectedDriverIds.includes(driver.id)}
            onToggle={() => onToggleDriver(driver.id)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => onSubmit(drivers)}
          disabled={selectedDriverIds.length === 0}
        >
          Optimize Route →
        </Button>
      </div>
    </div>
  )
}

export default SelectDriversStep
