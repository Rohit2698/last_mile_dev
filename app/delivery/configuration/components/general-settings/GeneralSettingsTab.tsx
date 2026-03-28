import React from "react"
import { Settings, Clock, MapPin, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useGeneralSettings } from "./hook"
import { RouteOptimizationOptions } from "@/lib/options"
import { FormNumberField, FormTextareaField } from "@/components/fields"
import { SwitchField } from "@/components/fields/SwitchFields"
import { FormSelect } from "@/components/fields/FormSelect"
import { Form } from "@/components/ui/form"

export const GeneralSettingsTab: React.FC = () => {
  const { isSaving, control, form, handleSubmit, saveGeneralSettings } =
    useGeneralSettings()
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(saveGeneralSettings)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">General Settings</h2>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save General Settings"}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Zones</CardTitle>
              <CardDescription>
                Provide delivery service areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormTextareaField
                    name="deliveryZipCodes"
                    control={control}
                    label="Delivery Zip Codes"
                    placeholder="Enter zip codes separated by commas (e.g., 12345, 67890, 11111)"
                    rows={3}
                    required
                    description="Separate multiple zip codes with commas"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Basic Settings</CardTitle>
              <CardDescription>
                Configure basic delivery system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchField
                name="autoAssignDrivers"
                control={control}
                label="Auto-assign drivers"
                icon={<Settings className="h-5 w-5" />}
              />

              <SwitchField
                name="realTimeTracking"
                control={control}
                label="Real-time tracking"
                icon={<Clock className="h-5 w-5" />}
              />

              <SwitchField
                name="mobileTracking"
                control={control}
                label="Mobile tracking"
                icon={<MapPin className="h-5 w-5" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
              <CardDescription>
                Configure route optimization and delivery parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormSelect
                name="routeOptimizationPriority"
                control={control}
                label="Route Optimization Priority"
                placeholder="Select optimization priority"
                options={RouteOptimizationOptions}
                description="Choose the primary optimization goal for route planning"
              />

              <FormNumberField
                name="maxDispensariesPerDriver"
                control={control}
                label="Max Dispensaries per Driver"
                min={1}
                max={10}
                description="Maximum number of dispensaries a single driver can deliver for in one route"
              />

              <FormNumberField
                name="serviceTimePerStop"
                control={control}
                label="Service Time per Stop"
                min={1}
                max={30}
                // unit="minutes"
                description="Average time spent at each delivery location"
              />

              <FormNumberField
                name="maxRouteDistance"
                control={control}
                label="Maximum Route Distance"
                min={10}
                max={200}
                // unit="miles"
                description="Maximum total distance for a single delivery route"
              />

              <FormNumberField
                name="breakDuration"
                control={control}
                label="Break Duration"
                min={15}
                max={60}
                // unit="minutes"
                description="Required break time for drivers during long routes"
              />

              <SwitchField
                name="dynamicRebalancing"
                control={control}
                label="Dynamic route rebalancing"
                icon={<Settings className="h-5 w-5" />}
              />

              <SwitchField
                name="realTimeUpdates"
                control={control}
                label="Real-time ETA updates"
                icon={<Clock className="h-5 w-5" />}
              />

              <SwitchField
                name="trafficConsideration"
                control={control}
                label="Traffic consideration"
                icon={<Settings className="h-5 w-5" />}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}
