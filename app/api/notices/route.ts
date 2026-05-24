import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notices } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const pinned = searchParams.get('pinned');

    const conditions = [eq(notices.is_published, true)];
    if (category) conditions.push(eq(notices.category, category));
    if (pinned === 'true') conditions.push(eq(notices.is_pinned, true));

    const data = await db
      .select()
      .from(notices)
      .where(and(...conditions))
      .orderBy(desc(notices.is_pinned), desc(notices.published_at))
      .limit(limit);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/notices error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title_en, title_np, content_en, content_np, category, is_pinned, pdf_url } = body;
    if (!title_en || !content_en) {
      return NextResponse.json({ success: false, error: 'title_en and content_en are required' }, { status: 400 });
    }
    const [created] = await db.insert(notices).values({
      title_en, title_np: title_np || title_en,
      content_en, content_np: content_np || content_en,
      category: category || 'general',
      is_pinned: is_pinned || false,
      pdf_url: pdf_url || null,
    }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create notice' }, { status: 500 });
  }
}
