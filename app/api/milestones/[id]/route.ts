import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { milestones } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const body = await request.json();
    const { title_en, title_np, date_label, year_ad, description_en, description_np, is_active, display_order } = body;

    const updateData: Record<string, unknown> = {};
    if (title_en !== undefined) updateData.title_en = title_en;
    if (title_np !== undefined) updateData.title_np = title_np;
    if (date_label !== undefined) updateData.date_label = date_label;
    if (year_ad !== undefined) updateData.year_ad = year_ad;
    if (description_en !== undefined) updateData.description_en = description_en;
    if (description_np !== undefined) updateData.description_np = description_np;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    const updated = await db.update(milestones)
      .set(updateData)
      .where(eq(milestones.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    console.error('Failed to update milestone:', error);
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const deleted = await db.delete(milestones).where(eq(milestones.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error('Failed to delete milestone:', error);
    return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 });
  }
}
