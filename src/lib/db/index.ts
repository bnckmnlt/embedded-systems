import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema/index";
import env from "@/lib/env";

if (!process.env.DB_URL_EXPANDED) {
  throw new Error("Database url not found");
}

export const sql = neon(process.env.DB_URL_EXPANDED! || env.DB_URL);
export const db = drizzle(sql, { schema });

export type db = typeof db;
export default db;
