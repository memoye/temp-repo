"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoadingBar } from "react-top-loading-bar";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav, MainNav } from "@/components/ui/site-nav";

export function SiteHeader() {
  const { status } = useSession();
  const pathname = usePathname();
  const { start: startLoading, complete: completeLoading } = useLoadingBar();

  useEffect(() => {
    if (status === "loading") startLoading();
    else completeLoading();

    return completeLoading;
  }, [completeLoading, status, startLoading]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 px-4 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 md:px-6 lg:px-11">
      <div className="">
        <div className="flex h-14 items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-2 flex items-center gap-2 lg:mr-6 lg:hidden">
              <Logo />
            </Link>
            <MobileNav />
          </div>

          <MainNav />

          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">{/* <CommandMenu /> */}</div>
            <nav className="flex items-center gap-0.5">
              <div className="mr-4 hidden lg:inline-block">
                <ThemeToggle />
              </div>
              <nav className="flex items-center gap-2">
                {/* <ThemeToggle /> */}

                {status === "loading" ? (
                  <div className="mr-4">
                    <Loader2Icon className="text-foreground-light size-4 animate-spin" />
                  </div>
                ) : status === "authenticated" ? (
                  <Button variant="ghost" className="h-8 text-primary hover:bg-secondary">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    {pathname !== "/login" && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 px-2 font-semibold text-primary hover:!bg-transparent hover:!text-primary"
                        asChild
                      >
                        <Link href="/login">Log In</Link>
                      </Button>
                    )}

                    <Button type="button" className="h-10">
                      <Link href="/onboarding">Get Started</Link>
                    </Button>
                  </>
                )}
              </nav>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
