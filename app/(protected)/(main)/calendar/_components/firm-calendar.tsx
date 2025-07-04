"use client";
import * as React from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dateFnsLocalizer, EventProps } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, formatDate, toDate } from "date-fns";
import { enGB, enUS } from "date-fns/locale";
import { Schedules } from "@/services/schedules";
import { CustomBigCalendar } from "@/components/big-calendar/custom-big-calendar";
import { type SlotInfo, Views } from "react-big-calendar";
import type { ApiError } from "@/lib/api";
import type { EventScheduleValues, Event as IEvent } from "@/types/schedules";
import type { ApiResponse } from "@/types/common";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { FormModal } from "@/app/_components/form-modal";
import { EventForm } from "./create-event-form-dialog";
import { useFirmEvents } from "@/hooks/use-calendar-events";
import { dummyevents } from "./calendar-components";
import {
  STEP,
  TIME_SLOTS,
  timeSlotLinesMap,
  TimeSlotMinutes,
  useCustomCalendar,
} from "@/hooks/use-custom-calendar";
import { ArrowLeftIcon, ArrowRightIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { VIEW_OPTIONS } from "@/lib/constants";
import { useEventAttendees } from "@/hooks/use-event-attendees";
import { ValueUnion } from "@/types/utils";

const locales = {
  "en-US": enUS,
  "en-NG": enGB,
};

const dfLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Remove later
type Event = {
  title: string;
  start: Date;
  end: Date;
};

const today = new Date();

export function FirmCalendar() {
  const {
    components,
    date,
    setDate,
    zoom,
    dateText,
    contextMenuInfo,
    setContextMenuInfo,
    setZoom,
    view,
    setView,
    onTodayClick,
    onPrevClick,
    onNextClick,
  } = useCustomCalendar();

  const { usersOptions: RESOURCES } = useEventAttendees();

  // const [date, setDate] = useState(defaultDate);
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["event-types"],
    queryFn: Schedules.lookups.getEventTypes,
    staleTime: Infinity,
  });

  const { firmEvents } = useFirmEvents();

  const [events, setEvents] = useState<Event[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const [eventFormOpen, setEventFormOpen] = useState(false);

  function handleViewChange(newView: React.SetStateAction<any>) {
    setView(newView);
  }

  function handleSelectSlot(slotInfo: SlotInfo) {
    setEventFormOpen(true);
    setSelectedSlot(slotInfo);
  }

  const {
    mutate: createEvent,
    isPending: createEventIsPending,
    error: createEventError,
  } = useMutation<ApiResponse<boolean>, ApiError, EventScheduleValues>({
    mutationFn: Schedules.events.createSchedule,
    onSuccess(_, values) {
      queryClient.invalidateQueries({ queryKey: ["schedules", "events"] });
      showSuccessToast("Event created!", {
        description: "Invitations will be sent to attendees.",
      });
      setSelectedSlot(null);
      setEventFormOpen(false);

      // handleCreateEvent(data);

      // const newEvent = {
      //   title: data.title,
      //   start: new Date(data.start),
      //   end: new Date(data.end),
      // };
      // setEvents([...events, newEvent]);
    },
    onError(error) {
      showErrorToast(error.message, { closeButton: true });
    },
  });

  const handleCreateEvent = (data: EventScheduleValues) => {
    createEvent(data);
  };

  // const resources =

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
    <>
      <div>
        <div className="flex flex-col-reverse flex-wrap-reverse items-end justify-between gap-4 py-4 @[35rem]/page:flex-row">
          <div className="@container/calendar-nav grid flex-1 gap-2">
            <div className="flex h-10 items-center text-sm font-medium @[30.5rem]/calendar-nav:hidden">
              {dateText}
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-background hover:bg-secondary"
                variant={"outline"}
                type="button"
                onClick={onTodayClick}
              >
                Today
              </Button>
              <ButtonGroup className="flex">
                <Button
                  className="bg-background hover:bg-secondary"
                  variant="outline"
                  type="button"
                  size="icon"
                  onClick={onPrevClick}
                >
                  <ArrowLeftIcon />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="hidden w-[200px] items-center justify-center bg-muted! px-4 text-sm font-medium @[30.5rem]/calendar-nav:flex"
                >
                  <div>{dateText}</div>
                </Button>
                <Button
                  className="bg-background hover:bg-secondary"
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onNextClick}
                >
                  <ArrowRightIcon />
                  <span className="sr-only">Next</span>
                </Button>
              </ButtonGroup>
              <DatePicker
                className="w-32 bg-background hover:bg-secondary"
                value={date}
                onChange={(date) => setDate(date!)}
              />
            </div>
          </div>

          <div className="flex flex-col items-end justify-end gap-2 @5xl/page:flex-row @5xl/page:items-center">
            {view !== Views.MONTH && (
              <div className="flex w-[200px] items-center justify-end gap-4 py-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  type="button"
                  title="zoom out"
                  className="hover:bg-muted"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const DECR_BY = 2.5;
                    // Initial immediate zoom
                    setZoom((prev) => (prev[0] - 5 <= 5 ? [5] : [prev[0] - DECR_BY]));

                    // Set up continuous zoom
                    const intervalId = setInterval(() => {
                      setZoom((prev) => {
                        if (prev[0] - 5 <= 5) {
                          clearInterval(intervalId);
                          return [5];
                        }
                        return [prev[0] - DECR_BY];
                      });
                    }, 150); // Adjust interval speed (ms) as needed

                    // Store interval ID for cleanup
                    (e.target as HTMLElement).dataset.intervalId = intervalId.toString();
                  }}
                  onMouseUp={(e) => {
                    clearInterval(Number((e.target as HTMLElement).dataset.intervalId));
                  }}
                  onMouseLeave={(e) => {
                    clearInterval(Number((e.target as HTMLElement).dataset.intervalId));
                  }}
                >
                  <ZoomOutIcon size={20} />
                </Button>
                <Slider
                  defaultValue={[50]}
                  onValueChange={(value) => setZoom(value)}
                  value={zoom}
                  min={5}
                  max={20}
                  step={0.5}
                  className="w-[60%]"
                  // {...props}
                />

                <Button
                  size="icon-sm"
                  variant="ghost"
                  type="button"
                  className="hover:bg-muted"
                  title="zoom in"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const INCR_BY = 2.5;
                    // Initial immediate zoom
                    setZoom((prev) => (prev[0] >= 20 ? [20] : [prev[0] + INCR_BY]));

                    // Set up continuous zoom
                    const intervalId = setInterval(() => {
                      setZoom((prev) => {
                        if (prev[0] >= 20) {
                          clearInterval(intervalId);
                          return [20];
                        }
                        return [prev[0] + INCR_BY];
                      });
                    }, 150); // Adjust interval speed (ms) as needed

                    // Store interval ID for cleanup
                    (e.target as HTMLElement).dataset.intervalId = intervalId.toString();
                  }}
                  onMouseUp={(e) => {
                    clearInterval(Number((e.target as HTMLElement).dataset.intervalId));
                  }}
                  onMouseLeave={(e) => {
                    clearInterval(Number((e.target as HTMLElement).dataset.intervalId));
                  }}
                >
                  <ZoomInIcon size={20} />
                </Button>
              </div>
            )}

            <ButtonGroup>
              {VIEW_OPTIONS.map(({ id, label }) => (
                <Button
                  key={id}
                  onClick={() => setView(id)}
                  variant={id === view ? "default" : "outline"}
                  className={
                    id === view ? "hover:bg-primary" : "bg-background hover:bg-secondary"
                  }
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        <div
          className="relative w-full flex-1 overflow-auto"
          onClick={() => {
            setContextMenuInfo(undefined);
          }}
        >
          <style>
            {`
              .rbc-timeslot-group {
                min-height: ${zoom?.[0] * 24}px;
              }
              
              ${timeSlotLinesMap[STEP as ValueUnion<typeof TimeSlotMinutes>]}
            `}
          </style>
          <CustomBigCalendar
            localizer={dfLocalizer}
            defaultDate={today}
            className="border-rounded-md h-[calc(100dvh-16rem)]! w-full rounded-lg border"
            selectable
            date={date}
            formats={{
              dayHeaderFormat: "eeee, d MMMM",
            }}
            timeslots={TIME_SLOTS}
            step={STEP}
            toolbar={false}
            components={components}
            onNavigate={setDate}
            view={view}
            onView={setView}
            //

            // resizable
            // draggableAccessor={() => true}
            // resizableAccessor={() => true}

            // resources={view === Views.DAY ? RESOURCES : undefined}
            events={dummyevents}
            // eventPropGetter={(event, start, end, isSelected) => ({
            //   className: "bg-primary text-primary-foreground",
            // })}
            onSelectSlot={(slotInfo) => {
              console.log(slotInfo);
              handleSelectSlot(slotInfo);
            }}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
        </div>
      </div>
      <FormModal
        open={eventFormOpen}
        renderForm={() => (
          <EventForm
            onSubmit={handleCreateEvent}
            start={selectedSlot?.start}
            end={selectedSlot?.end}
            close={() => setEventFormOpen(false)}
          />
        )}
      />
    </>
  );
}
