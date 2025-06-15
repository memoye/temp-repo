import { AppHeader } from "@/app/_components/app-header";
import { AppSidebar } from "@/app/_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* <AlertsContextProvider> */}
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="@container/main flex-1 bg-accent">
          {/* <MainLayoutAlerts /> */}
          <div className="flex flex-col gap-4 px-4 py-6 md:px-6">{children}</div>
        </main>
      </SidebarInset>
      {/* </AlertsContextProvider> */}
    </SidebarProvider>
  );
}
