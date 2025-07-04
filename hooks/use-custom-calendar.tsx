"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Components, EventProps, Views } from "react-big-calendar";
// import { Event as IEvent } from "@/types/schedules";
import {
  AppointmentEvent,
  BlockoutEvent,
} from "@/app/(protected)/(main)/calendar/_components/calendar-components";

const today = new Date();

export type CalendarView = (typeof Views)[keyof typeof Views];

export const STEP = 5;
export const TIME_SLOTS = 60 / STEP;

export const TimeSlotMinutes = {
  Five: 5,
  Ten: 10,
  Fifteen: 15,
  Thirty: 30,
} as const;

export const mapLines = (nthChild: string, width: number) =>
  `.rbc-day-slot .rbc-time-slot:nth-child(${nthChild}):after {width: ${width}% !important;}`;

export const timeSlotLinesMap = {
  [TimeSlotMinutes.Five]: `${mapLines("6n + 4", 25)} ${mapLines(
    "3n + 2",
    12.5,
  )} ${mapLines("3n + 3", 12.5)}`,
  [TimeSlotMinutes.Ten]: `${mapLines("3n + 2", 12.5)} ${mapLines("3n + 3", 12.5)}`,
  [TimeSlotMinutes.Fifteen]: mapLines("2n", 25),
  [TimeSlotMinutes.Thirty]: "",
};

export function useCustomCalendar() {
  const [date, setDate] = React.useState<Date>(today);
  const [view, setView] = React.useState<CalendarView>(Views.WEEK);

  const [contextMenuInfo, setContextMenuInfo] = React.useState<{
    xPosition: number;
    yPosition: number;
    selectedTime: string;
    resourceId: number;
  }>();

  const onPrevClick = React.useCallback(() => {
    if (view === Views.DAY) {
      setDate(subDays(date, 1));
    } else if (view === Views.WEEK) {
      setDate(subWeeks(date, 1));
    } else {
      setDate(subMonths(date, 1));
    }
  }, [view, date]);

  const onNextClick = React.useCallback(() => {
    if (view === Views.DAY) {
      setDate(addDays(date, 1));
    } else if (view === Views.WEEK) {
      setDate(addWeeks(date, 1));
    } else {
      setDate(addMonths(date, 1));
    }
  }, [view, date]);

  const [zoom, setZoom] = React.useState([5]);

  const dateText = React.useMemo(() => {
    if (view === Views.DAY) return format(date, "iiii, MMMMMM dd");
    if (view === Views.WEEK) {
      const from = startOfWeek(date);
      const to = endOfWeek(date);
      return `${format(from, "MMMMMM dd")} to ${format(to, "MMMMMM dd")}`;
    }
    if (view === Views.MONTH) {
      return format(date, "MMMM yyyy");
    }
  }, [view, date]);

  const components: Components<any, any> = {
    event: ({ event }: EventProps<any>) => {
      const data = event?.data;

      if (data?.type === "appointment")
        return <AppointmentEvent appointment={data} isMonthView={view === Views.MONTH} />;

      if (data?.type === "blockout") return <BlockoutEvent blockout={data} />;

      return null;
    },

    timeSlotWrapper: (props: any) => {
      const { children, value, resource } = props;

      return (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenuInfo({
              xPosition: e.clientX,
              yPosition: e.clientY,
              selectedTime: value,
              resourceId: resource,
            });
          }}
        >
          {children}
        </div>
      );
    },
  };

  const onTodayClick = React.useCallback(() => {
    setDate(today);
  }, []);

  return {
    components,
    contextMenuInfo,
    date,
    dateText,
    onNextClick,
    onPrevClick,
    onTodayClick,
    setContextMenuInfo,
    setDate,
    setView,
    setZoom,
    view,
    zoom,
  };
}
