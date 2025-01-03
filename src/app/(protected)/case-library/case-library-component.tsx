"use client";

import { CaseLibraryTable } from "./components/case-library-table";
import { useAppStore } from "@/providers/app-store-provider";
import { AddDocumentsDialog } from "./components/add-documents-dialog";
import { DisplayFileProcessingStatus } from "@/components/display-file-processing-status";
import { CaseDetailsSidebar } from "./components/case-details-sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// TODO: Medium: Maybe use a hashmap instead of an array to speed it up
// TODO: High: Fetch all currently processing files on init
export const CaseLibraryComponent = () => {
  const { selectedCaseId } = useAppStore((state) => state);

  return (
    <div className="h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="space-x-4 md:space-x-6 lg:space-x-8"
      >
        <ResizablePanel defaultSize={60}>
          <div className="h-full py-6 space-y-10">
            <div className="md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Case Library
                </h2>
              </div>
              <div className="mt-4 flex gap-4 md:mt-0 md:ml-4">
                <DisplayFileProcessingStatus />
                <AddDocumentsDialog />
              </div>
            </div>
            <CaseLibraryTable />
          </div>
        </ResizablePanel>
        {selectedCaseId && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
              <CaseDetailsSidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
