"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { PlayCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroCTA() {
  const { data, status } = useSession();
  const isLoggedIn = data?.user && status === "authenticated";

  return (
    <>
      <div className="flex justify-center gap-2">
        {isLoggedIn ? (
          <Button size="lg" asChild>
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        ) : (
          <Button size="lg" asChild>
            <Link href="/onboarding">Start Free Trial</Link>
          </Button>
        )}

        <Button
          size="lg"
          variant="ghost"
          className="hover:text-primaryn px-2 text-primary hover:bg-transparent dark:hover:bg-transparent dark:hover:text-primary"
          asChild
        >
          <Link href="/demo" target="_blank">
            <PlayCircleIcon className="size-5" /> Watch Demo
          </Link>
        </Button>
      </div>

      {!isLoggedIn && (
        <p className="text-foreground-light mt-4 text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="font-medium text-primary underline">
            Log in
          </Link>
        </p>
      )}
    </>
  );
}
