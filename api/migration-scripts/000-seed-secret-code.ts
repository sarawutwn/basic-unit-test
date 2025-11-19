/* ------------------------------ Config & Const ------------------------------ */

import { readFileSync } from "fs";
import { join } from "path";
import { secret_code } from "../schema";
import { db } from "../src/db";

const CONFIG = {
  description: "Seed secret_code table from CSV file",
  CSV_PATH: join(__dirname, "data", "secret_code.csv"),
} as const;

/* --------------------------------- Logging --------------------------------- */

const ts = () => new Date().toISOString();
function log(msg: string) {
  console.log(`[${ts()}] ${msg}`);
}
function hr() {
  console.log("-".repeat(80));
}

/* -------------------------------- CSV Parse -------------------------------- */

interface SecretCodeCSV {
  secret_code: string;
  code_number: string;
  type: string;
}

function parseCSV(filePath: string): SecretCodeCSV[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map((line) => {
    // Parse CSV with quotes handling
    const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
    if (!matches || matches.length < 3) {
      throw new Error(`Invalid CSV line: ${line}`);
    }
    
    const values = matches.map((match) => {
      // Remove leading comma and quotes
      let value = match.replace(/^,?"?/, "").replace(/"$/, "");
      return value;
    });
    
    return {
      secret_code: values[0] || "",
      code_number: values[1] || "",
      type: values[2] || "",
    };
  });
}

/* ------------------------------- Transforming ------------------------------ */

function mapCSVToSecretCode(
  rows: SecretCodeCSV[]
): (typeof secret_code.$inferInsert)[] {
  return rows.map<typeof secret_code.$inferInsert>((row) => ({
    secret_code: row.secret_code,
    code_number: row.code_number,
    type: row.type,
  }));
}

/* --------------------------------- Writing --------------------------------- */

async function insertSecretCodes(
  rows: (typeof secret_code.$inferInsert)[]
): Promise<void> {
  if (!rows.length) return;
  await db.insert(secret_code).values(rows).onConflictDoNothing();
}

/* ---------------------------------- Execute ----------------------------------- */

async function execute(): Promise<void> {
  log("SEED: START");
  log(`DESC: ${CONFIG.description}`);
  hr();

  try {
    log(`READING CSV: ${CONFIG.CSV_PATH}`);
    const csvData = parseCSV(CONFIG.CSV_PATH);
    log(`PARSED: ${csvData.length} rows`);
    
    log("MAPPING DATA...");
    const secretCodes = mapCSVToSecretCode(csvData);
    
    log(`INSERTING: ${secretCodes.length} rows`);
    await insertSecretCodes(secretCodes);
    
    hr();
    log("SEED: DONE");
  } catch (err) {
    log("SEED: FAILED");
    console.error(err);
    process.exitCode = 1;
  }
}

void execute();