import db from "@/lib/db";
import { captures } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const _captures = await db
    .select({
      id: captures.id,
      path: captures.filePath,
      name: captures.fileName,
      type: captures.fileType,
      date: captures.createdAt,
    })
    .from(captures)
    .orderBy(desc(captures.createdAt))
    .limit(34);

  return NextResponse.json(_captures);
};
