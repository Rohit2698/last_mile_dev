/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge"
import { VehicleCheckField } from "./util"
import { Control } from "react-hook-form"
import { SwitchField } from "@/components/fields/SwitchFields"

type VehicleCheckFieldFormProps = {
  field: VehicleCheckField
  index: number
  control: Control<any>
}
const VehicleCheckFieldForm = ({
  field,
  control,
  index,
}: VehicleCheckFieldFormProps) => {
  return (
    <div
      key={field.id}
      className="flex items-start justify-between p-3 border rounded-lg"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{field.name}</h3>
          <Badge variant="outline" className="text-xs">
            {field.fieldType}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {field.description}
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
        <SwitchField
          name={`vehicleCheckFields.${index}.isActive`}
          control={control}
          className="mb-0"
        />
      </div>
    </div>
  )
}

export default VehicleCheckFieldForm
