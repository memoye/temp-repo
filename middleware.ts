export { auth as middleware } from "./auth";

export const config = {
  matcher: [
    "/dashboard",
    "/cases",
    "/clients",
    "/tasks",
    "/invoices",
    "/calendar",
    "/documents",
    "/reports",
    "/time-tracking",
    "/users",
    "/template",
    "/settings",

    "/dashboard/:path*",
    "/settings/:path*",
  ], // Explicitly list protected paths
};
