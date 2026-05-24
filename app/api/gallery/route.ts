import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { albums, gallery_images } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(albums).where(eq(albums.is_published, true)).orderBy(asc(albums.display_order));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // If body contains album_id and url -> create gallery image
    if (body.album_id && body.url) {
      const [createdImage] = await db.insert(gallery_images).values({
        album_id: Number(body.album_id),
        url: body.url,
        caption_en: body.caption_en || null,
        caption_np: body.caption_np || null,
        display_order: body.display_order || 0,
      }).returning();
      return NextResponse.json({ success: true, data: createdImage }, { status: 201 });
    }

    // Otherwise treat as album creation
    const [created] = await db.insert(albums).values(body).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create album or image' }, { status: 500 });
  }
}
