import { db } from "@/lib/db";
import { ultrasonic } from "@/lib/db/schema";
import { asc, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const distanceData = await db
      .select({
        time: sql<string>`${ultrasonic.createdAt}`,
        highIndex: sql<number>`${ultrasonic.maxDistance}`,
        lowIndex: sql<number>`${ultrasonic.minDistance}`,
      })
      .from(ultrasonic)
      .orderBy(asc(ultrasonic.createdAt));

    return NextResponse.json(distanceData);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" });
  }
};
