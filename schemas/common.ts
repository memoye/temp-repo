// 206

import { z } from "zod";

interface CharLenValidation {
  limit?: number;
  message?: string;
}

const MIN_RICH_TEXT_LENGTH = 206;
export function richTextFieldSchemaFactory({
  min,
  max,
}: Record<"min" | "max", CharLenValidation>) {
  const baseSchema = z.string().min(MIN_RICH_TEXT_LENGTH + (min.limit || 0), {
    message: min.message || `The description must be at least ${min.limit || 0} characters`,
  });

  if (!max?.limit) {
    return baseSchema;
  } else {
    return baseSchema.max(max.limit, {
      message: max.message || `The description must not exceed ${max.limit} characters`,
    });
  }
}

export const countrySchema = z.object({
  dialCode: z.string().min(1, {
    message: "Please select country.",
  }),
  code: z.string().min(1, {
    message: "Please select country.",
  }),
  name: z.string().min(1, {
    message: "Please select country",
  }),
});

export const addressSchema = z.object({
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "Please select your city"),
  street: z.string().min(1, {
    message: "Enter street",
  }),
  postalCode: z.string().optional(),
});
