import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { type DataTableSkeletonProps } from "./data-table-skeleton";
import { Skeleton } from "../ui/skeleton";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  skeletonProps?: DataTableSkeletonProps;
  emptyMessage?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  skeletonProps,
  isLoading,
  emptyMessage,
  ...props
}: DataTableProps<TData>) {
  const cozyCellWidths = Array.from(
    { length: skeletonProps?.columnCount || 7 },
    (_, index) =>
      skeletonProps?.cellWidths?.[index % skeletonProps.cellWidths.length] ?? "auto",
  );

  return (
    <div className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
      {children}

      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          {!(isLoading && skeletonProps?.hideHeader) && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          {isLoading ? (
            <TableBody>
              {Array.from({
                length: skeletonProps?.rowCount ?? skeletonProps?.rowCount ?? 10,
              }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  {Array.from({
                    length: table.getAllColumns().length ?? skeletonProps?.columnCount ?? 5,
                  }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: cozyCellWidths[j],
                        minWidth: skeletonProps?.shrinkZero ? cozyCellWidths[j] : "auto",
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                          data-state={cell.column.getIsPinned() && "pinned"}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 bg-muted! text-center"
                  >
                    {emptyMessage ?? "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
