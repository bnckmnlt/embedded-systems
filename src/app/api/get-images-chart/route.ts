import db from "@/lib/db";
import { captures } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface ImageCapture {
  datetime: string;
  captures: number;
}

export const GET = async (req: NextRequest) => {
  try {
    const _images = await db.execute(
      sql`
        SELECT
          TO_CHAR("created_at", 'YYYY-MM-DD') AS date,
          TO_CHAR("created_at", 'HH24') AS hour, -- Extract only the hour in 24-hour format
          COUNT(*) AS captures
        FROM ${captures}
        GROUP BY date, hour
        ORDER BY date ASC, hour ASC;
      `,
    );

    const formattedImages: ImageCapture[] = (
      _images.rows as Array<Record<string, unknown>>
    ).map((row) => {
      const datetime = `${row.date as string} ${row.hour as string}:00:00`;

      return {
        datetime,
        captures: row.captures as number,
      };
    });

    return NextResponse.json(formattedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
};
