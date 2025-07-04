"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useLoadingBar } from "react-top-loading-bar";
import { passwordFormSchema } from "@/schemas/connect";
import { Connect } from "@/services/connect";
import { cn } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordRequirements } from "./password-requirements";
import { ApiError } from "@/lib/api";

export function PasswordCreationForm({ code }: { code: string }) {
  const { start } = useLoadingBar();

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: verifyUserMutation, isPending: isVerifyingUser } = useMutation({
    mutationKey: ["onboarding", "create-password"],
    mutationFn: Connect.verifyUser,
    onError: (error) => {
      showErrorToast(error?.message || "An error occured. Please try again", {
        closeButton: true,
        description: !error?.message && (
          <>
            If error persists, Contact{" "}
            <a
              className="text-primary underline"
              href={`mailto:hello@chronica.legal?subject=${encodeURIComponent("Sign Up Error (Password Creation) - ")}Code:${(error as ApiError)?.response.code}`}
            >
              hello@chronica.legal
            </a>
          </>
        ),
      });
    },
    onSuccess: () => {
      start();
      showSuccessToast("Congratulations 🎉!", {
        description: (
          <>
            You&apos;ve taken a huge step by creating your password successfully!
            <br />
            You may&nbsp;
            <button onClick={() => signIn("login")} className="text-primary">
              Proceed to Login
            </button>
          </>
        ),
        onDismiss: () => {
          signIn("login");
        },
        onAutoClose: () => {
          signIn("login");
        },
      });
    },
  });

  function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    const payload = { password: values.password, code };
    verifyUserMutation(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-8">
          <div className="mb-4 space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel aria-required>Password</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(fieldState.error && "border-destructive")}
                      type="password"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel aria-required>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(fieldState.error && "border-destructive")}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <PasswordRequirements password={form.watch("password")} />
        </div>

        <Button disabled={isVerifyingUser} className="w-full" size={"lg"} type="submit">
          {isVerifyingUser ? "Submitting..." : "Create Password"}
        </Button>
      </form>
    </Form>
  );
}
