import { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface SwitchFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export function SwitchField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  required = false,
  disabled = false,
  className,
  icon,
}: SwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="text-gray-400 dark:text-gray-500">{icon}</div>
              )}
              {label && (
                <FormLabel className={cn(disabled && "opacity-50 cursor-not-allowed")}>
                  {label}
                  {required && <span className="text-destructive ml-0.5">*</span>}
                </FormLabel>
              )}
            </div>
            <FormControl>
              <Switch
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </div>
          {description && (
            <FormDescription className={cn(icon ? "ml-11" : "ml-8")}>
              {description}
            </FormDescription>
          )}
          <FormMessage className={cn(icon ? "ml-11" : "ml-8")} />
        </FormItem>
      )}
    />
  )
}