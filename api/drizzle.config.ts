// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './schema', // ระบุโฟลเดอร์ schema
  out: './drizzle',   // โฟลเดอร์เก็บ migration SQL
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
