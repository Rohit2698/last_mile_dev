/* eslint-disable @typescript-eslint/no-explicit-any */
import deliveryApiClient from "@/lib/deliveryApiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

// Types
export interface Question {
  id?: string
  category: "trip_start" | "trip_end" | "point_of_delivery"
  text: string
  type: "yes_no" | "text" | "number" | "select"
  options?: string[]
  required: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Backend Response Types - Only config values come from backend
export interface FieldConfig {
  isRequired: boolean
  isActive: boolean
}

export interface OnboardRequirementsConfig {
  vehicleImage: FieldConfig
  vehicleRegistration: FieldConfig
  insurance: FieldConfig
  signAgreement: FieldConfig
  backgroundCheck: FieldConfig
  gpsInstalled: FieldConfig
  workingHvac: FieldConfig
  camera: FieldConfig
  secureCompartment: FieldConfig
}

export interface DeliveryWindow {
  id?: string
  day: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
  isActive: boolean
}

export interface CreateDeliveryWindowRequest {
  day: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
  isActive: boolean
}

export interface UpdateDeliveryWindowRequest extends CreateDeliveryWindowRequest {
  id: string
}

export interface BatchUpdateDeliveryWindowsRequest {
  deliveryWindows: DeliveryWindow[]
}

export interface VehicleCheckFieldsConfig {
  inspectionDate: FieldConfig
  driverName: FieldConfig
  vehicleNumber: FieldConfig
  gpsCheck: FieldConfig
  hvacCheck: FieldConfig
  cameraCheck: FieldConfig
  secureCompartmentCheck: FieldConfig
}

export interface DriverSetupResponse {
  onboard: OnboardRequirementsConfig
  vehicleCheck: VehicleCheckFieldsConfig
}

// Frontend Types - Combined backend config with frontend constants
export interface OnboardRequirement {
  id: string
  isActive: boolean
  isRequired: boolean
}

export interface VehicleCheckField {
  id: string
  isActive: boolean
}

export interface GeneralSettings {
  id: string
  autoAssignDrivers: boolean
  realTimeTracking: boolean
  mobileTracking: boolean
  routeOptimizationPriority: string
  maxDispensariesPerDriver?: number
  serviceTimePerStop?: number
  maxRouteDistance?: number
  breakDuration?: number
  dynamicRebalancing: boolean
  realTimeUpdates: boolean
  trafficConsideration: boolean
  updatedAt: string
  deliveryZipCodes: string[]
}

export interface NotificationSettings {
  emailNotification: boolean
  smsNotification: boolean
}

// Request types
export interface CreateQuestionRequest {
  category: Question["category"]
  text: string
  type: Question["type"]
  options?: string[]
  required: boolean
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  id: string
}

export type UpdateGeneralSettingsRequest = Omit<
  GeneralSettings,
  "id" | "updatedAt"
>

export type UpdateNotificationSettingsRequest = Omit<
  NotificationSettings,
  "id" | "updatedAt"
>

export interface UpdateOnboardRequirementsRequest {
  onboard: Partial<OnboardRequirementsConfig>
}

export interface UpdateVehicleCheckFieldsRequest {
  vehicleCheck: Partial<VehicleCheckFieldsConfig>
}

// Response types
export interface QuestionsResponse {
  questions: Question[]
  totalCount: number
}

export interface OnboardRequirementsResponse {
  onboardRequirements: OnboardRequirement[]
  vehicleCheckFields: VehicleCheckField[]
}

export interface VehicleCheckFieldsResponse {
  fields: VehicleCheckField[]
  totalCount: number
}

// API functions - General Settings
const fetchGeneralSettings = async () => {
  const res = await deliveryApiClient.get(
    `/delivery-partner/general-configuration`,
  )
  return res.data.data as GeneralSettings
}

const updateGeneralSettings = async (
  settings: UpdateGeneralSettingsRequest,
): Promise<GeneralSettings> => {
  return deliveryApiClient.put(`/delivery-partner/general-configuration`, {
    ...settings,
    serviceTimePerStop: settings.serviceTimePerStop?.toString(),
    maxRouteDistance: settings.maxRouteDistance?.toString(),
    breakDuration: settings.breakDuration?.toString(),
  })
}

const fetchQuestions = async (): Promise<QuestionsResponse> => {
  const response = await deliveryApiClient.get(
    `/delivery-partner/drivers-question`,
  )
  const questions = response.data.data
  return {
    questions,
    totalCount: questions.length,
  }
}

const createQuestion = async (questionData: CreateQuestionRequest) => {
  const user = await JSON.parse(
    localStorage.getItem("deliveryPartnerUser") || "{}",
  )
  return deliveryApiClient.post(`/delivery-partner/drivers-question`, {
    ...questionData,
    partnerId: user.id,
  })
}

const updateQuestion = async (
  questionData: UpdateQuestionRequest,
): Promise<Question> => {
  const user = await JSON.parse(
    localStorage.getItem("deliveryPartnerUser") || "{}",
  )
  return deliveryApiClient.put(
    `/delivery-partner/drivers-question/${questionData.id}`,
    {
      ...questionData,
      partnerId: user.id,
    },
  )
}

const deleteQuestion = async (questionId: string): Promise<void> => {
  await deliveryApiClient.delete(
    `/delivery-partner/drivers-question/${questionId}`,
  )
}

export const ONBOARD_REQUIREMENT_DEFINITIONS = [
  {
    id: "vehicle_image",
    isActive: false,
    isRequired: false,
  },
  {
    id: "registration",
    isActive: false,
    isRequired: false,
  },
  {
    id: "insurance",
    isActive: false,
    isRequired: false,
  },
  {
    id: "registration",
    isActive: false,
    isRequired: false,
  },
  {
    id: "insurance",
    isActive: false,
    isRequired: false,
  },
  {
    id: "sign_agreement",
    isActive: false,
    isRequired: false,
  },
  {
    id: "background_check",
    isActive: false,
    isRequired: false,
  },
  {
    id: "gps_installed",
    isActive: false,
    isRequired: false,
  },
  {
    id: "working_hvac",
    isActive: false,
    isRequired: false,
  },
  {
    id: "camera",
    isActive: false,
    isRequired: false,
  },
  {
    id: "secure_compartment",
    isActive: false,
    isRequired: false,
  },
]

export const VEHICLE_CHECK_FIELD_DEFINITIONS = [
  {
    id: "inspection_date",
    isActive: false,
  },
  {
    id: "driver_name",
    isActive: false,
  },
  {
    id: "vehicle_number",
    isActive: false,
  },
  {
    id: "gps_check",
    isActive: false,
  },
  {
    id: "hvac_check",

    isActive: false,
  },
  {
    id: "camera_check",
    isActive: false,
  },
  {
    id: "secure_compartment_check",
    isActive: false,
  },
]

// API functions - Driver Setup
const fetchOnboardRequirements =
  async (): Promise<OnboardRequirementsResponse> => {
    const response: any = await deliveryApiClient.get(
      `/delivery-partner/requirements`,
    )
    return Promise.resolve({
      onboardRequirements: response?.data?.data?.onboardRequirements.length
        ? response.data.data.onboardRequirements
        : ONBOARD_REQUIREMENT_DEFINITIONS,
      vehicleCheckFields: response?.data?.data?.vehicleCheckFields.length
        ? response.data.data.vehicleCheckFields
        : VEHICLE_CHECK_FIELD_DEFINITIONS,
    })
  }

type UpdateOnboardRequirementsData = {
  onboardRequirements: {
    id: string
    isRequired: boolean
    isActive: boolean
  }[]
  vehicleCheckFields: {
    id: string
    isActive: boolean
  }[]
}
const updateOnboardRequirements = async (
  data: UpdateOnboardRequirementsData,
) => {
  return deliveryApiClient.post(`/delivery-partner/requirements`, data)
}

// API functions - Notification Settings
const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  const res = await deliveryApiClient.get(`/delivery-partner/notification`)
  return {
    emailNotification: res.data.data.emailNotification,
    smsNotification: res.data.data.smsNotification,
  } as NotificationSettings
}

