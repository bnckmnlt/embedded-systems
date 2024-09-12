import { db } from "@/lib/db";
import { ultrasonic } from "@/lib/db/schema";
import dayjs from "dayjs";
import { desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { distance } = body;

    if (!distance) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const fiveMinutesAgo = dayjs().subtract(5, "minute").toDate();

    const recentRecord = await db
      .select()
      .from(ultrasonic)
      .where(gte(ultrasonic.createdAt, fiveMinutesAgo))
      .orderBy(desc(ultrasonic.createdAt))
      .limit(1);

    if (recentRecord.length === 0) {
      await db.insert(ultrasonic).values({
        maxDistance: distance,
        minDistance: distance,
      });

      return NextResponse.json({
        message: "Ultrasonic reading values were inserted successfully",
      });
    } else {
      const record = recentRecord[0];
      const maxDistance = Math.max(record.maxDistance, distance);
      const minDistance = Math.min(record.minDistance, distance);

      await db
        .update(ultrasonic)
        .set({
          maxDistance,
          minDistance,
        })
        .where(eq(ultrasonic.id, record.id));

      return NextResponse.json({ message: "Ultrasonic record updated" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" });
  }
};
