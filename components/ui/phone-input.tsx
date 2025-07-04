"use client";

import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { useIPData } from "@/hooks/use-ip-data";
import { useMount } from "@/hooks/use-mount";
import { LoadingDots } from "./loading-dots";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    loadingCountries?: boolean;
    // onMount?: (selectedCountry: RPNInput.Country) => void;
    disabled?: boolean;
  };

export function PhoneInput({
  className,
  onChange,
  loadingCountries,
  hasError,
  ...props
}: PhoneInputProps &
  React.ComponentProps<typeof RPNInput.default> & {
    hasError?: boolean;
  }) {
  const { data: ipData, isLoading: isLoadingIpData } = useIPData();
  const defaultCountry = ipData?.country_code || props.countries?.[0];

  useMount(() => props?.onCountryChange?.(defaultCountry));

  return (
    <RPNInput.default
      className={cn("flex", className, hasError && "[&_.dropdownBtn]:border-destructive")}
      flagComponent={FlagComponent}
      countrySelectComponent={
        loadingCountries || isLoadingIpData ? CountrySelectSkeleton : CountrySelect
      }
      inputComponent={InputComponent}
      smartCaret={false}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
      defaultCountry={defaultCountry}
      {...props}
    />
  );
}

const InputComponent = ({ className, ...props }: React.ComponentProps<"input">) => (
  <Input
    className={cn("rounded-s-none rounded-e-md", className)}
    {...props}
    inputMode="tel"
    type="tel"
  />
);

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
  hasError?: boolean;
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
  hasError,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          size={"lg"}
          className={cn(
            "dropdownBtn flex w-16 items-center gap-2 rounded-s-md rounded-e-none border-r-0 border-input px-3 focus-within:ring-transparent focus:border-primary",
            hasError && "border-error",
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />

          {/* {options.filter((o) => !!o.value).length > 1 && ( */}
          <ChevronDownIcon
            className={cn(
              "-mr-2 w-3.5 text-muted-foreground",
              disabled ? "opacity-50" : "opacity-100",
            )}
          />
          {/* )} */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[200px] p-0 min-[290px]:w-[300px] min-[1512px]:w-[326px] lg:w-[200px] xl:w-[250px]"
      >
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="max-h-72 overflow-y-auto">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup className="w-full">
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-sm text-foreground/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto size-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CountrySelectSkeleton = () => {
  return (
    <div
      className={buttonVariants({
        size: "lg",
        variant: "outline",
        className:
          "flex w-16 cursor-progress items-center gap-2 rounded-s-md rounded-e-none border-r-0 border-input bg-input/30 px-3 focus:border-primary",
      })}
    >
      {/* <span className="block h-4 w-6 shrink-0 animate-pulse rounded-sm bg-muted" /> */}
      <LoadingDots size="xs" animation="pulse" />
      <ChevronDownIcon className={"-mr-2 w-3.5 text-muted"} />
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-background">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
