// handleCreateEvent(data);

import { Schedules } from "@/services/schedules";
import { useQuery } from "@tanstack/react-query";
import { CalendarProps } from "react-big-calendar";

// const newEvent = {
//   title: data.title,
//   start: new Date(data.start),
//   end: new Date(data.end),
// };
// setEvents([...events, newEvent]);

// export function useCalendarEvents() {
//   return "Cal ev";
// }

export function useFirmEvents() {
  const query = useQuery({
    queryKey: ["events", "firm"],
    queryFn: Schedules.events.getUserEvents, //  getFirmEvents,
    staleTime: 30 * 1000,
  });

  const firmEvents: CalendarProps["events"] =
    query.data?.payload.map((event) => ({
      title: event.title,
      start: new Date(event.scheduledAt),
      end: new Date(event.endTime),
    })) || [];

  return { firmEvents, ...query };
}
