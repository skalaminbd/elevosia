CREATE TABLE "blueprint_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"blueprint_id" text NOT NULL,
	"milestone_id" text NOT NULL,
	"task_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"hours" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"note" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"by" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"final_name" text,
	"final_description" text,
	"final_hours" integer,
	"final_visible" boolean
);
--> statement-breakpoint
ALTER TABLE "blueprint_suggestions" ADD CONSTRAINT "blueprint_suggestions_blueprint_id_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."blueprints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blueprint_suggestions_blueprint_idx" ON "blueprint_suggestions" USING btree ("blueprint_id");