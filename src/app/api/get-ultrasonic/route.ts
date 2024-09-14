import { db } from "@/lib/db";
import { ultrasonic } from "@/lib/db/schema";
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
      .orderBy(ultrasonic.createdAt).limit(8);

    return NextResponse.json(distanceData);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" });
  }
};
