"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const today = new Date();
export function DatePicker({
  displayFormat,
  value = today,
  onChange,
  className,
}: {
  displayFormat?: string;
  value?: Date;
  onChange?: (value?: Date) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id="date"
          className={cn("w-48 justify-between font-normal", className)}
        >
          {value || date
            ? format(value || date, displayFormat || "dd/MM/yyyy")
            : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value || date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
