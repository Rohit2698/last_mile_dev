import { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormNumberFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  description?: string
  min?: number
  max?: number
  step?: string
}

export function FormNumberField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  description,
  min,
  max,
  step = "1",
}: FormNumberFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              type="number"
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value === "" ? undefined : Number(value))
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
