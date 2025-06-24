import Link from "next/link";
import { format } from "date-fns";
import { getCaseStatusLabel } from "@/lib/utils";
import { CalendarIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Copiable } from "@/components/ui/copiable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaseStatus } from "./case-status-badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { CaseItem, CaseLookups } from "@/types/cases";
import { Option } from "@/types/data-table";

export function getCasesColumns(
  cases: CaseItem[],
  {
    courtOptions,
    assigneesOptions,
    statusOptions,
  }: Record<"courtOptions" | "assigneesOptions" | "statusOptions", Option[]>,
): ColumnDef<CaseItem>[] {
  return [
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
      id: "id",
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Case No." />,
      cell: ({ cell }) => (
        <Copiable className="select-all" copyText={String(cell.getValue())} />
      ),
      meta: { label: "Case No." },
      size: 200,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
      meta: {
        label: "Title",
        placeholder: "Search Cases...",
        variant: "text",
      },
      enableColumnFilter: true,
      enableHiding: false,
      size: 350,
    },
    {
      id: "court",
      accessorKey: "court",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Court" />,
      cell: ({ row }) => <div>{row.original.court.name}</div>,
      meta: {
        label: "Court",
        variant: "multiSelect",
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
      meta: { label: "Location" },
      enableSorting: false,
      size: 180,
    },
    {
      id: "permission",
      accessorKey: "permission",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Permission" />,
      cell: ({ row: _ }) => <div className="w-[150px] text-accent-foreground">{"--"}</div>,
      meta: { label: "Permission" },
      enableSorting: false,
      size: 150,
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
      size: 120,
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
      size: 140,
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
  ];
}
