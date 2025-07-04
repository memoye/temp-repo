"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
  noColor?: boolean;
}

export function Logo({ iconOnly, className, noColor }: LogoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn("flex items-center justify-start gap-2 p-0.5 sm:gap-4", className)}>
      {iconOnly ? (
        <Image
          className="size-8 object-contain"
          src={
            !noColor
              ? "/assets/logo-icon.png"
              : resolvedTheme === "dark"
                ? "/assets/logo-icon-white.png"
                : "/assets/logo-icon-grayscale.png"
          }
          width={2763}
          height={2953}
          alt="Chronica"
          priority={true}
        />
      ) : (
        <Image
          className="h-12 w-28 object-contain"
          src="/assets/logo-full.png"
          width={1800}
          height={535}
          alt="Chronica"
          priority={true}
        />
      )}
    </div>
  );
}
