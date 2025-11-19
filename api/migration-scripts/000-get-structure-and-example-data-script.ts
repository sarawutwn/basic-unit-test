import { pool, poolConnect } from "../mssql";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/* ------------------------------ Config & Const ------------------------------ */

const CONFIG = {
  description: "Export all tables from MSSQL to CSV files (100 rows each)",
  OUTPUT_DIR: join(__dirname, "data-example"),
  MAX_ROWS: 100,
  // เพิ่มตารางที่ต้องการดึงข้อมูลที่นี่
  TABLES: [
    "APMAS",
    "ARMAS",
    "ASDET",
    "BKTRNS",
    "BPDET",
    "BRDET",
    "CHMAS",
    "CONFIG",
    "FIMAS",
    "F_AREAS",
    "F_DETAIL",
    "F_TABLE",
    "F_TABLES",
    "GJMAS",
    "GLDET",
    "GROUPS",
    "ICAUDIT",
    "ICCHG",
    "ICDET",
    "ICLABEL",
    "ICLOW",
    "ICMAIN",
    "ICMAS",
    "ICMIX",
    "ICPART",
    "ICSUB",
    "ICVEND",
    "LOOKUP",
    "MLIST",
    "PHONE",
    "PIDET",
    "PIMAS",
    "PJMAS",
    "PODET",
    "POMAS",
    "PRDET",
    "PRMAS",
    "PSDET",
    "PSMAS",
    "PVMAS",
    "RIGHTS",
    "RVMAS",
    "SACAT",
    "SADET",
    "SAMAS",
    "SAPOS",
    "SIDET",
    "SIMAS",
    "SJMAS",
    "SODET",
    "SOMAS",
    "SQDET",
    "SQMAS",
    "SVDET",
    "SVMAS",
    "USERS",
    "WHDET",
    "WHMAS",
    // เพิ่มตารางอื่นๆ ตามต้องการ
  ],
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
    log("✅ CONNECTED TO SQL SERVER");
  } catch (err) {
    log("❌ FAILED TO CONNECT SQL SERVER");
    throw err;
  }
}

function ensureOutputDir(): void {
  if (!existsSync(CONFIG.OUTPUT_DIR)) {
    mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
    log(`📁 CREATED DIRECTORY: ${CONFIG.OUTPUT_DIR}`);
  }
}

/* --------------------------------- Queries --------------------------------- */

// ดึงรายชื่อตารางทั้งหมดจาก database
async function getAllTableNames(): Promise<string[]> {
  const query = `
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE' 
      AND TABLE_CATALOG = '${process.env.MSSQL_DATABASE}'
    ORDER BY TABLE_NAME;
  `;
  
  const result = await pool.request().query(query);
  return result.recordset.map((row: any) => row.TABLE_NAME);
}

// ดึงโครงสร้างคอลัมน์ของตาราง
async function getTableColumns(tableName: string): Promise<string[]> {
  const query = `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = '${tableName}'
    ORDER BY ORDINAL_POSITION;
  `;
  
  const result = await pool.request().query(query);
  return result.recordset.map((row: any) => row.COLUMN_NAME);
}

// นับจำนวนแถวในตาราง
async function getTableRowCount(tableName: string): Promise<number> {
  const query = `SELECT COUNT(*) as total FROM [dbo].[${tableName}];`;
  const result = await pool.request().query(query);
  return Number(result.recordset[0]?.total ?? 0);
}

// ดึงข้อมูลจากตาราง (จำกัด 100 แถว)
async function getTableData(
  tableName: string,
  limit: number = CONFIG.MAX_ROWS
): Promise<any[]> {
  const query = `
    SELECT TOP ${limit} * 
    FROM [dbo].[${tableName}]
    ORDER BY (SELECT NULL);
  `;
  
  const result = await pool.request().query(query);
  return result.recordset;
}

/* ------------------------------- CSV Writing ------------------------------- */

// แปลงค่าเป็น CSV format (จัดการ quotes และ special characters)
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  
  // แปลง Date เป็น ISO string
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  const str = String(value);
  
  // ถ้ามี comma, quotes, หรือ newline ต้อง wrap ด้วย quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    // Escape quotes โดยใช้ double quotes
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

// สร้างไฟล์ CSV จาก data
function writeCSV(
  tableName: string,
  columns: string[],
  data: any[]
): void {
  const filePath = join(CONFIG.OUTPUT_DIR, `${tableName}.csv`);
  
  // สร้าง header row
  const header = columns.map((col) => `"${col}"`).join(",");
  
  // สร้าง data rows
  const rows = data.map((row) => {
    return columns.map((col) => escapeCSVValue(row[col])).join(",");
  });
  
  // รวม header + data
  const csvContent = [header, ...rows].join("\n");
  
  // เขียนไฟล์
  writeFileSync(filePath, csvContent, "utf-8");
  log(`  ✅ WRITTEN: ${filePath} (${data.length} rows)`);
}

/* -------------------------------- Migration -------------------------------- */

async function exportTable(tableName: string): Promise<void> {
  try {
    log(`\n📊 PROCESSING TABLE: ${tableName}`);
    
    // นับจำนวนแถว
    const totalRows = await getTableRowCount(tableName);
    log(`  📈 TOTAL ROWS: ${totalRows.toLocaleString()}`);
    
    if (totalRows === 0) {
      log(`  ⚠️  TABLE IS EMPTY, SKIPPING...`);
      return;
    }
    
    // ดึงโครงสร้างคอลัมน์
    const columns = await getTableColumns(tableName);
    log(`  📋 COLUMNS: ${columns.length}`);
    
    // ดึงข้อมูล
    const rowsToExport = Math.min(totalRows, CONFIG.MAX_ROWS);
    log(`  📥 FETCHING: ${rowsToExport} rows...`);
    const data = await getTableData(tableName, rowsToExport);
    
    // เขียนเป็น CSV
    writeCSV(tableName, columns, data);
    
  } catch (err) {
    log(`  ❌ FAILED TO EXPORT ${tableName}`);
    console.error(err);
  }
}

async function exportAllTables(): Promise<void> {
  // ใช้รายชื่อตารางจาก config หรือดึงทั้งหมด
  let tablesToExport: string[] = CONFIG.TABLES;
  
  // ถ้าต้องการดึงทุกตาราง ให้ uncomment บรรทัดนี้
  // tablesToExport = await getAllTableNames();
  
  log(`\n🎯 TOTAL TABLES TO EXPORT: ${tablesToExport.length}`);
  hr();
  
  for (const tableName of tablesToExport) {
    await exportTable(tableName);
  }
  
  hr();
  log(`\n✅ ALL TABLES EXPORTED`);
}

/* ---------------------------------- Execute ----------------------------------- */

async function execute(): Promise<void> {
  log("🚀 EXPORT: START");
  log(`📝 DESC: ${CONFIG.description}`);
  log(`📁 OUTPUT DIR: ${CONFIG.OUTPUT_DIR}`);
  log(`📊 MAX ROWS PER TABLE: ${CONFIG.MAX_ROWS}`);
  hr();

  try {
    await connectToSQLServer();
    ensureOutputDir();
    
    await exportAllTables();
    
    log("\n🎉 EXPORT: DONE");
  } catch (err) {
    log("\n❌ EXPORT: FAILED");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await pool.close();
    log("\n🔌 SQL SERVER POOL CLOSED");
  }
}

void execute();