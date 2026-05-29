import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin()
      .from('admissions')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch admission' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin()
      .from('admissions')
      .update(body)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update admission' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin()
      .from('admissions')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete admission' }, { status: 500 });
  }
}
