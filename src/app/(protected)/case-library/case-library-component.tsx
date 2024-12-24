"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { FileUploader } from "./components/file-uploader";
import { createClient } from "@/lib/supabase/client";
import { fetchAllDocuments } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const CaseLibraryComponent = () => {
  const supabase = createClient();
  // const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const isLoading = true;

  return isLoading ? (
    <Skeleton className="w-[100px] h-[20px] rounded-sm" />
  ) : (
    <div>
      <h1 className="text-2xl font-bold">Data Sources</h1>
      <FileUploader />
    </div>
  );
};
