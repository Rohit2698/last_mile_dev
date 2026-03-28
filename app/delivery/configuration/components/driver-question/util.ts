import { z } from "zod"

// Types
export type QuestionType = "yes_no" | "text" | "number" | "select"
export type QuestionCategory = "trip_start" | "trip_end" | "point_of_delivery"

export interface Question {
  id: string
  category: QuestionCategory
  text: string
  type: QuestionType
  options?: string[]
  required: boolean
  order: number
}

export interface GeneralSettings {
  autoAssignDrivers: boolean
  realTimeTracking: boolean
  mobileTracking: boolean
  routeOptimizationPriority: string
  maxDispensariesPerDriver: number
  serviceTimePerStop: number
  maxRouteDistance: number
  breakDuration: number
  dynamicRebalancing: boolean
  realTimeUpdates: boolean
  trafficConsideration: boolean
  deliveryZipCodes: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  deliveryUpdates: boolean
  routeChanges: boolean
  emergencyAlerts: boolean
}

// Form data types
export type QuestionFormData = z.infer<typeof questionSchema>

export const questionSchema = z.object({
  category: z.enum(["trip_start", "trip_end", "point_of_delivery"]),
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["yes_no", "text", "number", "select"]),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
})

// Initial values
export const defaultQuestion: Partial<Question> = {
  category: "trip_start",
  text: "",
  type: "yes_no",
  required: true,
  options: [],
}

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  deliveryUpdates: true,
  routeChanges: true,
  emergencyAlerts: true,
}

// Utility functions
export const getQuestionsByCategory = (
  questions: Question[],
  category: QuestionCategory,
): Question[] => {
  return questions
    .filter(q => q.category === category)
    .sort((a, b) => a.order - b.order)
}

export const deliveryWindowSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  isActive: z.boolean(),
})

export type DeliveryWindowFormData = z.infer<typeof deliveryWindowSchema>

export const defaultDeliveryWindow: DeliveryWindowFormData = {
  day: "monday",
  startTime: "09:00",
  endTime: "17:00",
  isActive: true,
}
