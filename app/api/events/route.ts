import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/schema';
import { asc, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(events).orderBy(asc(events.display_order), desc(events.date_en));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET events error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(events).values({
      title_en: body.title_en,
      title_np: body.title_np,
      date_bs: body.date_bs,
      date_en: body.date_en,
      description_en: body.description_en || null,
      description_np: body.description_np || null,
      display_order: body.display_order ? Number(body.display_order) : 0,
    }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("POST events error:", error);
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
  }
}
