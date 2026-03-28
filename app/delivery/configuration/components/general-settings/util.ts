import z from "zod";

export const defaultGeneralSettings = {
  autoAssignDrivers: false,
  realTimeTracking: false,
  mobileTracking: false,
  routeOptimizationPriority: 'balanced' as const,
  maxDispensariesPerDriver: undefined,
  serviceTimePerStop: undefined,
  maxRouteDistance: undefined,
  breakDuration: undefined,
  dynamicRebalancing: false,
  realTimeUpdates: false,
  trafficConsideration: false,
};

export const generalSettingsSchema = z.object({
  autoAssignDrivers: z.boolean(),
  realTimeTracking: z.boolean(),
  mobileTracking: z.boolean(),
  routeOptimizationPriority: z.string(),
  maxDispensariesPerDriver: z.number().min(1).max(10).optional(),
  serviceTimePerStop: z.number().min(1).max(30).optional(),
  maxRouteDistance: z.number().min(10).max(200).optional(),
  breakDuration: z.number().min(15).max(60).optional(),
  dynamicRebalancing: z.boolean(),
  realTimeUpdates: z.boolean(),
  trafficConsideration: z.boolean(),
  deliveryZipCodes: z
    .string()
    .min(1, 'At least one zip code is required')
    .refine((value) => {
      const zips = value
        .split(',')
        .map((zip) => zip.trim())
        .filter((zip) => zip.length > 0);

      if (zips.length === 0) {
        return false;
      }

      return zips.every((zip) => /^\d{5}(-\d{4})?$/.test(zip));
    }, 'Invalid zip code format'),
});


export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
