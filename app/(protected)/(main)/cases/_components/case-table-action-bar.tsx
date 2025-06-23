"use client";

import * as React from "react";
import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { ArrowUp, CheckCircle2, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Select, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
// import { deleteTasks, updateTasks } from "../_lib/actions";
import type { CaseItem } from "@/types/cases";
import { useCaseLookups } from "@/hooks/use-case-lookups";

const actions = ["update-status", "update-priority", "export", "delete"] as const;

type Action = (typeof actions)[number];

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

  const {
    data: caseLookups,
    isLoading: caseLookupsIsLoading,
    // isFetching: caseLookupsIsFetching,
  } = useCaseLookups();
  const statusOptions = React.useMemo(
    () =>
      caseLookups?.caseStatus.map((item) => ({
        label: item.name,
        value: item.id as string,
      })) || [],
    [caseLookups],
  );

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

  const onCaseExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

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
        <Select
        // onValueChange={(value: Task["status"]) => onTaskUpdate({ field: "status", value })}
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
              {/* {tasks.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))} */}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
        // onValueChange={(value: Task["priority"]) =>
        //   onTaskUpdate({ field: "priority", value })
        // }
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
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export Cases"
          isPending={getIsActionPending("export")}
          onClick={onCaseExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete Cases"
          isPending={getIsActionPending("delete")}
          // onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
