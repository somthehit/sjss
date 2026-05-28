import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('events')
      .select('*')
      .order('display_order', { ascending: true })
      .order('date_en', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("GET events error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin()
      .from('events')
      .insert({
        title_en: body.title_en,
        title_np: body.title_np,
        date_bs: body.date_bs,
        date_en: body.date_en,
        description_en: body.description_en || null,
        description_np: body.description_np || null,
        display_order: body.display_order ? Number(body.display_order) : 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("POST events error:", error);
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
  }
}