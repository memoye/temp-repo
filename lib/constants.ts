import { Views } from "react-big-calendar";
import { EventStatuses } from "./enum-values";

export const EVENT_STATUS_COLORS = {
  [EventStatuses.Status1]: "#c7edca",
  [EventStatuses.Status2]: "#bee2fa",
  [EventStatuses.Status3]: "#f3e7e8",
};

export const VIEW_OPTIONS = [
  { id: Views.DAY, label: "Day" },
  { id: Views.WEEK, label: "Week" },
  { id: Views.MONTH, label: "Month" },
];
