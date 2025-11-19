ALTER TABLE "user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "dealer" ADD COLUMN "phone" varchar;--> statement-breakpoint
ALTER TABLE "dealer" ADD COLUMN "address" varchar;