import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calendar_data } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(calendar_data).orderBy(asc(calendar_data.month_index));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET calendar error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { month_index, days } = body;
    if (!month_index || !days) return NextResponse.json({ success: false, error: 'month_index and days required' }, { status: 400 });
    
    const [updated] = await db.update(calendar_data)
      .set({ days, updated_at: new Date() })
      .where(eq(calendar_data.month_index, Number(month_index)))
      .returning();
      
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PUT calendar error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update calendar' }, { status: 500 });
  }
}
