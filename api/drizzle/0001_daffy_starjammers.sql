ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "rules" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "age";