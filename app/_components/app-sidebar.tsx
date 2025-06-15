"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navMain } from "@/data/static/nav";
import { Skeleton } from "@/components/ui/skeleton";
import { NavFooter } from "./nav-footer";
import { LogoHeader } from "./logo-header";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function AppSidebarSkeleton({ withNav }: { withNav?: boolean }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>

      <SidebarContent className="" aria-busy="true">
        {withNav ? (
          <NavMain items={navMain} />
        ) : (
          <SidebarGroup>
            <SidebarMenu>
              {Array.from({ length: 8 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <Skeleton className="h-10 w-full" />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter aria-busy="true">
        <Skeleton className="h-10 w-full" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
