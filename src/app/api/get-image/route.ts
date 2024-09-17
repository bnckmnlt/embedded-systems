import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("captured_images")
      .download(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": data.type,
        "Content-Disposition": `inline; filename="${path}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
};
