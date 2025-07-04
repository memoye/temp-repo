"use client";

import { useState, type ComponentProps } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import { showErrorToast, showLoadingToast } from "@/lib/toast";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Loader2Icon, LoaderIcon } from "lucide-react";

interface LoginButtonProps extends Omit<ComponentProps<"button">, "children" | "type"> {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  loadingText?: React.ReactNode;
}

export function LoginButton({ loadingText, children, className, ...props }: LoginButtonProps) {
  const [openRedirDialog, setOpenRedirDialog] = useState(false);
  const { start, complete } = useLoadingBar();
  const [isPending, setIsPending] = useState(false);

  function handleLogin() {
    start("continuous");
    document.body.style.cursor = "wait";
    setIsPending(true);

    signIn("login")
      .then(() => {
        setOpenRedirDialog(true);
      })
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
    <>
      <button
        onClick={() => handleLogin()}
        className={className}
        {...props}
        disabled={isPending || props.disabled}
      >
        {isPending && loadingText ? loadingText : children}
      </button>
      <Dialog open={openRedirDialog}>
        <DialogHeader className="sr-only">
          <DialogTitle>Redirecting</DialogTitle>
          <DialogTitle>Redirecting to the auth provider. Please wait</DialogTitle>
        </DialogHeader>

        <DialogContent showCloseButton={false} className="h-40 max-w-xs!">
          <div className="flex flex-col items-center justify-center gap-2">
            <LoaderIcon className="size-8 animate-spin" />
            <p className="text-center text-sm leading-loose">
              Redirecting... If you don&apos;t get redirected,{" "}
              <button
                type="button"
                onClick={() => {
                  setOpenRedirDialog(false);
                  handleLogin();
                  showLoadingToast("Retrying...");
                }}
                className="text-primary hover:underline"
              >
                Click here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
