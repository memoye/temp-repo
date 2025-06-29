import { z } from "zod";
import { getUserSchema } from "./common";
import { TaskPriorities, TaskReminderTypes, TaskStatuses, TimeUnits } from "@/lib/enum-values";
import type { ValueUnion } from "@/types/utils";
import { TaskReminderType, TimeUnit } from "@/types/tasks";

const userSchema = getUserSchema("user");

export const reminderSchema = z.object({
  type: z
    .number()
    .refine((value) => Object.values(TaskReminderTypes).includes(value as TaskReminderType), {
      message: "Invalid reminder type",
    })
    .optional(),
  timeUnit: z
    .number()
    .refine((value) => Object.values(TimeUnits).includes(value as TimeUnit), {
      message: "Invalid time unit",
    })
    .optional(),
  duration: z
    .number({ invalid_type_error: "Enter valid duration" })
    .int({ message: "Enter valid duration" })
    .min(0, { message: "Duration must be non-negative" })
    .optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }),
  description: z
    .string()
    .min(17, {
      message: "The description must be at least 10 characters.",
    })
    .max(500, {
      message: "The description must be at most 500 characters.",
    }),
  dueDate: z
    .date({
      required_error: "Select date.",
    })
    .optional(),
  status: z
    .number()
    .refine(
      (value) =>
        Object.values(TaskStatuses).includes(value as ValueUnion<typeof TaskStatuses>),
      { message: "Select status from the list" },
    ),
  priority: z
    .number()
    .refine(
      (value) =>
        Object.values(TaskPriorities).includes(value as ValueUnion<typeof TaskPriorities>),
      { message: "Select priority from the list" },
    ),
  assignedTo: userSchema.nullable().optional(), //UserSchema.optional(),
  caseNumber: z.string().optional(),
  reminders: z.array(reminderSchema.optional()).optional(),
});

export const taskCommentSchema = z.object({
  id: z.string(),
  comment: z.string().min(1, { message: "Comment is required" }),
});
