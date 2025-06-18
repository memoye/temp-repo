import type { FormStep } from "@/types/common";
import { GeneralInfoStep } from "./general-info";
import { generalInfoSchema } from "@/schemas/case-form";

export const formSteps: FormStep[] = [
  {
    id: "generalInfo",
    label: "General Information",
    description: "Case title and identification",
    schema: generalInfoSchema,
    component: GeneralInfoStep,
  },
  // {
  //   id: "relatedContacts",
  //   label: "Related Contacts",
  //   description: "Plaintiff, defendant, and attorneys",
  //   schema: partiesSchema,
  //   component: () => "partiesSchema",
  // },
  // {
  //   id: "permissions",
  //   label: "Permissions",
  //   description: "Description and status",
  //   schema: caseDetailsSchema,
  //   component: () => "DetailsStep",
  // },
  // {
  //   id: "customFields",
  //   label: "Custom Fields",
  //   description: "Upload relevant files",
  //   schema: documentsSchema,
  //   component: () => "DocumentsStep",
  // },
  // {
  //   id: "billingPreferences",
  //   label: "Billing Preferences",
  //   description: "Upload files",
  //   schema: documentsSchema,
  //   component: () => "tep",
  // },
];
