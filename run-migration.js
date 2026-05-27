import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = 'postgresql://postgres.lkksusoesadodxhgnelt:jafl8mbaZQtGHxGG@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const sqlFile = path.join(process.cwd(), 'drizzle', '0001_safe_power_pack.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  const statements = sql.split('--> statement-breakpoint');
  
  for (const stmt of statements) {
    if (stmt.trim()) {
      console.log('Executing:', stmt.trim().substring(0, 50) + '...');
      try {
        await pool.query(stmt);
      } catch (e) {
        console.error('Error executing statement:', e.message);
      }
    }
  }
  
  console.log('Migration complete');
  process.exit(0);
}

main();
