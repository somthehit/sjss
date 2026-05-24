import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staff } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    let query = db.select().from(staff).where(eq(staff.is_active, true)).orderBy(asc(staff.display_order));
    if (department) {
      query = db.select().from(staff).where(eq(staff.department, department)).orderBy(asc(staff.display_order));
    }

    const data = await query;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(staff).values(body).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create staff' }, { status: 500 });
  }
}
