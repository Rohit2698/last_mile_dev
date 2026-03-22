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

interface FormTimeFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  description?: string
}

export function FormTimeField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "HH:MM AM/PM",
  required = false,
  disabled = false,
  className = "",
  description,
}: FormTimeFieldProps<T>) {
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
            <IMaskInput
              mask="00:00 aa"
              value={field.value || ""}
              onAccept={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
