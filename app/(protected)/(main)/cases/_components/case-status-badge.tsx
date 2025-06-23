import { Dot } from "@/components/ui/dot";
import { StatusWrapper } from "@/components/ui/status-wrapper";
import { cn, getStatusColors } from "@/lib/utils";
import { CaseLookups } from "@/types/cases";

export function CaseStatus({
  status,
  name,
  className,
}: {
  status?: CaseLookups["caseStatus"][number]["id"];
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
