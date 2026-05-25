import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { albums, gallery_images } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [album] = await db.select().from(albums).where(eq(albums.id, parseInt(id)));
    if (!album) return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    const images = await db.select().from(gallery_images).where(eq(gallery_images.album_id, parseInt(id)));
    return NextResponse.json({ success: true, data: { ...album, images } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch album' }, { status: 500 });
  }
}

// POST /api/gallery/[id] — add an image to an album
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url, caption_en, caption_np, display_order } = body;
    if (!url) return NextResponse.json({ success: false, error: 'url is required' }, { status: 400 });

    const [image] = await db.insert(gallery_images).values({
      album_id: parseInt(id),
      url,
      caption_en: caption_en ?? null,
      caption_np: caption_np ?? null,
      display_order: display_order ?? 0,
    }).returning();

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db.update(albums).set(body).where(eq(albums.id, parseInt(id))).returning();
    if (!updated) return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
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
      await db.delete(gallery_images).where(eq(gallery_images.id, parseInt(imageId)));
      return NextResponse.json({ success: true, message: 'Image deleted' });
    }

    await db.delete(albums).where(eq(albums.id, parseInt(id)));
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
