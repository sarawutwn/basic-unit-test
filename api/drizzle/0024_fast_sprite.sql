CREATE TABLE "secret_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"secret_code" varchar,
	"code_number" varchar,
	"type" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" varchar DEFAULT ''
);
