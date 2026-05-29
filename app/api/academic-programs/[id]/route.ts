import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin()
      .from('academic_programs')
      .update(body)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Program not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/academic-programs/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin()
      .from('academic_programs')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Program deleted' });
  } catch (error) {
    console.error('DELETE /api/academic-programs/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete program' }, { status: 500 });
  }
}
