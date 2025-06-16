import type { FormStep } from "@/types/common";
import { BasicInfoStep } from "./basic-info";
import {
  caseBasicInfoSchema,
  caseDetailsSchema,
  documentsSchema,
  partiesSchema,
} from "@/schemas/case-form";

// This configuration makes it easy to add new steps later
export const formSteps: FormStep[] = [
  {
    id: "basicInfo",
    label: "Basic Information",
    description: "Case title and identification",
    schema: caseBasicInfoSchema,
    component: BasicInfoStep,
  },
  {
    id: "parties",
    label: "Parties Involved",
    description: "Plaintiff, defendant, and attorneys",
    schema: partiesSchema,
    component: () => "partiesSchema",
  },
  {
    id: "details",
    label: "Case Details",
    description: "Description and status",
    schema: caseDetailsSchema,
    component: () => "DetailsStep",
  },
  {
    id: "documents",
    label: "Documents",
    description: "Upload relevant files",
    schema: documentsSchema,
    component: () => "DocumentsStep",
  },
  {
    id: "billing",
    label: "Billing",
    description: "Upload files",
    schema: documentsSchema,
    component: () => "tep",
  },
];
