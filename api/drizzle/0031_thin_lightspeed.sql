ALTER TABLE "bill" ALTER COLUMN "created_by_id" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "bill" ALTER COLUMN "created_by_id" DROP NOT NULL;