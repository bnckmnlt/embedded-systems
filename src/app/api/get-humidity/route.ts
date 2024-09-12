import { db } from "@/lib/db";
import { humidity } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const humidityData = await db
      .select({
        time: sql<string>`TO_CHAR(${humidity.createdAt}, 'HH12:MI')`,
        highIndex: sql<number>`${humidity.maxHumidity}`,
        lowIndex: sql<number>`${humidity.minHumidity}`,
      })
      .from(humidity)
      .orderBy(desc(humidity.createdAt));

    return NextResponse.json(humidityData);
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
