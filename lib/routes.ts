import { navMain } from "@/config/nav";

export const ROOT = "/";
export const PUBLIC_ROUTES = [
  "/",
  "/onboarding",
  "/about",
  "/pricing",
  "/login",
  "/contact",
  "/onboarding",
  "/privacy-policy",
  "/terms-of-service",
  // "/dashboard-overview.png",
];

export const PROTECTED_ROUTES = [
  ...navMain
    .flatMap((nav) => {
      const urls = [];
      if (nav.url) urls.push(nav.url);
      if (nav.items?.length) {
        urls.push(...nav.items.map((item) => item.url).filter(Boolean));
      }
      return urls;
    })
    .filter(Boolean),
];

export const DEFAULT_REDIRECT = "/dashboard";
