import { Bedrock } from "@llamaindex/community";
import { promptTemplate, jsonSchema } from "./prompt";

export const runtime = "edge";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json(
      { success: false, error: "No text provided" },
      { status: 400 }
    );
  }

  try {
    const llm = new Bedrock({
      model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      region: "us-west-2",
      maxTokens: 2048,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const prompt = promptTemplate
      .replace("{{TEXT}}", text)
      .replace("{{JSON_SCHEMA}}", JSON.stringify(jsonSchema));

    const response = await llm.complete({ prompt });

    const extractedDataMatch = response.text.match(
      /<extracted_data>([\s\S]*?)<\/extracted_data>/
    );
    const extractedData = JSON.parse(extractedDataMatch?.[1] ?? "{}");

    if (!extractedData) {
      throw new Error("No extracted data found in response");
    }

    return Response.json({
      success: true,
      issues: extractedData,
    });
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
