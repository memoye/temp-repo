"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn, getCaseStatusLabel } from "@/lib/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getCases } from "@/data/services/case-manager";
import { PageHeader } from "@/app/_components/page-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { PageWrapper } from "@/app/_components/page-wrapper";
import { Button } from "@/components/ui/button";
import { QuickCasesStats } from "./quick-cases-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableActionBar } from "@/components/data-table/data-table-action-bar";
import { parseAsInteger, useQueryState } from "nuqs";
import { CasesTableActionBar } from "./case-table-action-bar";
import { getCasesColumns } from "./cases-table-columns";
import { ApiResponse } from "@/types/common";
import { CaseItem } from "@/types/cases";

interface CasesTableProps {
  initialData?: ApiResponse<CaseItem[]>;
}
export default function CasesTable({ initialData }: CasesTableProps) {
  const router = useRouter();

  const [Page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [PageSize] = useQueryState("perPage", parseAsInteger.withDefault(20));
  const [Keyword] = useQueryState("title", { defaultValue: "", throttleMs: 500 });

  const {
    data: casesData,
    isLoading: casesIsLoading,
    isFetchedAfterMount,
    isError: casesIsError,
    isFetching: casesIsFetching,
  } = useQuery({
    queryKey: ["cases", Page, PageSize, Keyword],
    queryFn: () => getCases({ Page, PageSize, Keyword }),
    initialData,
    initialDataUpdatedAt: Date.now() - 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const columns = useMemo(() => {
    const courtMap = new Map();
    const assigneesMap = new Map();
    const statusMap = new Map();

    let courtOptions = [];
    let assigneesOptions = [];
    let statusOptions = [];

    casesData?.payload.forEach((item) => {
      const courtId = item.court.id;
      const assignee = item.assignedTo;
      if (courtMap.has(courtId)) {
        courtMap.get(courtId).count++;
      } else {
        courtMap.set(courtId, {
          label: item.court.name,
          value: courtId,
          count: 1,
        });
      }

      if (assigneesMap.has(assignee)) {
        assigneesMap.get(assignee).count++;
      } else {
        assigneesMap.set(assignee, {
          label: assignee,
          value: assignee,
          count: 1,
        });
      }

      if (statusMap.has(item.status)) {
        statusMap.get(item.status).count++;
      } else {
        statusMap.set(item.status, {
          label: getCaseStatusLabel(item.status),
          value: item.status,
          count: 1,
        });
      }
    });

    courtOptions = Array.from(courtMap.values());
    assigneesOptions = Array.from(assigneesMap.values());
    statusOptions = Array.from(statusMap.values());

    return getCasesColumns(casesData?.payload || [], {
      courtOptions,
      assigneesOptions,
      statusOptions,
    });
  }, [casesData?.payload]);

  const { table } = useDataTable({
    data: casesData?.payload || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"], left: ["select"] },
      pagination: { pageSize: 20, pageIndex: PageSize - 1 },
    },
    pageCount: !casesData?.totalCount
      ? 1
      : casesData.totalCount < PageSize
        ? 1
        : Math.ceil(casesData.totalCount / PageSize),
  });

  function handleCreateCase() {
    router.push("/cases/new");
  }

  return (
    <>
      <DataTable
        table={table}
        isLoading={casesIsLoading}
        actionBar={
          <DataTableActionBar table={table}>
            <CasesTableActionBar table={table} />
          </DataTableActionBar>
        }
        className={cn(casesIsFetching && "opacity-75")}
      >
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Filter Cases</CardTitle>
            <CardDescription>
              <p>Search and filter cases by various criteria</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTableToolbar table={table} />
          </CardContent>
        </Card>
      </DataTable>
    </>
  );
}
