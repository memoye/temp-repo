import { Dot } from "@/components/ui/dot";
import { StatusWrapper } from "@/components/ui/status-wrapper";
import { cn, getStatusColors } from "@/lib/utils";

export function CaseStatus({
  status,
  name,
  className,
}: {
  status?: string | number;
  name?: string;
  className?: string;
}) {
  return (
    <StatusWrapper className={cn(getStatusColors(status), className)}>
      <Dot />
      <span>{name || status}</span>
    </StatusWrapper>
  );
}
