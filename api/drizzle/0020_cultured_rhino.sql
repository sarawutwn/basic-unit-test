ALTER TABLE "product" ADD COLUMN "sale_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "technician_price" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "price2" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "special_price_one" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "special_price_two" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit_big" varchar;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit_small" varchar;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "substitute_product_name" varchar;