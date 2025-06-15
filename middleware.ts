import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/login";

  const publicPaths = ["/", "/pricing", "/login", "/404", "/_next", "/favicon.ico"];

  if (publicPaths.includes(pathname)) return;

  // Skip auth check for auth-related routes
  if (pathname.startsWith("/api/auth")) return;

  if (!req.auth && !isLoginPage) {
    // Just redirect to login without query params
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.auth && isLoginPage) {
    // Always go to dashboard if already authenticated
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

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
