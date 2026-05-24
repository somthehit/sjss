import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hero_slides } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const body = await request.json();
    const { image_url, is_active, display_order } = body;

    const updateData: any = {};
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    const updated = await db.update(hero_slides)
      .set(updateData)
      .where(eq(hero_slides.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    console.error('Failed to update slide:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const deleted = await db.delete(hero_slides).where(eq(hero_slides.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error('Failed to delete slide:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
