import { z } from "zod";
import { addressSchema, countrySchema } from "./common";
import { ClientTypes } from "@/lib/enum-values";
import type { ValueUnion } from "@/types/utils";

export const clientSchema = z.object({
  firstName: z.string().min(3, {
    message: "Please enter first name.",
  }),
  surName: z.string().min(3, {
    message: "Please enter last name.",
  }),
  organization: z.string().optional(),
  type: z
    .number()
    .refine(
      (value) => Object.values(ClientTypes).includes(value as ValueUnion<typeof ClientTypes>),
      {
        message: "Select type",
      },
    ),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phoneNumber: z.string().trim().min(10, {
    message: "Please enter a valid phone number.",
  }),
  clientReference: z.string(),
  country: countrySchema,
  address: addressSchema,
});
