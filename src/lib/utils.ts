import { Run } from "@/types/inngest";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FIXME: High: Still returns null event without retrying
export async function getEvent(eventId: string) {
  const maxRetries = 10;
  let retryCount = 0;
  let error = null;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_INNGEST_URL}/v1/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
          },
        }
      );

      if (response.ok && response.status !== 404) {
        const json = await response.json();

        if (json.data.status === 404) {
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        return json.data;
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      error = err;
    }
  }

  throw error || new Error(`Failed to fetch event after ${maxRetries} retries`);
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
      console.log("run", run);
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

export async function logToAthina(params: {
  prompt: string | { role: string; content: string }[];
  languageModelId: string;
  response: string;
  promptSlug?: string;
  externalReferenceId?: string;
  cost?: number;
  customAttributes?: Record<string, any>;
}) {
  try {
    await fetch("https://log.athina.ai/api/v2/log/inference", {
      method: "POST",
      body: JSON.stringify({
        prompt_slug: params.promptSlug,
        prompt: params.prompt,
        language_model_id: params.languageModelId,
        response: params.response,
        external_reference_id: params.externalReferenceId,
        cost: params.cost,
        custom_attributes: params.customAttributes,
      }),

      headers: {
        "athina-api-key": process.env.ATHINA_API_KEY ?? "",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to log to Athina:", error);
  }
}
