export const CustomCaseFieldTypes = {
  Text: 1,
  Number: 2,
  Boolean: 3,
  SingleSelect: 4,
  MultiSelect: 5,
  Radio: 6,
  Link: 7,
  Date: 8,
} as const;

export const CaseStatuses = {
  Active: 1,
  Closed: 2,
} as const;

export const PermissionUserTypes = {
  SuperAdmin: 1,
  Admin: 2,
  Regular: 3,
} as const;

export const ClientTypes = {
  Individual: 1,
  Organization: 2,
} as const;

export const RecurringRuleTypes = {
  Daily: 1,
  Weekly: 2,
  Monthly: 3,
  Custom: 4,
} as const;

export const EventReminderTypes = {
  Email: 0,
  InApp: 1,
  Both: 2,
} as const;

export const TimeUnits = {
  Minutes: 1,
  Hours: 2,
  Days: 3,
} as const;

export const TaskReminderTypes = {
  Email: 1,
  Push: 2,
} as const;

export const TaskStatuses = {
  Todo: 1,
  NotStarted: 2,
  InProgress: 3,
  Completed: 4,
} as const;

export const TaskPriorities = {
  Normal: 1,
  High: 2,
} as const;

export const DaysOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
} as const;

export const EventStatuses = {
  Status1: 1,
  Status2: 2,
  Status3: 3,
} as const;

export const EventProviderTypes = {
  Type1: 1,
  Type2: 2,
  Type3: 3,
} as const;

export const UserStatuses = {
  ACTIVE: 1,
  PENDING: 2,
  BLOCKED: 3,
} as const;
