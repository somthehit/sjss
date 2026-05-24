import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function main() {
  console.log('Creating bucket sjss_media...');
  const { data, error } = await supabase.storage.createBucket('sjss_media', { public: true });
  if (error) {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created successfully:', data);
  }
}
main();