const updateNotificationSettings = async (
  settings: UpdateNotificationSettingsRequest,
): Promise<NotificationSettings> => {
  const user = await JSON.parse(
    localStorage.getItem("deliveryPartnerUser") || "{}",
  )
  return deliveryApiClient.put(`/delivery-partner/notification`, {
    emailNotification: settings.emailNotification,
    smsNotification: settings.smsNotification,
    id: Number(user.id),
  })
}

// React Query hooks - General Settings
export const useGeneralSettings = () => {
  return useQuery({
    queryKey: ["general-settings"],
    queryFn: () => fetchGeneralSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: UpdateGeneralSettingsRequest }) =>
      updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["general-settings"] })
    },
  })
}

// React Query hooks - Driver Questions (CRUD)
export const useQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      toast.success("Question added successfully!!")
    },
    onError: () => {
      toast.error("Something went wrong!!")
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })
}

// React Query hooks - Driver Setup
export const useOnboardRequirements = () => {
  return useQuery({
    queryKey: ["onboard-requirements"],
    queryFn: () => fetchOnboardRequirements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateOnboardRequirements = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOnboardRequirements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboard-requirements"] })
      toast.success("Updated Successfully!!!")
    },
    onError: () => {
      toast.error("Update failed!!")
    },
  })
}

