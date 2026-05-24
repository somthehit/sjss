import { NextRequest, NextResponse } from "next/server";
import { uploadFileToMediaBucket } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const { url, path } = await uploadFileToMediaBucket(file, folder);
    return NextResponse.json({ success: true, url, path });
  } catch (error: unknown) {
    console.error("Upload handler error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
