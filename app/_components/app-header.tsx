"use client";

import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
// import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { UserActions } from "./user-actions";
// import { SearchBox } from "../features/search-box";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const items = [
  {
    title: "A notification ",
    description: "This is a how a notification looks ",
    read: false,
  },
  {
    title: "A new notification ",
    description: "This is a how an unread notification looks ",
    read: true,
  },
];

export function AppHeader() {
  const { isMobile, state } = useSidebar();

  return (
    <header className="_transition-[width] _backdrop-blur sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border bg-sidebar ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex h-16 w-full items-center gap-1 px-4 md:px-6">
        <Link className="shrink-0 md:hidden" href="/dashboard">
          <Logo iconOnly />
        </Link>
        {(state === "collapsed" || isMobile) && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-px !h-4" />
          </>
        )}

        {/* <Breadcrumbs /> */}

        <div className="ml-auto flex h-16 items-center gap-1">
          <ThemeToggle className="p-2" />

          <div className="hidden md:inline-block">
            <NotificationsDropdown className="p-2" />
          </div>
          {/* <Separator orientation="vertical" className="mx-1 !h-4" /> */}
          <UserActions />
        </div>
      </div>
    </header>
  );
}

export function NotificationsDropdown({ className }: { className?: string }) {
  // TODO: Handle empty state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          className={cn("rounded-full", className)}
        >
          <span className="relative">
            <BellIcon size={20} />
            {!!items?.filter((item) => !item.read).length && (
              <span className="absolute top-0 inline-block size-2 rounded-full bg-destructive" />
            )}
            <span className="sr-only">Notifications</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="ml-5 w-[300px]">
        <DropdownMenuArrow />
        <DropdownMenuLabel className="py-3">
          <h3>Notifications</h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          {items?.length
            ? items?.map((item) => {
                return (
                  <DropdownMenuItem
                    className={cn("", item.read ? "bg-background" : "bg-sidebar-accent")}
                    key={item.title}
                  >
                    <div>
                      <h4 className="text-base font-medium">{item.title}</h4>
                      <p className="max-w-full truncate">{item.description}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })
            : ""}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button className="w-full">See all notifications</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
