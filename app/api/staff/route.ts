import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff } from '@/lib/schema';
import { and, asc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const conditions = [eq(staff.is_active, true)];

    if (department) {
      conditions.push(eq(staff.department, department));
    }

    const data = await db
      .select()
      .from(staff)
      .where(and(...conditions))
      .orderBy(asc(staff.display_order));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/staff error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(staff).values(body).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create staff' }, { status: 500 });
  }
}
