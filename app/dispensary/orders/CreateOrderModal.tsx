/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  Order,
} from "@/app/api/react-query/orders"
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
import {
  updateOrderSchema,
  UpdateOrderFormData,
  orderStatusOptions,
} from "./util"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { FormSelect } from "@/components/fields/FormSelect"

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: Order | null
}

export const CreateOrderModal = ({
  open,
  onOpenChange,
  order,
}: CreateOrderModalProps) => {
  const createOrderMutation = useCreateOrderMutation()
  const updateOrderMutation = useUpdateOrderMutation()
  const isEditMode = !!order

  const form = useForm<UpdateOrderFormData>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      primaryTimeSlot: "",
      secondaryTimeSlot: "",
      noOfItems: "1",
      productTotal: "0",
      deliveryFee: "0",
      deliveryDate: "",
      deliveryNotes: "",
      posOrderId: "",
      status: "PENDING",
    },
  })

  useEffect(() => {
    if (order && open) {
      // Pre-populate form with order data for editing
      form.reset({
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        primaryTimeSlot: order.primaryTimeSlot,
        secondaryTimeSlot: order.secondaryTimeSlot || "",
        noOfItems: order.noOfItems as string | number, // Accept both string and number  
        productTotal: order.productTotal as string | number, // Accept both string and number
        deliveryFee: order.deliveryFee as string | number, // Accept both string and number
        deliveryDate: order.deliveryDate.split("T")[0], // Format date for input
        deliveryNotes: order.deliveryNotes || "",
        posOrderId: order.posOrderId || "",
        status: order.status,
      })
    } else if (!order && open) {
      // Reset form for create mode
      form.reset({
        customerName: "",
        customerPhone: "",
        deliveryAddress: "",
        primaryTimeSlot: "",
        secondaryTimeSlot: "",
        noOfItems: "1",
        productTotal: "0",
        deliveryFee: "0",
        deliveryDate: "",
        deliveryNotes: "",
        posOrderId: "",
        status: "PENDING",
      })
    }
  }, [order, open])

  const onSubmit = async (data: UpdateOrderFormData) => {
    try {
      // Convert string values to numbers for API
      const apiData = {
        ...data,
        noOfItems: Number(data.noOfItems),
        productTotal: Number(data.productTotal),
        deliveryFee: Number(data.deliveryFee),
      }

      if (isEditMode && order) {
        // Update existing order
        await updateOrderMutation.mutateAsync({
          orderId: order.id,
          data: apiData,
        })
        toast.success("Order updated successfully")
      } else {
        // Create new order (exclude status from payload)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...createData } = apiData
        await createOrderMutation.mutateAsync(createData)
        toast.success("Order created successfully")
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      let message = isEditMode
        ? "Failed to update order"
        : "Failed to create order"
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
          <DialogTitle>
            {isEditMode ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the order details below."
              : "Fill in the details to create a new delivery order."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isEditMode && (
              <FormSelect
                control={form.control}
                name="status"
                label="Order Status"
                options={orderStatusOptions}
                required
                disabled={!isEditMode}
              />
            )}

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
                disabled={
                  createOrderMutation.isPending || updateOrderMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createOrderMutation.isPending || updateOrderMutation.isPending
                }
              >
                {isEditMode
                  ? updateOrderMutation.isPending
                    ? "Updating..."
                    : "Update Order"
                  : createOrderMutation.isPending
                    ? "Creating..."
                    : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
