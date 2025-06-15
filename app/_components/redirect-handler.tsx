"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function RedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const continueUrl = localStorage.getItem("continueUrl");

    localStorage.removeItem("continueUrl");
    if (continueUrl && pathname === "/dashboard") {
      localStorage.removeItem("continueUrl");
      setTimeout(() => {
        router.replace(continueUrl);
      }, 0);
    }
  }, [pathname, router, hydrated]);

  return null;
}
