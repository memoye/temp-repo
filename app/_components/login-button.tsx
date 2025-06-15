"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import { showErrorToast } from "@/lib/toast";
import { signIn } from "next-auth/react";

interface LoginButtonProps extends Omit<ComponentProps<"button">, "children" | "type"> {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  loadingText?: React.ReactNode;
}

export function LoginButton({ loadingText, children, className, ...props }: LoginButtonProps) {
  const { start, complete } = useLoadingBar();
  const [isPending, setIsPending] = useState(false);

  function handleLogin() {
    setIsPending(true);

    // Get saved redirect path (default to "/dashboard" if none)
    const redirectTo = localStorage.getItem("redirectPath") || "/dashboard";

    // Clear redirectPath after reading it
    localStorage.removeItem("redirectPath");

    // Call signIn with callbackUrl
    signIn("login", { redirectTo })
      .catch((reason) => {
        console.error(reason);
        showErrorToast("An unexpected error occurred. Please try again");
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  useEffect(() => {
    if (isPending) {
      start();
      document.body.style.cursor = "wait";
    } else {
      complete();
      document.body.style.cursor = "default";
    }

    return () => {
      document.body.style.cursor = "default";
      complete();
    };
  }, [isPending, start, complete]);

  return (
    <button
      onClick={() => handleLogin()}
      className={className}
      {...props}
      disabled={isPending || props.disabled}
    >
      {isPending && loadingText ? loadingText : children}
    </button>
  );
}
