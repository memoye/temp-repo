import { EventReminderTypes, RecurringRuleTypes, TimeUnits } from "./enum-values";

export const recurringRuleTypeOptions = [
  {
    label: "Daily",
    value: RecurringRuleTypes.Daily,
  },
  {
    label: "Weekly",
    value: RecurringRuleTypes.Weekly,
  },
  {
    label: "Monthly",
    value: RecurringRuleTypes.Monthly,
  },
  {
    label: "Custom",
    value: RecurringRuleTypes.Custom,
  },
];

export const daysOfWeekOptions = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export const reminderTypeOptions = [
  { value: EventReminderTypes.Email, label: "Email Notification" },
  { value: EventReminderTypes.InApp, label: "In-App Notification" },
  { value: EventReminderTypes.Both, label: "Both Email and In-App" },
];

export const timeUnitOptions = [
  { value: TimeUnits.Minutes, label: "Minutes" },
  { value: TimeUnits.Hours, label: "Hours" },
  { value: TimeUnits.Days, label: "Days" },
  // { value: TimeUnits., label: "Weeks" },
];
