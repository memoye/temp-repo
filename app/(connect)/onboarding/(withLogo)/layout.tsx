import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "",
    template: "Onboarding - %s | Chronica",
    default: "Onboarding",
  },
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 right-4 z-50 flex items-center justify-between gap-4 bg-background px-4 py-3">
        <Link href="/">
          <Logo className="lg:[&>img]:h-10" />
        </Link>
        <ThemeToggle />
      </header>
      <div className="flex-grow py-4">{children}</div>
    </div>
  );
}
