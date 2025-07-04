import { ChevronDown, ChevronUp } from "lucide-react";
import { ComponentProps, forwardRef, useCallback, useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends ComponentProps<"input">,
    Omit<NumericFormatProps, "value" | "onValueChange"> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  suffix?: string;
  prefix?: string;
  type?: "text" | "tel" | "password";
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
}

export const NumberInput = ({
  stepper,
  thousandSeparator,
  placeholder,
  defaultValue,
  min = -Infinity,
  max = Infinity,
  onValueChange,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  value: controlledValue,
  ref,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState<number | undefined>(controlledValue ?? defaultValue);

  const handleIncrement = useCallback(() => {
    setValue((prev) =>
      prev === undefined ? (stepper ?? 1) : Math.min(prev + (stepper ?? 1), max),
    );
  }, [stepper, max]);

  const handleDecrement = useCallback(() => {
    setValue((prev) =>
      prev === undefined ? -(stepper ?? 1) : Math.max(prev - (stepper ?? 1), min),
    );
  }, [stepper, min]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === (ref as React.RefObject<HTMLInputElement>).current) {
        if (e.key === "ArrowUp") {
          handleIncrement();
        } else if (e.key === "ArrowDown") {
          handleDecrement();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleIncrement, handleDecrement, ref]);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (values: { value: string; floatValue: number | undefined }) => {
    const newValue = values.floatValue === undefined ? undefined : values.floatValue;
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const handleBlur = () => {
    if (value !== undefined) {
      if (value < min) {
        setValue(min);
        (ref as React.RefObject<HTMLInputElement>).current!.value = String(min);
      } else if (value > max) {
        setValue(max);
        (ref as React.RefObject<HTMLInputElement>).current!.value = String(max);
      }
    }
  };

  // console.log();

  return (
    <div className="group/num-input flex items-center">
      <NumericFormat
        value={value}
        onValueChange={handleChange}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={min < 0}
        valueIsNumericString
        onBlur={handleBlur}
        max={max}
        min={min}
        suffix={suffix}
        prefix={prefix}
        customInput={Input}
        placeholder={placeholder}
        className="relative [appearance:textfield] rounded-r-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        getInputRef={ref}
        {...props}
      />

      <div className="flex flex-col">
        <Button
          aria-label="Increase value"
          className={cn(
            "h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:relative",
            props["aria-invalid"] && "border-destructive text-destructive",
          )}
          variant="outline"
          onClick={handleIncrement}
          disabled={value === max}
          type="button"
        >
          <ChevronUp size={15} />
        </Button>
        <Button
          aria-label="Decrease value"
          className={cn(
            "h-5 rounded-l-none rounded-tr-none border-t-[0.5px] border-l-0 border-input px-2 focus-visible:relative",
            props["aria-invalid"] && "border-destructive text-destructive",
          )}
          variant="outline"
          onClick={handleDecrement}
          disabled={value === min}
          type="button"
        >
          <ChevronDown size={15} />
        </Button>
      </div>
    </div>
  );
};

// NumberInput.displayName = "NumberInput";
