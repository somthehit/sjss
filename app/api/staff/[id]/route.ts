import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [member] = await db.select().from(staff).where(eq(staff.id, parseInt(id)));
    if (!member) return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db.update(staff).set(body).where(eq(staff.id, parseInt(id))).returning();
    if (!updated) return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(staff).where(eq(staff.id, parseInt(id)));
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete staff' }, { status: 500 });
  }
}
