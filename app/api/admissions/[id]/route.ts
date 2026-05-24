import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admissions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [admission] = await db.select().from(admissions).where(eq(admissions.id, parseInt(id)));
    if (!admission) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: admission });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch admission' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db.update(admissions).set(body).where(eq(admissions.id, parseInt(id))).returning();
    if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update admission' }, { status: 500 });
  }
}
