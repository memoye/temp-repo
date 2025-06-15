import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <span
      data-slot="skeleton"
      className={cn("inline-block animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
}

export { Skeleton };
