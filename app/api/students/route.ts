import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

    let query = supabaseAdmin().from('students').select('*', { count: 'exact' });

    if (search) {
      query = query.or(
        `student_name_en.ilike.%${search}%,student_name_np.ilike.%${search}%,reg_no.ilike.%${search}%,roll_no.ilike.%${search}%,guardian_name.ilike.%${search}%`
      );
    }

    if (classFilter) query = query.eq('current_class', classFilter);
    if (yearFilter) query = query.eq('academic_year', yearFilter);
    if (statusFilter) query = query.eq('status', statusFilter);

    const { data, error, count } = await query
      .order('current_class')
      .order('roll_no')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
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

    const { data: created, error } = await supabaseAdmin()
      .from('students')
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'A student with this registration number already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/students error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 500 });
  }
}
