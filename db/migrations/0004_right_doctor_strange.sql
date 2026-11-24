ALTER TABLE "team_members" ADD COLUMN "access" jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "last_active" date;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "added" date;