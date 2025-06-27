import { AlertTriangleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** High priority tasks/events */
export function UrgentItems() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row px-4">
        <AlertTriangleIcon className="size-5 shrink-0 text-warning" />
        <div className="space-y-1 py-0.5">
          <CardTitle>
            <h3>Urgent Items</h3>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <ul className="space-y-4">
          <UrgentItem />
          <UrgentItem />
        </ul>
      </CardContent>
    </Card>
  );
}

function UrgentItem() {
  return (
    <div className={cn("border-l-2 border-destructive bg-destructive/10 px-3 py-2")}>
      <h4 className="mb-1.5 text-sm"> Court deadline {"tomorrow"}</h4>
      <p className="text-xs">Johnson vs. Smith case</p>
    </div>
  );
}
