"use client";

import { useState, type ComponentProps } from "react";
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
    start("continuous");
    document.body.style.cursor = "wait";
    setIsPending(true);

    signIn("login")
      .catch((reason) => {
        console.error(reason);
        showErrorToast("An unexpected error occurred. Please try again");
      })
      .finally(() => {
        setTimeout(complete);
        document.body.style.cursor = "default";
        setIsPending(false);
      });
  }

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
