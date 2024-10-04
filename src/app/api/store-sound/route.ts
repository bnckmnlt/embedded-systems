import db from "$/src/lib/db";
import { sound } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { duration } = body;

    if (!duration) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const response = await db.insert(sound).values({
      duration: duration,
    });

    return NextResponse.json({
      message: "Sound values created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 },
    );
  }
};
