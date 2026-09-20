import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Please select a pickup address."),

  laundryServiceIds: z
    .array(z.string().min(1))
    .min(1, "Please select at least one laundry service."),

  turnaroundPlanId: z.string().min(1, "Please select a turnaround plan."),

  pickupDate: z.string().min(1, "Please select a pickup date."),

  pickupSlotId: z.string().min(1, "Please select a pickup time slot."),

  detergentPreference: z.string().optional(),

  fabricSoftener: z.boolean(),

  starchPreference: z.boolean(),

  foldingPreference: z.string().optional(),

  customerNotes: z
    .string()
    .max(500, "Customer notes cannot exceed 500 characters.")
    .optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
