import { z } from "zod"

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  licenseNumber: z.string().optional().or(z.literal("")),
})

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>

export const DOCUMENT_TYPE_OPTIONS = [
  { label: "License Front", value: "LICENSE_FRONT" },
  { label: "License Back", value: "LICENSE_BACK" },
]

export const LICENSE_SLOTS = [
  { documentType: "LICENSE_FRONT", label: "License Front" },
  { documentType: "LICENSE_BACK", label: "License Back" },
]
