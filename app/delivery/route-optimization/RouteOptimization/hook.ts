import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Order } from "@/app/api/react-query/orders"
import { Driver } from "@/app/api/react-query/drivers"
import {
  createRouteSchema,
  CreateRouteFormValues,
  generateTripAssignments,
} from "./util"
import { WizardStep, TripAssignment } from "./type"

export const useRouteOptimizationWizard = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([])
  const [tripAssignments, setTripAssignments] = useState<TripAssignment[]>([])
  const [isEndLocationLocked, setIsEndLocationLocked] = useState(true)

  const createRouteForm = useForm<CreateRouteFormValues>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      dispensaryId: "",
      startLocation: "",
      endLocation: "",
      deliveryDate: "",
      startTime: "",
      endTime: "",
      ignoreTimeWindows: false,
    },
  })

  const handleCreateRouteSubmit = useCallback(
    (data: CreateRouteFormValues) => {
      if (isEndLocationLocked) {
        createRouteForm.setValue("endLocation", data.startLocation)
      }
      setCurrentStep(2)
    },
    [isEndLocationLocked, createRouteForm],
  )

  const handleOrdersSubmit = useCallback(() => {
    if (selectedOrders.length === 0) return
    setCurrentStep(3)
  }, [selectedOrders])

  const handleDriversSubmit = useCallback(
    (allDrivers: Driver[]) => {
      const chosenDrivers = allDrivers.filter((d) =>
        selectedDriverIds.includes(d.id),
      )
      const assignments = generateTripAssignments(chosenDrivers, selectedOrders)
      setTripAssignments(assignments)
      setCurrentStep(4)
    },
    [selectedDriverIds, selectedOrders],
  )

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }, [currentStep])

  const toggleOrderSelection = useCallback((order: Order) => {
    setSelectedOrders((prev) =>
      prev.some((o) => o.id === order.id)
        ? prev.filter((o) => o.id !== order.id)
        : [...prev, order],
    )
  }, [])

  const toggleDriverSelection = useCallback((driverId: string) => {
    setSelectedDriverIds((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId],
    )
  }, [])

  const unlockEndLocation = useCallback(() => {
    setIsEndLocationLocked(false)
  }, [])

  return {
    currentStep,
    createRouteForm,
    selectedOrders,
    selectedDriverIds,
    tripAssignments,
    isEndLocationLocked,
    handleCreateRouteSubmit,
    handleOrdersSubmit,
    handleDriversSubmit,
    goBack,
    toggleOrderSelection,
    toggleDriverSelection,
    unlockEndLocation,
  }
}
