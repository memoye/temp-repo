import { auth } from "@/auth";
import { DEFAULT_REDIRECT, PROTECTED_ROUTES, ROOT } from "@/lib/routes";

export default auth((req) => {
  const { nextUrl } = req;

  // Check if the user is authenticated (i.e., if the 'auth' property exists in the request)
  const isAuthenticated = !!req.auth;

  // Check if path matches any protected route (including nested routes)
  const isProtectedRoute = PROTECTED_ROUTES.some((protectedRoute) =>
    nextUrl.pathname.startsWith(protectedRoute),
  );

  // Public routes are those that aren't protected
  const isPublicRoute = !isProtectedRoute;

  // If the route is public and the user is authenticated, redirect them to the default redirect URL
  if (isPublicRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl)); // Redirect to the default page if logged in
  }

  // If the route is not public and the user is not authenticated, redirect them to the root (login) page
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, nextUrl)); // Redirect to the root URL (e.g., login) if not authenticated
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
