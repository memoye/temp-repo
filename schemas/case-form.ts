import { z } from "zod";
import { capitalize } from "@/lib/utils";
import { CaseStatuses, CustomCaseFieldTypes, PermissionUserTypes } from "@/lib/enum-values";
import type { ValueUnion } from "@/types/utils";
import { richTextFieldSchemaFactory } from "./common";

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

export const customFieldOptionSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  value: z.any(),
  description: z.string().optional(),
});

export const customFieldSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  value: z.any(),
  fieldType: z
    .number()
    .refine(
      (value) =>
        Object.values(CustomCaseFieldTypes).includes(
          value as ValueUnion<typeof CustomCaseFieldTypes>,
        ),
      { message: "Select field type" },
    ),
  options: z.array(customFieldOptionSchema).nullable(),
});

export const generalInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  client: getUserSchema("client", "Select client"),
  fileNumber: z.string().optional(),
  firmId: z.string({ message: "Firm ID not found" }),
  status: z
    .number()
    .refine(
      (value) =>
        Object.values(CaseStatuses).includes(value as ValueUnion<typeof CaseStatuses>),
      { message: "Select status from the list" },
    )
    .optional(),
  state: z.object({
    id: z.number().min(1, { message: "Select a state" }),
    name: z.string(),
  }),
  courtId: z.number().min(1, { message: "Select a court" }),
  originatingLawyers: getUserSchema("solicitor"),
  responsibleLawyers: z.array(getUserSchema("solicitor").optional()).min(0).optional(),
  documentFolder: z.object({
    name: z.string().min(1, "Please enter folder name."),
    categoryId: z.number().min(1, "Please select category.").nullable(),
  }),
  practiceArea: z.object({
    id: z.string().min(1, { message: "Select a practice area" }),
    name: z.string().min(1, { message: "Select a practice area" }),
  }),
  openDate: z.date().nullable().optional(),
  closedDate: z.date().nullable().optional(),
  nextCourtDate: z.date().nullable().optional(),
  permission: z.object({
    type: z
      .number({ message: "Select permission type" })
      .min(1, { message: "Select permission type from options" }),
    permissions: z
      .array(
        z.union([
          z
            .object({
              userType: z
                .number()
                .refine(
                  (value) =>
                    Object.values(PermissionUserTypes).includes(
                      value as ValueUnion<typeof PermissionUserTypes>,
                    ),
                  { message: "Select permission user type" },
                )
                .optional(),
              value: z.string(),
            })
            .optional(),
          getUserSchema("user").optional(),
        ]),
      )
      .optional(),
  }),
  // isBillable: z.boolean({ required_error: "Specify if case is billable" }),
  // sendInvoiceToAll: z.boolean({ required_error: "Specify if invoice should be sent to all" }),
});

export const contactSchema = z.object({
  name: z.string().min(1, { message: `Contact Name is required` }),
  email: z.string().email({ message: `Contact Email is invalid` }),
  phoneNumber: z.string().min(1, { message: `Contact Phone Number is required` }),
  dialCode: z.string().min(1, { message: `Contact Dial Code is required` }),
  contactId: z.string().min(1, { message: `Select from list or create new` }),
  relationship: z.string().min(0, { message: `Contact Relationship is required` }),
  contactType: z
    .number()
    // .refine(
    //   (value) =>
    //     Object.values(ContactTypes).includes(value as TContactType),
    //   { message: "Select 'Individual' or 'Organization'" },
    // )
    .nullable()
    .optional(),
});

export const relatedContactsSchema = {
  relatedContacts: z.array(contactSchema).optional().default([]).optional(),
};

export const permissionsSchema = z.object({
  permission: z.object({
    type: z
      .number({ message: "Select permission type" })
      .min(1, { message: "Select permission type from options" }),
    permissions: z
      .array(
        z.union([
          z
            .object({
              userType: z
                .number()
                .refine(
                  (value) => Object.values(PermissionUserTypes).includes(value as any), // as TPermissionUserType),
                  { message: "Select permission user type" },
                )
                .optional(),
              value: z.string(),
            })
            .optional(),
          getUserSchema("user").optional(),
        ]),
      )
      .optional(),
  }),
});

// Combine all schemas
export const caseFormSchema = z.object({
  generalInfo: generalInfoSchema,
  relatedContacts: relatedContactsSchema,
  // permissions: partiesSchema,
  // details: caseDetailsSchema,
  // documents: documentsSchema,
});
