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
