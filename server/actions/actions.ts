"use server";

import { Vibration } from "$/src/components/vibration-sensor/VibrationSensorChart";
import db from "$/src/lib/db";
import { captures, gas, vibration } from "$/src/lib/db/schema";
import { desc, sql } from "drizzle-orm";

export interface Gas {
  id: number;
  intensity: number;
  createdAt: string;
}

export async function fetchImages() {
  const _data = await db
    .select({
      datetime: sql<string>`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00')`,
      captures: sql<number>`COUNT(*)`,
    })
    .from(captures)
    .groupBy(sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00')`)
    .orderBy(sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:00:00') ASC`);

  return _data;
}

export async function fetchImagesTable() {
  const _captures = await db
    .select({
      id: captures.id,
      path: captures.filePath,
      name: captures.fileName,
      type: captures.fileType,
      date: sql<string>`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:MI:SS')`,
    })
    .from(captures)
    .orderBy(
      sql`TO_CHAR(${captures}.created_at, 'YYYY-MM-DD HH24:MI:SS') DESC`,
    );

  return _captures;
}

export async function fetchVibrationRecords(): Promise<Vibration[]> {
  const _data = await db
    .select({
      id: vibration.id,
      duration: vibration.duration,
      createdAt: vibration.createdAt,
    })
    .from(vibration)
    .orderBy(vibration.createdAt);

  return _data as Vibration[];
}

export async function fetchSingleVibrationRecord() {
  const _vibrationRecord = await db
    .select()
    .from(vibration)
    .orderBy(vibration.createdAt)
    .limit(1);

  return _vibrationRecord;
}

export async function fetchSingleGasRecord() {
  const _singleData = await db
    .select()
    .from(gas)
    .orderBy(gas.createdAt)
    .limit(1);

  if (!_singleData) return { error: "No records found" };
  if (_singleData) return { success: _singleData };
}

export async function fetchGasRecords(): Promise<Gas[]> {
  const _data = await db.select().from(gas).orderBy(gas.createdAt);

  return _data;
}
