import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "sjss_media";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
    const filePath = `${normalizedFolder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    // The new sb_* keys from Supabase have a random string prefix followed by the actual JWT (which starts with 'eyJ').
    // We must extract only the JWT part for the Authorization header.
    let jwt = SUPABASE_SERVICE_KEY;
    const jwtStartIndex = SUPABASE_SERVICE_KEY.indexOf('eyJ');
    if (jwtStartIndex !== -1) {
      jwt = SUPABASE_SERVICE_KEY.substring(jwtStartIndex);
    }

    // ── Upload via Storage REST API ─────────────────────────────────────────
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
      {
        method: "POST",
        headers: {
          apikey: jwt,
          Authorization: `Bearer ${jwt}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "true",
        },
        body: arrayBuffer,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Storage upload error:", err);
      return NextResponse.json(
        { success: false, error: `Storage error: ${uploadRes.status} – ${err}` },
        { status: 500 }
      );
    }

    // ── Public URL ──────────────────────────────────────────────────────────
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

    return NextResponse.json({ success: true, url: publicUrl, path: filePath });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
