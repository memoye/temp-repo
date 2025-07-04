"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { cn, dismissToast, showErrorToast, showSuccessToast } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";
import { LoaderCircleIcon } from "lucide-react";
import type { CountryCode, ICountry } from "@/lib/types";
import { CompleteUserInvitationSchema } from "@/lib/schemas/auth";
import { completeUserInvitation, getCountries } from "@/services/connect";
import { PasswordRequirements } from "../(withLogo)/create-password/components/password-requirements";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const CompleteProfileForm = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptTermsError, setAcceptTermsError] = useState("");
  const [, setSelectedCountry] = useState<ICountry | null>(null); // selectedCountry

  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const isGenerateInviteLink = searchParams.get("isGenerateLink") === "True";

  const form = useForm<z.infer<typeof CompleteUserInvitationSchema>>({
    values: {
      firstName: "",
      surName: "",
      email: "",
      password: "",
      dialCode: "",
      phoneNumber: "",
      confirmPassword: "",
      isGenerateInviteLink,
      code,
    },
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["lookups", "countries"],
    queryFn: getCountries,
    select: (data) => data?.payload,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
  const countries = countriesData?.map((c) => c.code);

  const { mutate: completeUserInvitationMutation, isPending: isCompletingUserInvitation } =
    useMutation({
      mutationKey: ["onboarding", "complete-profile"],
      mutationFn: completeUserInvitation,
      onError: (error) => {
        showErrorToast(error?.message || "An error occured. Please try again", {
          closeButton: true,
          description: !error?.message ? (
            <>
              If error persists, Contact{" "}
              <a
                className="text-primary underline"
                href={`mailto:hello@chronica.legal?subject=${encodeURIComponent("Profile Completion Error")}`}
              >
                hello@chronica.legal
              </a>
            </>
          ) : error?.message.includes("already exists") ? (
            <Link onClick={() => dismissToast()} href="/login" className="text-primary">
              Proceed to Login
            </Link>
          ) : null,
        });
      },
      onSuccess: (data) => {
        showSuccessToast(data?.message || "Success!", {
          description: "You will be redirected shortly",
          closeButton: true,
        });
        signIn("login");
      },
    });

  function onSubmit(values: z.infer<typeof CompleteUserInvitationSchema>) {
    // eslint-disable @typescript-eslint/no-unused-vars
    const { email, ...rest } = values;

    const payload = {
      ...rest,
      phoneNumber: values.phoneNumber.replace(values?.dialCode, ""),
      ...(values.isGenerateInviteLink && { email }), // Only include email if isGenerateInviteLink is true
      confirmPassword: undefined,
    };

    setAcceptTermsError("");

    if (!acceptedTerms) {
      setAcceptTermsError("Check the box to accept terms");
      return void showErrorToast("Please accept the terms and conditions to continue.");
    }

    if (!values.code) {
      return void showErrorToast("Invalid invite link!", {
        description:
          "Confirm that the invite link is correct. Kindly request a new invite link if you are unsure.",
      });
    }

    completeUserInvitationMutation(payload);
  }

  const handleCountrySelect = (country: CountryCode) => {
    const currentCountry = countriesData?.find((c) => c.code === country);
    setSelectedCountry(currentCountry || null);
    form.setValue("dialCode", currentCountry?.dialCode || "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 space-y-3">
          <div className="grid gap-3.75 md:grid-cols-2 md:gap-x-7 md:gap-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel required>First Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(fieldState.error && "border-destructive")}
                      {...field}
                      placeholder="Enter your first name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel required>Surname</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(fieldState.error && "border-destructive")}
                      {...field}
                      placeholder="Enter your surname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className={cn(
              "grid gap-3.75 md:gap-x-7 md:gap-y-5",
              isGenerateInviteLink ? "md:grid-cols-2" : "",
            )}
          >
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      key={String(isLoadingCountries)}
                      className={fieldState.error && "border-destructive"}
                      loadingCountries={isLoadingCountries}
                      countries={countries}
                      placeholder="Enter your phone number"
                      {...field}
                      onCountryChange={(country) => handleCountrySelect(country!)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isGenerateInviteLink && (
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={cn(fieldState.error && "border-destructive")}
                        {...field}
                        placeholder="Enter your email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid gap-3.75 md:grid-cols-2 md:gap-x-7 md:gap-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
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
                  <FormLabel required>Confirm Password</FormLabel>
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
        </div>

        <PasswordRequirements password={form.watch("password")} />

        <div className="!mb-14 !mt-12 space-y-2">
          <div className="flex items-start space-x-2 sm:items-center">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
              className="border-input"
            />
            <label
              htmlFor="terms"
              className="text-pretty text-sm font-medium leading-snug text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none"
            >
              I agree to Chronica&trade;{" "}
              <Link className="text-primary underline" href="#">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link className="text-primary underline" href="#">
                Terms of Use
              </Link>
              .
            </label>
          </div>

          {acceptTermsError && (
            <p className="text-xs font-medium text-destructive">{acceptTermsError}</p>
          )}
        </div>

        <Button
          disabled={isCompletingUserInvitation}
          className="w-full"
          size="lg"
          type="submit"
        >
          {isCompletingUserInvitation ? (
            <span className="flex animate-pulse items-center gap-2">
              <LoaderCircleIcon className="size-6 animate-spin" />
              Please wait
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
};
