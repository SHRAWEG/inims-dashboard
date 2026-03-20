import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowCount?: number;
}

export function DataTablePagination<TData>({
  table,
  rowCount,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("common");

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows =
    rowCount ??
    (table.getFilteredRowModel().rows.length ||
      table.options.data.length * table.getPageCount());

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50">
      <div className="text-sm font-medium text-slate-500">
        Showing <span className="text-slate-900">{from}</span> to{" "}
        <span className="text-slate-900">{to}</span> of{" "}
        <span className="text-slate-900">{totalRows}</span> results
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="material-symbols-outlined text-lg">
            chevron_left
          </span>
        </Button>

        {/* Simplified Page Numbers Logic */}
        {table.getPageCount() > 0 && (
          <div className="flex items-center gap-1">
            {pageIndex > 0 && (
              <Button
                variant="outline"
                className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                onClick={() => table.setPageIndex(0)}
              >
                1
              </Button>
            )}

            {pageIndex > 2 && <div className="text-slate-300 px-1">...</div>}

            {pageIndex > 1 && (
              <Button
                variant="outline"
                className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                onClick={() => table.setPageIndex(pageIndex - 1)}
              >
                {pageIndex}
              </Button>
            )}

            <Button className="h-8 w-8 p-0 rounded-md font-bold text-sm transition-all bg-[#aa000c] text-white hover:bg-[#930009]">
              {pageIndex + 1}
            </Button>

            {pageIndex < table.getPageCount() - 2 && (
              <Button
                variant="outline"
                className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                onClick={() => table.setPageIndex(pageIndex + 1)}
              >
                {pageIndex + 2}
              </Button>
            )}

            {pageIndex < table.getPageCount() - 3 && (
              <div className="text-slate-300 px-1">...</div>
            )}

            {pageIndex < table.getPageCount() - 1 && (
              <Button
                variant="outline"
                className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              >
                {table.getPageCount()}
              </Button>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-md border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="material-symbols-outlined text-lg">
            chevron_right
          </span>
        </Button>
      </div>
    </div>
  );
}
