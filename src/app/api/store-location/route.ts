import db from "$/src/lib/db";
import { gas, gps } from "$/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import env from "@/lib/env";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const areaName = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    )
      .then((res) => res.json())
      .then((res) => res.plus_code.compound_code);

    const response = await db.insert(gps).values({
      latitude: latitude,
      longitude: longitude,
      areaName: areaName,
    });

    return NextResponse.json({
      message: "Location values stored successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 },
    );
  }
};
