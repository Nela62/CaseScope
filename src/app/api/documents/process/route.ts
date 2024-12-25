import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

type File = {
  id: string;
  url: string;
  name: string;
};

export async function POST(request: Request) {
  const { files, userId } = await request.json();

  if (!files) {
    return new Response("No files provided", { status: 400 });
  }

  const { ids } = await inngest.send(
    files.map((file: File) => ({
      id: `document-added-${file.id}`,
      name: "api/document.added",
      data: { fileName: file.name, fileId: file.id, userId },
    }))
  );

  return NextResponse.json({
    data: files.map((file: File, i: number) => ({
      name: file.name,
      id: ids[i],
    })),
  });
}
