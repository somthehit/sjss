import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_SERVICE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY
)?.trim();
const BUCKET = "sjss_media";

const validateStorageConfig = () => {
  if (!SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)");
  }

  if (SUPABASE_SERVICE_KEY.startsWith("sb_publishable_")) {
    throw new Error("Invalid service key: received publishable key, expected service role/secret key");
  }
};

export async function uploadFileToMediaBucket(file: File, folder = "general") {
  validateStorageConfig();

  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const filePath = `${normalizedFolder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, path: filePath };
}
