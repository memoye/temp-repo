"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Props = {
  initialSession: any;
};

export function SessionExpiryHandler({ initialSession }: Props) {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔁 Proactive silent refresh
  useEffect(() => {
    if (!session?.expires_at) return;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = session.expires_at - now;

    // Refresh 1 minute before expiry
    const refreshThreshold = timeUntilExpiry > 60 ? timeUntilExpiry - 60 : 5;

    const timeout = setTimeout(() => {
      signIn("login", { redirect: false }); // silently refresh session
    }, refreshThreshold * 1000);

    return () => clearTimeout(timeout);
  }, [session?.expires_at]);

  // ❌ Redirect if session already broken
  useEffect(() => {
    const isExpired =
      session?.error === "SessionExpired" ||
      session?.error === "RefreshAccessTokenError" ||
      status === "unauthenticated";

    if (isExpired && !pathname.startsWith("/login")) {
      const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      localStorage.setItem("redirectPath", currentUrl);
      update({ error: undefined }).then(() => {
        router.push("/login");
      });
    }
  }, [session?.error, pathname, searchParams, update, router, status, initialSession]);

  return null;
}
