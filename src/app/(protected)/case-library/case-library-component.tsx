"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CaseDetails } from "./components/case-details";
import { CaseLibraryTable } from "./components/case-library-table";
import { useAppStore } from "@/providers/app-store-provider";
import { AddDocumentsButton } from "./components/add-documents-button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoCases } from "./components/no-cases";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllDocuments } from "@/lib/queries";
import { DisplayFileProcessingStatus } from "@/components/display-file-processing-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// TODO: Medium: Maybe use a hashmap instead of an array to speed it up
// TODO: High: Fetch all currently processing files on init
export const CaseLibraryComponent = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const { selectedCaseId, setSelectedCaseId, fileProcessingEvents } =
    useAppStore((state) => state);

  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedCaseId(documents[0].id);
    }
  }, [documents, setSelectedCaseId]);

  // TODO: High: Once all runs are done, remove the event from the fileEvents

  return (
    <div className="h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="space-x-4 md:space-x-6 lg:space-x-8"
      >
        <ResizablePanel defaultSize={60}>
          <div className="h-full py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Case Library
                </h2>
              </div>
              <div className="mt-4 flex gap-4 md:mt-0 md:ml-4">
                <Dialog>
                  <DialogTrigger>
                    <div className="rounded-full bg-yellow-400 p-2 h-8 w-8 flex items-center justify-center text-muted-foreground">
                      {/* {fileProcessingEvents.length} */}
                      15
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      {/* TODO: Improve the title */}
                      <DialogTitle>Files Being Processed</DialogTitle>
                    </DialogHeader>
                    <DisplayFileProcessingStatus />
                  </DialogContent>
                </Dialog>
                <AddDocumentsButton />
              </div>
            </div>
            <div className="flex items-center justify-between py-1 px-2 bg-orange-300 rounded-md">
              <p>Processing files (5 left)</p>
              <Button variant="outline">View</Button>
            </div>

            {isLoading ? (
              <Skeleton className="w-[100px] h-[20px] rounded-sm" />
            ) : documents && documents.length > 0 ? (
              <CaseLibraryTable />
            ) : (
              <NoCases />
            )}
          </div>
        </ResizablePanel>
        {selectedCaseId && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
              <CaseDetails />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
