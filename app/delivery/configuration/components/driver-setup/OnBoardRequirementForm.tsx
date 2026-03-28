/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwitchField } from "@/components/fields/SwitchFields"
import { OnboardRequirement } from "./util"
import { Badge } from "@/components/ui/badge"
import { Control } from "react-hook-form"

type OnBoardRequirementFormProps = {
  requirement: OnboardRequirement
  index: number
  isRequired: boolean
  control: Control<any>
}
const OnBoardRequirementForm = ({
  requirement,
  isRequired,
  index,
  control,
}: OnBoardRequirementFormProps) => {
  return (
    <div
      key={requirement.id}
      className="flex items-start justify-between p-3 border rounded-lg"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{requirement.name}</h3>
          {isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {requirement.description}
        </p>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Required
          </span>
          <SwitchField
            name={`onboardRequirements.${index}.isRequired`}
            control={control}
            className="mb-0"
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Active
          </span>
          <SwitchField
            name={`onboardRequirements.${index}.isActive`}
            control={control}
            className="mb-0"
          />
        </div>
      </div>
    </div>
  )
}

export default OnBoardRequirementForm
