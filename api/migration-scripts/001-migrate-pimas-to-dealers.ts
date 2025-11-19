import { pool, poolConnect } from "../mssql";
import type { PIMAS } from "../mssql/types/PIMAS.type";
import { dealer } from "../schema";
import { db } from "../src/db";

/* ------------------------------ Config & Const ------------------------------ */

const CONFIG = {
  description: "Migrate PIMAS (on sql server) to dealers (on postgres)",
  BATCH_SIZE: 1_000,
} as const;

const SQL = {
  COUNT_PIMAS: `SELECT COUNT(DISTINCT [ACCTNO]) AS total FROM [dbo].[PIMAS] WHERE [ACCTNAME] IS NOT NULL AND [ACCTNAME] != '' AND [ACCTNAME] != 'เงินสด' AND [ACCTNO] IS NOT NULL AND [ACCTNO] != '' AND [ADDR1] IS NOT NULL AND [ADDR1] != '' AND [ADDR2] IS NOT NULL AND [ADDR2] != '';`,
  PAGE_PIMAS: (skip: number, take: number) => `
    SELECT [ACCTNAME], [ACCTNO], [ADDR1], [ADDR2]
    FROM (
      SELECT [ACCTNAME], [ACCTNO], [ADDR1], [ADDR2],
             ROW_NUMBER() OVER (PARTITION BY [ACCTNO] ORDER BY [ID]) as rn
      FROM [dbo].[PIMAS]
      WHERE [ACCTNAME] IS NOT NULL AND [ACCTNAME] != '' AND [ACCTNAME] != 'เงินสด' 
        AND [ACCTNO] IS NOT NULL AND [ACCTNO] != '' 
        AND [ADDR1] IS NOT NULL AND [ADDR1] != '' 
        AND [ADDR2] IS NOT NULL AND [ADDR2] != ''
    ) ranked
    WHERE rn = 1
    ORDER BY [ACCTNO]
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

async function getTotalPIMAS(): Promise<number> {
  const result = await pool.request().query(SQL.COUNT_PIMAS);
  return Number(result.recordset[0]?.total ?? 0);
}

async function getPIMASPage(skip: number, take: number): Promise<PIMAS[]> {
  const result = await pool.request().query(SQL.PAGE_PIMAS(skip, take));
  return result.recordset as PIMAS[];
}

/* ------------------------------- Transforming ------------------------------ */

function mapPIMASToDealers(rows: PIMAS[]): (typeof dealer.$inferInsert)[] {
  return rows.map<typeof dealer.$inferInsert>((p) => ({
    name: p.ACCTNAME ?? null,
    dealer_code: p.ACCTNO?.toString() ?? null,
    phone: null,
    address: p.ADDR1 + ' ' + p.ADDR2,
  }));
}

/* --------------------------------- Writing --------------------------------- */

async function insertDealers(
  rows: (typeof dealer.$inferInsert)[]
): Promise<void> {
  if (!rows.length) return;
  await db.insert(dealer).values(rows).onConflictDoNothing();
}

/* -------------------------------- Migration -------------------------------- */

async function runBatches(total: number): Promise<void> {
  const size = CONFIG.BATCH_SIZE;

  for (let offset = 0; offset < total; offset += size) {
    const from = offset;
    const to = Math.min(offset + size, total) - 1;

    hr();
    log(`FETCH  : ${from}..${to}`);

    const pimas = await getPIMASPage(offset, size);
    log(`MAP    : ${pimas.length} rows`);

    const dealers = mapPIMASToDealers(pimas);

    log(`INSERT : ${dealers.length} rows`);
    await insertDealers(dealers);

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

    const total = await getTotalPIMAS();
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
