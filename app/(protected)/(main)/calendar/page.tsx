import { PageWrapper } from "@/app/_components/page-wrapper";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarTabsList } from "./_components/calendar-tabs-list";
import { FirmCalendar } from "./_components/firm-calendar";
import { PersonalCalendar } from "./_components/personal-calendar";
import { PageHeader } from "@/app/_components/page-header";
import { Button } from "@/components/ui/button";
import { CalendarCogIcon, PlusIcon, SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { CalendarAsideContent } from "./_components/calendar-aside-content";
import Link from "next/link";
import CreateEventDialog from "./_components/create-event-form-dialog";
import { Separator } from "@/components/ui/separator";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab: "firm" | "personal" }>;
}) {
  const search = await searchParams;

  return (
    <div className="relative flex flex-col @7xl/main:flex-row">
      <Tabs defaultValue={search.tab ?? "firm"} className="w-full">
        <PageWrapper className="flex-1 py-4">
          <PageHeader
            pageActions={
              <div className="flex h-9 items-center gap-2">
                <CreateEventDialog asChild>
                  <Button>
                    <PlusIcon /> New Event
                  </Button>
                </CreateEventDialog>

                <Button type="button" variant="outline" className="@7xl/main:hidden" asChild>
                  <Link href="/calendar/schedules">
                    <CalendarCogIcon />{" "}
                    <span className="sr-only md:not-sr-only">Manage Schedules</span>
                  </Link>
                </Button>

                <Separator orientation="vertical" className="@7xl/main:hidden" />

                <div className="@7xl/main:hidden">
                  <Sheet>
                    <SheetTrigger className="text-muted-foreground" asChild>
                      <Button variant="outline" size="icon" type="button">
                        <SidebarCloseIcon />
                        <span className="sr-only" id="events-summary">
                          Open events summary
                        </span>
                      </Button>
                    </SheetTrigger>

                    <SheetContent
                      showCloseButton={false}
                      aria-describedby="events-summary"
                      className="max-w-[80vw] gap-0 sm:max-w-[90vw] md:max-w-[500px]"
                    >
                      <SheetHeader className="sticky top-0 bg-background py-4">
                        <SheetTrigger className="text-muted-foreground" asChild>
                          <Button variant="ghost" size="icon" type="button">
                            <SidebarOpenIcon />
                            <span className="sr-only" id="events-summary">
                              Close events summary
                            </span>
                          </Button>
                        </SheetTrigger>
                      </SheetHeader>

                      <CalendarAsideContent />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            }
          >
            <CalendarTabsList
            // defaultValue={search.tab ?? "firm"}
            />
          </PageHeader>

          <TabsContent value="firm">
            <FirmCalendar />
          </TabsContent>

          <TabsContent value="personal">
            <PersonalCalendar />
          </TabsContent>
        </PageWrapper>
      </Tabs>

      <aside className="hidden @7xl/main:sticky @7xl/main:top-16 @7xl/main:flex @7xl/main:h-[calc(100vh-4rem)] @7xl/main:w-2/5 @7xl/main:min-w-80 @7xl/main:flex-col @7xl/main:overflow-y-auto @7xl/main:bg-sidebar @7xl/main:group-has-[[data-collapsible=icon]]/sidebar-wrapper:top-12 @7xl/main:group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[calc(100vh-3rem)]">
        <div className="flex w-full items-center px-4 py-5 md:px-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/calendar/schedules">
              <CalendarCogIcon /> Manage Schedules
            </Link>
          </Button>
        </div>

        <CalendarAsideContent className="pt-2" />
      </aside>
    </div>
  );
}
