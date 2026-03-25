/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  useCreateDeliveryOrderMutation,
  useUpdateDeliveryOrderMutation,
} from "@/app/api/react-query/deliveryOrders"
import { Order } from "@/app/api/react-query/orders"
import { useDeliveryConnections } from "@/app/api/react-query/connections"
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
import { FormSelect } from "@/components/fields/FormSelect"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { orderStatusOptions } from "../../../app/dispensary/orders/util"

const deliveryOrderSchema = z.object({
  dispensaryId: z.string().min(1, "Dispensary is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerType: z.enum(["MED", "REC"]),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  primaryTimeSlot: z.string().min(1, "Primary time slot is required"),
  noOfItems: z.union([z.string().min(1), z.number().min(1)]),
  productTotal: z.union([z.string().min(1), z.number().min(0)]),
  deliveryFee: z.union([z.string().min(1), z.number().min(0)]),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryNotes: z.string().optional(),
  posOrderId: z.string().optional(),
  status: z.string().optional(),
})

type DeliveryOrderFormData = z.infer<typeof deliveryOrderSchema>

const customerTypeOptions = [
  { value: "REC", label: "Recreational (REC)" },
  { value: "MED", label: "Medical (MED)" },
]

const defaultValues: DeliveryOrderFormData = {
  dispensaryId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerType: "REC",
  deliveryAddress: "",
  primaryTimeSlot: "",
  noOfItems: "1",
  productTotal: "0",
  deliveryFee: "0",
  deliveryDate: "",
  deliveryNotes: "",
  posOrderId: "",
  status: "PENDING",
}

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: Order | null
}

export const CreateOrderModal = ({ open, onOpenChange, order }: CreateOrderModalProps) => {
  const isEditMode = !!order
  const createOrderMutation = useCreateDeliveryOrderMutation()
  const updateOrderMutation = useUpdateDeliveryOrderMutation()
  const { data: connections } = useDeliveryConnections()

  const dispensaryOptions = (connections ?? [])
    .filter(c => c.status === "ACTIVE")
    .map(c => ({
      value: c.dispensary!.id,
      label: c.dispensary!.name,
    }))

  const form = useForm<DeliveryOrderFormData>({
    resolver: zodResolver(deliveryOrderSchema),
    defaultValues,
  })

  useEffect(() => {
    if (order && open) {
      form.reset({
        dispensaryId: order.dispensaryId,
        customerName: order.customerName,
        customerEmail: order.customerEmail ?? "",
        customerPhone: order.customerPhone,
        customerType: order.customerType ?? "REC",
        deliveryAddress: order.deliveryAddress,
        primaryTimeSlot: order.primaryTimeSlot,
        noOfItems: order.noOfItems as string | number,
        productTotal: order.productTotal as string | number,
        deliveryFee: order.deliveryFee as string | number,
        deliveryDate: order.deliveryDate.split("T")[0],
        deliveryNotes: order.deliveryNotes ?? "",
        posOrderId: order.posOrderId ?? "",
        status: order.status,
      })
    } else if (!order && open) {
      form.reset(defaultValues)
    }
  }, [order, open])

  const onSubmit = async (data: DeliveryOrderFormData) => {
    try {
      const payload = {
        ...data,
        noOfItems: Number(data.noOfItems),
        productTotal: Number(data.productTotal),
        deliveryFee: Number(data.deliveryFee),
        customerEmail: data.customerEmail || undefined,
      }

      if (isEditMode && order) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dispensaryId, ...updatePayload } = payload
        await updateOrderMutation.mutateAsync({ orderId: order.id, data: updatePayload })
        toast.success("Order updated successfully")
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...createPayload } = payload
        await createOrderMutation.mutateAsync(createPayload)
        toast.success("Order created successfully")
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      let message = isEditMode ? "Failed to update order" : "Failed to create order"
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        message = apiError.response?.data?.message || message
      }
      toast.error(message)
    }
  }

  const isPending = createOrderMutation.isPending || updateOrderMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the order details below."
              : "Fill in the details to create a new delivery order for a connected dispensary."}
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
              />
            )}

            <FormSelect
              control={form.control}
              name="dispensaryId"
              label="Dispensary"
              options={dispensaryOptions}
              placeholder="Select a connected dispensary"
              required
              disabled={isEditMode}
            />

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

            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                name="customerEmail"
                control={form.control}
                label="Customer Email"
                placeholder="customer@example.com"
                type="email"
              />
              <FormSelect
                control={form.control}
                name="customerType"
                label="Customer Type"
                options={customerTypeOptions}
                required
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

            <div className="grid grid-cols-2 gap-4 items-baseline">
              <FormInputField
                name="deliveryDate"
                control={form.control}
                label="Delivery Date"
                type="date"
                required
              />
              <FormTimeRangeField
                name="primaryTimeSlot"
                control={form.control}
                label="Primary Time Slot"
                required
                description="Select start and end time"
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditMode
                  ? isPending ? "Updating..." : "Update Order"
                  : isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

