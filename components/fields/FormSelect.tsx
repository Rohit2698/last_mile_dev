/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { Plus, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { OptionType } from "./type"
import { cn } from "@/lib/utils"

const ADD_NEW_VALUE = "__ADD_NEW__"

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues, unknown>
  name: TName
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean
  className?: string
  options: OptionType[]
  required?: boolean
  clearable?: boolean
  onAddNew?: () => void
}

export const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  className,
  options,
  required = false,
  clearable,
  onAddNew,
}: FormSelectProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Check if control has a wrapper for onChange
        const wrappedOnChange = (control as any)?._wrapFieldOnChange
          ? (control as any)._wrapFieldOnChange(field.onChange)
          : field.onChange

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}{" "}
                {required && (
                  <span className="text-red-500  leading-none">*</span>
                )}
              </FormLabel>
            )}
            <div className="relative">
              <Select
                onValueChange={val => {
                  if (onAddNew && val === ADD_NEW_VALUE) {
                    onAddNew()
                    return
                  }
                  if (!val) {
                    return
                  }
                  wrappedOnChange(val)
                }}
                value={field.value ?? ""}
                disabled={disabled}
              >
                <FormControl className="w-full">
                  <SelectTrigger
                    className={cn(
                      className,
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                  {onAddNew && (
                    <SelectItem
                      value={ADD_NEW_VALUE}
                      className={cn(
                        "mt-1 border-t border-border pt-2 font-medium text-primary! data-highlighted:bg-primary/10 data-highlighted:text-primary flex items-cente !justify-centerr gap-2",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {clearable && field.value && (
                <button
                  type="button"
                  onClick={() => wrappedOnChange("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-sm transition-colors"
                  disabled={disabled}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

type CommonSelectProps = {
  id: string
  options: OptionType[]
  onChange: (value: string) => void
  value: string
  placeholder?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  onClear?: () => void
}
export const CommonSelect = ({
  id,
  options,
  onChange,
  value,
  placeholder,
  disabled,
  clearable,
  onClear,
}: CommonSelectProps) => {
  return (
    <div className="relative">
      <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-35">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={`${id}-${opt.value}`} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {clearable && value !== "all" && (
        <button
          type="button"
          onClick={() => onClear?.() || onChange("all")}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-sm transition-colors"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  )
}
