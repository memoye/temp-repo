// import { Event as IEvent } from "@/types/schedules";
// import { ComponentType } from "react";
import type { Components, EventProps } from "react-big-calendar";

export function AppointmentEvent({
  appointment,
}: {
  appointment: any; // React.ComponentProps<typeof Event>["event"]["data"];
  isMonthView: boolean;
}) {
  return "Appointment Event";
}

export function BlockoutEvent({
  blockout,
}: {
  blockout: any; //  React.ComponentProps<typeof Event>["event"]["data"];
}) {
  return "Blockout Event";
}

// export const Event: ComponentType<
//   EventProps<{
//     data: { id: string; title: string; type: "appointment" | "blockout" };
//   }>
// > = function ({ event }) {
//   const data = event?.data;

//   if (data?.type === "appointment") return <AppointmentEvent appointment={data} />;
//   if (data?.type === "blockout") return <BlockoutEvent blockout={data} />;

//   return null;
// };

export const dummyevents = [
  {
    start: new Date("2025-07-03T12:46:48.553Z"),
    end: new Date("2025-07-03T14:46:48.553Z"),
    data: {
      id: "1",
      title: "Event 1",
      type: "appointment",
    },
  },

  {
    start: new Date("2025-07-05T14:46:48.553Z"),
    end: new Date("2025-07-05T18:46:48.553Z"),
    data: {
      id: "2",
      title: "Event 2",
      type: "appointment",
    },
  },

  {
    start: new Date("2025-07-07T14:46:48.553Z"),
    end: new Date("2025-07-07T18:46:48.553Z"),
    data: {
      id: "1",
      title: "Event 3",
      type: "blockout",
    },
  },
];
