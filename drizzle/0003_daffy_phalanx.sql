CREATE TABLE "academic_programs" (
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
--> statement-breakpoint
CREATE TABLE "student_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"from_class" varchar(20) NOT NULL,
	"to_class" varchar(20) NOT NULL,
	"from_academic_year" varchar(10) NOT NULL,
	"to_academic_year" varchar(10) NOT NULL,
	"result_id" integer,
	"promotion_type" varchar(20) DEFAULT 'auto' NOT NULL,
	"remarks" text,
	"promoted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"reg_no" varchar(30) NOT NULL,
	"student_name_en" text NOT NULL,
	"student_name_np" text DEFAULT '' NOT NULL,
	"dob" varchar(30),
	"gender" varchar(10) DEFAULT 'Male' NOT NULL,
	"religion" varchar(50),
	"ethnicity" varchar(50),
	"guardian_name" text DEFAULT '' NOT NULL,
	"guardian_relation" varchar(30),
	"contact_no" varchar(20),
	"address" text,
	"current_class" varchar(20) NOT NULL,
	"current_section" varchar(5) DEFAULT 'A',
	"roll_no" varchar(20),
	"academic_year" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'Active' NOT NULL,
	"photo_url" text,
	"previous_school" text,
	"admission_date" varchar(30),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_reg_no_unique" UNIQUE("reg_no")
);
--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "caption" text;--> statement-breakpoint
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE no action ON UPDATE no action;