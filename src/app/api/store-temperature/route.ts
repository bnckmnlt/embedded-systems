import { db } from '@/lib/db';
import { temperature } from '@/lib/db/schema';
import dayjs from 'dayjs';
import { desc, eq, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { temperature: currentTemperature } = body;

    if(!currentTemperature){
      return NextResponse.json(
        { error: "Missing value" },
        { status: 422 }
      );
    }

    const fiveMinutesAgo = dayjs().subtract(5, 'minute').toDate();

    const recentRecord = await db
      .select()
      .from(temperature)
      .where(gte(temperature.createdAt, fiveMinutesAgo))
      .orderBy(desc(temperature.createdAt))
      .limit(1);

    if (recentRecord.length === 0) {
      await db.insert(temperature).values({
        maxTemp: currentTemperature,
        minTemp: currentTemperature,
        createdAt: new Date(),
      });
      return NextResponse.json({ message: 'Temperature record created' });
    } else {
      const record = recentRecord[0];
      const newMaxTemp = Math.max(record.maxTemp, currentTemperature);
      const newMinTemp = Math.min(record.minTemp, currentTemperature);

      await db
        .update(temperature)
        .set({
          maxTemp: newMaxTemp,
          minTemp: newMinTemp,
        })
        .where(eq(temperature.id, record.id));

      return NextResponse.json({ message: 'Temperature record updated' });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' });
  }
}
