/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react"
import {
  useOnboardRequirements,
  useUpdateOnboardRequirements,
} from "@/app/api/react-query/deliveryPartnerConfiguration"
import { DriverSetupFormData, driverSetupSchema } from "./util"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const useDriverSetup = () => {
  const {
    data: onboardData,
    isLoading: loadingOnboard,
    error: onboardError,
  } = useOnboardRequirements()

  const updateOnboardMutation = useUpdateOnboardRequirements()

  const onboardRequirements = useMemo(
    () => onboardData?.onboardRequirements || [],
    [onboardData],
  )
  const vehicleCheckFields = useMemo(
    () => onboardData?.vehicleCheckFields || [],
    [onboardData],
  )

  const form = useForm<DriverSetupFormData>({
    resolver: zodResolver(driverSetupSchema),
    defaultValues: {
      onboardRequirements,
      vehicleCheckFields,
    },
    values: {
      onboardRequirements,
      vehicleCheckFields,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form

  useEffect(() => {
    reset({
      onboardRequirements,
      vehicleCheckFields,
    })
  }, [onboardRequirements, vehicleCheckFields])

  const onboard = useWatch({
    control,
    name: "onboardRequirements",
  })

  const saveDriverSetup = async (data: DriverSetupFormData) => {
    updateOnboardMutation.mutate({
      onboardRequirements: data.onboardRequirements.map(item => ({
        id: item.id,
        isRequired: item.isRequired,
        isActive: item.isActive,
      })),
      vehicleCheckFields: data.vehicleCheckFields.map(item => ({
        id: item.id,
        isActive: item.isActive,
      })),
    })
  }

  return {
    onboardRequirements,
    vehicleCheckFields,
    isSaving: updateOnboardMutation.isPending,
    isLoading: loadingOnboard,
    error: onboardError,
    saveDriverSetup,
    onboard,
    handleSubmit,
    isSubmitting,
    control,
    form
  }
}
