import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { milestones } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(milestones).orderBy(asc(milestones.display_order));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title_en, title_np, date_label, year_ad, description_en, description_np, is_active = true } = body;

    if (!title_en || !title_np || !date_label || !description_en || !description_np) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const maxOrder = await db.select({ max: milestones.display_order })
      .from(milestones)
      .orderBy(asc(milestones.display_order))
      .limit(1);

    const display_order = maxOrder.length > 0 ? maxOrder[0].max + 1 : 0;

    const inserted = await db.insert(milestones).values({
      title_en, title_np, date_label, year_ad, description_en, description_np,
      display_order, is_active,
    }).returning();

    return NextResponse.json({ data: inserted[0] });
  } catch (error) {
    console.error('Failed to create milestone:', error);
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
