"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface FormModalProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  /**
   * Define other dialog components in the rendered form component.
   */
  renderForm: (props: {
    onOpenChange?: React.ComponentProps<typeof Dialog>["onOpenChange"];
  }) => React.ReactNode;
}

export function FormModal({
  children,
  asChild,
  className,
  renderForm,
  ...props
}: FormModalProps & React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      {children && (
        <DialogTrigger className={className} asChild={asChild}>
          {children}
        </DialogTrigger>
      )}

      <DialogContent
        className="max-h-[calc(100dvh-10rem)] overflow-y-auto py-0 sm:max-w-[500px] md:max-w-[650px] lg:max-w-[700px]"
        showCloseButton={false}
      >
        {renderForm({ onOpenChange: props.onOpenChange })}
      </DialogContent>
    </Dialog>
  );
}
