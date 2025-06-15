"use client";

import { useState, useCallback } from "react";
import Link, { LinkProps } from "next/link";
import { useMetaColor } from "@/hooks/use-meta-color";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { ThemeToggle } from "./theme-toggle";
import { useSession } from "next-auth/react";
import { Logo } from "./logo";

function MobileNav() {
  const { status: sessionStatus } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { setMetaColor, metaColor } = useMetaColor();

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      setMetaColor(open ? "#09090b" : metaColor);
    },
    [setMetaColor, metaColor],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-1 -ml-2 size-8 px-0 py-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon className="text-primary" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3 pt-8">
            <MobileLink
              href="/"
              onOpenChange={setOpen}
              prefetch={true}
              className={cn(
                "rounded-md px-4 py-2 font-medium",
                pathname === "/" ? "text-primary" : "",
              )}
            >
              Home
            </MobileLink>

            <MobileLink
              href="/"
              onOpenChange={setOpen}
              prefetch={true}
              className={cn(
                "rounded-md px-4 py-2 font-medium",
                pathname === "/about" ? "bg-primary-light text-primary" : "",
              )}
            >
              About
            </MobileLink>

            <MobileLink
              href="/"
              onOpenChange={setOpen}
              prefetch={true}
              className={cn(
                "rounded-md px-4 py-2 font-medium",
                pathname === "/contact" ? "bg-primary-light text-primary" : "",
              )}
            >
              Contact
            </MobileLink>

            <MobileLink
              href="/"
              onOpenChange={setOpen}
              prefetch={true}
              className={cn(
                "rounded-md px-4 py-2 font-medium",
                pathname === "/pricing" ? "bg-primary-light text-primary" : "",
              )}
            >
              Pricing
            </MobileLink>

            {sessionStatus === "loading" ? (
              <></>
            ) : sessionStatus === "authenticated" ? (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 font-medium text-primary"
              >
                <ArrowLeftIcon className="size-4" /> Back to Dashboard
              </Link>
            ) : (
              <>
                <Button asChild>
                  <Link href="/onboarding">Get Started</Link>
                </Button>

                <p className="text-foreground-light text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-primary">
                    Log in
                  </Link>
                  .
                </p>
              </>
            )}

            <ThemeToggle className="!mt-6" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <span className="hidden font-bold lg:inline-block">
          <Logo />
        </span>
        {/* <span className="font-bold lg:hidden">
          <Logo iconOnly />
        </span> */}
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/"
          className={cn(
            "rounded-md px-2 py-1 font-medium text-sidebar-foreground transition-colors",
            pathname === "/" ? "text-primary" : "hover:bg-muted hover:text-foreground/80",
          )}
        >
          Home
        </Link>

        <Link
          href="/about"
          className={cn(
            "rounded-md px-2 py-1 font-medium text-sidebar-foreground transition-colors",
            pathname === "/about" ? "text-primary" : "hover:bg-muted hover:text-foreground/80",
          )}
        >
          About Us
        </Link>

        <Link
          href="/contact"
          className={cn(
            "rounded-md px-2 py-1 font-medium text-sidebar-foreground transition-colors",
            pathname === "/contact"
              ? "text-primary"
              : "hover:bg-muted hover:text-foreground/80",
          )}
        >
          Contact
        </Link>

        <Link
          href="/pricing"
          className={cn(
            "rounded-md px-2 py-1 font-medium text-sidebar-foreground transition-colors",
            pathname === "/pricing"
              ? "text-primary"
              : "hover:bg-muted hover:text-foreground/80",
          )}
        >
          Pricing
        </Link>
      </nav>
    </div>
  );
}

export { MainNav, MobileNav };
