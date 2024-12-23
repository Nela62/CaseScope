import { inngest } from "@/inngest/client";
import { getExtractor } from "@/lib/extractors";
import { isValidExtractorType, type ExtractorType } from "@/types/extractor";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { text } = await request.json();

  if (!text) {
    return Response.json(
      { success: false, error: "No text provided" },
      { status: 400 }
    );
  }

  if (!isValidExtractorType(slug)) {
    return Response.json(
      { success: false, error: "Invalid extractor type" },
      { status: 400 }
    );
  }

  const extractor = getExtractor(slug as ExtractorType);

  const { ids } = await inngest.send({
    name: "api/document.extracted",
    data: { text, extractor },
  });

  return NextResponse.json({ success: true, id: ids[0] });
}
