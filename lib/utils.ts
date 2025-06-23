import { ValueUnion } from "@/types/utils";
import { CaseStatuses } from "./enums";
import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * className helper
 **/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalize the first letter of a given string
 **/
export function capitalize(val: string) {
  return `${val[0]?.toUpperCase()}${val?.slice(1)}`;
}

export function decodeJwtPayload(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions & { locale?: string },
): string => {
  return new Intl.NumberFormat(options?.locale || "en-NG", {
    style: "currency",
    currency: options?.currency || "NGN",
    ...options,
  }).format(amount);
};

export const getInitials = (user?: { given_name?: string; family_name?: string }) =>
  `${user?.given_name?.[0] ?? ""}${user?.family_name?.[0] ?? ""}`;

export const noop = () => {};

/**
 * Check if two objects are equal
 */
export function isEqual(obj1: Record<string, any>, obj2: Record<string, any>) {
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Get background and text colors for status badges
 **/
export function getStatusColors(status?: string | number | null) {
  const [neutral, complete, success, pending, error] = [
    "bg-accent text-accent-foreground",
    "bg-secondary text-primary",
    "bg-success/15 text-success",
    "bg-warning/15 text-warning",
    "bg-destructive/15 text-destructive",
  ];

  if (!status) return neutral;

  const s = String(status).toLowerCase();

  switch (true) {
    case ["open", "paid", "active", "1", 1, "confirmed", "paid", "success"].includes(s):
      return success;

    case ["in progress", 2, "pending", "court document"].includes(s):
      return pending;

    case ["completed", "sent", "awaiting confirmation"].includes(s):
      return complete;

    case ["closed", "overdue", false, "cancelled", "blocked", "failed"].includes(s):
      return error;

    default:
      return neutral;
  }
}

export function getCaseStatusLabel(
  unit: ValueUnion<typeof CaseStatuses>,
): keyof typeof CaseStatuses | string {
  switch (unit) {
    case CaseStatuses.Active:
      return "Active";
    case CaseStatuses.Closed:
      return "Closed";
    default:
      return "Unknown Status";
  }
}

const prefixes: Record<string, unknown> = {};

interface GenerateIdOptions {
  length?: number;
  separator?: string;
}

export function generateId(
  prefixOrOptions?: keyof typeof prefixes | GenerateIdOptions,
  inputOptions: GenerateIdOptions = {},
) {
  const finalOptions = typeof prefixOrOptions === "object" ? prefixOrOptions : inputOptions;

  const prefix = typeof prefixOrOptions === "object" ? undefined : prefixOrOptions;

  const { length = 12, separator = "_" } = finalOptions;
  const id = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length,
  )();

  return prefix ? `${prefixes[prefix]}${separator}${id}` : id;
}
