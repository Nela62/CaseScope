import { FileUploader } from "@/components/file-uploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { useAppStore } from "@/providers/app-store-provider";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const AddDocumentsDialog = () => {
  const { userId, isAnonymous } = useUser();
  const { appendFileProcessingEvents } = useAppStore((state) => state);
  const [open, setOpen] = useState(false);

  const handleDone = useCallback(
    async (files: (File | Blob)[]) => {
      setOpen(false);

      const processedFiles = files.map((file) =>
        file instanceof File ? file : new File([file], `${uuidv4()}.pdf`)
      );

      const formData = new FormData();
      formData.append("userId", userId);
      for (let i = 0; i < processedFiles.length; i++) {
        formData.append("files[]", processedFiles[i], processedFiles[i].name);
      }

      const response = await fetch("/api/documents/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // TODO: Medium: Display toast with error message
        console.error("Failed to process documents");
        throw new Error("Failed to process documents");
      }

      const { data } = await response.json();
      appendFileProcessingEvents(data);
    },
    [appendFileProcessingEvents, userId]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAnonymous}
        >
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
