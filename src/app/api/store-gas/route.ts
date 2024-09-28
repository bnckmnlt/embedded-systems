import db from "$/src/lib/db";
import { gas } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { intensity } = body;

    if (!intensity) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const response = await db.insert(gas).values({
      intensity: intensity,
    });

    return NextResponse.json({
      message: "Gas values created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 },
    );
  }
};
