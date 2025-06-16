"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ReactNode } from "react";
import { capitalize } from "@/lib/utils";
import { useTheme } from "next-themes";

type ThemeToggleProps =
  | { variant: "dropdown"; className?: string; children?: ReactNode }
  | { variant?: "switch"; className?: string; children?: never };

export function ThemeToggle({ variant, className, children }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  if (variant === "dropdown")
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={children ? "default" : "icon"} className={className}>
            {theme === "light" && <SunIcon size={12} className="animate-in fade-in-0" />}
            {theme === "dark" && <MoonIcon size={12} className="animate-in fade-in" />}
            {theme === "system" && <LaptopIcon size={12} className="animate-in fade-in" />}
            {children}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  const handleToggle = () => {
    switch (theme) {
      case "system":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      default:
        break;
    }
  };

  return (
    <div className={className} suppressHydrationWarning>
      <button
        type="button"
        onClick={handleToggle}
        className="focus-within:outline-brand text-brand hover:border-brand relative flex h-5 w-11 min-w-max flex-nowrap items-center rounded-full border border-border bg-accent transition-[border-color] duration-300 ease-in focus-within:outline-offset-1 dark:text-foreground [&>span]:inline-block [&>span]:shrink-0"
        title={capitalize(theme || "")}
        suppressHydrationWarning
      >
        <span
          data-theme={theme}
          className="absolute top-1/2 grid! size-4.5 -translate-y-1/2 place-items-center rounded-full bg-background drop-shadow-sm transition-[left] duration-300 ease-out hover:border-primary data-[theme=dark]:left-[calc(100%-(1rem+3px))] data-[theme=light]:left-px data-[theme=system]:left-3"
          suppressHydrationWarning
        >
          {theme === "light" && <SunIcon size={12} className="animate-in fade-in-0" />}
          {theme === "dark" && <MoonIcon size={12} className="animate-in fade-in" />}
          {theme === "system" && <LaptopIcon size={12} className="animate-in fade-in" />}
        </span>
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}
