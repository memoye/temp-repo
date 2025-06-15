import { AppSidebarSkeleton } from "@/app/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const DashboardLayoutSkeleton = ({ withNav }: { withNav?: boolean }) => {
  return (
    <SidebarProvider>
      <AppSidebarSkeleton withNav={withNav} />
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between rounded-none border-b bg-background px-4">
          <div className="flex items-center gap-3" aria-busy="true">
            <Skeleton className="size-8 rounded-sm" />
            <Skeleton className="h-4 w-16 rounded-sm" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="size-8" aria-busy="true" />
            <Skeleton className="h-8 w-12" aria-busy="true" />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4" aria-busy="true">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="aspect-video rounded-xl" />
          </div>
          <Skeleton className="flex-1" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
