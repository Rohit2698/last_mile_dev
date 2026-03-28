import z from "zod";

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});


export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
