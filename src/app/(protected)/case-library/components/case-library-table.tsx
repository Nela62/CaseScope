import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllDocuments } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { NoCases } from "./no-cases";

export const CaseLibraryTable = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const { setSelectedCaseId } = useAppStore((state) => state);
  // const isLoading = true;

  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedCaseId(documents[0].id);
    }
  }, [documents]);

  return (
    <div className="h-full">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Case Library
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-00"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Documents
          </button>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-[100px] h-[20px] rounded-sm" />
      ) : documents && documents.length > 0 ? (
        <CaseLibraryTable />
      ) : (
        <NoCases />
      )}
    </div>
  );
};
