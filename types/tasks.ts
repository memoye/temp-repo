import { z } from "zod";
import { taskCommentSchema, taskSchema } from "@/schemas/tasks-schema";
import { TaskPriorities, TaskReminderTypes, TaskStatuses, TimeUnits } from "@/lib/enum-values";
import type { ValueUnion } from "./utils";

export type TaskValues = z.infer<typeof taskSchema>;

export type TaskCommentValues = z.infer<typeof taskCommentSchema>;

export type TaskReminderType = ValueUnion<typeof TaskReminderTypes>;

export type TimeUnit = ValueUnion<typeof TimeUnits>;

export type TaskStatus = ValueUnion<typeof TaskStatuses>;

export type TaskPriority = ValueUnion<typeof TaskPriorities>;

export type TaskComment = {
  comment: string;
  createdBy: string;
  updatedBy: null;
};

export type TaskReminder = {
  id: number;
  reminderType: TaskReminderType;
  timeUnit: TimeUnit;
  duration: number;
};

export interface Task {
  comments: TaskComment[];
  createdBy: string;
  updatedBy: string | null;
  reminders: TaskReminder[];
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  caseId: string;
  priority: TaskPriority;
  assignedTo: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    dialCode: string;
    contactId: string;
    relationship: string;
    contactType: number;
  };
}
