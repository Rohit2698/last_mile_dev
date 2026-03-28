import React from "react"
import { Bell, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SwitchField } from "@/components/fields/SwitchFields"
import { useNotificationSettingsForm } from "./hook"
import { Form } from "@/components/ui/form"

export const NotificationsTab: React.FC = () => {
  const { control, handleSubmit, isLoading, onSubmit, form, isSubmitting } =
    useNotificationSettingsForm()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading notification settings...</div>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notification Settings</h2>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Notification Settings"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how drivers and partners receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SwitchField
              name="emailNotifications"
              control={control}
              label="Email Notifications"
              icon={<Bell className="h-5 w-5" />}
            />

            <SwitchField
              name="smsNotifications"
              control={control}
              label="SMS Notifications"
              icon={<Bell className="h-5 w-5" />}
            />
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
