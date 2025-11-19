CREATE TABLE "improve_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"stock_id" integer,
	"real_number" integer,
	"comment" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" varchar DEFAULT '',
	"created_by_id" integer
);
--> statement-breakpoint
DROP TABLE "Improve_stock" CASCADE;