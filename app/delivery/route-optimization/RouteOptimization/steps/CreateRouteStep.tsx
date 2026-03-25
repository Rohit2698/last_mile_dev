"use client"

import React, { useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Autocomplete } from "@react-google-maps/api"
import { format } from "date-fns"
import { CalendarIcon, Lock, Pencil } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { FormSelect } from "@/components/fields/FormSelect"
import { FormTimeField } from "@/components/fields"
import { CreateRouteFormValues } from "../util"
import { OptionType } from "@/components/fields/type"

interface CreateRouteStepProps {
  form: UseFormReturn<CreateRouteFormValues>
  onSubmit: (data: CreateRouteFormValues) => void
  isLoaded: boolean
  dispensaryOptions: OptionType[]
  isEndLocationLocked: boolean
  onUnlockEndLocation: () => void
}

const CreateRouteStep: React.FC<CreateRouteStepProps> = ({
  form,
  onSubmit,
  isLoaded,
  dispensaryOptions,
  isEndLocationLocked,
  onUnlockEndLocation,
}) => {
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  )
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  )
  const [calendarOpen, setCalendarOpen] = useState(false)

  const startLocationValue = form.watch("startLocation")

  function renderStartLocationInput(
    field: {
      value: string
      onChange: (val: string) => void
      onBlur: () => void
    }
  ) {
    if (!isLoaded) {
      return (
        <Input
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          placeholder="Search start address..."
        />
      )
    }

    return (
      <Autocomplete
        onLoad={(auto) => {
          startAutocompleteRef.current = auto
        }}
        onPlaceChanged={() => {
          const place = startAutocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            field.onChange(place.formatted_address)
            if (isEndLocationLocked) {
              form.setValue("endLocation", place.formatted_address)
            }
          }
        }}
      >
        <Input
          defaultValue={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          placeholder="Search start address..."
        />
      </Autocomplete>
    )
  }

  function renderEndLocationInput(
    field: {
      value: string
      onChange: (val: string) => void
      onBlur: () => void
    }
  ) {
    if (isEndLocationLocked) {
      return (
        <div className="flex gap-2">
          <Input
            value={startLocationValue}
            disabled
            placeholder="Same as start location"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onUnlockEndLocation}
            title="Change end location"
          >
            <Pencil size={14} />
          </Button>
        </div>
      )
    }

    if (!isLoaded) {
      return (
        <Input
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          placeholder="Search end address..."
        />
      )
    }

    return (
      <Autocomplete
        onLoad={(auto) => {
          endAutocompleteRef.current = auto
        }}
        onPlaceChanged={() => {
          const place = endAutocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            field.onChange(place.formatted_address)
          }
        }}
      >
        <Input
          defaultValue={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          placeholder="Search end address..."
        />
      </Autocomplete>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 items-baseline md:grid-cols-2 gap-4">
          <FormSelect
            control={form.control}
            name="dispensaryId"
            label="Dispensary Partner"
            placeholder="Select dispensary"
            options={dispensaryOptions}
            required
          />

          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start Location{" "}
                  <span className="text-red-500 leading-none">*</span>
                </FormLabel>
                <FormControl>
                  {renderStartLocationInput({
                    value: field.value,
                    onChange: field.onChange,
                    onBlur: field.onBlur,
                  })}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  End Location{" "}
                  <span className="text-red-500 leading-none">*</span>
                  {isEndLocationLocked && (
                    <Lock size={12} className="text-muted-foreground ml-1" />
                  )}
                </FormLabel>
                <FormControl>
                  {renderEndLocationInput({
                    value: field.value,
                    onChange: field.onChange,
                    onBlur: field.onBlur,
                  })}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Delivery{" "}
                  <span className="text-red-500 leading-none">*</span>
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? new Date(field.value) : undefined
                      }
                      onSelect={(date) => {
                        field.onChange(
                          date ? format(date, "yyyy-MM-dd") : "",
                        )
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormTimeField
            control={form.control}
            name="startTime"
            label="Start Time"
            placeholder="HH:MM AM/PM"
            required
          />

          <FormTimeField
            control={form.control}
            name="endTime"
            label="End Time"
            placeholder="HH:MM AM/PM"
            required
          />
        </div>

        <FormField
          control={form.control}
          name="ignoreTimeWindows"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Ignore time windows
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">Next →</Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateRouteStep
