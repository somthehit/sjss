import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: notice, error } = await supabaseAdmin()
      .from('notices')
      .select()
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!notice) return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch notice' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data: updated, error } = await supabaseAdmin()
      .from('notices')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!updated) return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin()
      .from('notices')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete notice' }, { status: 500 });
  }
}
