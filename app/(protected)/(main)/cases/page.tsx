"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn, getCaseStatusLabel } from "@/lib/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { TextIcon, CalendarIcon, PlusIcon, MoreHorizontalIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { CaseItem } from "@/types/cases";
import { useQuery } from "@tanstack/react-query";
import { getCases } from "@/data/services/case-manager";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { PageHeader } from "@/app/_components/page-header";
import { PageWrapper } from "@/app/_components/page-wrapper";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { QuickCasesStats } from "./_components/quick-cases-stats";
import { CaseStatus } from "./_components/case-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableActionBar } from "@/components/data-table/data-table-action-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCaseLookups } from "@/hooks/use-case-lookups";
import type { ColumnDef } from "@tanstack/react-table";

export default function CasesTablePage() {
  const router = useRouter();

  const [Page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [PageSize] = useQueryState("perPage", parseAsInteger.withDefault(20));
  const [Keyword] = useQueryState("title", { defaultValue: "", throttleMs: 500 });

  const {
    data: casesData,
    isLoading: casesIsLoading,
    isError: casesIsError,
    isFetching: casesIsFetching,
  } = useQuery({
    queryKey: ["cases", Page, PageSize, Keyword],
    queryFn: () => getCases({ Page, PageSize, Keyword }),
  });

  const {
    data: caseLookups,
    // isLoading: caseLookupsIsLoading,
    // isFetching: caseLookupsIsFetching,
  } = useCaseLookups();
  const statusOptions = useMemo(
    () =>
      caseLookups?.caseStatus.map((item) => ({
        label: item.name,
        value: item.id as string,
        count:
          casesData?.payload.filter((caseItem) => caseItem.status === item.id).length || 1,
      })) || [],
    [caseLookups, casesData],
  );
  const { courtOptions, assigneesOptions } = useMemo(() => {
    if (!casesData?.payload) return { courtOptions: [], assigneesOptions: [] };

    const courtMap = new Map();
    const assigneesMap = new Map();

    casesData.payload.forEach((item) => {
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
    });

    return {
      courtOptions: Array.from(courtMap.values()),
      assigneesOptions: Array.from(assigneesMap.values()),
    };
  }, [casesData]);

  const columns = useMemo<ColumnDef<CaseItem>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        // Provide an unique id for the column
        // This id will be used as query key for the column filter
        id: "title",
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
        // Define the column meta options for sorting, filtering, and view options
        meta: {
          label: "Title",
          placeholder: "Search Cases...",
          variant: "text",
        },
        // By default, the column will not be filtered. Set to `true` to enable filtering.
        enableColumnFilter: true,
        enableHiding: false,
      },
      {
        // Provide an unique id for the column
        // This id will be used as query key for the column filter
        id: "court",
        accessorKey: "court",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Court" />,
        cell: ({ row }) => <div>{row.original.court.name}</div>,
        meta: {
          label: "Court",
          variant: "select",
          options: courtOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "assignedTo",
        accessorKey: "assignedTo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
        meta: {
          label: "Assignee",
          variant: "multiSelect",
          options: assigneesOptions,
        },
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        id: "location",
        accessorKey: "location",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
        cell: ({ row }) => (
          <div className="grid min-w-[150px] gap-0.5">
            <div>{row.original.city || "--"}</div>
            <div className="text-xs font-light text-accent-foreground">
              {row.original.state.name || ""}
            </div>
          </div>
        ),
        meta: {
          label: "Location",
        },
        enableSorting: false,
      },
      {
        id: "permission",
        accessorKey: "permission",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Permission" />,
        cell: ({ row: _ }) => <div className="w-[150px] text-accent-foreground">{"--"}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "openDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
        cell: ({ getValue }) => {
          const date = getValue<Date>();
          return <div className="min-w-max">{date ? format(date, "PP") : "--"}</div>;
        },
        meta: {
          label: "Start Date",
          variant: "dateRange",
          // placeholder: "From",
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <CaseStatus status={getCaseStatusLabel(row.original.status)} />,
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptions,
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/cases/${row.original.id}`}>Open</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/cases/${row.original.id}?action=edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [courtOptions, assigneesOptions, statusOptions],
  );

  const { table } = useDataTable({
    data: casesData?.payload || [],
    columns,
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
    <PageWrapper className="space-y-6 py-4">
      <PageHeader
        title="Cases"
        description="Manage and track all cases"
        pageActions={
          <Button
            type="button"
            onClick={handleCreateCase}
            onMouseOver={() => router.prefetch("/cases/new")}
          >
            <PlusIcon /> New Case
          </Button>
        }
      />

      <QuickCasesStats
        isLoading={casesIsLoading}
        className={cn(casesIsFetching && "opacity-75")}
      />

      <>
        <DataTable
          table={table}
          actionBar={<DataTableActionBar visible table={table}></DataTableActionBar>}
          className={cn(casesIsFetching && "opacity-75")}
          isLoading={casesIsLoading}
          skeletonProps={{
            columnCount: columns.length,
            rowCount: PageSize,
            cellWidths: [
              "2rem",
              "10rem",
              ...Array.from({ length: columns.length - 3 }, () => "8rem"),
            ],
          }}
        >
          {!casesIsLoading && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Filter Cases</CardTitle>
                <CardDescription>
                  <p>Search and filter cases by various criteria</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTableToolbar table={table}></DataTableToolbar>
              </CardContent>
            </Card>
          )}
        </DataTable>
      </>
    </PageWrapper>
  );
}
