import db from "$/src/lib/db";
import { chats, messages } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const chat_id = await db
      .insert(chats)
      .values({
        createdAt: new Date().toISOString(),
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: error.message,
      },
      { status: 500 },
    );
  }
};
