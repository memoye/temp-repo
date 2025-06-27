"use client";
import React from "react";
import { useMemo, useState } from "react";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { CustomBigCalendar } from "@/components/big-calendar/custom-big-calendar";
import { SlotInfo, Views } from "react-big-calendar";

// import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const dfLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  title: string;
  start: Date;
  end: Date;
};

export function FirmCalendar() {
  const defaultDate = useMemo(() => new Date(), []);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<Event[]>([]);
  const [, setSelectedSlot] = useState<SlotInfo | null>(null);

  function handleNavigate(newDate: Date) {
    setDate(newDate);
  }

  const handleViewChange = (newView: React.SetStateAction<any>) => {
    setView(newView);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
  };

  // const handleCreateEvent = (data: { title: string; start: string; end: string }) => {
  //   const newEvent = {
  //     title: data.title,
  //     start: new Date(data.start),
  //     end: new Date(data.end),
  //   };
  //   setEvents([...events, newEvent]);
  //   setSelectedSlot(null);
  // };

  const handleEventDrop = ({ event, start, end }: any) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...existingEvent, start, end } : existingEvent,
    );
    setEvents(updatedEvents);
  };

  const handleEventResize = ({ event, start, end }: any) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...existingEvent, start, end } : existingEvent,
    );
    setEvents(updatedEvents);
  };

  return (
    <div>
      <CustomBigCalendar
        localizer={dfLocalizer}
        defaultDate={defaultDate}
        style={{ height: 700, width: "100%" }}
        className="border-rounded-md rounded-lg border"
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}
        events={events}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
      />
    </div>
  );
}
