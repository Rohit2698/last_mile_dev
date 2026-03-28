import z from "zod"

export type VehicleCheckFieldType = "text" | "checkbox" | "date" | "select"

export interface VehicleCheckField {
  id: string
  name: string
  description: string
  isActive: boolean
  fieldType: VehicleCheckFieldType
  options?: string[]
}

export interface OnboardRequirement {
  id: string
  name: string
  description: string
  isActive: boolean
  isRequired: boolean
}

export const onboardRequirementSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  isRequired: z.boolean(),
})

export const vehicleCheckFieldSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
})

export const driverSetupSchema = z.object({
  onboardRequirements: z.array(onboardRequirementSchema),
  vehicleCheckFields: z.array(vehicleCheckFieldSchema),
})

export type DriverSetupFormData = z.infer<typeof driverSetupSchema>

// Constant field definitions (these don't come from backend)
export const ONBOARD_REQUIREMENT_DEFINITIONS: Record<
  string,
  {
    id: string
    name: string
    description: string
  }
> = {
  vehicle_image: {
    id: "vehicle_image",
    name: "Vehicle Image",
    description: "Driver must upload a photo of their vehicle",
  },
  registration: {
    id: "registration",
    name: "Vehicle Registration",
    description: "Driver must provide vehicle registration document",
  },
  insurance: {
    id: "insurance",
    name: "Insurance Document",
    description: "Driver must provide proof of insurance",
  },
  sign_agreement: {
    id: "sign_agreement",
    name: "Sign Agreement",
    description: "Driver must digitally sign the driver agreement",
  },
  background_check: {
    id: "background_check",
    name: "Background Check",
    description: "Driver must complete background check verification",
  },
  gps_installed: {
    id: "gps_installed",
    name: "GPS Installed",
    description: "Driver must confirm GPS tracking device is installed",
  },
  working_hvac: {
    id: "working_hvac",
    name: "Working Heat/AC",
    description: "Driver must confirm vehicle HVAC system is working",
  },
  camera: {
    id: "camera",
    name: "Camera",
    description: "Driver must have a working camera for delivery verification",
  },
  secure_compartment: {
    id: "secure_compartment",
    name: "Secure Compartment",
    description: "Driver must have a secure storage compartment in vehicle",
  },
} as const

export const VEHICLE_CHECK_FIELD_DEFINITIONS: Record<
  string,
  {
    id: string
    name: string
    description: string
    fieldType: string
  }
> = {
  inspection_date: {
    id: "inspection_date",
    name: "Inspection Date",
    description: "Date of vehicle inspection",
    fieldType: "date" as const,
  },
  driver_name: {
    id: "driver_name",
    name: "Driver Name",
    description: "Name of the driver being inspected",
    fieldType: "text" as const,
  },
  vehicle_number: {
    id: "vehicle_number",
    name: "Vehicle Number/License Plate",
    description: "Vehicle identification number or license plate",
    fieldType: "text" as const,
  },
  gps_check: {
    id: "gps_check",
    name: "GPS Installed",
    description:
      "Verify GPS tracking device is properly installed and functioning",
    fieldType: "checkbox" as const,
  },
  hvac_check: {
    id: "hvac_check",
    name: "Working Heat/AC",
    description:
      "Verify vehicle heating and air conditioning system is working",
    fieldType: "checkbox" as const,
  },
  camera_check: {
    id: "camera_check",
    name: "Camera",
    description: "Verify driver has working camera for delivery verification",
    fieldType: "checkbox" as const,
  },
  secure_compartment_check: {
    id: "secure_compartment_check",
    name: "Secure Compartment",
    description: "Verify vehicle has secure storage compartment for deliveries",
    fieldType: "checkbox" as const,
  },
} as const
