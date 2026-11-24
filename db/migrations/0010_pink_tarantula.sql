CREATE TABLE "intake_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"content_type" text DEFAULT '' NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intake_selections" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"kind" text NOT NULL,
	"module_key" text DEFAULT '' NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intake_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"service_type" text NOT NULL,
	"team_size" text DEFAULT '' NOT NULL,
	"budget" text DEFAULT '' NOT NULL,
	"description" text NOT NULL,
	"deadline" date,
	"website_needed" boolean DEFAULT false NOT NULL,
	"website_pages" text DEFAULT '' NOT NULL,
	"nda" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'Submitted' NOT NULL,
	"source" text DEFAULT 'Start a project' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "intake_files" ADD CONSTRAINT "intake_files_submission_id_intake_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."intake_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_selections" ADD CONSTRAINT "intake_selections_submission_id_intake_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."intake_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_submissions" ADD CONSTRAINT "intake_submissions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intake_files_submission_idx" ON "intake_files" USING btree ("submission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "intake_selections_key_idx" ON "intake_selections" USING btree ("submission_id","kind","key");--> statement-breakpoint
CREATE INDEX "intake_selections_submission_idx" ON "intake_selections" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "intake_submissions_client_idx" ON "intake_submissions" USING btree ("client_id");