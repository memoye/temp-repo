import { z } from "zod";
import { caseFormSchema } from "@/schemas/case-form";
import { CaseStatuses } from "@/lib/enum-values";
import type { LookupItem } from "./common";
import type { ValueUnion } from "./utils";

export type CaseFormValues = z.infer<typeof caseFormSchema>;
export type CaseLookups = Record<
  | "caseStatus"
  | "taskStatus"
  | "contactTypes"
  | "billingMethod"
  | "permissionUserTypes"
  | "permissionTypes",
  LookupItem[]
>;

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

export interface ICaseDetails {
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
