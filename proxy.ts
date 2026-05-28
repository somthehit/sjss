import { createClient as createSupabaseMiddlewareResponse } from "./utils/supabase/middleware";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return createSupabaseMiddlewareResponse(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
