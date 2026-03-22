import React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { cn } from "@/lib/utils"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface PhoneInputFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
  country?: string
  preferredCountries?: string[]
  enableSearch?: boolean
  alwaysLightMode?: boolean
  description?: string
}

export const FormPhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Enter phone number",
  required = false,
  disabled = false,
  className,
  error,
  country = "au",
  preferredCountries = ["au", "ca"],
  enableSearch = true,
  alwaysLightMode = false,
  description,
}: PhoneInputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && (
                  <span className="text-red-500 leading-none">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <div className="phone-input-wrapper">
                <PhoneInput
                  {...field}
                  country={country}
                  preferredCountries={preferredCountries}
                  enableSearch={enableSearch}
                  placeholder={placeholder}
                  disabled={disabled}
                  containerClass={cn("w-full", !alwaysLightMode && "dark-mode")}
                  inputClass={cn(
                    "!w-full !border-gray-300 !bg-white !text-gray-900 !rounded-sm",
                    !alwaysLightMode &&
                      "dark:!bg-[#212121] dark:!text-gray-100 dark:!border-gray-600",
                    fieldState.error && "error",
                    className,
                  )}
                  buttonClass={cn(
                    "!bg-white !border-gray-300",
                    !alwaysLightMode &&
                      "dark:!bg-[#212121] dark:!border-gray-600 !rounded-tl-sm !rounded-bl-sm",
                    fieldState.error && "error",
                  )}
                  searchClass={cn(
                    "!bg-white !border-gray-300 !text-gray-900",
                    !alwaysLightMode &&
                      "dark:!bg-[#212121] dark:!text-gray-100 dark:!border-gray-600",
                  )}
                  dropdownClass={cn(
                    "!bg-white !border-gray-300",
                    "[&>li]:text-gray-500 [&_.country:hover]:bg-gray-200 [&_.country:hover]:dark:bg-gray-600",
                    !alwaysLightMode &&
                      "dark:!bg-[#212121] dark:!border-gray-600",
                  )}
                />
                {(fieldState.error || error) && (
                  <p
                    className={cn(
                      "mt-1 text-sm text-red-600",
                      !alwaysLightMode && "dark:text-red-400",
                    )}
                  >
                    {fieldState.error?.message || error}
                  </p>
                )}
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
