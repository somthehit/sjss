import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { academic_programs } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(academic_programs).orderBy(asc(academic_programs.display_order));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET academic programs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch academic programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level_en, level_np, description_en, description_np, subjects, display_order, is_active } = body;
    
    if (!level_en || !level_np) {
      return NextResponse.json({ success: false, error: 'level_en and level_np are required' }, { status: 400 });
    }

    const [created] = await db.insert(academic_programs).values({
      level_en,
      level_np,
      description_en: description_en || '',
      description_np: description_np || '',
      subjects: subjects || [],
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    }).returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('POST academic program error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create academic program' }, { status: 500 });
  }
}
