import { pool, poolConnect } from "../mssql";
import type { PIDET } from "../mssql/types/PIDET.type";
import type { SIDET } from "../mssql/types/SIDET.type";
import { product, dealer, stock, category } from "../schema";
import { db } from "../src/db";
import { eq } from "drizzle-orm";

/* ------------------------------ Config & Const ------------------------------ */

const CONFIG = {
  description: "Migrate PIDET + SIDET + ICMAS (on sql server) to product (on postgres)",
  BATCH_SIZE: 500,
} as const;

// รวมข้อมูลจาก PIDET, SIDET และ ICMAS เพื่อให้ได้ข้อมูลครบถ้วน
const SQL = {
  COUNT_PRODUCTS: `
    SELECT COUNT(DISTINCT BCODE) AS total 
    FROM (
      SELECT BCODE FROM [dbo].[PIDET] WHERE BCODE IS NOT NULL AND BCODE != ''
      UNION
      SELECT BCODE FROM [dbo].[SIDET] WHERE BCODE IS NOT NULL AND BCODE != ''
      UNION
      SELECT BCODE FROM [dbo].[ICMAS] WHERE BCODE IS NOT NULL AND BCODE != ''
    ) AS combined;
  `,
  
  PAGE_PRODUCTS: (skip: number, take: number) => `
    WITH LatestPurchase AS (
      SELECT 
        BCODE,
        PCODE,
        MCODE,
        DETAIL,
        LOCATION1,
        UI,
        MTP,
        PRICE as PURCHASE_PRICE,
        QTY as PURCHASE_QTY,
        DISCNT1,
        DISCNT2,
        DISCNT3,
        DISCNT4,
        ACCTNO,
        JOURDATE,
        ROW_NUMBER() OVER (PARTITION BY BCODE ORDER BY JOURDATE DESC, ID DESC) as rn
      FROM [dbo].[PIDET]
      WHERE BCODE IS NOT NULL AND BCODE != ''
    ),
    LatestSale AS (
      SELECT 
        BCODE,
        PRICE as SALE_PRICE,
        XPRICE as COST_PRICE,
        QTY as SALE_QTY,
        JOURDATE,
        ROW_NUMBER() OVER (PARTITION BY BCODE ORDER BY JOURDATE DESC, ID DESC) as rn
      FROM [dbo].[SIDET]
      WHERE BCODE IS NOT NULL AND BCODE != ''
    ),
    ProductMaster AS (
      SELECT
        BCODE,
        ACODE,          -- ← เพิ่ม ACODE (short_name)
        DESCR,
        MODEL,
        BRAND,
        PCODE,
        MCODE,
        MAIN as CATEGORY_CODE,
        UI1,
        UI2,
        MTP2,
        LOCATION1,
        PRICE1,
        PRICE2,
        PRICE3,
        PRICE4,
        PRICE5,
        QTYOH1,
        QTYOH2,
        ROW_NUMBER() OVER (PARTITION BY BCODE ORDER BY ID DESC) as rn
      FROM [dbo].[ICMAS]
      WHERE BCODE IS NOT NULL AND BCODE != ''
    ),
    CombinedProducts AS (
      SELECT DISTINCT
        COALESCE(icm.BCODE, p.BCODE, s.BCODE) as BCODE,
        -- ใช้ข้อมูลจาก ICMAS เป็นหลัก
        COALESCE(icm.ACODE, '') as ACODE,     -- ← เพิ่ม ACODE
        COALESCE(icm.PCODE, p.PCODE) as PCODE,
        COALESCE(icm.MCODE, p.MCODE) as MCODE,
        COALESCE(icm.DESCR, p.DETAIL) as DETAIL,
        COALESCE(icm.MODEL, '') as MODEL,
        COALESCE(icm.BRAND, '') as BRAND,
        COALESCE(icm.LOCATION1, p.LOCATION1) as LOCATION1,
        COALESCE(icm.UI1, p.UI) as UI_SMALL,
        COALESCE(icm.UI2, '') as UI_BIG,
        COALESCE(icm.MTP2, p.MTP, 1) as MTP,
        icm.CATEGORY_CODE,
        -- ราคาและต้นทุน
        COALESCE(p.PURCHASE_PRICE, s.COST_PRICE, icm.PRICE1, 0) as COST,
        COALESCE(s.SALE_PRICE, icm.PRICE1, p.PURCHASE_PRICE * 1.3, 0) as SALE_PRICE,
        COALESCE(icm.PRICE2, s.SALE_PRICE * 0.92, 0) as TECHNICIAN_PRICE,
        COALESCE(icm.PRICE3, s.SALE_PRICE * 0.95, 0) as PRICE2,
        COALESCE(icm.PRICE4, s.SALE_PRICE * 0.90, 0) as SPECIAL_PRICE_ONE,
        COALESCE(icm.PRICE5, s.SALE_PRICE * 0.85, 0) as SPECIAL_PRICE_TWO,
        COALESCE(s.COST_PRICE, p.PURCHASE_PRICE, 0) as LAST_PRICE,
        -- ส่วนลดจาก PIDET
        p.DISCNT1,
        p.DISCNT2,
        p.DISCNT3,
        p.DISCNT4,
        -- จำนวนสต๊อก
        COALESCE(icm.QTYOH1, p.PURCHASE_QTY, s.SALE_QTY, 0) as QTY_SMALL,
        COALESCE(icm.QTYOH2, 0) as QTY_BIG,
        p.ACCTNO
      FROM ProductMaster icm
      FULL OUTER JOIN LatestPurchase p ON icm.BCODE = p.BCODE AND p.rn = 1
      FULL OUTER JOIN LatestSale s ON icm.BCODE = s.BCODE AND s.rn = 1
      WHERE icm.rn = 1 OR p.rn = 1 OR s.rn = 1
    )
    SELECT *
    FROM CombinedProducts
    ORDER BY BCODE
    OFFSET ${skip} ROWS
    FETCH NEXT ${take} ROWS ONLY;
  `,
} as const;

