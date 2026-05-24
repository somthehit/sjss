import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notices } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [notice] = await db.select().from(notices).where(eq(notices.id, parseInt(id)));
    if (!notice) return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch notice' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db.update(notices).set({ ...body, updated_at: new Date() }).where(eq(notices.id, parseInt(id))).returning();
    if (!updated) return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(notices).where(eq(notices.id, parseInt(id)));
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete notice' }, { status: 500 });
  }
}
