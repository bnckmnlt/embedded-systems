import env from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech",
      {
        headers: {
          Authorization: `Bearer ${env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(message),
      },
    );

    const audioData = await response.arrayBuffer();

    if (!response.ok) {
      throw new Error("Request failed");
    }

    console.log(audioData);

    return new NextResponse(audioData, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
