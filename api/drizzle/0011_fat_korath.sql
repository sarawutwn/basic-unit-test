ALTER TABLE "category" ADD COLUMN "type" varchar;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "options" jsonb DEFAULT '[]'::jsonb;