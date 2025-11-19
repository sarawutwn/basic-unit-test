/* ------------------------------ Config & Const ------------------------------ */

import { pool, poolConnect } from "../mssql";
import type { SIMAS } from "../mssql/types/SIMAS.type";
import { member } from "../schema";
import { db } from "../src/db";

const CONFIG = {
  description: "Migrate SIMAS (on sql server) to member (on postgres)",
  BATCH_SIZE: 1_000,
} as const;

const SQL = {
  COUNT_SIMAS: `SELECT COUNT(DISTINCT [ACCTNAME]) AS total FROM [dbo].[SIMAS] WHERE [ACCTNAME] IS NOT NULL AND [ACCTNAME] != '' AND [ACCTNAME] != 'เงินสด' AND [ACCTNO] IS NOT NULL AND [ACCTNO] != '' AND [ADDR1] IS NOT NULL AND [ADDR1] != '' AND [ADDR2] IS NOT NULL AND [ADDR2] != '';`,
  PAGE_SIMAS: (skip: number, take: number) => `
      SELECT MAX([ACCTNO]) AS [ACCTNO], [ACCTNAME], MAX([RE]) AS [RE], MAX([ADDR1]) AS [ADDR1], MAX([ADDR2]) AS [ADDR2], SUM([DUEAMT]) AS [DUEAMT]
      FROM [dbo].[SIMAS]
      WHERE [ACCTNAME] IS NOT NULL AND [ACCTNAME] != '' AND [ACCTNAME] != 'เงินสด' AND [ACCTNO] IS NOT NULL AND [ACCTNO] != '' AND [ADDR1] IS NOT NULL AND [ADDR1] != '' AND [ADDR2] IS NOT NULL AND [ADDR2] != ''
      GROUP BY [ACCTNAME]
      ORDER BY [ACCTNAME]
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

async function getTotalSIMAS(): Promise<number> {
  const result = await pool.request().query(SQL.COUNT_SIMAS);
  return Number(result.recordset[0]?.total ?? 0);
}

async function getSIMASPage(skip: number, take: number): Promise<SIMAS[]> {
  const result = await pool.request().query(SQL.PAGE_SIMAS(skip, take));
  console.log(result.recordset[0]);
  return result.recordset as SIMAS[];
}

/* ------------------------------- Transforming ------------------------------ */

function mapSIMASToMEMBER(rows: SIMAS[]): (typeof member.$inferInsert)[] {
  return rows.map<typeof member.$inferInsert>((p) => ({
    member_code: p.ACCTNO?.toString() ?? null,
    name: p.ACCTNAME ?? null,
    level: null,
    address: p.ADDR1 ?? null,
    phone:  p.ADDR2 ?? null,
    credit: '0',
  }));
}

/* --------------------------------- Writing --------------------------------- */

async function insertMembers(
  rows: (typeof member.$inferInsert)[]
): Promise<void> {
  if (!rows.length) return;
  await db.insert(member).values(rows).onConflictDoNothing();
}

/* -------------------------------- Migration -------------------------------- */

async function runBatches(total: number): Promise<void> {
  const size = CONFIG.BATCH_SIZE;

  for (let offset = 0; offset < total; offset += size) {
    const from = offset;
    const to = Math.min(offset + size, total) - 1;

    hr();
    log(`FETCH  : ${from}..${to}`);

    const simas = await getSIMASPage(offset, size);
    log(`MAP    : ${simas.length} rows`);

    const members = mapSIMASToMEMBER(simas);

    log(`INSERT : ${members.length} rows`);
    await insertMembers(members);

    log(`STATUS     : SUCCESS`);
  }

  // hr();
  // log("ALL BATCHES COMPLETED");
}

/* ---------------------------------- Execute ----------------------------------- */

async function execute(): Promise<void> {
  log("MIGRATE: START");
  log(`DESC   : ${CONFIG.description}`);

  try {
    await connectToSQLServer();

    const total = await getTotalSIMAS();
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
