import db from "@/lib/db";
import { captures } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { extname } from "path";

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9_\u0600-\u06FF.]/g, "_");
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const file = formData.get("media") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 411 },
      );
    }

    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileExtension = extname(file["name"]);
    const originalFilename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const sanitizedFilename = sanitizeFilename(originalFilename);
    const filename = `${sanitizedFilename}_${uniqueSuffix}${fileExtension}`;

    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("captured_images")
      .upload(`public/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await db.insert(captures).values({
      filePath: data.path,
      fileName: `${sanitizedFilename}_${uniqueSuffix}`,
      fileType: fileExtension,
    });

    return NextResponse.json({
      message: "Record inserted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
};