/* --------------------------------- Logging --------------------------------- */

const ts = () => new Date().toISOString();
function log(msg: string) {
  console.log(`[${ts()}] ${msg}`);
}
function hr() {
  console.log("-".repeat(80));
}

/* ------------------------------ Bootstrapping ------------------------------- */

async function connectToSQLServer(): Promise<void> {
  try {
    await poolConnect;
    log("CONNECTED TO SQL SERVER");
  } catch (err) {
    log("FAILED TO CONNECT SQL SERVER");
    throw err;
  }
}

/* --------------------------------- Queries --------------------------------- */

async function getTotalProducts(): Promise<number> {
  const result = await pool.request().query(SQL.COUNT_PRODUCTS);
  return Number(result.recordset[0]?.total ?? 0);
}

interface CombinedProduct {
  BCODE: string;
  ACODE?: string | null;
  PCODE?: string | null;
  MCODE?: string | null;
  DETAIL?: string | null;
  MODEL?: string | null;
  BRAND?: string | null;
  LOCATION1?: string | null;
  UI_SMALL?: string | null;
  UI_BIG?: string | null;
  MTP?: number;
  CATEGORY_CODE?: number | null;
  COST?: number;
  SALE_PRICE?: number;
  TECHNICIAN_PRICE?: number;
  PRICE2?: number;
  SPECIAL_PRICE_ONE?: number;
  SPECIAL_PRICE_TWO?: number;
  LAST_PRICE?: number;
  DISCNT1?: number | null;
  DISCNT2?: number | null;
  DISCNT3?: number | null;
  DISCNT4?: number | null;
  QTY_SMALL?: number;
  QTY_BIG?: number;
  ACCTNO?: string | null;
}

async function getProductsPage(
  skip: number,
  take: number
): Promise<CombinedProduct[]> {
  const result = await pool.request().query(SQL.PAGE_PRODUCTS(skip, take));
  return result.recordset as CombinedProduct[];
}

// ค้นหา dealer_id จาก dealer_code (ACCTNO)
async function getDealerIdByCode(
  dealerCode: string | null
): Promise<number | null> {
  if (!dealerCode) return null;
  
  const result = await db
    .select({ id: dealer.id })
    .from(dealer)
    .where(eq(dealer.dealer_code, dealerCode))
    .limit(1);
  
  return result[0]?.id ?? null;
}

// ค้นหา category_id จาก MAIN code (ICMAIN)
// Cache เพื่อไม่ต้อง query ซ้ำ
const categoryCache = new Map<number, number | null>();

