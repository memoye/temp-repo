"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { createEventSchedule } from "@/data/services/schedule-manager";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
// import { eventScheduleSchema } from "@/schemas/schedule-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { LoaderIcon, SaveIcon, XIcon } from "lucide-react";
import { FormModal } from "@/app/_components/form-modal";
import { devLog } from "@/lib/utils";

interface CreateEventDialogProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
export default function CreateEventDialog({
  children,
  asChild,
  className,
}: CreateEventDialogProps) {
  return (
    <FormModal
      asChild={asChild}
      className={className}
      renderForm={({ close }) => <EventForm close={close} />}
    >
      {children}
    </FormModal>
  );
}

const eventScheduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string(),
  end: z.string(),
});

type EventFormProps = {
  start?: Date;
  end?: Date;
  onCancel?: () => void;
  close?: () => void;
};

const today = new Date();

export function EventForm({ start = today, end = today, close, onCancel }: EventFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createEventMutation, isPending: isCreatingEvent } = useMutation({
    mutationFn: createEventSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      showSuccessToast("Event created successfully");
      close?.();
    },
    onError: (error) => {
      devLog(error);
      showErrorToast("Error");
    },
  });

  function onSubmit(values: z.infer<typeof eventScheduleSchema>) {
    console.log(values);
    createEventMutation(values as any);
  }

  // const { data: sessionData } = useSession();
  const form = useForm<z.infer<typeof eventScheduleSchema>>({
    resolver: zodResolver(eventScheduleSchema),
    defaultValues: {
      title: "",
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
    },
  });

  console.log(start.toISOString().slice(0, 16));

  function handleCancel() {
    onCancel?.();
    close?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="@container/event-form w-full space-y-4"
      >
        <DialogHeader className="sticky top-0 flex-row items-start justify-between bg-background py-4 pt-6">
          <div className="space-y-2">
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Schedule a new event.</DialogDescription>
          </div>

          <DialogClose onClick={close} className="p-2">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 @lg/event-form:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="@lg/event-form:col-span-2">
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4 pb-8">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={isCreatingEvent}>
            {isCreatingEvent ? (
              <>
                <LoaderIcon /> Saving...
              </>
            ) : (
              <>
                <SaveIcon /> Save
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// {
//       title: "",
//       host: {
//         id: sessionData?.user?.id || "",
//         name: sessionData?.user
//           ? `${sessionData.user.given_name} ${sessionData.user.family_name}`
//           : "",
//         email: sessionData?.user?.email || "",
//         phoneNumber: sessionData?.user?.phone_number || "",
//       },
//       description: "",
//       attendees: [],
//       durationMinutes: 0,
//       scheduledAt: new Date(),
//       location: "",
//       eventTypeId: "",
//       recurringRule: null,
//       reminders: [],
//     }
