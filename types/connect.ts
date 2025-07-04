import { z } from "zod";
import {
  inviteUserSchema,
  onboardFirmSchema,
  onboardInvitedUserSchema,
  roleFormSchema,
} from "@/schemas/connect";
import { UserStatuses } from "@/lib/enum-values";
import type { ValueUnion } from "./utils";
import type { Country, LookupItem } from "./common";

export type UserStatus = ValueUnion<typeof UserStatuses>;

export type OnboardFirmValues = z.infer<typeof onboardFirmSchema>;

export type OnboardInvitedUserValues = z.infer<typeof onboardInvitedUserSchema>;

export type InviteUserValues = z.infer<typeof inviteUserSchema>;

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export type VerifyUserFormValues = { password: string; code: string };

export interface User {
  firstName: string;
  dialCode: string;
  name?: string;
  contactId?: string;
  surName: string;
  email: string;
  phoneNumber: string;
  userId: string;
  status: UserStatus;
  type?: number;
  relationship?: string;
}

export interface CountryDetails extends Country {
  dateCreated: string;
  dateUpdated: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  id: number;
  domainEvents: any[];
  currency: string;
  currencySymbol: string;
  currencyCode: string;
  imageUrl: string;
}

export interface State extends LookupItem {
  countryId: string;
  country: CountryDetails;
}

export interface City extends LookupItem {
  stateId: string;
  state: State;
}

export interface ILocation {
  name: string;
  addressLine: string;
  landMark: string;
  region: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  cityId: string;
  city: City;
}

export interface Firm {
  name: string;
  firmId: string;
  description: string;
  status: 1;
  stage: 1;
  country: Country;
  locations: ILocation[];
  practiceAreas: LookupItem[];
  firmSize: LookupItem;
}
