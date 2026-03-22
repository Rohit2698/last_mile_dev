import { Control, FieldPath, FieldValues } from "react-hook-form"
import { IMaskInput } from "react-imask"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

interface FormTimeRangeFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  description?: string
}

export function FormTimeRangeField<T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  className = "",
  description,
}: FormTimeRangeFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const parseTimeRange = (value: string) => {
          if (!value) return { start: "", end: "" }
          const parts = value.split(" - ")
          return {
            start: parts[0]?.trim() || "",
            end: parts[1]?.trim() || "",
          }
        }

        const { start, end } = parseTimeRange(field.value)

        const handleStartChange = (value: string) => {
          const newValue = end ? `${value} - ${end}` : value
          field.onChange(newValue)
        }

        const handleEndChange = (value: string) => {
          const newValue = start ? `${start} - ${value}` : ` - ${value}`
          field.onChange(newValue)
        }

        const inputClassName = cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "flex-1"
        )

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="flex items-center gap-2">
                <IMaskInput
                  mask="00:00 aa"
                  value={start || ""}
                  onAccept={handleStartChange}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  placeholder="10:00 AM"
                  className={inputClassName}
                />
                <span className="text-muted-foreground">to</span>
                <IMaskInput
                  mask="00:00 aa"
                  value={end || ""}
                  onAccept={handleEndChange}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  placeholder="12:00 PM"
                  className={inputClassName}
                />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
