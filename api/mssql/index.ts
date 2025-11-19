import sql from "mssql";

const config: sql.config = {
  user: process.env.MSSQL_USERNAME!,
  password: process.env.MSSQL_PASSWORD!,
  server: process.env.MSSQL_SERVER!,
  database: process.env.MSSQL_DATABASE!,
  port: Number(process.env.MSSQL_PORT ?? 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect();
