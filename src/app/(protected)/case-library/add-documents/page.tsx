"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/providers/user-provider";
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { useAppStore } from "@/providers/app-store-provider";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/file-uploader";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddDocumentsPage() {
  const { userId } = useUser();
  const { appendFileProcessingEvents } = useAppStore((state) => state);
  const [isProcessing, setIsProcessing] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const { mutateAsync: upload } = useUpload(
    supabase.storage.from("documents"),
    { buildFileName: ({ fileName }) => `${userId}/${fileName}` }
  );
  const { mutateAsync: insertDocuments } = useUpsertMutation(
    supabase.from("documents"),
    ["id"],
    "id, name",
    { ignoreDuplicates: true, onConflict: "name, user_id" }
  );

  // TODO: add more error handling for files with the same name

  const handleDone = useCallback(
    async (files: (File | Blob)[]) => {
      if (isProcessing) return;

      setIsProcessing(true);

      const res = await upload({
        files: files.map((file) =>
          file instanceof File ? file : new File([file], `${uuidv4()}.pdf`)
        ),
      });

      const filePaths = res.map(({ data, error }) => {
        // TODO: move these to backend or background job. otherwise they're slowing down the page
        if (error) {
          console.error(error);
          throw new Error("Failed to upload file");
        }
        return data.fullPath;
      });

      const documents = await insertDocuments(
        filePaths.map((path) => ({
          name: path.split("/").pop()!,
          user_id: userId,
        }))
      );

      if (!documents) {
        console.error("Failed to insert documents");
        throw new Error("Failed to insert documents");
      }

      console.log(documents);

      const response = await fetch("/api/documents/process", {
        method: "POST",
        body: JSON.stringify({ files: documents, userId }),
      });

      if (!response.ok) {
        console.error("Failed to process documents");
        throw new Error("Failed to process documents");
      }

      const { data } = await response.json();
      console.log(data);
      appendFileProcessingEvents(data);
      router.push("/case-library");
    },
    [
      isProcessing,
      appendFileProcessingEvents,
      router,
      insertDocuments,
      upload,
      userId,
    ]
  );

  return (
    <div className="h-full flex flex-col py-9">
      <Link
        href="/case-library"
        className="flex items-center gap-2 text-xs text-muted-foreground font-semibold cursor-pointer"
      >
        <ArrowLeft className="size-3" />
        Back to Case Library
      </Link>
      <div className="min-w-0 flex items-center gap-2 mt-4">
        <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Upload Documents
        </h2>
      </div>
      <div className="flex-1 flex items-center justify-center pb-20">
        <FileUploader onDone={handleDone} />
      </div>
    </div>
  );
}
