CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" varchar(20) DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" text NOT NULL,
	"guardian_name" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" text,
	"grade_applying" varchar(10) NOT NULL,
	"dob" text NOT NULL,
	"address" text NOT NULL,
	"previous_school" text,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"description_en" text,
	"description_np" text,
	"cover_url" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"url" text NOT NULL,
	"caption_en" text,
	"caption_np" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"content_en" text NOT NULL,
	"content_np" text NOT NULL,
	"category" varchar(50) DEFAULT 'general' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"pdf_url" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_no" varchar(30) NOT NULL,
	"student_name" text NOT NULL,
	"grade" varchar(10) NOT NULL,
	"academic_year" varchar(20) NOT NULL,
	"exam_type" varchar(30) DEFAULT 'terminal' NOT NULL,
	"subjects" jsonb DEFAULT '{}' NOT NULL,
	"total_marks" integer,
	"obtained_marks" integer,
	"percentage" text,
	"division" varchar(30),
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_np" text NOT NULL,
	"role_en" text NOT NULL,
	"role_np" text NOT NULL,
	"department" varchar(80) DEFAULT 'general' NOT NULL,
	"qualification" text,
	"photo_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;