"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function FooterCTA() {
  const { data, status } = useSession();
  const isLoggedIn = data?.user && status === "authenticated";

  return (
    <>
      {isLoggedIn ? (
        <Button className="h-13 w-full bg-white! font-semibold text-primary" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      ) : (
        <Button className="h-13 w-full bg-white! font-semibold text-primary" asChild>
          <Link href="/onboarding">Get Started</Link>
        </Button>
      )}
      {!isLoggedIn && (
        <p className="mt-3 text-xs opacity-80">
          Start your 14-day free trial. No credit card required.
        </p>
      )}
    </>
  );
}
