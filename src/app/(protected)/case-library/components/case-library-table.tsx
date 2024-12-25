import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-react-query";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { fetchAllDocuments } from "@/lib/queries";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { NoCases } from "./no-cases";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/providers/app-store-provider";
import { useMemo } from "react";

type Document = {
  id: string;
  name: string;
  created_at: string;
};

// TODO: High: Add delete button
// TODO: Low: Add sorting
export const CaseLibraryTable = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const { setSelectedCaseId } = useAppStore((state) => state);

  const { mutateAsync: deleteDocument } = useDeleteMutation(
    supabase.from("documents"),
    ["id"]
  );

  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }: { row: Row<Document> }) => {
          const document = row.original;
          return (
            <div className="text-center">
              {format(document.created_at, "MM/dd/yyyy")}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }: { row: Row<Document> }) => {
          const document = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-300"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  // TODO: High: Delete from storage
                  // TODO: Low: Add confirmation toast
                  onClick={() => deleteDocument({ id: document.id })}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteDocument]
  );

  // TODO: Low: Corners of the table overflow
  // TODO: Low: Improve the table's ui

  return documents && !isLoading ? (
    documents.length > 0 ? (
      <DataTable
        columns={columns}
        data={documents}
        onRowClick={(row) => setSelectedCaseId(row.id)}
      />
    ) : (
      <NoCases />
    )
  ) : (
    <Skeleton className="h-[400px]" />
  );
};
