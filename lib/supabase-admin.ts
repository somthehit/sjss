import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_SERVICE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY
)?.trim();

let cachedClient: SupabaseClient<any, "public", any> | null = null;
export function supabaseAdmin() {
  if (!cachedClient) {
    if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    if (!SUPABASE_SERVICE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    cachedClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
      db: { schema: "public" },
    });
  }
  return cachedClient;
}
