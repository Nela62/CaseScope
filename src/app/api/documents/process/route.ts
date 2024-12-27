import { inngest } from "@/inngest/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  console.log("request", request);
  // const { files, userId } = await request.json();
  const form = await request.formData();
  const files = form.getAll("files[]") as File[];
  const userId = form.get("userId");

  if (!files) {
    return new Response("No files provided", { status: 400 });
  }

  if (!userId) {
    return new Response("No user ID provided", { status: 400 });
  }

  // Filter out duplicate file names, keeping only the first occurrence
  const uniqueFiles: File[] = files.reduce((acc: File[], file: File) => {
    const isDuplicate = acc.some(
      (existingFile) => existingFile.name === file.name
    );
    if (!isDuplicate) {
      acc.push(file);
    }
    return acc;
  }, []);

  const supabase = await createClient();

  const filePaths = await Promise.all(
    uniqueFiles.map((file) =>
      supabase.storage.from("documents").upload(file.name, file)
    )
  );

  // TODO: Low: add logging for the upload errors

  if (filePaths.some((filePath) => filePath.error)) {
    return new Response("Failed to upload files", { status: 500 });
  }

  const { ids } = await inngest.send(
    filePaths.map((filePath) => ({
      id: `document-added-${filePath.data?.id}`,
      name: "api/document.added",
      data: {
        fileName: filePath.data?.path.split("/").pop(),
        fileId: filePath.data?.id,
        userId,
      },
    }))
  );

  return NextResponse.json({
    data: uniqueFiles.map((file: File, i: number) => ({
      name: file.name,
      id: ids[i],
    })),
  });
}
