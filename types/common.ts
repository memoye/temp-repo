import { z } from "zod";
import type { Country as CountryCode } from "react-phone-number-input";
import type { ValueUnion } from "./utils";
import type { CustomCaseFieldTypes } from "@/lib/enums";
import type { Control } from "react-hook-form";

export interface ApiResponse<T = unknown> {
  payload: T;
  message: string | null;
  totalCount?: number;
  code: number;
  errors: string[];
}

export interface PaginatedRequestParams {
  Page: number;
  PageSize: number;
  From: string;
  To: string;
  Keyword: string;
  OrderByDsc?: boolean;
}

export type { CountryCode };

export interface ICountry {
  name: string;
  code: CountryCode;
  dialCode: string;
  stateLabel: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface IPLookupResponse {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: CountryCode;
  country_name: string;
  country_code: CountryCode;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export interface ILookupItem {
  id: number | string;
  name: string;
}

export type ICaseLookup = Record<
  | "caseStatus"
  | "taskStatus"
  | "contactTypes"
  | "billingMethod"
  | "permissionUserTypes"
  | "permissionTypes",
  // | string,
  ILookupItem[]
>;

export interface IPaginatedRequestParams {
  Page: number;
  PageSize: number;
  From: string;
  To: string;
  Keyword: string;
  OrderByDsc?: boolean;
}

export interface ICustomFieldLookupItem extends ILookupItem {
  description: string;
  fieldType: ValueUnion<typeof CustomCaseFieldTypes>;
  options: Array<ILookupItem & { description: string }>;
}

export type FormStep = {
  id: string;
  label: string;
  description: string;
  schema: z.ZodType<any>;
  component: React.ComponentType<{
    control: Control<any>;
    watch: any;
    className?: string;
  }>;
};

export interface LookupItem {
  id: number | string;
  name: string;
}

export interface PaginatedRequestParams {
  Page: number;
  PageSize: number;
  From: string;
  To: string;
  Keyword: string;
  OrderByDsc?: boolean;
}

export interface IPLookupResponse {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: CountryCode;
  country_name: string;
  country_code: CountryCode;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}
