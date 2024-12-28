"use client";

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
import { useEffect, useMemo } from "react";
import { useRemoveFiles } from "@supabase-cache-helpers/storage-react-query";
import { useUser } from "@/providers/user-provider";

type Document = {
  id: string;
  name: string;
  created_at: string;
};

// TODO: Low: Add sorting
// TODO: High: Doesn't remove the sidebar even after the last case is deleted
// TODO: High: Adds a document to the list before it's fully processed
export const CaseLibraryTable = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const { setSelectedCaseId } = useAppStore((state) => state);
  const { userId } = useUser();

  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedCaseId(documents[0].id);
    }
  }, [documents, setSelectedCaseId]);

  const { mutateAsync: deleteDocument } = useDeleteMutation(
    supabase.from("documents"),
    ["id"]
  );
  const { mutateAsync: deleteFile } = useRemoveFiles(
    supabase.storage.from("documents")
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
            <div className="">{format(document.created_at, "MM/dd/yyyy")}</div>
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
                <DropdownMenuLabel className="sr-only">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  // TODO: Low: Add confirmation toast
                  onClick={async () => {
                    await deleteDocument({ id: document.id });
                    await deleteFile([`${userId}/${document.name}`]);
                    await deleteFile([
                      `${userId}/${document.name.replace(".pdf", ".md")}`,
                    ]);
                    setSelectedCaseId(
                      documents && documents.length ? documents[0].id : null
                    );
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteDocument, deleteFile, setSelectedCaseId, documents, userId]
  );

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
