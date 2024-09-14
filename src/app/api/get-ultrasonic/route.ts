import { db } from "@/lib/db";
import { ultrasonic } from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const distanceData = await db
      .select({
        time: ultrasonic.createdAt,
        highIndex: ultrasonic.maxDistance,
        lowIndex: ultrasonic.minDistance,
      })
      .from(ultrasonic)
      .orderBy(desc(ultrasonic.createdAt))
      .limit(10);

    return NextResponse.json(distanceData);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" });
  }
};
