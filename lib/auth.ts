import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) {
    return null;
  }
  return user;
}
