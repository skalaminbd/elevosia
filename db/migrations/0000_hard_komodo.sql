CREATE TABLE "blueprint_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"blueprint_id" text NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blueprint_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"milestone_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"hours" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blueprints" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"requirement_id" text,
	"title" text NOT NULL,
	"status" text DEFAULT 'Draft' NOT NULL,
	"version" text DEFAULT 'v1' NOT NULL,
	"valid_until" date,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"milestone_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"industry" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"pm" text DEFAULT '' NOT NULL,
	"timezone" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"updated_on" date
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"project_id" text,
	"type" text NOT NULL,
	"status" text DEFAULT 'Draft' NOT NULL,
	"signed_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"project_id" text,
	"kind" text DEFAULT 'Custom' NOT NULL,
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"due_on" date,
	"due_label" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Due' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_scope_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"text" text NOT NULL,
	"must_have" boolean DEFAULT false NOT NULL,
	"milestone_id" text NOT NULL,
	"milestone_title" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_scopes" (
	"project_id" text PRIMARY KEY NOT NULL,
	"requirement_id" text NOT NULL,
	"requirement_title" text DEFAULT '' NOT NULL,
	"blueprint_id" text NOT NULL,
	"approved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"invoice_id" text
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	"blueprint_id" text,
	"pm" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Planning' NOT NULL,
	"start_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requirement_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"text" text NOT NULL,
	"must_have" boolean DEFAULT false NOT NULL,
	"comment" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requirement_reviews" (
	"requirement_id" text NOT NULL,
	"section_key" text NOT NULL,
	"point_index" integer NOT NULL,
	"blueprint_id" text NOT NULL,
	"milestone_id" text,
	"state" text DEFAULT 'skipped' NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "requirement_reviews_requirement_id_section_key_point_index_pk" PRIMARY KEY("requirement_id","section_key","point_index")
);
--> statement-breakpoint
CREATE TABLE "requirement_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"requirement_id" text NOT NULL,
	"section_key" text NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requirements" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"title" text NOT NULL,
	"submitted_on" date,
	"due_on" date,
	"overdue" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'Submitted' NOT NULL,
	"budget" text DEFAULT '' NOT NULL,
	"points_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blueprint_milestones" ADD CONSTRAINT "blueprint_milestones_blueprint_id_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."blueprints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blueprint_tasks" ADD CONSTRAINT "blueprint_tasks_milestone_id_blueprint_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."blueprint_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_scope_points" ADD CONSTRAINT "project_scope_points_project_id_project_scopes_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project_scopes"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_scopes" ADD CONSTRAINT "project_scopes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_points" ADD CONSTRAINT "requirement_points_section_id_requirement_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."requirement_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_reviews" ADD CONSTRAINT "requirement_reviews_requirement_id_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_sections" ADD CONSTRAINT "requirement_sections_requirement_id_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blueprint_milestones_position_idx" ON "blueprint_milestones" USING btree ("blueprint_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "blueprint_tasks_position_idx" ON "blueprint_tasks" USING btree ("milestone_id","position");--> statement-breakpoint
CREATE INDEX "blueprints_client_idx" ON "blueprints" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "contracts_client_idx" ON "contracts" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "invoices_client_idx" ON "invoices" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "invoices_project_idx" ON "invoices" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_scope_points_position_idx" ON "project_scope_points" USING btree ("project_id","position");--> statement-breakpoint
CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "requirement_points_position_idx" ON "requirement_points" USING btree ("section_id","position");--> statement-breakpoint
CREATE INDEX "requirement_reviews_blueprint_idx" ON "requirement_reviews" USING btree ("blueprint_id");--> statement-breakpoint
CREATE UNIQUE INDEX "requirement_sections_key_idx" ON "requirement_sections" USING btree ("requirement_id","section_key");--> statement-breakpoint
CREATE INDEX "requirements_client_idx" ON "requirements" USING btree ("client_id");