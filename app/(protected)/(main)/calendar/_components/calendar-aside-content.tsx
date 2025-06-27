import { cn } from "@/lib/utils";
import { TodaySchedule } from "./today-schedule";
import { EventsFilter } from "./events-filter";
import { UrgentItems } from "./urgent-items";

export function CalendarAsideContent({ className }: { className?: string }) {
  return (
    <div className={cn("flex-1 space-y-4 overflow-y-auto p-4 md:px-6", className)}>
      <TodaySchedule />
      <EventsFilter />
      <UrgentItems />
    </div>
  );
}
