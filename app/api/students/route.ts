import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students } from '@/lib/schema';
import { eq, desc, ilike, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const classFilter = searchParams.get('class') || '';
    const yearFilter = searchParams.get('year') || '';
    const statusFilter = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(students.student_name_en, `%${search}%`),
          ilike(students.student_name_np, `%${search}%`),
          ilike(students.reg_no, `%${search}%`),
          ilike(students.roll_no ?? '', `%${search}%`),
          ilike(students.guardian_name, `%${search}%`)
        )
      );
    }

    if (classFilter) conditions.push(eq(students.current_class, classFilter));
    if (yearFilter) conditions.push(eq(students.academic_year, yearFilter));
    if (statusFilter) conditions.push(eq(students.status, statusFilter));

    const data = await db
      .select()
      .from(students)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(students.current_class, students.roll_no)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const allData = await db
      .select({ id: students.id })
      .from(students)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({
      success: true,
      data,
      total: allData.length,
      page,
      limit,
    });
  } catch (error) {
    console.error('GET /api/students error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reg_no, student_name_en, student_name_np, dob, gender,
      religion, ethnicity, guardian_name, guardian_relation,
      contact_no, address, current_class, current_section,
      roll_no, academic_year, status, photo_url,
      previous_school, admission_date,
    } = body;

    if (!reg_no || !student_name_en || !current_class || !academic_year) {
      return NextResponse.json(
        { success: false, error: 'reg_no, student_name_en, current_class, and academic_year are required' },
        { status: 400 }
      );
    }

    const [created] = await db.insert(students).values({
      reg_no,
      student_name_en,
      student_name_np: student_name_np || '',
      dob: dob || null,
      gender: gender || 'Male',
      religion: religion || null,
      ethnicity: ethnicity || null,
      guardian_name: guardian_name || '',
      guardian_relation: guardian_relation || null,
      contact_no: contact_no || null,
      address: address || null,
      current_class,
      current_section: current_section || 'A',
      roll_no: roll_no || null,
      academic_year,
      status: status || 'Active',
      photo_url: photo_url || null,
      previous_school: previous_school || null,
      admission_date: admission_date || null,
    }).returning();

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'A student with this registration number already exists' },
        { status: 409 }
      );
    }
    console.error('POST /api/students error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 500 });
  }
}
