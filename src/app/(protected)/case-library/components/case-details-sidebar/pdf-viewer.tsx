"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchDocumentById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useUser } from "@/providers/user-provider";
import { Viewer } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useFileUrl } from "@supabase-cache-helpers/storage-react-query";

export const PdfViewer = () => {
  const supabase = createClient();
  const { selectedCaseId } = useAppStore((state) => state);
  const { data: document } = useQuery(
    fetchDocumentById(supabase, selectedCaseId ?? ""),
    { enabled: !!selectedCaseId }
  );
  const { userId } = useUser();

  const { data: fileUrl } = useFileUrl(
    supabase.storage.from("documents"),
    `${userId}/${document?.name}`,
    "private",
    { enabled: !!document }
  );

  return fileUrl ? (
    <div>
      <Viewer fileUrl={fileUrl} />;
    </div>
  ) : (
    <Skeleton className="h-full w-full" />
  );
};
