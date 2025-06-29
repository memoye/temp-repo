import { hasTimeOverlap } from "@/lib/calendar-utils";
import { validateTimeRange } from "@/lib/datetime-utils";
import { EventReminderTypes, RecurringRuleTypes, TimeUnits } from "@/lib/enum-values";
import { ValueUnion } from "@/types/utils";
import { z } from "zod";

export const attendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  userId: z.string().optional(),
});

export const blackoutTypeSchema = z.object(
  {
    id: z.string().min(1, { message: "Select blackout type" }),
    name: z.string().min(1, { message: "Select blackout type" }),
    colorCode: z.string({ message: "Select blackout type" }).nullable(),
  },
  { message: "Select blackout type" },
);

// Reminder Schema
export const reminderSchema = z.object({
  reminderType: z
    .number()
    .refine(
      (value): value is ValueUnion<typeof EventReminderTypes> =>
        Object.values(EventReminderTypes).includes(
          value as ValueUnion<typeof EventReminderTypes>,
        ),
      { message: "Invalid reminder type" },
    ),
  timeUnit: z
    .number()
    .refine(
      (value): value is ValueUnion<typeof TimeUnits> =>
        Object.values(TimeUnits).includes(value as ValueUnion<typeof TimeUnits>),
      { message: "Invalid time unit" },
    ),
  duration: z.number().min(0),
  isEnabled: z.boolean(),
  lastSentAt: z.date().optional(),
});

export const hostSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().optional(),
});

export const blackoutSchema = z.object({
  id: z.string().optional(),
  reason: z
    .string({ message: "Please enter reason for blocking calendar" })
    .min(8, { message: "Reason cannot be blank" }),
  type: blackoutTypeSchema,
  date: z.string().datetime(),
  startTime: z.string({ message: "Please enter valid time" }).optional(),
  endTime: z.string({ message: "Please enter valid time" }).optional(),
  fullDay: z.boolean().default(true),
});

export const blackoutsSchema = z.object({
  blackouts: z.array(blackoutSchema).refine((blackouts) => !hasTimeOverlap(blackouts), {
    message: "Time slots cannot overlap",
  }),
});

export const recurringRuleSchema = z
  .object({
    type: z
      .number()
      .refine(
        (value): value is ValueUnion<typeof RecurringRuleTypes> =>
          Object.values(RecurringRuleTypes).includes(
            value as ValueUnion<typeof RecurringRuleTypes>,
          ),
        { message: "Invalid recurring rule type" },
      ),
    daysOfWeek: z
      .array(
        z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
      )
      .optional(),
    interval: z
      .number()
      .min(0, { message: "Interval must be a positive number or 0" })
      .default(1)
      .optional(),
    // .nullable()
    endDate: z.date({ required_error: "End date is required for recurring events" }),
    maxOccurrences: z.number().min(0).default(0).optional(),
  })
  .refine(
    (data) => {
      // Ensure that daysOfWeek is provided when type is Custom
      if (data.type === RecurringRuleTypes.Custom) {
        return (data?.daysOfWeek || [])?.length > 0;
      }
      return true;
    },
    { message: "Please select custom days of week", path: ["daysOfWeek"] },
  );

export const eventScheduleSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    host: hostSchema,
    eventTypeId: z.string().min(1, { message: "Select event type" }),
    location: z.string({ message: "Enter valid location" }).optional(),
    durationMinutes: z
      .number({ message: "Enter valid duration" })
      .min(0, { message: "Duration must be positive" })
      .default(30),
    scheduledAt: z.date(),
    recurringRule: recurringRuleSchema.nullable(),
    reminders: z
      .array(reminderSchema)
      .optional()
      .refine(
        (reminders) => {
          if (!reminders) return true;

          // Create a map to store unique reminder signatures
          const reminderSignatures = new Set<string>();

          for (const reminder of reminders) {
            // Create a unique signature for each reminder based on its properties
            const signature = `${reminder.reminderType}-${reminder.timeUnit}-${reminder.duration}`;

            // If we've seen this signature before, we have a duplicate
            if (reminderSignatures.has(signature)) {
              return false;
            }
            reminderSignatures.add(signature);
          }

          return true;
        },
        { message: "Duplicate reminders are not allowed." }, // Each reminder must have a unique combination of type, time unit, and duration,
      ),
    attendees: z
      .array(attendeeSchema)
      .min(1, "At least one attendee is required")
      .max(100, "Maximum 100 attendees allowed"),
  })
  .refine(
    // Ensure scheduledAt is in the future
    (data) => new Date(data.scheduledAt) > new Date(),
    { message: "Scheduled time must be in the future", path: ["scheduledAt"] },
  )
  .refine(
    (data) => {
      // If there's no recurring rule or no endDate, validation passes
      if (!data.recurringRule) return true;

      // Calculate the end time of the first event
      const firstEventEndTime = new Date(data.scheduledAt);
      firstEventEndTime.setMinutes(
        firstEventEndTime.getMinutes() + (data.durationMinutes || 0),
      );

      return data.recurringRule.endDate > firstEventEndTime;
    },
    {
      message: "Recurring rule end date must be after the event's end time",
      path: ["recurringRule.endDate"],
    },
  );

export const cancelEventScheduleSchema = z.object({
  eventId: z.string().min(1, { message: "Select event to cancel" }),
  reason: z.string().optional(),
});

export const customDayTimeSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6).optional(), // 0-6 representing Sunday to Saturday
    startTime: z.string({ message: "Enter valid time" }).optional(),
    endTime: z.string({ message: "Enter valid time" }).optional(),
  })
  .refine(validateTimeRange, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// Main availability schedule schema
export const availabilityScheduleSchema = z
  .object({
    daysOfWeek: z.array(z.number().int().min(0).max(6)), // Array of days (0-6)
    startTime: z.string({ message: "Enter valid time" }),
    endTime: z.string({ message: "Enter valid time" }),
    customDayTimes: z.array(customDayTimeSchema.optional()).optional(),
  })
  .refine(validateTimeRange, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      // If no custom day times, validation passes
      if (!data.customDayTimes?.length) return true;

      // Check each custom day time
      return data.customDayTimes.every(
        (customDay) =>
          // Either start time or end time must be different
          customDay?.startTime !== data.startTime || customDay?.endTime !== data.endTime,
      );
    },
    {
      message: "Custom day times must be different from default times",
      path: ["customDayTimes"],
    },
  );
