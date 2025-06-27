import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClockIcon, CalendarOffIcon, ClockAlertIcon, PlusIcon } from "lucide-react";
import CreateEventDialog from "./create-event-form-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function TodaySchedule() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row px-4">
        <CalendarClockIcon className="size-5 shrink-0 text-accent-foreground/70" />
        <div className="space-y-1 py-0.5">
          <CardTitle>
            <h3>Today&apos;s Schedule</h3>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <ScheduleEmpty
          text="No schedule for today."
          action={
            <CreateEventDialog>
              <span className="flex flex-row items-center gap-1 font-medium text-primary">
                <PlusIcon className="size-3" /> Create
              </span>
            </CreateEventDialog>
          }
        />
      </CardContent>
    </Card>
  );
}

// export function ScheduleItem() {
//   return <div></div>;
// } wait...

export function ScheduleEmpty({ text, action }: { text?: string; action?: React.ReactNode }) {
  return (
    <div className="min-h-[100px] place-items-center rounded-md bg-muted/40 p-4 text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <CalendarOffIcon />
        <p>{text || "No schedule for today."}</p>
        {action}
      </div>
    </div>
  );
}

export function TodayScheduleSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row px-4">
        <ClockAlertIcon className="size-5 shrink-0 text-accent-foreground/70" />
        <div className="space-y-1 py-0.5">
          <CardTitle>
            <h3>Today&apos;s Schedule</h3>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
