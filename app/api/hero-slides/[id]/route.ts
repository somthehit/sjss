import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const body = await request.json();
    const { image_url, caption, is_active, display_order } = body;

    const updateData: any = {};
    if (image_url !== undefined) updateData.image_url = image_url;
    if (caption !== undefined) updateData.caption = caption;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabaseAdmin()
      .from('hero_slides')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to update slide:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);

    const { data, error } = await supabaseAdmin()
      .from('hero_slides')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to delete slide:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}