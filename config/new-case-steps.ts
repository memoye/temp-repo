import type { FormStep } from "@/types/common";
import { generalInfoSchema, relatedContactsSchema } from "@/schemas/case-form";

import { GeneralInfoStep } from "@/app/(protected)/(main)/cases/_components/case-form/general-info-step";
import { RelatedContactsStep } from "@/app/(protected)/(main)/cases/_components/case-form/related-contacts-step";

export const newCaseSteps: FormStep[] = [
  {
    id: "generalInfo",
    label: "General Information",
    description: "Case title and identification",
    schema: generalInfoSchema,
    component: GeneralInfoStep,
  },
  {
    id: "relatedContacts",
    label: "Related Contacts",
    description: "Add witnesses, opposing parties, and other relevant contacts",
    schema: relatedContactsSchema as any, // TODO: fix schema
    component: RelatedContactsStep,
  },
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
