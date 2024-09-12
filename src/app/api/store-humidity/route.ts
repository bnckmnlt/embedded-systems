import { db } from '@/lib/db';
import { humidity } from '@/lib/db/schema';
import dayjs from 'dayjs';
import { desc, eq, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { humidity: currentHumidity } = body;

    if(!currentHumidity){
      return NextResponse.json(
        { error: "Missing value" },
        { status: 422 }
      );
    }

    const fiveMinutesAgo = dayjs().subtract(5, 'minute').toDate();

    const recentRecord = await db
      .select()
      .from(humidity)
      .where(gte(humidity.createdAt, fiveMinutesAgo))
      .orderBy(desc(humidity.createdAt))
      .limit(1);

    if (recentRecord.length === 0) {
      await db.insert(humidity).values({
        maxHumidity: currentHumidity,
        minHumidity: currentHumidity,
        createdAt: new Date(),
      });
      return NextResponse.json({ message: 'Temperature record created' });
    }
    else {
      const record = recentRecord[0];
      const newMaxTemp = Math.max(record.maxHumidity, currentHumidity);
      const newMinTemp = Math.min(record.minHumidity, currentHumidity);

      await db
        .update(humidity)
        .set({
          maxHumidity: newMaxTemp,
          minHumidity: newMinTemp,
        })
        .where(eq(humidity.id, record.id));

      return NextResponse.json({ message: 'Humidity record updated' });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' });
  }
}
