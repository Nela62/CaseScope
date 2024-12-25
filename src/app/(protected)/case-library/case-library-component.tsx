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
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllDocuments } from "@/lib/queries";
import { type Run } from "@/types/inngest";
import { createRunPoller, getRuns } from "@/lib/utils";

type ProcessingRun = { id: string; status: string };
type ProcessingFiles = {
  [key: string]: { name: string; runs: ProcessingRun[] };
};

// TODO: Maybe use a hashmap instead of an array to speed it up
export const CaseLibraryComponent = () => {
  const supabase = createClient();
  const { data: documents, isLoading } = useQuery(fetchAllDocuments(supabase));
  const { selectedCaseId, setSelectedCaseId, fileProcessingEvents } =
    useAppStore((state) => state);
  const [fileEvents, setFileEvents] = useState<ProcessingFiles>({});

  const updateRun = useCallback(
    (eventId: string, run: Run) => {
      setFileEvents((prevEvents) => ({
        ...prevEvents,
        [eventId]: {
          name: prevEvents[eventId].name,
          runs: prevEvents[eventId].runs.map((r) =>
            r.id === run.run_id ? { id: r.id, status: run.status } : r
          ),
        },
      }));
    },
    [setFileEvents]
  );

  const addRun = useCallback(
    (eventId: string, run: Run) => {
      setFileEvents((prevEvents) => ({
        ...prevEvents,
        [eventId]: {
          name: prevEvents[eventId].name,
          runs: [
            ...prevEvents[eventId].runs,
            { id: run.run_id, status: run.status },
          ],
        },
      }));
      const cleanup = createRunPoller(
        run.run_id,
        (updatedRun: Run) => {
          updateRun(eventId, updatedRun);
        },
        (error) => {
          console.error("Error polling run:", error);
        }
      );
      return cleanup;
    },
    [setFileEvents, updateRun]
  );

  const addEvent = useCallback(
    (event: { name: string; id: string }, eventRuns: Run[]) => {
      if (!fileEvents[event.id]) {
        setFileEvents((prevEvents) => ({
          ...prevEvents,
          [event.id]: { name: event.name, runs: [] },
        }));
      }
      eventRuns.forEach((run) => {
        addRun(event.id, run);
      });
    },
    [fileEvents, setFileEvents, addRun]
  );

  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedCaseId(documents[0].id);
    }
  }, [documents, setSelectedCaseId]);

  // TODO: Once all runs are done, remove the event from the fileEvents

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    console.log(fileProcessingEvents);

    if (fileProcessingEvents.length > 0) {
      fileProcessingEvents.forEach(
        async (event: { name: string; id: string }) => {
          const eventRuns = await getRuns(event.id);

          if (!fileEvents[event.id]) {
            addEvent(event, eventRuns);
          } else {
            eventRuns.forEach((run: Run) => {
              if (!fileEvents[event.id].runs.some((r) => r.id === run.run_id)) {
                const cleanup = addRun(event.id, run);
                cleanups.push(cleanup);
              }
            });
          }
        }
      );
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [fileProcessingEvents, addEvent, addRun, updateRun, fileEvents]);

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
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <AddDocumentsButton />
              </div>
            </div>
            {Object.values(fileEvents).map((file) => (
              <div key={file.name} className="border">
                <p>{file.name}</p>
                <p>{file.runs.map((r) => r.status).join(", ")}</p>
              </div>
            ))}
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
