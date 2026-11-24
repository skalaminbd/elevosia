CREATE TABLE "client_notification_prefs" (
	"client_id" text NOT NULL,
	"setting_id" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "client_notification_prefs_client_id_setting_id_pk" PRIMARY KEY("client_id","setting_id")
);
--> statement-breakpoint
CREATE TABLE "health_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"tone" text DEFAULT 'success' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"hint" text DEFAULT '' NOT NULL,
	"scope" text DEFAULT 'team' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_checklist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"label" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"author" text NOT NULL,
	"body" text NOT NULL,
	"at_label" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_notification_prefs" ADD CONSTRAINT "client_notification_prefs_setting_id_notification_settings_id_fk" FOREIGN KEY ("setting_id") REFERENCES "public"."notification_settings"("id") ON DELETE cascade ON UPDATE no action;