"use client";

import Link from "next/link";
import { Bell, ChevronDownIcon, CreditCard, LogOut, Sparkles, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
// import { SwitchAccountAlert } from "@/app/(connect)/login/switch-account-alert";

export function UserActions() {
  const { data, status: sessionStatus } = useSession();

  function handleLogout() {
    signOut({ redirectTo: "/" });
  }

  const profile = data?.user;

  if (sessionStatus === "unauthenticated") return;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={sessionStatus === "loading"} asChild>
          <Button
            size="lg"
            variant="ghost"
            className="group h-10 rounded-full !px-1.5 focus-visible:ring-accent data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            {sessionStatus === "loading" ? (
              <Skeleton className="size-8 rounded-full" />
            ) : (
              <Avatar className="size-8 rounded-full">
                <AvatarImage src={undefined} alt={profile?.given_name} />
                <AvatarFallback className="rounded-lg">{getInitials(profile)}</AvatarFallback>
              </Avatar>
            )}

            <div className="sr-only grid flex-1 text-left text-sm leading-tight md:not-sr-only">
              {sessionStatus === "loading" ? (
                <>
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-[60px]" />
                    <Skeleton className="h-3.5 w-[30px]" />
                  </div>
                  <Skeleton className="h-3 w-[40px]" />
                </>
              ) : (
                <>
                  <span className="truncate text-xs font-medium">
                    {profile?.given_name} {profile?.family_name}
                  </span>
                  <span className="truncate text-xs font-light">
                    {(profile as { role?: string })?.role}
                  </span>
                </>
              )}
            </div>

            {sessionStatus === "loading" ? (
              <Skeleton className="size-4" />
            ) : (
              <>
                <Separator
                  orientation="vertical"
                  className="hidden h-full bg-background opacity-0 transition-opacity group-hover:opacity-100 md:inline-block"
                />
                <ChevronDownIcon className="ml-auto size-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-sidebar"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex cursor-default items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={undefined} alt={profile?.given_name} />
                <AvatarFallback className="rounded-lg text-xs font-bold">
                  {getInitials(profile)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profile?.given_name} {profile?.family_name}
                </span>
                <span title={profile?.email} className="truncate text-[10px]">
                  {profile?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="group !bg-transparent font-semibold text-primary">
              <Sparkles className="text-amber-400" />
              <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                Upgrade to Pro
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                {/* <BadgeCheck /> */}
                <UserIcon />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/subscription">
                <CreditCard />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <SwitchAccountAlert /> */}
    </>
  );
}
