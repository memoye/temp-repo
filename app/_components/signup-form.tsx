"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircleIcon, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismissToast, showErrorToast, showSuccessToast } from "@/lib/toast";
import { onboardFirmSchema } from "@/schemas/connect";
import { useIPData } from "@/hooks/use-ip-data";
import { Connect } from "@/services/connect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLoading,
  ComboboxTag,
  ComboboxTagsInput,
} from "@/components/ui/combobox";
import type { Country, CountryCode } from "@/types/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof onboardFirmSchema>>({
    resolver: zodResolver(onboardFirmSchema),
    defaultValues: {
      name: "",
      firstName: "",
      surName: "",
      phoneNumber: "",
      email: "",
      dialCode: "",
      firmSizeId: 0,
      practiceAreas: [],
      address: {
        state: "",
        cityId: "",
      },
      referralCode: "",
    },
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptTermsError, setAcceptTermsError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const { ipCountryCode } = useIPData();
  const { data: countriesData, isLoading: isLoadingCountries } = useSuspenseQuery({
    queryKey: ["lookups", "countries"],
    queryFn: Connect.lookups.getCountries,
    select: (data) => data?.payload,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
  const countries = countriesData?.map((c) => c.code);

  const { data: states, isLoading: isLoadingStates } = useQuery({
    queryKey: ["lookups", "states", selectedCountry],
    queryFn: () => Connect.lookups.getStates(selectedCountry?.code || ipCountryCode),
    select: (data) => data?.payload,
    enabled: !!selectedCountry?.code,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["lookups", "cities", form.watch("address.state")],
    queryFn: () => Connect.lookups.getCities(form.watch("address.state")),
    select: (data) => data?.payload,
    enabled: !!form.watch("address.state"),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const { data: practiceAreas, isLoading: isLoadingPracticeAreas } = useQuery({
    queryKey: ["lookups", "practiceAreas"],
    queryFn: Connect.lookups.getPracticeAreas,
    select: (data) => data?.payload,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const { data: firmSizes, isLoading: isLoadingFirmSizes } = useQuery({
    queryKey: ["lookups", "firmSizes"],
    queryFn: Connect.lookups.getFirmSizes,
    select: (data) => data?.payload,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const { mutate: onboardFirmMutation, isPending: isOnboardingFirm } = useMutation({
    mutationKey: ["onboarding", "create-account"],
    mutationFn: Connect.onboardFirm,
    onError: (error) => {
      showErrorToast(error?.message || "An error occured. Please try again", {
        closeButton: true,
        description: !error?.message ? (
          <>
            If error persists, Contact{" "}
            <a
              className="text-primary underline"
              href={`mailto:hello@chronica.legal?subject=${encodeURIComponent("Sign Up Error - ")}Code:${error}`}
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
    onSuccess: (data, { email }) => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("email", encodeURIComponent(email));

      router.push(`/onboarding/confirmation?${urlParams.toString()}`);

      showSuccessToast(data?.message || "Account created!", {
        description: "You will be redirected shortly",
        closeButton: true,
      });
    },
  });

  const handleCountrySelect = (country: CountryCode) => {
    const currentCountry = countriesData?.find((c) => c.code === country);
    setSelectedCountry(currentCountry || null);
    form.setValue("dialCode", currentCountry?.dialCode || "");
  };

  const onSubmit = (values: z.infer<typeof onboardFirmSchema>) => {
    const payload = {
      ...values,
      phoneNumber: values.phoneNumber.replace(values?.dialCode, ""),
    };

    setAcceptTermsError("");
    if (!acceptedTerms) {
      setAcceptTermsError("Check the box to accept terms");
      return showErrorToast("Please accept the terms and conditions to continue.");
    }
    onboardFirmMutation(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel aria-required>Firm Name</FormLabel>
                <FormControl>
                  <Input
                    className={cn(fieldState.error && "border-destructive")}
                    {...field}
                    placeholder="Enter your firm name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3.75 md:grid-cols-2 md:gap-x-7 md:gap-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel aria-required>First Name</FormLabel>
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
                  <FormLabel aria-required>Surname</FormLabel>
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

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel aria-required>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      key={String(isLoadingCountries)}
                      className={fieldState.error && "border-destructive"}
                      loadingCountries={isLoadingCountries}
                      countries={countries}
                      placeholder="Enter your phone number"
                      {...field}
                      hasError={fieldState.invalid}
                      onCountryChange={(country) => handleCountrySelect(country!)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel aria-required>Email</FormLabel>
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
          </div>

          <div className="_sm:items-start flex w-full justify-stretch gap-x-7 gap-y-5 max-sm:flex-col">
            <FormField
              control={form.control}
              name="address.state"
              render={({ field, fieldState }) => (
                <FormItem className="flex-1">
                  <FormLabel aria-required>{selectedCountry?.stateLabel || "State"}</FormLabel>
                  <Combobox
                    type="single"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.resetField("address.cityId");
                    }}
                  >
                    <FormControl>
                      <ComboboxInput
                        disabled={isOnboardingFirm}
                        autoComplete={"none"}
                        className={cn(field.value && "placeholder:text-foreground")}
                        placeholder={
                          isLoadingStates
                            ? "Loading..."
                            : field.value
                              ? states?.find((s) => String(s.id) === String(field.value))?.name
                              : "Search state"
                        }
                        error={fieldState.invalid}
                      />
                    </FormControl>
                    <ComboboxContent>
                      <ComboboxGroup>
                        {isLoadingStates ? (
                          <ComboboxLoading />
                        ) : (
                          <>
                            <ComboboxEmpty>No results.</ComboboxEmpty>
                            {states?.map((state) => (
                              <ComboboxItem key={state.id} value={state.id}>
                                {state.name}
                              </ComboboxItem>
                            ))}
                          </>
                        )}
                      </ComboboxGroup>
                    </ComboboxContent>
                  </Combobox>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("address.state") && (
              <FormField
                control={form.control}
                name="address.cityId"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel aria-required>City</FormLabel>
                    <Combobox type="single" value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <ComboboxInput
                          disabled={isOnboardingFirm}
                          autoComplete={"none"}
                          className={cn(field.value && "placeholder:text-foreground")}
                          placeholder={
                            isLoadingCities
                              ? "Loading..."
                              : field.value
                                ? cities?.find((s) => String(s.id) === String(field.value))
                                    ?.name
                                : "Search state"
                          }
                          error={fieldState.invalid}
                        />
                      </FormControl>
                      <ComboboxContent>
                        <ComboboxGroup>
                          {isLoadingCities ? (
                            <ComboboxLoading />
                          ) : (
                            <>
                              <ComboboxEmpty>No results.</ComboboxEmpty>
                              {cities?.map((city) => (
                                <ComboboxItem key={city.id} value={city.id}>
                                  {city.name}
                                </ComboboxItem>
                              ))}
                            </>
                          )}
                        </ComboboxGroup>
                      </ComboboxContent>
                    </Combobox>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 sm:items-start">
            <FormField
              control={form.control}
              name="practiceAreas"
              render={({ field, fieldState }) => (
                <FormItem className="flex-1">
                  <FormLabel aria-required>Practice Areas</FormLabel>
                  <Combobox type="multiple" value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <ComboboxTagsInput
                        placeholder={
                          isLoadingPracticeAreas ? "Loading..." : "Search practice areas"
                        }
                        disabled={isOnboardingFirm}
                        error={fieldState.invalid}
                        autoComplete="none"
                      >
                        {field.value?.length > 0 && practiceAreas?.length && (
                          <>
                            {field.value?.map((value) => (
                              <ComboboxTag key={value} value={value}>
                                {
                                  practiceAreas?.find((pa) => String(pa.id) === String(value))
                                    ?.name
                                }
                              </ComboboxTag>
                            ))}
                          </>
                        )}
                      </ComboboxTagsInput>
                    </FormControl>
                    <ComboboxContent>
                      <ComboboxGroup>
                        {isLoadingPracticeAreas ? (
                          <ComboboxLoading />
                        ) : (
                          <>
                            <ComboboxEmpty>No results.</ComboboxEmpty>
                            {practiceAreas?.map((practiceArea) => (
                              <ComboboxItem key={practiceArea.id} value={practiceArea.id}>
                                {practiceArea.name}
                              </ComboboxItem>
                            ))}
                          </>
                        )}
                      </ComboboxGroup>
                    </ComboboxContent>
                  </Combobox>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firmSizeId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel aria-required htmlFor="firmSize">
                    Firm Size
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value || "")}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" id="firmSize">
                        <SelectValue placeholder="Select firm size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingFirmSizes ? (
                        <div className="grid min-h-[80px] w-full place-items-center">
                          <LoaderIcon className="animate-spin text-accent-foreground" />
                        </div>
                      ) : (
                        <>
                          {firmSizes?.map((size) => (
                            <SelectItem value={String(size.id)}>{size.name}</SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Referral</FormLabel>
                <FormControl>
                  <Input
                    className={cn(fieldState.error && "border-destructive")}
                    {...field}
                    placeholder="a1b2C3d4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="!mb-6">
          <div className="flex items-start space-x-2 sm:items-center">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
              className="border-input"
            />
            <label
              htmlFor="terms"
              className="text-sm leading-snug font-medium text-pretty text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none"
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

        <Button disabled={isOnboardingFirm} className="w-full" size="lg" type="submit">
          {isOnboardingFirm ? (
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
}
