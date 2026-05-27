CREATE TABLE "calendar_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"month_name" varchar(30) NOT NULL,
	"month_index" integer NOT NULL,
	"days" jsonb DEFAULT '[]' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"sender_phone" varchar(30),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_replied" boolean DEFAULT false NOT NULL,
	"admin_notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"date_bs" varchar(50) NOT NULL,
	"date_en" varchar(50) NOT NULL,
	"description_en" text,
	"description_np" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
