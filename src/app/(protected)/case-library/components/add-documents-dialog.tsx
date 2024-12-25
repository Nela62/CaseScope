import { FileUploader } from "@/components/file-uploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/providers/user-provider";
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { useAppStore } from "@/providers/app-store-provider";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const AddDocumentsDialog = () => {
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
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
          <PlusIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
          Add Documents
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-none w-fit">
        <DialogHeader>
          <DialogTitle>Add Documents</DialogTitle>
        </DialogHeader>
        <FileUploader onDone={handleDone} />
      </DialogContent>
    </Dialog>
  );
};
