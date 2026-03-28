/* eslint-disable react-hooks/purity */
"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useDeliveryWindows,
  useBatchUpdateDeliveryWindows,
  type DeliveryWindow,
} from "@/app/api/react-query/deliveryPartnerConfiguration"
import { dayOptions } from "@/lib/options"

const DAYS_OF_WEEK = [{
    value: 1,
    label: "Monday",
  },
  {
    value: 2,
    label: "Tuesday",
  },
  {
    value: 3,
    label: "Wednesday",
  },
  {
    value: 4,
    label: "Thursday",
  },
  {
    value: 5,
    label: "Friday",
  },
  {
    value: 6,
    label: "Saturday",
  },
  {
    value: 7,
    label: "Sunday",
  },
] as const

interface LocalWindow extends Omit<DeliveryWindow, "id"> {
  id?: string
  tempId?: string
}

export const DeliveryWindowsTab: React.FC = () => {
  const { data: serverWindows = [], isLoading } = useDeliveryWindows()
  console.log("debug:Fetched delivery windows from server:", serverWindows)
  const batchUpdateMutation = useBatchUpdateDeliveryWindows()

  // Local state for managing windows before saving
  const [localWindows, setLocalWindows] = useState<LocalWindow[]>([])

  // Initialize local windows from server data
  useEffect(() => {
    if (serverWindows.length > 0) {
      setLocalWindows(serverWindows)
    }
  }, [serverWindows])

  const getWindowsForDay = (day: string): LocalWindow[] => {
    return localWindows.filter(w => w.day.toString() === day.toString())
  }

  const handleAddWindow = (day: string) => {
    const newWindow: LocalWindow = {
      tempId: `temp-${Date.now()}`,
      day: parseInt(day, 10),
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    }
    setLocalWindows([...localWindows, newWindow])
  }

  const handleUpdateWindow = (
    index: number,
    field: keyof LocalWindow,
    value: string | boolean,
  ) => {
    const updatedWindows = [...localWindows]
    updatedWindows[index] = {
      ...updatedWindows[index],
      [field]: value,
    }
    setLocalWindows(updatedWindows)
  }

  const handleDeleteWindow = (index: number) => {
    const updatedWindows = localWindows.filter((_, i) => i !== index)
    setLocalWindows(updatedWindows)
  }

  const handleSaveAll = async () => {
    try {
      // Convert localWindows to DeliveryWindow format for API
      const windowsToSave: DeliveryWindow[] = localWindows.map(w => ({
        ...(w.id && { id: w.id }),
        day: w.day,
        startTime: w.startTime,
        endTime: w.endTime,
        isActive: w.isActive,
      }))

      await batchUpdateMutation.mutateAsync({
        deliveryWindows: windowsToSave,
      })
    } catch (error) {
      console.error("Error saving delivery windows:", error)
    }
  }

  const hasChanges =
    JSON.stringify(localWindows) !== JSON.stringify(serverWindows)

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button
          onClick={handleSaveAll}
          disabled={!hasChanges || batchUpdateMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {batchUpdateMutation.isPending ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Delivery Hours</CardTitle>
          <CardDescription>
            Configure delivery windows for each day of the week. You can add
            multiple time slots per day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS_OF_WEEK.map(day => {
              const windows = getWindowsForDay(day.value.toString())
              const dayLabel =
                dayOptions.find(opt => opt.value === day.value)?.label || day.label

              return (
                <div
                  key={day.value}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold capitalize">
                      {dayLabel}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddWindow(day.value.toString())}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  {windows.length === 0 ? (
                    <div className="text-xs text-gray-500 italic py-1">
                      No delivery windows configured.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {windows.map(window => {
                        const globalIndex = localWindows.findIndex(
                          w =>
                            (w.id && w.id === window.id) ||
                            (w.tempId && w.tempId === window.tempId),
                        )
                        return (
                          <div
                            key={window.id || window.tempId}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                          >
                            <Input
                              type="time"
                              value={window.startTime}
                              onChange={e =>
                                handleUpdateWindow(
                                  globalIndex,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              className="h-8 text-sm flex-1"
                            />
                            <span className="text-sm text-gray-500">-</span>
                            <Input
                              type="time"
                              value={window.endTime}
                              onChange={e =>
                                handleUpdateWindow(
                                  globalIndex,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                              className="h-8 text-sm flex-1"
                            />
                            <div className="flex items-center gap-1.5 pl-2">
                              <input
                                type="checkbox"
                                id={`active-${window.id || window.tempId}`}
                                checked={window.isActive}
                                onChange={e =>
                                  handleUpdateWindow(
                                    globalIndex,
                                    "isActive",
                                    e.target.checked,
                                  )
                                }
                                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                              />
                              <Label
                                htmlFor={`active-${window.id || window.tempId}`}
                                className="text-xs cursor-pointer whitespace-nowrap"
                              >
                                Active
                              </Label>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWindow(globalIndex)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
