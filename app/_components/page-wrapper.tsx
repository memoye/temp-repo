import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("@container/page space-y-6 px-4 md:px-6", className)}>{children}</div>
  );
}
