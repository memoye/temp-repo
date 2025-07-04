"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { eventScheduleSchema } from "@/schemas/schedule-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Control, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  BellDotIcon,
  DotIcon,
  LoaderIcon,
  MailIcon,
  MailsIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { FormModal } from "@/app/_components/form-modal";
import type { EventScheduleValues } from "@/types/schedules";
import {
  DateTimeField,
  DateTimeFieldAmPm,
  DateTimeFieldDays,
  DateTimeFieldHours,
  DateTimeFieldMinutes,
  DateTimeFieldMonths,
  DateTimeFieldSeconds,
  DateTimeFieldSeparator,
  DateTimeFieldYears,
} from "@/components/ui/date-time-field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Fragment, useState } from "react";
import {
  daysOfWeekOptions,
  recurringRuleTypeOptions,
  reminderTypeOptions,
  timeUnitOptions,
} from "@/lib/input-fields-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { EventReminderTypes, RecurringRuleTypes, TimeUnits } from "@/lib/enum-values";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLoading,
  ComboboxTag,
  ComboboxTagsInput,
} from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { BasicEditor } from "@/components/editor/basic";
import { Schedules } from "@/services/schedules";
import { useEventAttendees } from "@/hooks/use-event-attendees";
import { Textarea } from "@/components/ui/textarea";

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
      renderForm={({ onOpenChange }) => (
        <EventForm onSubmit={() => {}} close={() => onOpenChange?.(false)} />
      )}
    >
      {children}
    </FormModal>
  );
}

type EventFormProps = {
  start?: Date;
  end?: Date;
  isSubmitting?: boolean;
  onSubmit: (values: EventScheduleValues) => void;
  onCancel?: () => void;
  close?: () => void;
};

const today = new Date();

