"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { FileUploader } from "./components/file-uploader";
import { createClient } from "@/lib/supabase/client";
import { fetchAllDocuments } from "@/lib/queries";

export const DataSourcesComponent = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));

  return (
    <div>
      <h1 className="text-2xl font-bold">Data Sources</h1>
      <FileUploader />
    </div>
  );
};
