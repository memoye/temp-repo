"use client";

import { cn } from "@/lib/utils";
import { CaseStatuses } from "@/lib/enums";
import { ActivityIcon, ArchiveIcon, ClockIcon, FolderIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingDots } from "@/components/ui/loading-dots";
import type { CaseItem } from "@/types/cases";
import type { ApiResponse } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { getCases } from "@/data/services/case-manager";

interface QuickCasesStatsProps {
  className?: string;
  isLoading?: boolean;
}
export function QuickCasesStats({ className }: QuickCasesStatsProps) {
  const {
    data: casesData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["cases", "stats"],
    queryFn: () => getCases({ PageSize: 500 }),
  });

  const cases = casesData?.payload || [];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 @3xl/main:grid-cols-2 @7xl/main:grid-cols-4",
        isFetching && "opacity-75",
        className,
      )}
    >
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <FolderIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <LoadingDots size="sm" animation="pulse" /> : casesData?.totalCount}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          <ActivityIcon className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <LoadingDots size="sm" animation="pulse" />
            ) : (
              cases.filter((c) => c.status === CaseStatuses.Active).length
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
          <ClockIcon className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">
            {/* {isLoading ? <LoadingDots size="sm"/> : cases.filter((c) => c.status === CaseStatuses.PENDING).length} */}
            --
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
          <ArchiveIcon className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <LoadingDots size="sm" animation="pulse" />
            ) : (
              cases.filter((c) => c.status === CaseStatuses.Closed).length
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
