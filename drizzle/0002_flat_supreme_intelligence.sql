CREATE TABLE "milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"date_label" varchar(50) NOT NULL,
	"year_ad" varchar(20),
	"description_en" text NOT NULL,
	"description_np" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_data" ADD COLUMN "academic_year" varchar(10) DEFAULT '२०८३' NOT NULL;