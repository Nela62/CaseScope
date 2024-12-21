export const runtime = "edge";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Settings.llm = new Bedrock({
//   model: BEDROCK_MODELS.ANTHROPIC_CLAUDE_3_5_SONNET_V2,
//   region: "us-east-2",
// });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return new Response("No file provided", { status: 400 });
  }

  try {
    const documents = await processPdf(file);
    // For now just return success
    return Response.json({
      success: true,
      text: documents.reduce((acc, doc) => acc + doc.text, ""),
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function processPdf(file: File) {
  const { LlamaParseReader } = await import("llamaindex");

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // set up the llamaparse reader
  const reader = new LlamaParseReader({ resultType: "markdown" });

  // parse the document
  try {
    const documents = await reader.loadDataAsContent(bytes, file.name);
    return documents;
  } catch (error) {
    console.error("Error parsing document:", error);
    throw error;
  }
}
