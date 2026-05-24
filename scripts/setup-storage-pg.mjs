import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
  try {
    await pool.query(`INSERT INTO storage.buckets (id, name, public) VALUES ('sjss_media', 'sjss_media', true) ON CONFLICT DO NOTHING;`);
    console.log('Bucket created successfully in DB');
  } catch (err) {
    console.error('Error creating bucket:', err);
  } finally {
    pool.end();
  }
}
main();
