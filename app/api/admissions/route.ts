import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admissions } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(admissions).orderBy(desc(admissions.submitted_at));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, guardian_name, phone, grade_applying, dob, address } = body;
    if (!student_name || !guardian_name || !phone || !grade_applying || !dob || !address) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const [created] = await db.insert(admissions).values({ ...body, status: 'pending' }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit admission' }, { status: 500 });
  }
}
