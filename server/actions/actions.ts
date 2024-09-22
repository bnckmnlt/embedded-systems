"use server";

import db from "$/src/lib/db";
import { captures } from "$/src/lib/db/schema";
import { sql } from "drizzle-orm";

export async function fetchImages() {
  const _data = await db
    .select({
      datetime: sql<string>`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00')`,
      captures: sql<number>`COUNT(*)`,
    })
    .from(captures)
    .groupBy(sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00')`)
    .orderBy(sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00') ASC`);

  return _data;
}

export async function fetchImagesTable() {
  const _captures = await db
    .select({
      id: captures.id,
      path: captures.filePath,
      name: captures.fileName,
      type: captures.fileType,
      date: sql<string>`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:MI:SS')`,
    })
    .from(captures)
    .orderBy(
      sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:MI:SS') DESC`,
    );

  return _captures;
}
