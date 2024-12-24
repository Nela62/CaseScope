"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CaseDetails } from "./components/case-details";
import { CaseLibraryTable } from "./components/case-library-table";
import { useAppStore } from "@/providers/app-store-provider";

export const CaseLibraryComponent = () => {
  const { selectedCaseId } = useAppStore((state) => state);

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <CaseLibraryTable />
        </ResizablePanel>
        {selectedCaseId && (
          <>
            <ResizableHandle />
            <ResizablePanel>
              <CaseDetails />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
