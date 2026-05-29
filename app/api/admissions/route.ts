import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('admissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
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

    const { data, error } = await supabaseAdmin()
      .from('admissions')
      .insert({ ...body, status: 'pending' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit admission' }, { status: 500 });
  }
}
