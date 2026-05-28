import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: event, error } = await supabaseAdmin()
      .from('events')
      .select()
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!event) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("GET event ID error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data: updated, error } = await supabaseAdmin()
      .from('events')
      .update({
        title_en: body.title_en,
        title_np: body.title_np,
        date_bs: body.date_bs,
        date_en: body.date_en,
        description_en: body.description_en,
        description_np: body.description_np,
        display_order: body.display_order ? Number(body.display_order) : undefined,
      })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!updated) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT event ID error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin()
      .from('events')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error("DELETE event ID error:", error);
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 });
  }
}
