import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { milestones } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body as { orderedIds: number[] };

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(milestones)
        .set({ display_order: i })
        .where(eq(milestones.id, orderedIds[i]));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder milestones:', error);
    return NextResponse.json({ error: 'Failed to reorder milestones' }, { status: 500 });
  }
}
