import { z } from "zod"

export const profileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export const DOCUMENT_SLOTS = [
  { documentType: "COMPANY_REGISTRATION", label: "Company Registration" },
  { documentType: "INSURANCE_CERTIFICATE", label: "Insurance Certificate" },
]
