import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { Bedrock } from "@llamaindex/community";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const processNewDocument = inngest.createFunction(
  { id: "process-new-document" },
  { event: "api/document.added" },
  async ({ event, step }) => {
    await step.run("parse-document", async () => {
      const { file } = event.data;
    });
    await step.run("extract-data", async () => {
      return extractData({ event, step });
    });
  }
);

export const extractData = inngest.createFunction(
  { id: "extract-data" },
  { event: "api/document.extracted" },
  async ({ event, step }) => {
    const { text, extractor } = await step.run("init", async () => {
      const { text, extractor } = event.data;

      if (!text || !extractor) {
        throw new NonRetriableError("Missing required data", {
          cause: { text, extractor },
        });
      }
      return { text, extractor };
    });

    const llm = new Bedrock({
      model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      region: "us-west-2",
      maxTokens: 2048,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const prompt = extractor.promptTemplate
      .replace("{{TEXT}}", text)
      .replace("{{JSON_SCHEMA}}", JSON.stringify(extractor.jsonSchema));

    const { text: response } = await step.run("extract-data", async () => {
      // TODO: add retry-after on rate limit error
      return llm.complete({ prompt });
    });

    const extractedData = await step.run("parse-extracted-data", async () => {
      try {
        const extractedDataMatch = response.match(
          /<extracted_data>([\s\S]*?)<\/extracted_data>/
        );
        return JSON.parse(extractedDataMatch?.[1] ?? "{}");
      } catch (err) {
        throw new NonRetriableError("Failed to parse extracted data", {
          cause: err,
        });
      }
    });

    return { data: extractedData };
  }
);
