"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { VariantProps } from "class-variance-authority";

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({
  fallback,
  className,
  variant = "outline",
  size = "default",
  children,
}: BackButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we can go back in history
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    // Check if document.referrer exists and is from the same origin
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    if (referrer && referrer.startsWith(currentOrigin) && canGoBack) {
      // Same origin, safe to go back
      router.back();
    } else {
      // Different origin or no referrer, use fallback
      let redirectTo = fallback;

      if (!redirectTo) {
        // Default fallback logic
        if (session) {
          redirectTo = "/dashboard";
        } else {
          redirectTo = "/";
        }
      }

      router.push(redirectTo);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleBack} className={className}>
      <ArrowLeft className="mr-2 size-4" />
      {children || "Back"}
    </Button>
  );
}
