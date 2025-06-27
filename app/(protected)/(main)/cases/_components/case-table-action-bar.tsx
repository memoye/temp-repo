"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { DownloadIcon, Trash2 } from "lucide-react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV, exportTableToExcel } from "@/lib/export";
// import { deleteTasks, updateTasks } from "../_lib/actions";
import type { CaseItem } from "@/types/cases";
// import { useCaseLookups } from "@/hooks/use-case-lookups";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// const actions = ["update-status", "update-priority", "export", "delete"] as const;

type Action = "export" | "delete";

interface CasesTableActionBarProps {
  table: Table<CaseItem>;
}

export function CasesTableActionBar({ table }: CasesTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  // const {
  //   data: caseLookups,
  //   // isLoading: caseLookupsIsLoading,
  //   // isFetching: caseLookupsIsFetching,
  // } = useCaseLookups();
  // const statusOptions = React.useMemo(
  //   () =>
  //     caseLookups?.caseStatus.map((item) => ({
  //       label: item.name,
  //       value: item.id as string,
  //     })) || [],
  //   [caseLookups],
  // );

  // const onTaskUpdate = React.useCallback(
  //   ({
  //     field,
  //     value,
  //   }: {
  //     field: "status" | "priority";
  //     value: Task["status"] | Task["priority"];
  //   }) => {
  //     setCurrentAction(field === "status" ? "update-status" : "update-priority");
  //     startTransition(async () => {
  //       const { error } = await updateTasks({
  //         ids: rows.map((row) => row.original.id),
  //         [field]: value,
  //       });

  //       if (error) {
  //         toast.error(error);
  //         return;
  //       }
  //       toast.success("Tasks updated");
  //     });
  //   },
  //   [rows],
  // );

  const onCaseExport = React.useCallback(
    (type?: "csv" | "xlsx") => {
      setCurrentAction("export");
      startTransition(() => {
        if (type === "xlsx")
          exportTableToExcel(table, {
            excludeColumns: ["select", "actions"],
            onlySelected: true,
            filename: "Cases",
          });
        else
          exportTableToCSV(table, {
            excludeColumns: ["select", "actions"],
            onlySelected: true,
            filename: "Cases",
          });
      });
    },
    [table],
  );

  // const onTaskDelete = React.useCallback(() => {
  //   setCurrentAction("delete");
  //   startTransition(async () => {
  //     const { error } = await deleteTasks({
  //       ids: rows.map((row) => row.original.id),
  //     });

  //     if (error) {
  //       toast.error(error);
  //       return;
  //     }
  //     table.toggleAllRowsSelected(false);
  //   });
  // }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        {/* <Select
        onValueChange={(value: Task["status"]) => onTaskUpdate({ field: "status", value })}
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending("update-status")}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))} 
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
         onValueChange={(value: Task["priority"]) =>
           onTaskUpdate({ field: "priority", value })
        }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update priority"
              isPending={getIsActionPending("update-priority")}
            >
              <ArrowUp />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {statusOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DataTableActionBarAction size="icon" tooltip="Export Cases">
              <DownloadIcon />
            </DataTableActionBarAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" sideOffset={5} className="p-2">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <button className="w-full" type="button" onClick={() => onCaseExport("xlsx")}>
                  Excel
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button className="w-full" type="button" onClick={() => onCaseExport("csv")}>
                  CSV
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DataTableActionBarAction
          size="icon"
          tooltip="Delete Cases"
          isPending={getIsActionPending("delete")}
          className="bg-transparent! text-destructive! hover:bg-destructive/10!"
          // onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
