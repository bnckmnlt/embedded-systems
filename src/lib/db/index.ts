import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema/index";
import env from "@/lib/env";

export const sql = neon(env.DB_URL);
export const db = drizzle(sql, { schema });

export type db = typeof db;
export default db;
