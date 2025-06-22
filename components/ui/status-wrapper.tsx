import { cn } from "@/lib/utils";

export function StatusWrapper({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-max items-center justify-center space-x-1 rounded-[20px] px-2.5 capitalize",
        className,
      )}
    >
      {children}
    </span>
  );
}
