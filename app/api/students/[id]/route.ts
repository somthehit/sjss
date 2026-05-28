import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { data: student, error } = await supabaseAdmin()
      .from('students')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const { data: promotions, error: promoError } = await supabaseAdmin()
      .from('student_promotions')
      .select()
      .eq('student_id', id);

    if (promoError) throw promoError;

    return NextResponse.json({ success: true, data: { ...student, promotions: promotions || [] } });
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

    const updateData: any = { updated_at: new Date().toISOString() };
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

    const { data: updated, error } = await supabaseAdmin()
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Registration number already in use' },
          { status: 409 }
        );
      }
      throw error;
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('PUT /api/students/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { error } = await supabaseAdmin()
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}
