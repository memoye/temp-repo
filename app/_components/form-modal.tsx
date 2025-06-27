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
  renderForm: (props: { open?: () => void; close?: () => void }) => React.ReactNode;
}

export function FormModal({ children, asChild, className, renderForm }: FormModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  function openDialog() {
    setDialogOpen(true);
  }
  function closeDialog() {
    setDialogOpen(false);
  }

  return (
    <Dialog modal open={dialogOpen}>
      <DialogTrigger className={className} asChild={asChild} onClick={openDialog}>
        {children}
      </DialogTrigger>

      <DialogContent
        className="max-h-[calc(100dvh-10rem)] overflow-y-auto py-0 sm:max-w-[500px] md:max-w-[650px] lg:max-w-[700px]"
        showCloseButton={false}
      >
        {renderForm({ close: closeDialog, open: openDialog })}
      </DialogContent>
    </Dialog>
  );
}
