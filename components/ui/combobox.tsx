"use client";

import * as React from "react";
import { Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, LoaderIcon, XIcon } from "lucide-react";
import * as ComboboxPrimitive from "@/components/ui/combobox-primitive";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  InputBase,
  InputBaseAdornmentButton,
  InputBaseControl,
  InputBaseFlexWrapper,
  InputBaseInput,
} from "@/components/ui/input-base";

export const Combobox = ComboboxPrimitive.Root;

function ComboboxInputBase({
  children,
  error,
  ...props
}: React.ComponentProps<typeof InputBase>) {
  return (
    <ComboboxPrimitive.Anchor asChild>
      <InputBase error={error} data-slot="combobox-input-base" {...props}>
        {children}
        <ComboboxPrimitive.Clear asChild>
          <InputBaseAdornmentButton>
            <XIcon className="size-3" />
          </InputBaseAdornmentButton>
        </ComboboxPrimitive.Clear>
        <ComboboxPrimitive.Trigger asChild>
          <InputBaseAdornmentButton>
            <ChevronDownIcon className="opacity-50" />
          </InputBaseAdornmentButton>
        </ComboboxPrimitive.Trigger>
      </InputBase>
    </ComboboxPrimitive.Anchor>
  );
}

function ComboboxInput({
  error,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & { error?: boolean }) {
  return (
    <ComboboxInputBase error={error}>
      <InputBaseControl>
        <ComboboxPrimitive.Input asChild>
          <InputBaseInput data-slot="combobox-input" {...props} />
        </ComboboxPrimitive.Input>
      </InputBaseControl>
    </ComboboxInputBase>
  );
}

function ComboboxTagsInput({
  children,
  error,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> & { error?: boolean }) {
  return (
    <ComboboxInputBase error={error}>
      <ComboboxPrimitive.TagGroup asChild>
        <InputBaseFlexWrapper
          data-slot="combobox-tags-input"
          className="flex items-center gap-2"
        >
          {children}
          <InputBaseControl>
            <ComboboxPrimitive.Input asChild>
              <InputBaseInput {...props} />
            </ComboboxPrimitive.Input>
          </InputBaseControl>
        </InputBaseFlexWrapper>
      </ComboboxPrimitive.TagGroup>
    </ComboboxInputBase>
  );
}

function ComboboxTag({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.TagGroupItem>) {
  return (
    <ComboboxPrimitive.TagGroupItem
      data-slot="combobox-tag"
      className={cn(
        badgeVariants({ variant: "outline" }),
        "group gap-1 pr-1.5 data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Slottable>{children}</Slottable>
      <ComboboxPrimitive.TagGroupItemRemove className="group-data-disabled:pointer-events-none">
        <XIcon className="size-4" />
        <span className="sr-only">Remove</span>
      </ComboboxPrimitive.TagGroupItemRemove>
    </ComboboxPrimitive.TagGroupItem>
  );
}

function ComboboxContent({
  children,
  className,
  align = "center",
  alignOffset = 4,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Content>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Content
        data-slot="combobox-content"
        asChild
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 max-h-96 w-(--radix-popover-trigger-width) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:translate-y-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 data-[side=left]:slide-in-from-right-2 data-[side=right]:translate-x-1 data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        <ComboboxPrimitive.List>{children}</ComboboxPrimitive.List>
      </ComboboxPrimitive.Content>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

function ComboboxLoading({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Loading>) {
  return (
    <ComboboxPrimitive.Loading
      data-slot="combobox-loading"
      className={cn("flex items-center justify-center px-1.5 py-2", className)}
      {...props}
    >
      <LoaderIcon className="mask-conic-gradient-to-tr from-45deg size-4 animate-spin to-white" />
    </ComboboxPrimitive.Loading>
  );
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export const comboboxItemStyle = cva(
  "relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
);

type ComboboxItemProps = Omit<
  React.ComponentProps<typeof ComboboxPrimitive.Item>,
  "children"
> &
  Pick<React.ComponentProps<typeof ComboboxPrimitive.ItemText>, "children">;

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(comboboxItemStyle(), className)}
      {...props}
    >
      <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
      <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <CheckIcon className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

export {
  ComboboxInputBase,
  ComboboxInput,
  ComboboxTagsInput,
  ComboboxTag,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxLoading,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxItem,
};
