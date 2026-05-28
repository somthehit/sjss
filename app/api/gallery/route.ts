import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('albums')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.album_id && body.url) {
      const { data, error } = await supabaseAdmin()
        .from('gallery_images')
        .insert({
          album_id: Number(body.album_id),
          url: body.url,
          caption_en: body.caption_en || null,
          caption_np: body.caption_np || null,
          display_order: body.display_order || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 201 });
    }

    const { data, error } = await supabaseAdmin()
      .from('albums')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create album or image' }, { status: 500 });
  }
}