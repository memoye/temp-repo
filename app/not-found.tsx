"use client";

import { useSession } from "next-auth/react";
import { NotFound } from "./_components/not-found";
import { SiteHeader } from "./_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { AppHeader } from "./_components/app-header";

export default function NotFoundPage() {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated")
    return (
      <>
        <SiteHeader />
        <NotFound />
      </>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <NotFound />
      </SidebarInset>
    </SidebarProvider>
  );
  4;
}
