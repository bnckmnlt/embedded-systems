import { db } from "@/lib/db";
import { temperature } from "@/lib/db/schema";
import { asc, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const temperatureData = await db
    .select({
      time: sql<string>`TO_CHAR(${temperature.createdAt}, 'HH12:MI AM')`,
      highIndex: sql<number>`${temperature.maxTemp}`,
      lowIndex: sql<number>`${temperature.minTemp}`,
    })
    .from(temperature)
    .orderBy(desc(temperature.createdAt));

    return NextResponse.json(temperatureData);
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
