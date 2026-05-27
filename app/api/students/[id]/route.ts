import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students, student_promotions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const [student] = await db.select().from(students).where(eq(students.id, id));
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Also fetch promotion history
    const promotions = await db
      .select()
      .from(student_promotions)
      .where(eq(student_promotions.student_id, id));

    return NextResponse.json({ success: true, data: { ...student, promotions } });
  } catch (error) {
    console.error('GET /api/students/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();

    const updateData: any = { updated_at: new Date() };
    const fields = [
      'reg_no', 'student_name_en', 'student_name_np', 'dob', 'gender',
      'religion', 'ethnicity', 'guardian_name', 'guardian_relation',
      'contact_no', 'address', 'current_class', 'current_section',
      'roll_no', 'academic_year', 'status', 'photo_url',
      'previous_school', 'admission_date',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const [updated] = await db
      .update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Registration number already in use' },
        { status: 409 }
      );
    }
    console.error('PUT /api/students/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await db.delete(students).where(eq(students.id, id));
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}
