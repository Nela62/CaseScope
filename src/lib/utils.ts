import { Run } from "@/types/inngest";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getRuns(eventId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INNGEST_URL}/v1/events/${eventId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  const json = await response.json();
  return json.data;
}

export async function getRun(runId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INNGEST_URL}/v1/runs/${runId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  const json = await response.json();
  return json.data;
}

// export async function getRunOutput(eventId: string) {
//   let runs = await getRuns(eventId);

//   const intervalId = setInterval(async () => {
//     runs = await getRuns(eventId);

//     if (runs[0].status === "Completed") {
//       clearInterval(intervalId);
//     }

//     if (runs[0].status === "Failed" || runs[0].status === "Cancelled") {
//       clearInterval(intervalId);
//       throw new Error(`Function run ${runs[0].status}`);
//     }
//   }, 1000);

//   return { run: runs[0], intervalId };
// }

export function createRunPoller(
  runId: string,
  onUpdate: (run: Run) => void,
  onError?: (error: Error) => void
) {
  getRun(runId).then(onUpdate);

  // Set up interval
  const intervalId = setInterval(async () => {
    try {
      const run = await getRun(runId);
      onUpdate(run);

      if (run.status === "Completed") {
        clearInterval(intervalId);
      }

      if (run.status === "Failed" || run.status === "Cancelled") {
        clearInterval(intervalId);
        if (onError) {
          onError(new Error(`Function run ${run.status}`));
        }
      }
    } catch (error) {
      clearInterval(intervalId);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
