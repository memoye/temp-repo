import { z } from "zod";
import {
  DaysOfWeek,
  EventProviderTypes,
  EventReminderTypes,
  RecurringRuleTypes,
  TimeUnits,
} from "@/lib/enum-values";
import {
  availabilityScheduleSchema,
  blackoutSchema,
  cancelEventScheduleSchema,
  eventScheduleSchema,
} from "@/schemas/schedule-schema";
import type { ValueUnion } from "./utils";

export type DayOfWeek = ValueUnion<typeof DaysOfWeek>;

export type EventReminderType = ValueUnion<typeof EventReminderTypes>;

export type TimeUnit = ValueUnion<typeof TimeUnits>;

export interface UserAvailabilitiesQueryParams {
  HostId: string;
  StartTime: string;
  EndTime: string;
  DurationInMinutes: number;
}

export interface FirmAvailabilitiesQueryParams {
  FirmId: string;
  StartTime: string;
  EndTime: string;
  DurationInMinutes: number;
}

export type EventType = {
  id: string;
  name: string;
  code: string;
  colorCode: string;
};

export type EventProvider = {
  type: ValueUnion<typeof EventProviderTypes>;
  externalEventId: string;
  meetingLink: string;
  providerMetadata: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
};

export type EventAttendee = {
  name: string;
  email: string;
  userId: string;
  firmId: string;
  status: 1 | 2 | 3;
};

export type EventHost = {
  dateCreated: string;
  dateUpdated: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: true;
  id: string;
  domainEvents: Record<any, any>[];
  fullName: string;
  email: string;
  phoneNumber: string;
  userId: string;
  firmId: string;
};

export type EventRecurringRule = {
  type: ValueUnion<typeof RecurringRuleTypes>;
  daysOfWeek: DayOfWeek[];
  interval: number;
  endDate: string;
  maxOccurrences: number;
};

export type EventReminder = {
  reminderType: EventReminderType;
  timeUnit: TimeUnit;
  duration: number;
  isEnabled: boolean;
  lastSentAt: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  location: string;
  status: number;
  scheduledAt: string;
  endTime: string;
  eventProvider: EventProvider;
  eventType: EventType;
  recurringRule: EventRecurringRule;
  reminders: EventReminder[];
  attendees: EventAttendee[];
  host: EventHost;
  recurringSeriesId: string;
  isRecurring: boolean;
  occurrenceNumber: number;
  seriesStartDate: string;
  seriesEndDate: string;
  cancelledAt: string;
  cancelledBy: string;
  cancellationReason: string;
  dateCreated: string;
};

export type ScheduleTime = {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMicroseconds: number;
  totalNanoseconds: number;
  totalMinutes: number;
  totalSeconds: number;
};

export type CalendarAvailability = {
  id: string;
  daysOfWeek: DayOfWeek[];
  startTime: ScheduleTime;
  endTime: ScheduleTime;
  customDayTimes: {
    dayOfWeek: DayOfWeek;
    startTime: ScheduleTime;
    endTime: ScheduleTime;
  }[];
};

export type UserAvailability = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason: string;
  user: string;
  availableHosts: string[];
};

export type CustomDayTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type UserAvailabilitySchedule = {
  id: string;
  userId: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  customDayTimes: CustomDayTime[];
};

export type AvailabilityScheduleValues = z.infer<typeof availabilityScheduleSchema>;

export type BlackoutsValues = z.infer<typeof blackoutSchema>;

export type EventScheduleValues = z.infer<typeof eventScheduleSchema>;

export type CancelEventScheduleValues = z.infer<typeof cancelEventScheduleSchema>;
