ALTER TABLE "bill" ALTER COLUMN "created_by_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bill" ALTER COLUMN "created_by_id" DROP NOT NULL;