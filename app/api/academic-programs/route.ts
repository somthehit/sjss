import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('academic_programs')
      .select()
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET academic programs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch academic programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level_en, level_np, description_en, description_np, subjects, display_order, is_active } = body;
    
    if (!level_en || !level_np) {
      return NextResponse.json({ success: false, error: 'level_en and level_np are required' }, { status: 400 });
    }

    const { data: created, error } = await supabaseAdmin()
      .from('academic_programs')
      .insert({
        level_en,
        level_np,
        description_en: description_en || '',
        description_np: description_np || '',
        subjects: subjects || [],
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('POST academic program error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create academic program' }, { status: 500 });
  }
}
