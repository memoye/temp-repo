import { hasTimeOverlap } from "@/lib/calendar-utils";
import { validateTimeRange } from "@/lib/datetime-utils";
import { EventReminderTypes, RecurringRuleTypes, TimeUnits } from "@/lib/enum-values";
import { ValueUnion } from "@/types/utils";
import { z } from "zod";
import { requiredString } from "./common";

export const blackoutTypeSchema = z.object(
  {
    id: z.string().min(1, { message: "Select blackout type" }),
    name: z.string().min(1, { message: "Select blackout type" }),
    colorCode: z.string({ message: "Select blackout type" }).nullable(),
  },
  { message: "Select blackout type" },
);

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

export const attendeeSchema = z.object({
  name: requiredString("Name is required"),
  email: z.string().email("Invalid email format"),
  userId: z.string().optional(),
});

export const hostSchema = z.object({
  id: requiredString("Host ID is required"),
  name: requiredString("Host name is required"),
  email: z.string().email("Invalid host email format"),
  phoneNumber: z.string().optional(),
});

export const reminderSchema = z.object({
  reminderType: z.number().min(0),
  timeUnit: z.number().min(0),
  duration: z.number().min(0),
  isEnabled: z.boolean().default(true),
  lastSentAt: z.date().optional(),
});

export const recurringRuleSchema = z
  .object({
    type: z.number({ message: "Select recurring type" }).min(1, "Select recurring type"),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    interval: z
      .number({ message: "Enter valid interval" })
      .min(1, "Interval must be at least 1"), // .default(1),
    endDate: z.date(),
    maxOccurrences: z.number({ message: "Enter valid number" }).min(0).optional(), //.default(1).optional(),
  })
  .optional();

// Main event schema with proper optional/required fields
export const eventScheduleSchema = z
  .object({
    // Required fields
    title: requiredString("Title is required"),
    host: hostSchema,
    eventTypeId: requiredString("Event type is required"),
    scheduledAt: z.date(),
    attendees: z.array(attendeeSchema).min(1, "At least one attendee is required"),

    // Optional fields with defaults
    description: z.string().optional(),
    location: z.string().optional(),
    durationMinutes: z
      .number({ message: "Enter valid duration" })
      .min(5, "Duration must be at least 5 minutes")
      .default(30),
    recurringRule: recurringRuleSchema.nullable().default(null),
    reminders: z.array(reminderSchema).default([]),

    // Date fields that can be derived
    start: z.date().optional(),
    end: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.start && data.end) {
        return data.end > data.start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end"],
    },
  );
