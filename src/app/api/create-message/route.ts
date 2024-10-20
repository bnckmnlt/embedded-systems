import db from "$/src/lib/db";
import { chats, messages } from "$/src/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { requestCommand, responseCommand } = await req.json();

    if (!requestCommand || !responseCommand) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    await db.insert(messages).values({
      chatId: 1,
      content: requestCommand,
      userRole: "user",
    });

    await db.insert(messages).values({
      chatId: 1,
      content: responseCommand,
      userRole: "system",
    });

    return NextResponse.json(
      {
        message: "Messages values stored successfully",
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
}
