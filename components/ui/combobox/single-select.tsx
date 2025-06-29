import * as React from "react";
import * as Combobox from "@diceui/combobox";
import { Check, ChevronDown, ChevronDownIcon } from "lucide-react";
import { Label } from "../label";
import { cn } from "@/lib/utils";
import { matchSorter } from "match-sorter";

interface ComboboxSelectOption {
  value: string | number;
  label: string;
}

interface ComboboxSelectProps //<T extends ComboboxSelectOption<TValue>, TValue = string>
  extends Pick<React.ComponentProps<"input">, "aria-invalid">,
    Pick<Combobox.ComboboxRootProps<false>, "onInputValueChange"> {
  label?: string;
  required?: boolean;
  value?: ComboboxSelectOption["value"];
  placeholder?: string;
  options: ComboboxSelectOption[];
  emptyContent?: React.ReactNode;
  defaultValue?: ComboboxSelectOption["value"];
  footer?: React.ReactNode | ((options: ComboboxSelectOption[]) => React.ReactNode);
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  loading?: boolean;
  loadingText?: string;
}
export function ComboboxSelect({
  label,
  required,
  placeholder,
  emptyContent,
  options: _opts,
  onInputValueChange,
  onValueChange,
  value,
  footer,
  defaultValue,
  disabled,
  loading,
  loadingText = "Loading...",
  ...props
}: ComboboxSelectProps) {
  const options = _opts.map((option) => ({
    value: String(option.value),
    label: option.label,
  }));

  // const [inputVal, setInputVal] = React.useState<string | null>(null);

  function onFilter(allOptions: string[], search: string) {
    const filtered = options.filter((option) => allOptions.includes(option.value.toString()));

    return matchSorter(filtered, search, {
      keys: ["label", "value"],
      threshold: matchSorter.rankings.MATCHES,
    }).map((trick) => trick.value);
  }

  // const _displayVal =
  //   inputVal == null
  //     ? (options.find(
  //         (option) =>
  //           String(option.value) === String(value) ||
  //           String(option.value) === String(defaultValue),
  //       )?.label ?? undefined)
  //     : inputVal;

  console.log(loading);

  return (
    <Combobox.Root
      preserveInputOnBlur={true}
      // defaultValue={String(defaultValue)}
      // value={String(value)}
      // inputValue={
      //   _displayVal === "undefined" || _displayVal === "null" || _displayVal == null
      //     ? ""
      //     : _displayVal
      // }
      onInputValueChange={(v) => {
        // setInputVal(v);
        onInputValueChange?.(v);
      }}
      className="space-y-2"
      onFilter={onFilter}
      disabled={loading || disabled}
    >
      {label && (
        <Combobox.Label className="inline-block" asChild>
          <Label className="aria-required:after:ml-1" aria-required={required}>
            {label}
          </Label>
        </Combobox.Label>
      )}

      <Combobox.Anchor className="relative">
        <Combobox.Input
          placeholder={
            loading
              ? loadingText
              : options.length > 1 && value
                ? options.find((option) => option.value === value)?.label
                : placeholder
          }
          className={cn(
            "flex h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          )}
          {...props}
        />

        <Combobox.Trigger className="absolute inset-y-0 right-0 flex items-center pr-3 pl-2 text-muted-foreground">
          <ChevronDownIcon className="size-4 opacity-50" />
        </Combobox.Trigger>
      </Combobox.Anchor>

      <Combobox.Portal>
        <Combobox.Content
          sideOffset={8}
          className="relative z-50 min-w-[var(--dice-anchor-width)] overflow-hidden rounded-md border bg-background p-1 text-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <Combobox.Empty className="py-6 text-center text-sm">
            {emptyContent || "No options found."}
          </Combobox.Empty>

          {options.map((option) => (
            <Combobox.Item
              key={option.value}
              value={String(option.value)}
              className="relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent"
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Combobox.ItemIndicator>
                  <Check className="h-4 w-4" />
                </Combobox.ItemIndicator>
              </span>
              <Combobox.ItemText>{option.label}</Combobox.ItemText>
            </Combobox.Item>
          ))}

          {footer && (
            <div className="relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-800 dark:data-highlighted:text-zinc-50">
              {typeof footer === "function" ? footer(options) : footer}
            </div>
          )}
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
