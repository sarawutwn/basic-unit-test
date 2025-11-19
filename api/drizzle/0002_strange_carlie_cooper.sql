CREATE TABLE "Improve_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"stock_id" integer,
	"real_number" integer,
	"comment" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT '',
	"created_by_id" integer
);
--> statement-breakpoint
CREATE TABLE "bill" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_no" varchar NOT NULL,
	"member_id" integer,
	"client_type" varchar NOT NULL,
	"total" numeric,
	"sale_type" varchar NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT '',
	"created_by_id" integer
);
--> statement-breakpoint
CREATE TABLE "bill_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" varchar,
	"product_name" varchar,
	"product_id" integer,
	"price" numeric,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"shelves" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "credit" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" integer,
	"credit_code" varchar,
	"amount" numeric,
	"member_id" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "credit_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"credit_id" integer,
	"product_id" varchar,
	"quantity" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "dealer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"dealer_code" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" integer,
	"member_id" integer,
	"account_name" varchar,
	"invoice_no" varchar,
	"total" numeric,
	"bill_name" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT '',
	"created_by_id" integer
);
--> statement-breakpoint
CREATE TABLE "invoice_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer,
	"date_invoice" timestamp,
	"bill_no" varchar,
	"price" numeric,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"level" varchar,
	"address" varchar,
	"phone" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "payout_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_bill_id" varchar,
	"dealer_id" varchar,
	"total" numeric,
	"payment_method" timestamp,
	"preference_number" timestamp,
	"paying_bank" varchar DEFAULT '',
	"note" varchar,
	"created_by_id" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"short_name" varchar NOT NULL,
	"name" varchar NOT NULL,
	"model" varchar NOT NULL,
	"brand" varchar NOT NULL,
	"cost" varchar NOT NULL,
	"authentic_code" varchar,
	"category_id" integer,
	"product_type_id" integer,
	"sku" varchar,
	"secret_code" varchar,
	"special_search" jsonb DEFAULT '[]'::jsonb,
	"created_by_id" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "product_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "purchase_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_id" integer,
	"product_id" integer,
	"price" numeric,
	"quantity" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "purchase_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_no" varchar,
	"dealer_id" integer,
	"status" varchar,
	"number_items" integer,
	"total_Invoice" numeric,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "receipt_voucher" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_no" varchar,
	"delivery_number" varchar,
	"sender_name" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "selling_sku" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"sku" varchar,
	"percent" integer,
	"price_mode" varchar,
	"price_selling" numeric,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"quantity" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "total_bill" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_Included_number" varchar,
	"note" varchar,
	"dealer_id" integer,
	"total" timestamp,
	"due_date" timestamp,
	"receipt_voucher_id" varchar DEFAULT '',
	"status" varchar,
	"created_by_id" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" varchar DEFAULT ''
);