async function getCategoryIdByCode(
  categoryCode: number | null
): Promise<number | null> {
  if (!categoryCode) return null;
  
  // เช็ค cache ก่อน
  if (categoryCache.has(categoryCode)) {
    return categoryCache.get(categoryCode)!;
  }
  
  // Query จาก database (สมมติว่า ICMAIN.ID = category.id หลัง migrate)
  const result = await db
    .select({ id: category.id })
    .from(category)
    .where(eq(category.id, categoryCode))
    .limit(1);
  
  const categoryId = result[0]?.id ?? null;
  categoryCache.set(categoryCode, categoryId);
  
  return categoryId;
}

/* ------------------------------- Transforming ------------------------------ */

// แยกชื่อย่อจาก DETAIL (ใช้เป็น fallback ถ้าไม่มี ACODE)
function extractShortName(
  acode: string | null | undefined,
  detail: string | null | undefined
): string {
  // ใช้ ACODE ก่อนเสมอ
  if (acode && acode.trim()) {
    return acode.trim();
  }
  
  // ถ้าไม่มี ACODE ให้ตัดจาก DETAIL
  if (!detail) return "สินค้า";
  
  const trimmed = detail.trim();
  const firstWord = trimmed.split(/[\s,]+/)[0];
  
  return firstWord?.substring(0, 10) || "สินค้า";
}

// คำนวณราคาจากส่วนลด (ถ้ามี)
function calculatePriceWithDiscount(
  basePrice: number,
  discount1?: number | null,
  discount2?: number | null
): number {
  let price = basePrice;
  
  // ลดจาก DISCNT1
  if (discount1 && discount1 > 0) {
    price = price * (1 - discount1 / 100);
  }
  
  // ลดเพิ่มจาก DISCNT2
  if (discount2 && discount2 > 0) {
    price = price * (1 - discount2 / 100);
  }
  
  return price;
}

// คำนวณราคาต่างๆ
function calculatePrices(
  cost: number,
  salePrice: number,
  technicianPrice?: number,
  price2?: number,
  specialPrice1?: number,
  specialPrice2?: number,
  discnt1?: number | null,
  discnt2?: number | null,
  discnt3?: number | null,
  discnt4?: number | null
) {
  // ถ้ามีราคามาจาก ICMAS ให้ใช้เลย
  if (technicianPrice && technicianPrice > 0) {
    return {
      sale_price: salePrice,
      technician_price: technicianPrice,
      price2: price2 || salePrice * 0.95,
      special_price_one: specialPrice1 || salePrice * 0.90,
      special_price_two: specialPrice2 || salePrice * 0.85,
    };
  }
  
  // ถ้าไม่มี ให้คำนวณจากส่วนลด
  const basePrice = salePrice > cost ? salePrice : cost * 1.3;
  
  return {
    sale_price: basePrice,
    technician_price: calculatePriceWithDiscount(basePrice, discnt1, discnt2),
    price2: calculatePriceWithDiscount(basePrice, discnt1),
    special_price_one: calculatePriceWithDiscount(basePrice, discnt1, discnt3),
    special_price_two: calculatePriceWithDiscount(basePrice, discnt1, discnt4),
  };
}

