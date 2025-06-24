import * as XLSX from "@e965/xlsx";
import type { Table } from "@tanstack/react-table";
import { showErrorToast } from "./toast";

export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {},
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData));

  const csvContent = [
    headers.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTableToExcel<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {},
) {
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !opts?.excludeColumns?.includes(id as keyof TData));

  try {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(
      table.getRowModel().rows.map((row) => {
        return headers.reduce(
          (acc, header) => {
            acc[header] = row.getValue(header);
            return acc;
          },
          {} as Record<string, unknown>,
        );
      }),
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, opts.filename ?? "Table");
    XLSX.writeFile(
      workbook,
      `${opts.filename || "table"}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  } catch (error) {
    showErrorToast("Failed to export Excel file", { description: (error as Error).message });
    console.error("Excel download error:", error);
  }
}
