CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"time_label" text DEFAULT '' NOT NULL,
	"kind" text DEFAULT 'client' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_history" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"title" text NOT NULL,
	"action" text DEFAULT 'Approved' NOT NULL,
	"who" text DEFAULT '' NOT NULL,
	"date_label" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"day_label" text DEFAULT '' NOT NULL,
	"time_label" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"kind" text DEFAULT 'Weekly' NOT NULL,
	"owner" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"channel" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Planned' NOT NULL,
	"due_label" text DEFAULT '' NOT NULL,
	"owner" text DEFAULT '' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canned_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"zip" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"project_id" text,
	"project_label" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"folder" text DEFAULT '' NOT NULL,
	"size_label" text DEFAULT '' NOT NULL,
	"updated_label" text DEFAULT '' NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"version" text DEFAULT 'v1' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installments" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"paid_cents" integer DEFAULT 0 NOT NULL,
	"next_label" text DEFAULT '' NOT NULL,
	"months" integer DEFAULT 1 NOT NULL,
	"missed" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"stage" text NOT NULL,
	"client_id" text,
	"client" text NOT NULL,
	"missing" text DEFAULT '' NOT NULL,
	"days_label" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"type" text DEFAULT 'Milestone' NOT NULL,
	"title" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"due_label" text DEFAULT '' NOT NULL,
	"amount_cents" integer,
	"status" text DEFAULT 'Pending' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_calls" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"kind" text DEFAULT 'past' NOT NULL,
	"title" text NOT NULL,
	"when_label" text DEFAULT '' NOT NULL,
	"with_label" text DEFAULT '' NOT NULL,
	"join_label" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"actions" jsonb,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"title" text NOT NULL,
	"period_label" text DEFAULT '' NOT NULL,
	"published_label" text DEFAULT '' NOT NULL,
	"highlights" jsonb,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_users" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'Member' NOT NULL,
	"initials" text DEFAULT '' NOT NULL,
	"project_scope" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"owner" text DEFAULT '' NOT NULL,
	"status" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_changes" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"scope" text DEFAULT '' NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"days" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Waiting for client' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retainer_work" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"title" text NOT NULL,
	"hours" real DEFAULT 0 NOT NULL,
	"date_label" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retainers" (
	"client_id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"hours" real DEFAULT 0 NOT NULL,
	"used" real DEFAULT 0 NOT NULL,
	"next_label" text DEFAULT '' NOT NULL,
	"sla" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"client_id" text,
	"title" text NOT NULL,
	"assignee" text DEFAULT '' NOT NULL,
	"reviewer" text,
	"milestone" text,
	"linked_type" text,
	"linked_id" text,
	"linked_title" text,
	"week" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"due_label" text DEFAULT '' NOT NULL,
	"priority" text DEFAULT 'Normal' NOT NULL,
	"estimate" real DEFAULT 0 NOT NULL,
	"logged" real DEFAULT 0 NOT NULL,
	"client_visible" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"initials" text DEFAULT '' NOT NULL,
	"email" text,
	"planned" real DEFAULT 0 NOT NULL,
	"capacity" real DEFAULT 40 NOT NULL,
	"project_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"author" text NOT NULL,
	"self" boolean DEFAULT false NOT NULL,
	"body" text NOT NULL,
	"time_label" text DEFAULT '' NOT NULL,
	"at" timestamp with time zone,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"project_id" text,
	"title" text DEFAULT '' NOT NULL,
	"with_label" text DEFAULT '' NOT NULL,
	"preview" text DEFAULT '' NOT NULL,
	"time_label" text DEFAULT '' NOT NULL,
	"unread" integer DEFAULT 0 NOT NULL,
	"scope" text DEFAULT 'admin' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_events" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"kind" text DEFAULT 'created' NOT NULL,
	"text" text NOT NULL,
	"actor" text DEFAULT '' NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"author" text NOT NULL,
	"sender" text DEFAULT 'Staff' NOT NULL,
	"channel" text DEFAULT 'Portal' NOT NULL,
	"body" text NOT NULL,
	"unread" boolean DEFAULT false NOT NULL,
	"internal" boolean DEFAULT false NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"project_id" text,
	"project_label" text,
	"subject" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"priority" text DEFAULT 'P3' NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"assignee" text,
	"care_plan" text DEFAULT '' NOT NULL,
	"warranty" boolean DEFAULT false NOT NULL,
	"billable_hours" real DEFAULT 0 NOT NULL,
	"channel" text DEFAULT 'Portal' NOT NULL,
	"sla" jsonb,
	"requester" jsonb,
	"cc" jsonb,
	"followers" jsonb,
	"tags" jsonb,
	"linked" jsonb,
	"rating" jsonb,
	"unread" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timesheets" (
	"id" text PRIMARY KEY NOT NULL,
	"member" text NOT NULL,
	"project_label" text DEFAULT '' NOT NULL,
	"task" text DEFAULT '' NOT NULL,
	"hours" real DEFAULT 0 NOT NULL,
	"week_label" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text,
	"title" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"hours" real DEFAULT 0 NOT NULL,
	"submitted_label" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Submitted' NOT NULL,
	"pm" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "initials" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "plan" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "balance_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "source" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "client_since" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "since_label" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD COLUMN "approval" text;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "week" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "state" text DEFAULT 'next' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "assignee" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "priority" text DEFAULT 'Normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "due_label" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "estimate" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "logged" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "health" text DEFAULT 'On track' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "progress" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "phase" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "next_milestone" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "modules" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "price_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "used_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "due_label" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_companies" ADD CONSTRAINT "client_companies_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_messages" ADD CONSTRAINT "thread_messages_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_events" ADD CONSTRAINT "ticket_events_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "client_companies_position_idx" ON "client_companies" USING btree ("client_id","position");--> statement-breakpoint
CREATE INDEX "files_client_idx" ON "files" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_access_position_idx" ON "project_access" USING btree ("project_id","position");--> statement-breakpoint
CREATE INDEX "project_changes_project_idx" ON "project_changes" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "tasks_project_idx" ON "tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "thread_messages_thread_idx" ON "thread_messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "threads_client_idx" ON "threads" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "ticket_events_ticket_idx" ON "ticket_events" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "ticket_messages_ticket_idx" ON "ticket_messages" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "tickets_client_idx" ON "tickets" USING btree ("client_id");