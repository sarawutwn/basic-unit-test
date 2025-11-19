ALTER TABLE "bill" ALTER COLUMN "created_by_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bill" ADD COLUMN "number_car" varchar DEFAULT '';