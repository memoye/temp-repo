"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function LogoHeader() {
  const { isMobile, state } = useSidebar();

  return (
    <Button
      variant="ghost"
      className={cn(
        "_py-2 h-12 items-center justify-between px-0 py-0 text-start transition-none hover:!bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
        !isMobile && state === "collapsed" && "ml-1 size-7 p-0 hover:!bg-transparent",
      )}
      title="Chronica"
      asChild
    >
      <span>
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-lg bg-transparent pb-1"
        >
          <Logo iconOnly={isMobile ? false : state === "collapsed"} />
        </Link>
        {(state === "expanded" || isMobile) && <SidebarTrigger />}
      </span>
    </Button>
  );
}
