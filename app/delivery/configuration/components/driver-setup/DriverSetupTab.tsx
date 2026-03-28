/* eslint-disable @typescript-eslint/no-explicit-any */
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDriverSetup } from "./hook"
import {
  ONBOARD_REQUIREMENT_DEFINITIONS,
  OnboardRequirement,
  VEHICLE_CHECK_FIELD_DEFINITIONS,
  VehicleCheckField,
} from "./util"
import VehicleCheckFieldForm from "./VechileCheckFieldForm"
import OnBoardRequirementForm from "./OnBoardRequirementForm"
import { QuestionDialog } from "../driver-question/QuestionDialog"
import { useDriverQuestions } from "../driver-question/hook"
import { Form } from "@/components/ui/form"


export const DriverSetupTab: React.FC = () => {
  const {
    onboardRequirements,
    vehicleCheckFields,
    isSaving,
    saveDriverSetup,
    handleSubmit,
    isSubmitting,
    onboard,
    control,
    form
  } = useDriverSetup()

  // We only need the question modal state from the driver questions hook
  const {
    showAddQuestion,
    editingQuestion,
    newQuestion,
    setNewQuestion,
    addOption,
    updateOption,
    removeOption,
    closeQuestionModal,
    handleSubmitQuestion,
  } = useDriverQuestions()
  return (
    <>
    <Form {...form}>
<form onSubmit={handleSubmit(saveDriverSetup)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Driver Setup</h2>
            <Button type="submit" disabled={isSaving || isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving || isSubmitting
                ? "Saving..."
                : "Save Setup Configuration"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboard Requirements</CardTitle>
                <CardDescription>
                  {onboardRequirements.filter(req => req.isActive).length}{" "}
                  active requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {onboardRequirements.map((requirement, index) => (
                  <OnBoardRequirementForm
                    key={`${requirement.id}-${index}`}
                    control={control as any}
                    index={index}
                    isRequired={onboard?.[index]?.isRequired}
                    requirement={
                      ONBOARD_REQUIREMENT_DEFINITIONS[
                        requirement.id
                      ] as OnboardRequirement
                    }
                  />
                ))}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Settings className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Configuration Note
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        Active requirements will be displayed to drivers during
                        onboarding. Required items must be completed before
                        drivers can start deliveries.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Check Fields</CardTitle>
                <CardDescription>
                  {vehicleCheckFields.filter(field => field.isActive).length}{" "}
                  active fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleCheckFields.map((field, index) => (
                  <VehicleCheckFieldForm
                    control={control as any}
                    field={
                      VEHICLE_CHECK_FIELD_DEFINITIONS[
                        field.id
                      ] as VehicleCheckField
                    }
                    index={index}
                    key={field.id}
                  />
                ))}

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Settings className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Vehicle Inspection
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        These fields will be included in the vehicle inspection
                        checklist that drivers must complete before starting
                        their shifts.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
      
      <QuestionDialog
        isOpen={showAddQuestion}
        onClose={closeQuestionModal}
        question={newQuestion}
        editingQuestion={editingQuestion}
        onUpdateQuestion={setNewQuestion}
        onSubmit={handleSubmitQuestion}
        onAddOption={addOption}
        onUpdateOption={updateOption}
        onRemoveOption={removeOption}
      />
    </>
  )
}
