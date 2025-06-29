// 206

import { capitalize } from "@/lib/utils";
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

export const getUserSchema = (as?: string, message?: string) => {
  const field = as ? capitalize(as) : "User";

  return z.object(
    {
      name: z.string().min(1, { message: `${field} Name is required` }),
      email: z.string().email({ message: `${field} Email is invalid` }),
      phoneNumber: z.string().min(1, { message: `${field} Phone Number is required` }),
      dialCode: z.string().min(1, { message: `${field} Dial Code is required` }),
      contactId: z.string().min(1, { message: `Select ${as ?? ""} from list or create new` }),
      relationship: z.string().min(0, { message: `${field} Relationship is required` }),
      contactType: z
        .number()
        // .refine(
        //   (value) =>
        //     Object.values(ContactTypes).includes(value as TContactType),
        //   { message: "Select 'Individual' or 'Organization'" },
        // )
        .nullable()
        .optional(),
    },
    {
      message,
      invalid_type_error: "Select Individual or Organization",
    },
  );
};
