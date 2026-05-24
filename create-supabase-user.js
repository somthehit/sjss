const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkksusoesadodxhgnelt.supabase.co';
const supabaseServiceKey = 'sb_service_role_POOatmA81HoEhgtVacpVjA_fJugp67OeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxra3N1c29lc2Fkb2R4aGduZWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ5NzcxMiwiZXhwIjoyMDk1MDczNzEyfQ.yJxas8C3Bm7xubCLsuUIvOfO0Ak_txyMqLX4AuaDHxc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@sjsss.edu.np',
      password: 'Admin@4sjss',
      email_confirm: true,
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created successfully:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

createAdminUser();