async function mapProductsToInsert(
  rows: CombinedProduct[]
): Promise<(typeof product.$inferInsert)[]> {
  const results: (typeof product.$inferInsert)[] = [];

  for (const row of rows) {
    const cost = Number(row.COST ?? 0);
    const salePrice = Number(row.SALE_PRICE ?? cost * 1.3);
    const prices = calculatePrices(
      cost,
      salePrice,
      row.TECHNICIAN_PRICE,
      row.PRICE2,
      row.SPECIAL_PRICE_ONE,
      row.SPECIAL_PRICE_TWO,
      row.DISCNT1,
      row.DISCNT2,
      row.DISCNT3,
      row.DISCNT4
    );
    
    // ค้นหา dealer_id และ category_id
    const dealerId = await getDealerIdByCode(row.ACCTNO ?? null);
    const categoryId = await getCategoryIdByCode(row.CATEGORY_CODE ?? null);

    results.push({
      factory_number: row.BCODE ?? "",
      short_name: extractShortName(row.ACODE, row.DETAIL),  // ← ใช้ ACODE
      name: row.DETAIL ?? "ไม่ระบุชื่อสินค้า",
      model: row.MODEL ?? "",
      brand: row.BRAND ?? "",
      cost: cost.toString(),
      sale_price: prices.sale_price.toFixed(2),
      technician_price: prices.technician_price.toFixed(2),
      price2: prices.price2.toFixed(2),
      special_price_one: prices.special_price_one.toFixed(2),
      special_price_two: prices.special_price_two.toFixed(2),
      authentic_code: row.PCODE ?? null,
      category_id: categoryId,
      secret_code: null,
      special_search: [],
      created_by_id: null,
      dealer_id: dealerId,
      last_price: (row.LAST_PRICE ?? cost).toString(),
      unit_big: row.UI_BIG ?? null,
      unit_small: row.UI_SMALL ?? null,
      substitute_product_name: row.MCODE ?? "",
      storage_location: row.LOCATION1 ?? "",
    });
  }

  return results;
}

/* --------------------------------- Writing --------------------------------- */

async function insertProducts(
  rows: (typeof product.$inferInsert)[]
): Promise<{ id: number; factory_number: string }[]> {
  if (!rows.length) return [];
  
  // Insert และ return id + factory_number เพื่อใช้ insert stock
  const inserted = await db
    .insert(product)
    .values(rows)
    .onConflictDoNothing() // ถ้า BCODE ซ้ำให้ข้ามไป
    .returning({ id: product.id, factory_number: product.factory_number });
  
  return inserted;
}

async function insertStock(
  productId: number,
  quantitySmall: number,
  quantityBig: number,
  mtp: number
): Promise<void> {
  // คำนวณจำนวนรวม (หน่วยเล็ก)
  const totalQty = quantitySmall + (quantityBig * mtp);
  
  if (totalQty > 0) {
    await db.insert(stock).values({
      product_id: productId,
      quantity: Math.floor(totalQty),
      lead_time: 0,
    }).onConflictDoNothing();
  }
}

/* -------------------------------- Migration -------------------------------- */

async function runBatches(total: number): Promise<void> {
  const size = CONFIG.BATCH_SIZE;
  let totalInserted = 0;

  for (let offset = 0; offset < total; offset += size) {
    const from = offset;
    const to = Math.min(offset + size, total) - 1;

    hr();
    log(`FETCH  : ${from}..${to}`);

    const combined = await getProductsPage(offset, size);
    log(`MAP    : ${combined.length} rows`);

    const products = await mapProductsToInsert(combined);

    log(`INSERT : ${products.length} products`);
    const inserted = await insertProducts(products);
    
    // Insert stock แบบ batch (เร็วกว่า)
    log(`INSERT : stock for ${inserted.length} products`);
    const stockData = inserted.map((item, i) => {
      const qtySmall = Number(combined[i]?.QTY_SMALL ?? 0);
      const qtyBig = Number(combined[i]?.QTY_BIG ?? 0);
      const mtp = Number(combined[i]?.MTP ?? 1);
      const totalQty = qtySmall + (qtyBig * mtp);
      
      return {
        product_id: item.id,
        quantity: Math.floor(totalQty),
        lead_time: 0,
      };
    });
    
    if (stockData.length > 0) {
      await db.insert(stock)
        .values(stockData)
        .onConflictDoNothing();
    }

    totalInserted += inserted.length;
    log(`STATUS : SUCCESS (Total: ${totalInserted})`);
  }

  hr();
  log(`ALL BATCHES COMPLETED (Total Products: ${totalInserted})`);
}

/* ---------------------------------- Execute ----------------------------------- */

async function execute(): Promise<void> {
  log("MIGRATE: START");
  log(`DESC   : ${CONFIG.description}`);

  try {
    await connectToSQLServer();

    const total = await getTotalProducts();
    log(`TOTAL  : ${total} unique products (BCODE)`);

    if (total === 0) {
      log("NOTHING TO MIGRATE");
      return;
    }

    await runBatches(total);
    log("MIGRATE: DONE");
  } catch (err) {
    log("MIGRATE: FAILED");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await pool.close();
    log("SQL SERVER POOL CLOSED");
  }
}

void execute();