ALTER TABLE "product" ALTER COLUMN "cost" SET DATA TYPE integer USING cost::integer;
ALTER TABLE "product" ALTER COLUMN "last_price" SET DATA TYPE integer USING last_price::integer;