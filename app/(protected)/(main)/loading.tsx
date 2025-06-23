"use client";

import { LoadingDots } from "@/components/ui/loading-dots";
import { Logo } from "@/components/ui/logo";

export default function MainLoading() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="grid place-items-center gap-1">
        <Logo />
        <LoadingDots className="text-primary" size="md" />
      </div>
    </div>
  );
}
