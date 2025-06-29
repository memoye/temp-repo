import { z } from "zod";
import { caseFormSchema, caseNoteSchema } from "@/schemas/cases-schema";
import { CaseStatuses, CustomCaseFieldTypes } from "@/lib/enum-values";
import type { ILookupItem, LookupItem } from "./common";
import type { ValueUnion } from "./utils";

export type CaseFormValues = z.infer<typeof caseFormSchema>;

export type CaseNoteValues = z.infer<typeof caseNoteSchema>;

export type CaseLookups = Record<
  | "caseStatus"
  | "taskStatus"
  | "contactTypes"
  | "billingMethod"
  | "permissionUserTypes"
  | "permissionTypes",
  LookupItem[]
>;

export interface CustomCaseFieldLookupItem extends ILookupItem {
  description: string;
  fieldType: ValueUnion<typeof CustomCaseFieldTypes>;
  options: Array<ILookupItem & { description: string }>;
}

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dialCode: string;
  contactId: string;
  relationship: string;
  contactType: number;
};

export interface CaseItem {
  id: string;
  title: string;
  assignedTo: string;
  court: LookupItem;
  city: string;
  region: string;
  state: LookupItem;
  permission: number;
  openDate: string;
  status: ValueUnion<typeof CaseStatuses>;
}

export interface CaseNote {
  createdBy: string;
  updatedBy: string;
  id: number;
  note: string;
  nextActionDate: string;
}

export interface Case {
  description: string;
  originatingLawyer: User;
  originatingClient: User;
  billingPreference: {
    billingMethod: number;
    amount: number;
    courtAppearanceFee: number;
    budget: {
      amount: number;
      isPercentage: boolean;
      value: number;
    };
    balance: {
      amount: number;
      isPercentage: boolean;
      value: number;
    };
  };
  practiceArea: {
    id: string;
    name: string;
  };
  client: User;
  closedDate: string;
  nextCourtDate: string;
  relatedContacts: User[];
  responsibleLawyers: User[];
  payers: User[];
  balanceNotifications: User[];
  budgetNotifications: User[];
  id: string;
  title: string;
  assignedTo: string;
  court: {
    id: number;
    name: string;
  };
  city: string;
  region: string;
  state: {
    id: number;
    name: string;
  };
  permission: number;
  openDate: string;
  status: ValueUnion<typeof CaseStatuses>;
  documentFolder: {
    name: string;
    category: string;
    path: string | null;
    categoryId: number;
  };
}
