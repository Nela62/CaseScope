"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Run } from "@/types/inngest";
import { useState } from "react";
import { cn, createRunPoller, getEvent, getRuns } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";

type ProcessingRun = { id: string; status: string };
type ProcessingFiles = {
  [key: string]: {
    name: string;
    status: string;
    runs: ProcessingRun[];
    startedAt: Date;
  };
};
// TODO: Medium: This takes a moment to show up

const statuses = {
  Completed: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Failed: "text-red-800 bg-red-50 ring-red-600/20",
};

const DisplayTaskStatus = ({
  file,
}: {
  file: ProcessingFiles[keyof ProcessingFiles];
}) => {
  return (
    <li
      key={file.name}
      className="flex items-center justify-between gap-x-6 py-5"
    >
      <div className="min-w-0 flex justify-between w-full">
        <div className="flex flex-col gap-1 items-start">
          <p className="text-sm/6 font-semibold text-gray-900">{file.name}</p>
          <p className="whitespace-nowrap text-xs/5 text-gray-500">
            Started at{" "}
            <time dateTime={file.startedAt.toISOString()}>
              {file.startedAt.toLocaleString()}
            </time>
          </p>
        </div>
        <div className="">
          <p
            className={cn(
              statuses[file.status as keyof typeof statuses],
              "mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset"
            )}
          >
            {file.status}
          </p>
        </div>
      </div>
    </li>
  );
};

export const DisplayFileProcessingStatus = () => {
  const { fileProcessingEvents } = useAppStore((state) => state);
  const [fileEvents, setFileEvents] = useState<ProcessingFiles>({});
  const queryClient = useQueryClient();

  const updateRun = useCallback(
    (eventId: string, run: Run) => {
      let completeEvent = false;
      let failed = false;

      setFileEvents((prevEvents) => {
        const newRuns = prevEvents[eventId].runs.map((r) =>
          r.id === run.run_id ? { id: r.id, status: run.status } : r
        );

        if (newRuns.every((r) => r.status === "Completed")) {
          completeEvent = true;
        }

        if (newRuns.some((r) => r.status === "Failed")) {
          failed = true;
        }

        return {
          ...prevEvents,
          [eventId]: {
            name: prevEvents[eventId].name,
            status: failed
              ? "Failed"
              : completeEvent
              ? "Completed"
              : "In progress",
            runs: newRuns,
            startedAt: prevEvents[eventId].startedAt,
          },
        };
      });

      if (completeEvent) {
        // TODO: Medium: Ideally should invalidate the query only for this document
        queryClient.invalidateQueries({
          // queryKey: ["documents", { id: fileProcessingEvents.find(e => e.id === eventId)?.id }],
          queryKey: [
            "documents",
            { id: fileProcessingEvents.find((e) => e.id === eventId)?.id },
          ],
        });
      }
    },
    [setFileEvents, queryClient]
  );

  const addRun = useCallback(
    (eventId: string, run: Run) => {
      console.log("adding run");

      setFileEvents((prevEvents) => ({
        ...prevEvents,
        [eventId]: {
          name: prevEvents[eventId].name,
          status: prevEvents[eventId].status,
          runs: [
            ...prevEvents[eventId].runs,
            {
              id: run.run_id,
              status: run.status,
            },
          ],
          startedAt: prevEvents[eventId].startedAt,
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
    (
      event: { name: string; id: string; startedAt: Date },
      eventRuns: Run[]
    ) => {
      if (!fileEvents[event.id]) {
        setFileEvents((prevEvents) => ({
          ...prevEvents,
          [event.id]: {
            name: event.name,
            status: "In progress",
            runs: [],
            startedAt: event.startedAt,
          },
        }));
      }

      eventRuns.forEach((run) => {
        addRun(event.id, run);
      });
    },
    [fileEvents, setFileEvents, addRun]
  );

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    if (fileProcessingEvents.length > 0) {
      fileProcessingEvents.forEach(
        async (event: { name: string; id: string }) => {
          if (!fileEvents[event.id]) {
            const eventData = await getEvent(event.id);
            const eventRuns = await getRuns(event.id);
            addEvent(
              { ...event, startedAt: new Date(eventData.received_at) },
              eventRuns
            );
          } else {
            const eventRuns = await getRuns(event.id);
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

  const areFilesCompleted = useMemo(
    () =>
      Object.values(fileEvents).filter((file) => file.status === "In progress")
        .length === 0,
    [fileEvents]
  );

  return (
    fileProcessingEvents.length > 0 && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-sm text-foreground/70">
            Files Processing
            <div className="ml-1 relative h-6 w-6">
              {areFilesCompleted ? (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-600/30 border-emerald-600" />
                  <span className="absolute inset-0 inline-flex items-center justify-center text-xs text-emerald-600 font-semibold">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-sky-600/30 border-t-sky-600 animate-spin" />
                  <span className="absolute inset-0 inline-flex items-center justify-center text-xs text-sky-600 font-semibold">
                    {
                      Object.values(fileEvents).filter(
                        (file) => file.status === "In progress"
                      ).length
                    }
                  </span>
                </>
              )}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          {/* TODO: Low: Add a line for ui */}
          <DialogHeader className="=">
            <DialogTitle>Files Processing</DialogTitle>
          </DialogHeader>
          <div>
            <ul role="list" className="divide-y divide-gray-100">
              {Object.values(fileEvents).map((file) => (
                <DisplayTaskStatus key={file.name} file={file} />
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};
