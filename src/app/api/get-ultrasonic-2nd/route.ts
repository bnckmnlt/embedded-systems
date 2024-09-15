import { db } from "@/lib/db";
import { ultrasonic2nd } from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const distanceData = await db
      .select({
        time: ultrasonic2nd.createdAt,
        highIndex: ultrasonic2nd.maxDistance,
        lowIndex: ultrasonic2nd.minDistance,
      })
      .from(ultrasonic2nd)
      .orderBy(desc(ultrasonic2nd.createdAt))
      .limit(10);

    return NextResponse.json(distanceData);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" });
  }
};