// React Query hooks - Notification Settings
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: fetchNotificationSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: data => {
      queryClient.setQueryData(["notification-settings"], data)
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] })
      toast.success("Notification settings updated successfully!")
    },
    onError: () => {
      toast.error("Failed to update notification settings")
    },
  })
}

// NOTE: delivery windows endpoints are not present in the current Go router;
// these will work once the backend exposes /v1/dispensary/delivery-windows.
const fetchDeliveryWindows = async (): Promise<DeliveryWindow[]> => {
  const res = await deliveryApiClient.get("/delivery-partner/delivery-windows")
  return (res.data?.data ?? []).map((window: any) => ({
    id: window.id,
    day: window.dayOfWeek, // Keep as numeric (0-6)
    startTime: window.startTime,
    endTime: window.endTime,
    isActive: window.isActive,
  })) as DeliveryWindow[]
}

export const useDeliveryWindows = () => {
  return useQuery({
    queryKey: ["delivery-windows"],
    queryFn: fetchDeliveryWindows,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const createDeliveryWindow = async (
  data: CreateDeliveryWindowRequest,
): Promise<DeliveryWindow> => {
  const res = await deliveryApiClient.post(
    "/delivery-partner/delivery-windows",
    data,
  )
  return res.data?.data as DeliveryWindow
}

const updateDeliveryWindow = async (
  data: UpdateDeliveryWindowRequest,
): Promise<DeliveryWindow> => {
  const res = await deliveryApiClient.put(
    `/delivery-partner/delivery-windows/${data.id}`,
    data,
  )
  return res.data?.data as DeliveryWindow
}

const deleteDeliveryWindow = async (id: string): Promise<void> => {
  await deliveryApiClient.delete(`/delivery-partner/delivery-windows/${id}`)
}

const batchUpdateDeliveryWindows = async (
  data: BatchUpdateDeliveryWindowsRequest,
): Promise<DeliveryWindow[]> => {
  const res = await deliveryApiClient.put(
    "/delivery-partner/delivery-windows",
    data,
  )
  return (res.data?.data ?? []) as DeliveryWindow[]
}

export const useCreateDeliveryWindow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryWindow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-windows"] })
      toast.success("Delivery window added successfully!")
    },
    onError: () => {
      toast.error("Failed to add delivery window")
    },
  })
}

export const useUpdateDeliveryWindow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDeliveryWindow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-windows"] })
      toast.success("Delivery window updated successfully!")
    },
    onError: () => {
      toast.error("Failed to update delivery window")
    },
  })
}

export const useDeleteDeliveryWindow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeliveryWindow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-windows"] })
      toast.success("Delivery window deleted successfully!")
    },
    onError: () => {
      toast.error("Failed to delete delivery window")
    },
  })
}

export const useBatchUpdateDeliveryWindows = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: batchUpdateDeliveryWindows,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-windows"] })
      toast.success("Delivery windows updated successfully!")
    },
    onError: () => {
      toast.error("Failed to update delivery windows")
    },
  })
}
