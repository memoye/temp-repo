import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarSearchIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function EventsFilter() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row px-4">
        <CalendarSearchIcon className="size-5 shrink-0 text-accent-foreground/70" />
        <div className="space-y-1 py-0.5">
          <CardTitle>
            <h3>Filter Events</h3>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="flex items-start gap-3">
          <Checkbox id="terms-2" defaultChecked />
          <Label htmlFor="terms-2">All events</Label>
        </div>
      </CardContent>
    </Card>
  );
}
