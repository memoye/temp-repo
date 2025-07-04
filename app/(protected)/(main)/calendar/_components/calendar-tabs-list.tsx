"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";

export function CalendarTabsList() {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "firm",
    history: "replace",
  });

  return (
    <TabsList className="p-0" defaultValue={tab} aria-label="Calendar tabs navigation">
      <TabsTrigger className="font-bold" value="firm" onClick={() => setTab("firm")}>
        Firm Calendar
      </TabsTrigger>
      <TabsTrigger className="font-bold" value="personal" onClick={() => setTab("personal")}>
        My Calendar
      </TabsTrigger>
    </TabsList>
  );
}
