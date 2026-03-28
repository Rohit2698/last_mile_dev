"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsTab } from "./components/general-settings/GeneralSettingsTab"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DeliveryWindowsTab } from "./components/delivery-windows/DeliveryWindowTab"
import { DriverQuestionsTab } from "./components/driver-question/DriverQuestionTab"
import { DriverSetupTab } from "./components/driver-setup/DriverSetupTab"
import { NotificationsTab } from "./components/notification-tab/NotificationTab"

const DeliveryPartnerConfiguration = () => {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <DashboardLayout role="delivery">
      <div className="space-y-6 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="windows">Delivery Windows</TabsTrigger>
              <TabsTrigger value="questions">Driver Questions</TabsTrigger>
              <TabsTrigger value="driver-setup">Driver Setup</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="general">
            <GeneralSettingsTab />
          </TabsContent>

          <TabsContent value="windows">
            <DeliveryWindowsTab />
          </TabsContent>

          <TabsContent value="questions">
            <DriverQuestionsTab />
          </TabsContent>

          <TabsContent value="driver-setup">
            <DriverSetupTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default DeliveryPartnerConfiguration
