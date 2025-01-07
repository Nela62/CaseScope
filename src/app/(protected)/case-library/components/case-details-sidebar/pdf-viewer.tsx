"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchDocumentById, fetchPublicDocumentById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useUser } from "@/providers/user-provider";
import { Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useFileUrl } from "@supabase-cache-helpers/storage-react-query";

// TODO: High: Take up full width and readjust when sidebar is moved
// TODO: High: Improve the UI

export const PdfViewer = () => {
  const supabase = createClient();
  const { userId, isAnonymous } = useUser();

  const { selectedCaseId } = useAppStore((state) => state);
  const { data: document } = useQuery(
    isAnonymous
      ? fetchPublicDocumentById(supabase, selectedCaseId ?? "")
      : fetchDocumentById(supabase, selectedCaseId ?? ""),
    { enabled: !!selectedCaseId }
  );

  const { data: fileUrl } = useFileUrl(
    supabase.storage.from(isAnonymous ? "public_documents" : "documents"),
    isAnonymous ? `${document?.name}` : `${userId}/${document?.name}`,
    "private",
    { enabled: !!document }
  );

  // TODO: Medium: Remove unnecessary functions
  // TODO: Low: Make it more responsive on smaller screens
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return fileUrl ? (
    <div className="h-full w-full">
      <div
        className="rpv-core__viewer"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#eeeeee",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            display: "flex",
            padding: "4px",
          }}
        >
          <Toolbar />
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
        </div>
      </div>
    </div>
  ) : (
    <Skeleton className="h-full w-full" />
  );
};
