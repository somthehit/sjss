import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const pinned = searchParams.get('pinned');

    let query = supabaseAdmin()
      .from('notices')
      .select('*')
      .eq('is_published', true);

    if (category) query = query.eq('category', category);
    if (pinned === 'true') query = query.eq('is_pinned', true);

    query = query.order('is_pinned', { ascending: false }).order('published_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
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

    const { data, error } = await supabaseAdmin()
      .from('notices')
      .insert({
        title_en, title_np: title_np || title_en,
        content_en, content_np: content_np || content_en,
        category: category || 'general',
        is_pinned: is_pinned || false,
        pdf_url: pdf_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create notice' }, { status: 500 });
  }
}