"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useRouteChangeListener(callback: () => void) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    callback();
  }, [pathname, searchParams, callback]);
}
