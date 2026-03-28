import { useForm } from "react-hook-form"
import {
  useGeneralSettings as useGeneralSettingsQuery,
  useUpdateGeneralSettings,
} from "@/app/api/react-query/deliveryPartnerConfiguration"
import {
  defaultGeneralSettings,
  GeneralSettingsFormData,
  generalSettingsSchema,
} from "./util"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { formatZipCodes, parseZipCodes } from "@/lib/utils"

export const useGeneralSettings = () => {
  const { data: generalSettings, isLoading, error } = useGeneralSettingsQuery()

  const updateMutation = useUpdateGeneralSettings()

  const saveGeneralSettings = async (value: GeneralSettingsFormData) => {
    debugger
    await updateMutation.mutateAsync({
      data: {
        ...value,
        deliveryZipCodes: parseZipCodes(value.deliveryZipCodes),
      },
    })
  }

  // Setup form with react-hook-form
  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: defaultGeneralSettings,
  })

  useEffect(() => {
    if (generalSettings) {
      console.log("debug:Setting general settings in form:", generalSettings)
      form.reset({
        ...generalSettings,
        deliveryZipCodes: generalSettings.deliveryZipCodes
          ? formatZipCodes(generalSettings.deliveryZipCodes)
          : "",
      })
      return
    }
    form.reset(defaultGeneralSettings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalSettings])

  return {
    generalSettings: generalSettings,
    isSaving: updateMutation.isPending,
    isLoading,
    error,
    saveGeneralSettings,
    control: form.control,
    handleSubmit: form.handleSubmit,
    form,
  }
}