export function EventForm({
  start = today,
  end,
  isSubmitting,
  close,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();

  const form = useForm<z.infer<typeof eventScheduleSchema>>({
    resolver: zodResolver(eventScheduleSchema) as any,
    values: {
      title: "",
      description: "",
      host: {
        id: sessionData?.user?.id || "",
        name: sessionData?.user.name || "",
        email: sessionData?.user?.email || "",
        phoneNumber: sessionData?.user?.phone_number || "",
      },
      eventTypeId: "",
      location: "",
      durationMinutes: 30, // Default value matches schema
      scheduledAt: start, // Now required in schema;
      start: start,
      end: end || new Date(start.getTime() + 30 * 60000), // scheduledAt + 30 mins
      recurringRule: null,
      reminders: [],
      attendees: [], // Minimum one attendee as required
    },
  });
  const [isRecurring, setIsRecurring] = useState(!!form.watch("recurringRule"));

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
        <DialogHeader className="sticky top-0 z-50 flex-row items-start justify-between bg-background py-4 pt-6">
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
                <FormLabel aria-required>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <EventTypeField control={form.control} />

          <FormField
            control={form.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Scheduled At</FormLabel>
                <DateTimeField value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <DateTimeFieldDays />
                  </FormControl>
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldMonths />
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldYears />
                  <DateTimeFieldSeparator>
                    <DotIcon className="size-4" />
                  </DateTimeFieldSeparator>
                  <DateTimeFieldHours />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldMinutes />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldSeconds />
                  <DateTimeFieldAmPm />
                </DateTimeField>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem className="@lg/event-form:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Start</FormLabel>
                <DateTimeField value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <DateTimeFieldDays />
                  </FormControl>
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldMonths />
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldYears />
                  <DateTimeFieldSeparator>
                    <DotIcon className="size-4" />
                  </DateTimeFieldSeparator>
                  <DateTimeFieldHours />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldMinutes />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldSeconds />
                  <DateTimeFieldAmPm />
                </DateTimeField>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End</FormLabel>
                <DateTimeField value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <DateTimeFieldDays />
                  </FormControl>
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldMonths />
                  <DateTimeFieldSeparator>/</DateTimeFieldSeparator>
                  <DateTimeFieldYears />
                  <DateTimeFieldSeparator>
                    <DotIcon className="size-4" />
                  </DateTimeFieldSeparator>
                  <DateTimeFieldHours />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldMinutes />
                  <DateTimeFieldSeparator>:</DateTimeFieldSeparator>
                  <DateTimeFieldSeconds />
                  <DateTimeFieldAmPm />
                </DateTimeField>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field, fieldState }) => {
              return (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location or meeting link"
                      hasError={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel aria-required>Duration (in minutes)</FormLabel>
                <FormControl>
                  <NumberInput
                    aria-invalid={fieldState.invalid}
                    inputMode="numeric"
                    min={5}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(Number(value || 0));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Label className="mb-4 flex w-fit items-center gap-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => {
              if (!checked) {
                form.resetField("recurringRule");
              } else {
                form.setValue("recurringRule.type", RecurringRuleTypes.Daily);
                form.setValue("recurringRule.interval", 1);
              }

              setIsRecurring(Boolean(checked));
            }}
            className="border-input"
          />
          <span>This is a recurring event</span>
        </Label>

        <AttendeesField control={form.control} />

        {isRecurring && (
          <>
            <h3 className="inline-block text-base font-medium">Recurring Rule</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 @lg/event-form:flex-row">
                <FormField
                  control={form.control}
                  name="recurringRule.type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="rrule-type">Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));

                          form.resetField("recurringRule.interval");
                          form.resetField("recurringRule.daysOfWeek");
                        }}
                        defaultValue={String(field.value || "")}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full" id="rrule-type">
                            <SelectValue placeholder="Select recurring type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recurringRuleTypeOptions.map((rrt) => (
                            <SelectItem value={String(rrt.value)}>{rrt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("recurringRule.type") === RecurringRuleTypes.Custom ? (
                  <FormField
                    control={form.control}
                    name="recurringRule.daysOfWeek"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormLabel aria-required>Days of the week</FormLabel>
                        <Combobox
                          type="multiple"
                          value={field.value?.map(String)}
                          onValueChange={(value) => field.onChange(value.map(Number))}
                        >
                          <FormControl>
                            <ComboboxTagsInput
                              placeholder="Select days"
                              disabled={field.disabled}
                              error={fieldState.invalid}
                              autoComplete="none"
                            >
                              {field.value && field.value?.length ? (
                                field.value?.length === 7 ? (
                                  <Badge id="«r1t»-form-item" variant="ghost">
                                    Everyday
                                  </Badge>
                                ) : (
                                  <>
                                    {field.value?.slice(0, 2).map((value) => (
                                      <ComboboxTag key={value} value={String(value)}>
                                        {
                                          daysOfWeekOptions.find(
                                            (dow) => String(dow.value) === String(value),
                                          )?.label
                                        }
                                      </ComboboxTag>
                                    ))}
                                    {field.value?.length > 2 ? (
                                      <Badge id="«r1t»-form-item" variant="outline">
                                        +{field.value?.length - 2}
                                      </Badge>
                                    ) : null}
                                  </>
                                )
                              ) : null}
                            </ComboboxTagsInput>
                          </FormControl>
                          <ComboboxContent>
                            <ComboboxGroup>
                              {daysOfWeekOptions.map((dow) => (
                                <ComboboxItem key={dow.value} value={String(dow.value)}>
                                  {dow.label}
                                </ComboboxItem>
                              ))}
                            </ComboboxGroup>
                          </ComboboxContent>
                        </Combobox>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name={"recurringRule.interval"}
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Interval</FormLabel>
                        <FormControl>
                          <NumberInput
                            aria-invalid={fieldState.invalid}
                            inputMode="numeric"
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(Number(value || 0));
                            }}
                            allowNegative={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <RemindersSection />

        <DialogFooter className="pt-4 pb-8">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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

export function RemindersSection() {
  const form = useFormContext<EventScheduleValues>();
  const control = form.control;

  const {
    fields: reminderFields,
    append: appendReminderField,
    remove: removeReminderField,
  } = useFieldArray({
    control,
    name: "reminders",
  });

  const addReminder = () => {
    appendReminderField({
      reminderType: EventReminderTypes.Email,
      timeUnit: TimeUnits.Minutes,
      duration: 15,
      isEnabled: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Reminders</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addReminder}
          className="flex items-center gap-2 bg-transparent"
        >
          <PlusIcon className="size-4" />
          Add Reminder
        </Button>
      </div>

      {reminderFields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No reminders set. Click "Add Reminder" to create one.
        </p>
      )}

      <div className="space-y-4">
        {reminderFields.map((field, index) => (
          <div key={field.id} className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Reminder {index + 1}</h4>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeReminderField(index)}
                className="text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>

            <div className="mb-4 flex flex-col gap-4 @lg/event-form:flex-row @lg/event-form:items-start">
              <div className="flex flex-1 items-center gap-2">
                <FormField
                  control={control}
                  name={`reminders.${index}.reminderType`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {/* <FormLabel>Type</FormLabel> */}
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reminderTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-1 gap-2">
                <FormField
                  control={control}
                  name={`reminders.${index}.duration`}
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-2">
                      {/* <FormLabel>Duration</FormLabel> */}
                      <FormControl>
                        <NumberInput
                          aria-invalid={fieldState.invalid}
                          inputMode="numeric"
                          min={1}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(Number(value || 1));
                          }}
                          allowNegative={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`reminders.${index}.timeUnit`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {/* <FormLabel>Time Unit</FormLabel> */}
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent align="end">
                          {timeUnitOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={control}
              name={`reminders.${index}.isEnabled`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Enable this reminder</FormLabel>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      {form.watch("reminders").filter((r) => r.isEnabled).length > 0 && (
        <div className="text-foreground-light rounded-lg bg-accent p-4">
          <h4 className="mb-3 text-sm font-medium">Attendees will receive;</h4>
          <ul className="font-medium">
            {form
              .watch("reminders")
              ?.filter((reminder) => reminder.isEnabled)
              .map((reminder: EventScheduleValues["reminders"][number], idx: number) => (
                <Fragment key={`reminder-${idx}`}>
                  <li className="mb-2 flex items-center gap-2 text-sm">
                    &nbsp;
                    {
                      {
                        0: <MailIcon size={16} />,
                        1: <BellDotIcon size={16} />,
                        2: <MailsIcon size={16} />,
                      }[reminder.reminderType]
                    }
                    {/* {getEventReminderTypeLabel(reminder.reminderType)} */}
                    {
                      reminderTypeOptions.find((rt) => rt.value === reminder.reminderType)
                        ?.label
                    }
                    &nbsp;
                    {reminder.duration}&nbsp;
                    {reminder.duration === 1
                      ? timeUnitOptions
                          .find((tu) => tu.value === reminder.timeUnit)
                          ?.label.slice(0, -1)
                      : timeUnitOptions.find((tu) => tu.value === reminder.timeUnit)?.label}
                    &nbsp;before start of event
                  </li>
                </Fragment>
              ))}
          </ul>
        </div>
      )}
      <FormMessage className="mt-2">
        {form.formState.errors.reminders?.root?.message}
      </FormMessage>
    </div>
  );
}

export function EventTypeField({ control }: { control: Control<EventScheduleValues> }) {
  const { data: eventTypeOptions, isLoading: isLoadingEventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: Schedules.lookups.getEventTypes,
    select: (data) => data.payload,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  return (
    <FormField
      control={control}
      name="eventTypeId"
      render={({ field, fieldState }) => (
        <FormItem className="flex-1">
          <FormLabel htmlFor="rrule-type" aria-required>
            Type
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                style={{
                  color:
                    eventTypeOptions?.find(
                      (option) => String(option.id) === String(field.value),
                    )?.colorCode || undefined,
                }}
                className="w-full"
                id="rrule-type"
              >
                <SelectValue
                  placeholder={isLoadingEventTypes ? "Loading..." : "Select event type"}
                />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {isLoadingEventTypes ? (
                <div className="grid h-20 w-full place-items-center">
                  <LoaderIcon className="animate-spin" />
                </div>
              ) : (
                eventTypeOptions?.map((rrt) => (
                  <SelectItem style={{ color: rrt.colorCode }} value={String(rrt.id)}>
                    {rrt.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export function AttendeesField({ control }: { control: Control<EventScheduleValues> }) {
  const form = useFormContext();

  const { attendeesOptions, isLoading: isLoadingAttendees } = useEventAttendees();

  return (
    <FormField
      control={control}
      name="attendees"
      render={({ field, fieldState }) => (
        <FormItem className="flex-1">
          <FormLabel aria-required>Attendees</FormLabel>
          <Combobox
            type="multiple"
            value={field.value?.map((attendee) => String(attendee.userId)) || []}
            onValueChange={(selectedUserIds) => {
              // Map the selected user IDs to the full attendee objects
              const selectedAttendees = selectedUserIds
                .map((userId) => {
                  const attendee = attendeesOptions?.find(
                    (opt) => String(opt.id) === String(userId),
                  );
                  return attendee
                    ? {
                        name: attendee.name,
                        email: attendee.email,
                        userId: attendee.id,
                      }
                    : null;
                })
                .filter(Boolean); // Remove any null values

              field.onChange(selectedAttendees);
            }}
          >
            <FormControl>
              <ComboboxTagsInput
                placeholder={isLoadingAttendees ? "Loading..." : "Select attendees"}
                disabled={field.disabled}
                error={fieldState.invalid}
                autoComplete="none"
              >
                {field.value?.map((attendee) => {
                  const option = attendeesOptions?.find(
                    (opt) => String(opt.id) === String(attendee.userId),
                  );
                  return (
                    <ComboboxTag key={attendee.userId} value={String(attendee.userId)}>
                      {option?.name || attendee.name}
                    </ComboboxTag>
                  );
                })}
              </ComboboxTagsInput>
            </FormControl>
            <ComboboxContent>
              <>
                {isLoadingAttendees ? (
                  <div className="grid min-h-22 place-items-center">
                    <ComboboxLoading />
                  </div>
                ) : (
                  <>
                    {/* TODO: Implement disable by availability  */}
                    <ComboboxGroup>
                      {attendeesOptions?.map((attendee) => (
                        <ComboboxItem key={attendee.id} value={attendee.id}>
                          {attendee.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxGroup>
                    <ComboboxEmpty>No results.</ComboboxEmpty>
                  </>
                )}
              </>
            </ComboboxContent>
          </Combobox>
          <FormDescription>
            {isLoadingAttendees ? "Loading..." : "Select attendees to invite to the event"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
