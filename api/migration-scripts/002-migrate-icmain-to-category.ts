/* ------------------------------ Config & Const ------------------------------ */

import { pool, poolConnect } from "../mssql";
import type { ICMAIN } from "../mssql/types/ICMAIN.type";
import { category } from "../schema";
import { db } from "../src/db";

const CONFIG = {
  description: "Migrate ICMAIN (on sql server) to category (on postgres)",
  BATCH_SIZE: 1_000,
} as const;

const SQL = {
  COUNT_ICMAIN: `SELECT COUNT(*) AS total FROM [dbo].[ICMAIN];`,
  PAGE_ICMAIN: (skip: number, take: number) => `
      SELECT *
      FROM [dbo].[ICMAIN]
      ORDER BY [id]
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

async function getTotalICMAN(): Promise<number> {
  const result = await pool.request().query(SQL.COUNT_ICMAIN);
  return Number(result.recordset[0]?.total ?? 0);
}

async function getICMAINPage(skip: number, take: number): Promise<ICMAIN[]> {
  const result = await pool.request().query(SQL.PAGE_ICMAIN(skip, take));
  return result.recordset as ICMAIN[];
}

/* ------------------------------- Transforming ------------------------------ */

function mapICMAINToCategory(rows: ICMAIN[]): (typeof category.$inferInsert)[] {
  return rows.map<typeof category.$inferInsert>((p) => ({
    name: p.NAME ?? null,
    shelves: null,
    type: p.DETAIL ? p.DETAIL : "หมวดหมู่ทั่วไป",
    options: {
      wide: false,
      inside: false,
      outer_circle: false,
    },
  }));
}

/* --------------------------------- Writing --------------------------------- */

async function insertCategories(
  rows: (typeof category.$inferInsert)[]
): Promise<void> {
  if (!rows.length) return;
  await db.insert(category).values(rows).onConflictDoNothing();
}

/* -------------------------------- Migration -------------------------------- */

async function runBatches(total: number): Promise<void> {
  const size = CONFIG.BATCH_SIZE;

  for (let offset = 0; offset < total; offset += size) {
    const from = offset;
    const to = Math.min(offset + size, total) - 1;

    hr();
    log(`FETCH  : ${from}..${to}`);

    const icmain = await getICMAINPage(offset, size);
    log(`MAP    : ${icmain.length} rows`);

    const categories = mapICMAINToCategory(icmain);

    log(`INSERT : ${categories.length} rows`);
    await insertCategories(categories);

    log(`STATUS     : SUCCESS`);
  }

  hr();
  log("ALL BATCHES COMPLETED");
}

/* ---------------------------------- Execute ----------------------------------- */

async function execute(): Promise<void> {
  log("MIGRATE: START");
  log(`DESC   : ${CONFIG.description}`);

  try {
    await connectToSQLServer();

    const total = await getTotalICMAN();
    log(`TOTAL  : ${total}`);

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
