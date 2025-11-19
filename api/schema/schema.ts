// schema/user.ts
import { pgTable, serial, integer, varchar, timestamp, jsonb, decimal, date, time } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import { relations } from "drizzle-orm";


export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  first_name: varchar().notNull(),
  last_name: varchar().notNull(),
  username: varchar().notNull(),
  rules: varchar().notNull(),
  password: varchar().notNull(),
  phone: varchar().notNull(),
  token: varchar().default(''),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
});


export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  running_number: varchar()
    .notNull()
    .default(sql`lpad(nextval('running_number_seq')::text, 6, '0')`),
  factory_number: varchar().default(""),
  short_name: varchar().notNull(),
  name: varchar().notNull(),
  model: varchar().notNull(),
  brand: varchar().notNull(),
  cost: decimal().notNull(),
  sale_price: decimal().notNull().default(sql`0`),
  technician_price: decimal().notNull().default(sql`0`),
  price2: decimal().notNull().default(sql`0`),
  special_price_one: decimal().notNull().default(sql`0`),
  special_price_two: decimal().notNull().default(sql`0`),
  authentic_code: varchar(),
  category_id: integer(),
  secret_code: varchar(),
  special_search: jsonb().default([]),
  created_by_id: integer(),
  dealer_id: integer(),
  last_price: decimal().default(sql`0`),
  unit_big: varchar(),
  unit_small: varchar(),
  substitute_product_name: varchar().default(""),
  storage_location: varchar().default(""),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
});


export const stock = pgTable('stock', {
  id: serial('id').primaryKey(),
  product_id: integer("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer(),
  lead_time: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
})


export const product_type = pgTable('product_type', {
  id: serial('id').primaryKey(),
  name: varchar().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
})


export const bill = pgTable('bill', {
  id: serial('id').primaryKey(),
  bill_no: varchar().notNull(),
  member_id: integer(),
  client_type: varchar().notNull(),
  total: decimal(),
  sale_type: varchar().notNull(),
  number_car: varchar().default(""),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
  created_by_id: integer(),
});

export const bill_detail = pgTable('bill_detail', {
  id: serial('id').primaryKey(),
  bill_id: varchar(),
  product_name: varchar(),
  product_id: integer(),
  price: decimal(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
})

export const category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar(),
  shelves: varchar(),
  type: varchar(),
  options: jsonb().default({ inside: false, outer_circle: true, wide: true }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
});

export const productRelations = relations(product, ({ one }) => ({
  category: one(category, {
    fields: [product.category_id],   // field ใน product
    references: [category.id],       // ไปอ้างอิง category.id
  }),
}));

export const productStock = relations(product, ({ one }) => ({
  stock: one(stock, {
    fields: [product.id],   // field ใน product
    references: [stock.product_id],       // ไปอ้างอิง product_id
  }),
}));

export const billRelations = relations(bill, ({ one }) => ({
  member: one(member, {
    fields: [bill.member_id],
    references: [member.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product), // category มีหลาย product
}));

export const dealer = pgTable('dealer', {
  id: serial('id').primaryKey(),
  name: varchar(),
  dealer_code: varchar(),
  phone: varchar(),
  address: varchar(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default("")
})

export const Improve_stock = pgTable('improve_stock', {
  id: serial('id').primaryKey(),
  stock_id: integer(),
  real_number: integer(),
  comment: varchar(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
  created_by_id: integer()
})

export const invoice = pgTable('invoice', {
  id: serial('id').primaryKey(),
  bill_id: integer(),
  member_id: integer(),
  account_name: varchar(),
  invoice_no: varchar(),
  total: decimal(),
  bill_name: varchar(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
  created_by_id: integer()
})

export const invoice_detail = pgTable('invoice_detail', {
  id: serial('id').primaryKey(),
  invoice_id: integer(),
  date_invoice: timestamp(),
  bill_no: varchar(),
  price: decimal(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const member = pgTable('member', {
  id: serial('id').primaryKey(),
  member_code: varchar(),
  name: varchar(),
  level: varchar(),
  address: varchar(),
  phone: varchar(),
  credit: decimal(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const purchase_detail = pgTable('purchase_detail', {
  id: serial('id').primaryKey(),
  purchase_id: integer(),
  product_id: integer(),
  price: decimal(),
  quantity: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const purchase_order = pgTable('purchase_order', {
  id: serial('id').primaryKey(),
  order_no: varchar(),
  dealer_id: integer(),
  status: varchar(),
  number_items: integer(),
  total_Invoice: decimal(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const receipt_voucher = pgTable('receipt_voucher', {
  id: serial('id').primaryKey(),
  order_no: varchar(),
  delivery_number: varchar(),
  sender_name: varchar(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const selling_sku = pgTable('selling_sku', {
  id: serial('id').primaryKey(),
  product_id: integer(),
  sku: varchar(),
  percent: integer(),
  price_mode: varchar(),
  price_selling: decimal(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const credit = pgTable('credit', {
  id: serial('id').primaryKey(),
  bill_id: integer(),
  credit_code: varchar(),
  amount: decimal(),
  member_id: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const credit_product = pgTable('credit_product', {
  id: serial('id').primaryKey(),
  credit_id: integer(),
  product_id: varchar(),
  quantity: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const total_bill = pgTable('total_bill', {
  id: serial('id').primaryKey(),
  bill_Included_number: varchar(),
  note: varchar(),
  dealer_id: integer(),
  total: timestamp(),
  due_date: timestamp(),
  receipt_voucher_id: varchar().default(""),
  status: varchar(),
  created_by_id: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const payout_record = pgTable('payout_record', {
  id: serial('id').primaryKey(),
  total_bill_id: varchar(),
  dealer_id: varchar(),
  total: decimal(),
  payment_method: timestamp(),
  preference_number: timestamp(),
  paying_bank: varchar().default(""),
  note: varchar(),
  created_by_id: integer(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})

export const secret_code = pgTable('secret_code', {
  id: serial('id').primaryKey(),
  secret_code: varchar(),
  code_number: varchar(),
  type: varchar(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: varchar().default(""),
})
