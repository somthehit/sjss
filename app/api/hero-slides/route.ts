import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hero_slides } from '@/lib/schema';
import { desc, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(hero_slides).orderBy(asc(hero_slides.display_order));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, caption, is_active = true, display_order = 0 } = body;

    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    const inserted = await db.insert(hero_slides).values({
      image_url,
      caption,
      is_active,
      display_order,
    }).returning();

    return NextResponse.json({ data: inserted[0] });
  } catch (error) {
    console.error('Failed to insert slide:', error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
