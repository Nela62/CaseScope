import { useCallback, useEffect } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Run } from "@/types/inngest";
import { useState } from "react";
import { createRunPoller, getRuns } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

type ProcessingRun = { id: string; status: string };
type ProcessingFiles = {
  [key: string]: { name: string; runs: ProcessingRun[] };
};

const DisplayTaskStatus = ({ taskId }: { taskId: string }) => {
  return <div>TaskStatus for {taskId}</div>;
};

export const DisplayFileProcessingStatus = () => {
  const { fileProcessingEvents, removeFileProcessingEvents } = useAppStore(
    (state) => state
  );
  const [fileEvents, setFileEvents] = useState<ProcessingFiles>({});

  const updateRun = useCallback(
    (eventId: string, run: Run) => {
      let removeEvent = false;

      setFileEvents((prevEvents) => {
        const newRuns = prevEvents[eventId].runs.map((r) =>
          r.id === run.run_id ? { id: r.id, status: run.status } : r
        );

        if (newRuns.every((r) => r.status === "completed")) {
          removeEvent = true;
        }

        return {
          ...prevEvents,
          [eventId]: {
            name: prevEvents[eventId].name,
            runs: newRuns,
          },
        };
      });

      if (removeEvent) {
        removeFileProcessingEvents([eventId]);
      }
    },
    [setFileEvents, removeFileProcessingEvents]
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
    const cleanups: (() => void)[] = [];

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
    fileProcessingEvents.length > 0 && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-sm text-foreground/70">
            Files Processing
            <div className="ml-1 relative h-6 w-6">
              <div className="absolute inset-0 rounded-full border-2 border-sky-600/30 border-t-sky-600 animate-spin" />
              <span className="absolute inset-0 inline-flex items-center justify-center text-xs text-sky-600 font-semibold">
                {fileProcessingEvents.length}
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Files Processing</DialogTitle>
          </DialogHeader>
          <div>
            {Object.values(fileEvents).map((file) => (
              <div key={file.name} className="border">
                <p>{file.name}</p>
                <p>{file.runs.map((r) => r.status).join(", ")}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};
