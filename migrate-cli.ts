import { db } from './lib/db';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

async function main() {
  try {
    const createTableSql = `
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendar_data' AND column_name = 'academic_year') THEN 
          ALTER TABLE "calendar_data" ADD COLUMN "academic_year" varchar(10) NOT NULL DEFAULT '२०८३';
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS "academic_programs" (
        "id" serial PRIMARY KEY NOT NULL,
        "level_en" varchar(50) NOT NULL,
        "level_np" varchar(50) NOT NULL,
        "description_en" text NOT NULL,
        "description_np" text NOT NULL,
        "subjects" jsonb DEFAULT '[]' NOT NULL,
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    await db.execute(sql.raw(createTableSql));
    console.log("Migration successful!");
  } catch(e) {
    console.error("Migration failed:", e);
  } finally {
    process.exit(0);
  }
}

main();
