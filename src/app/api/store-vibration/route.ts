import db from "$/src/lib/db";
import { vibration } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { duration } = body;

    if (!duration) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const response = await db.insert(vibration).values({
      duration: duration,
    });

    return NextResponse.json({
      message: "Vibration values created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 },
    );
  }
};
