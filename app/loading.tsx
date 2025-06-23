"use client";

import { useEffect } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Logo } from "@/components/ui/logo";

export default function RootLoading() {
  const { start, complete } = useLoadingBar({});

  useEffect(() => {
    start();
    return () => complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid h-dvh w-screen place-items-center">
      <div className="grid place-items-center gap-1">
        <Logo />
        <LoadingDots className="text-primary" size="md" />
      </div>
    </div>
  );
}
