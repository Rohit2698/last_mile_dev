"use client"

import React from "react"
import { useJsApiLoader } from "@react-google-maps/api"
import { useDeliveryConnections } from "@/app/api/react-query/connections"
import { useRouteOptimizationWizard } from "./hook"
import StepIndicator from "./StepIndicator"
import RouteOptimizationMap from "./RouteOptimizationMap"
import CreateRouteStep from "./steps/CreateRouteStep"
import SelectOrdersStep from "./steps/SelectOrdersStep"
import SelectDriversStep from "./steps/SelectDriversStep"
import TripDetailsStep from "./steps/TripDetailsStep"

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"]

const RouteOptimization: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "route-optimization-map",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const { data: connections } = useDeliveryConnections()
  const dispensaryOptions = (connections ?? [])
    .filter((c) => c.status === "ACTIVE")
    .map((c) => ({ value: c.dispensary!.id, label: c.dispensary!.name }))

  const {
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
  } = useRouteOptimizationWizard()

  function renderCurrentStep() {
    if (currentStep === 1) {
      return (
        <CreateRouteStep
          form={createRouteForm}
          onSubmit={handleCreateRouteSubmit}
          isLoaded={isLoaded}
          dispensaryOptions={dispensaryOptions}
          isEndLocationLocked={isEndLocationLocked}
          onUnlockEndLocation={unlockEndLocation}
        />
      )
    }

    if (currentStep === 2) {
      return (
        <SelectOrdersStep
          routeValues={createRouteForm.getValues()}
          selectedOrders={selectedOrders}
          onToggleOrder={toggleOrderSelection}
          onSubmit={handleOrdersSubmit}
          onBack={goBack}
        />
      )
    }

    if (currentStep === 3) {
      return (
        <SelectDriversStep
          selectedDriverIds={selectedDriverIds}
          onToggleDriver={toggleDriverSelection}
          onSubmit={handleDriversSubmit}
          onBack={goBack}
          suggestedDriverCount={Math.max(
            2,
            Math.ceil(selectedOrders.length / 5),
          )}
        />
      )
    }

    return (
      <TripDetailsStep
        tripAssignments={tripAssignments}
        onBack={goBack}
      />
    )
  }

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <RouteOptimizationMap isLoaded={isLoaded} />

      <div className="absolute top-4 left-4 z-10 w-max max-h-[calc(100vh-96px)] overflow-y-auto bg-background/95 backdrop-blur-sm rounded-xl shadow-xl border p-4 space-y-4">
        <StepIndicator currentStep={currentStep} />
        {renderCurrentStep()}
      </div>
    </div>
  )
}

export default RouteOptimization
