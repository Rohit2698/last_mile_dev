/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateOrderMutation } from "@/app/api/react-query/orders"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  FormInputField,
  FormPhoneInput,
  FormTextareaField,
  FormNumberField,
  FormTimeRangeField,
} from "@/components/fields"
import { createOrderSchema, CreateOrderFormData } from "./util"
import { toast } from "react-toastify"
import { useEffect } from "react"

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateOrderModal = ({
  open,
  onOpenChange,
}: CreateOrderModalProps) => {
  const createOrderMutation = useCreateOrderMutation()

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      primaryTimeSlot: "",
      secondaryTimeSlot: "",
      noOfItems: 1,
      productTotal: 0,
      deliveryFee: 0,
      deliveryDate: "",
      deliveryNotes: "",
      posOrderId: "",
    },
  })

  useEffect(() => {
    form.reset()
  }, [open]);

  const onSubmit = async (data: CreateOrderFormData) => {
    try {
      await createOrderMutation.mutateAsync(data)
      toast.success("Order created successfully")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      let message = "Failed to create order"
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        message = apiError.response?.data?.message || message
      }
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new delivery order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                name="customerName"
                control={form.control}
                label="Customer Name"
                placeholder="John Doe"
                required
              />

              <FormPhoneInput
                name="customerPhone"
                control={form.control}
                label="Customer Phone"
                placeholder="Enter phone number"
                required
                country="us"
              />
            </div>

            <FormTextareaField
              name="deliveryAddress"
              control={form.control}
              label="Delivery Address"
              placeholder="123 Main St, City, State, ZIP"
              rows={2}
              required
            />

            <div>
              <FormInputField
                name="deliveryDate"
                control={form.control}
                label="Delivery Date"
                type="date"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormTimeRangeField
                name="primaryTimeSlot"
                control={form.control}
                label="Primary Time Slot"
                required
                description="Select start and end time"
              />
              <FormTimeRangeField
                name="secondaryTimeSlot"
                control={form.control}
                label="Secondary Time Slot (Optional)"
                description="Select start and end times for backup slot"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormNumberField
                name="noOfItems"
                control={form.control}
                label="Number of Items"
                min={1}
                required
              />

              <FormNumberField
                name="productTotal"
                control={form.control}
                label="Product Total ($)"
                step="0.01"
                min={0}
                required
              />

              <FormNumberField
                name="deliveryFee"
                control={form.control}
                label="Delivery Fee ($)"
                step="0.01"
                min={0}
                required
              />
            </div>

            <FormInputField
              name="posOrderId"
              control={form.control}
              label="POS Order ID (Optional)"
              placeholder="POS-12345"
            />

            <FormTextareaField
              name="deliveryNotes"
              control={form.control}
              label="Delivery Notes (Optional)"
              placeholder="Any special instructions..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createOrderMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createOrderMutation.isPending}>
                {createOrderMutation.isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
