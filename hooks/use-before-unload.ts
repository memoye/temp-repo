"use client";

import { useCallback, useEffect } from "react";

export function useBeforeUnload(
  enabled: boolean | (() => boolean) = true,
  message: string = "Are you sure you want to leave?",
) {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const finalEnabled = typeof enabled === "function" ? enabled() : enabled;

      if (!finalEnabled) return;

      event.preventDefault(); // Trigger browser's default prompt
      event.returnValue = message; // Deprecated: No longer necessary. Leave in case of legacy browsers
    },
    [enabled, message],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [handler]);
}
