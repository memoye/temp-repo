"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast";
import { cn, noop } from "@/lib/utils";
import { formatTime } from "@/lib/datetime-utils";
import { Connect } from "@/services/connect";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

interface ResendLinkProps {
  email?: string;
  className?: string;
}

export function ResendLink({ email = "", className }: ResendLinkProps) {
  const { secondsLeft, isActive, restart: restartTimer } = useCountdown(90, noop, true);

  const { mutate: resendEmailMutation, isPending } = useMutation({
    mutationKey: ["onboarding", "resend-verification-email"],
    mutationFn: Connect.resendVerificationEmail,
    onError: (error) => {
      showErrorToast(error?.message || "An error occured. Please try again", {
        closeButton: true,
        description: !error?.message && (
          <>
            If error persists, Contact{" "}
            <a
              className="text-primary underline"
              href={`mailto:hello@chronica.legal?subject=${encodeURIComponent("Email Verification Error - ")}`}
            >
              hello@chronica.legal
            </a>
          </>
        ),
      });

      if (error?.message?.toLowerCase()?.includes("please login")) {
        showInfoToast(error.message, {
          action: (
            <Button type="button" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          ),
          onAutoClose: () => signIn("login"),
          onDismiss: () => signIn("login"),
        });
      } else {
        showErrorToast(error.message || "Resend link failed", {
          description: "Please try again",
          closeButton: true,
          dismissible: true,
        });
      }
    },
    onSuccess: (data) => {
      showSuccessToast(data?.message || "Email sent!", {
        description: "Please check your email",
        closeButton: true,
      });
      restartTimer();
    },
  });

  return (
    <button
      type="button"
      disabled={isActive || isPending}
      className={cn(
        "font-medium text-primary disabled:cursor-not-allowed disabled:text-muted-foreground",
        isPending && "cursor-wait disabled:cursor-wait",
        className,
      )}
      onClick={() => resendEmailMutation({ email })}
    >
      {isPending ? (
        "Resending..."
      ) : (
        <>Resend Link {isActive && <span>({formatTime(secondsLeft)})</span>}</>
      )}
    </button>
  );
}
