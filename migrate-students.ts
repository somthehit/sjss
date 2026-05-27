import { db } from './lib/db';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

async function main() {
  try {
    console.log("Running students migration...");

    const migrationSql = `
      -- Create students table
      CREATE TABLE IF NOT EXISTS "students" (
        "id" serial PRIMARY KEY NOT NULL,
        "reg_no" varchar(30) NOT NULL UNIQUE,
        "student_name_en" text NOT NULL,
        "student_name_np" text NOT NULL DEFAULT '',
        "dob" varchar(30),
        "gender" varchar(10) NOT NULL DEFAULT 'Male',
        "religion" varchar(50),
        "ethnicity" varchar(50),
        "guardian_name" text NOT NULL DEFAULT '',
        "guardian_relation" varchar(30),
        "contact_no" varchar(20),
        "address" text,
        "current_class" varchar(20) NOT NULL,
        "current_section" varchar(5) DEFAULT 'A',
        "roll_no" varchar(20),
        "academic_year" varchar(10) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'Active',
        "photo_url" text,
        "previous_school" text,
        "admission_date" varchar(30),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      -- Create student_promotions table
      CREATE TABLE IF NOT EXISTS "student_promotions" (
        "id" serial PRIMARY KEY NOT NULL,
        "student_id" integer NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
        "from_class" varchar(20) NOT NULL,
        "to_class" varchar(20) NOT NULL,
        "from_academic_year" varchar(10) NOT NULL,
        "to_academic_year" varchar(10) NOT NULL,
        "result_id" integer REFERENCES "results"("id"),
        "promotion_type" varchar(20) NOT NULL DEFAULT 'auto',
        "remarks" text,
        "promoted_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      -- Add student_id to results if not exists
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'results' AND column_name = 'student_id'
        ) THEN
          ALTER TABLE "results" ADD COLUMN "student_id" integer REFERENCES "students"("id");
        END IF;
      END $$;
    `;

    await db.execute(sql.raw(migrationSql));
    console.log("✅ Students migration successful!");
  } catch(e) {
    console.error("❌ Migration failed:", e);
  } finally {
    process.exit(0);
  }
}

main();
