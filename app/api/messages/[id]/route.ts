import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contact_messages } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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

    const [updated] = await db.update(contact_messages)
      .set(updateData)
      .where(eq(contact_messages.id, msgId))
      .returning();

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

    await db.delete(contact_messages).where(eq(contact_messages.id, msgId));
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
