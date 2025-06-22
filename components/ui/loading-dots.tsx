import { cn } from "@/lib/utils";

export function LoadingDots({
  className,
  size = "md",
  animation = "bounce",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  animation?: "pulse" | "bounce";
}) {
  const baseDot = cn("inline-block rounded-full bg-current", animation, {
    "size-0.5": size === "xs",
    "size-1": size === "sm",
    "size-2.5": size === "md",
    "size-6": size === "lg",
    "size-7": size === "xl",
    "size-8": size === "2xl",
    "size-10": size === "3xl",

    "animate-bounce": animation === "bounce",
    "animate-pulse": animation === "pulse",
  });

  return (
    <span
      className={cn("inline-flex items-center justify-center", className, {
        "gap-1": ["xs", "sm", "md"].includes(size),
        "gap-2": ["lg", "xl"].includes(size),
        "gap-4": ["2xl", "3xl"].includes(size),
      })}
    >
      <span className="sr-only">Loading...</span>
      <span className={cn(baseDot, "[animation-delay:-0.3s]")} />
      <span className={cn(baseDot, "[animation-delay:-0.15s]")} />
      <span className={baseDot} />
    </span>
  );
}
