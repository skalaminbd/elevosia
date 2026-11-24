CREATE TABLE "call_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"call_title" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"actions" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deletion_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"client" text DEFAULT '' NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"request_label" text DEFAULT '' NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handover_items" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "help_articles" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text DEFAULT 'Article' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"change" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "retainers" ADD COLUMN "status" text DEFAULT 'Active' NOT NULL;