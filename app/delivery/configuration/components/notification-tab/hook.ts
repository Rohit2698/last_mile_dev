import { useEffect, useMemo } from "react"
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/app/api/react-query/deliveryPartnerConfiguration"
import {
  NotificationSettingsFormData,
  notificationSettingsSchema,
} from "./util"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const useNotificationSettingsForm = () => {
  // API hooks
  const { data: notificationData, isLoading } = useNotificationSettings()
  const updateMutation = useUpdateNotificationSettings()

  // Form default values - only email and SMS
  const defaultValues: NotificationSettingsFormData = useMemo(
    () => ({
      emailNotifications: notificationData?.emailNotification ?? true,
      smsNotifications: notificationData?.smsNotification ?? false,
    }),
    [notificationData],
  )

  // Handle form submission
  const onSubmit = async (data: NotificationSettingsFormData) => {
    updateMutation.mutateAsync({
      emailNotification: data.emailNotifications,
      smsNotification: data.smsNotifications,
    })
  }

  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
  })
  const { control, handleSubmit, reset } = form

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return {
    defaultValues,
    isLoading,
    onSubmit,
    isSubmitting: updateMutation.isPending,
    control,
    handleSubmit,
    form,
  }
}
