"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";

export function CalendarTabsList() {
// { defaultValue: _ }: { defaultValue?: "firm" | "personal" }
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "firm",
    history: "replace",
    // clearOnDefault: false,
  });

  return (
    <TabsList defaultValue={tab} aria-label="Calendar tabs navigation">
      <TabsTrigger value="firm" onClick={() => setTab("firm")}>
        Firm Calendar
      </TabsTrigger>
      <TabsTrigger value="personal" onClick={() => setTab("personal")}>
        My Calendar
      </TabsTrigger>
    </TabsList>
  );
}
