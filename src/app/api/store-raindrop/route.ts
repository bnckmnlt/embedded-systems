import db from "$/src/lib/db";
import { raindrop } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { moisture } = body;

    if (!moisture) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const response = await db.insert(raindrop).values({
      moisture: moisture,
    });

    return NextResponse.json({
      message: "Raindrop values created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 },
    );
  }
};
