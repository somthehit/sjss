import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const albumId = parseInt(id);

    const { data: album, error: albumError } = await supabaseAdmin()
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (albumError) throw albumError;
    if (!album) return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });

    const { data: images, error: imagesError } = await supabaseAdmin()
      .from('gallery_images')
      .select('*')
      .eq('album_id', albumId);

    if (imagesError) throw imagesError;

    return NextResponse.json({ success: true, data: { ...album, images: images || [] } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch album' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url, caption_en, caption_np, display_order } = body;
    if (!url) return NextResponse.json({ success: false, error: 'url is required' }, { status: 400 });

    const { data, error } = await supabaseAdmin()
      .from('gallery_images')
      .insert({
        album_id: parseInt(id),
        url,
        caption_en: caption_en ?? null,
        caption_np: caption_np ?? null,
        display_order: display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const imageId = url.searchParams.get('imageId');

    // Update individual image caption
    if (imageId) {
      const body = await request.json();
      const { caption_en, caption_np } = body;

      const { data, error } = await supabaseAdmin()
        .from('gallery_images')
        .update({ caption_en: caption_en ?? null, caption_np: caption_np ?? null })
        .eq('id', parseInt(imageId))
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Update album
    const body = await request.json();

    const { data, error } = await supabaseAdmin()
      .from('albums')
      .update(body)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const imageId = url.searchParams.get('imageId');

    if (imageId) {
      const { error } = await supabaseAdmin()
        .from('gallery_images')
        .delete()
        .eq('id', parseInt(imageId));

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Image deleted' });
    }

    const { error } = await supabaseAdmin()
      .from('albums')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}