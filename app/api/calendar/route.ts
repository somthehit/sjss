import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('calendar_data')
      .select('*')
      .order('month_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('GET calendar error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { month_index, days } = body;
    if (!month_index || !days) return NextResponse.json({ success: false, error: 'month_index and days required' }, { status: 400 });

    const { data, error } = await supabaseAdmin()
      .from('calendar_data')
      .update({ days, updated_at: new Date().toISOString() })
      .eq('month_index', Number(month_index))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT calendar error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update calendar' }, { status: 500 });
  }
}
