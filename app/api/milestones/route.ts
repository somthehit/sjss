import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('milestones')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title_en, title_np, date_label, year_ad, description_en, description_np, is_active = true } = body;

    if (!title_en || !title_np || !date_label || !description_en || !description_np) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: maxRow } = await supabaseAdmin()
      .from('milestones')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const display_order = maxRow ? maxRow.display_order + 1 : 0;

    const { data, error } = await supabaseAdmin()
      .from('milestones')
      .insert({ title_en, title_np, date_label, year_ad, description_en, description_np, display_order, is_active })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to create milestone:', error);
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}