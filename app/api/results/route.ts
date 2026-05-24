import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { results } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNo = searchParams.get('rollNo');
    const year = searchParams.get('year');

    if (!rollNo) {
      return NextResponse.json({ success: false, error: 'rollNo is required' }, { status: 400 });
    }

    const conditions = [eq(results.roll_no, rollNo)];
    if (year) conditions.push(eq(results.academic_year, year));

    const data = await db.select().from(results).where(and(...conditions));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(results).values(body).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create result' }, { status: 500 });
  }
}
