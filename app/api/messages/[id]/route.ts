import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// PUT: Update message (mark read, replied, add admin notes)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const msgId = parseInt(id);
    if (isNaN(msgId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (typeof body.is_read === 'boolean') updateData.is_read = body.is_read;
    if (typeof body.is_replied === 'boolean') updateData.is_replied = body.is_replied;
    if (typeof body.admin_notes === 'string') updateData.admin_notes = body.admin_notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No update fields provided' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin()
      .from('contact_messages')
      .update(updateData)
      .eq('id', msgId)
      .select()
      .single();

    if (error) throw error;
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE: Remove a message
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const msgId = parseInt(id);
    if (isNaN(msgId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from('contact_messages')
      .delete()
      .eq('id', msgId);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
