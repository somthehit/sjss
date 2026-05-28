import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body as { orderedIds: number[] };

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabaseAdmin()
        .from('milestones')
        .update({ display_order: i })
        .eq('id', orderedIds[i]);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder milestones:', error);
    return NextResponse.json({ error: 'Failed to reorder milestones' }, { status: 500 });
  }
}
