import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contact_messages } from '@/lib/schema';
import { desc } from 'drizzle-orm';

// GET: Fetch all messages (admin)
export async function GET() {
  try {
    const rows = await db.select().from(contact_messages).orderBy(desc(contact_messages.submitted_at));
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Submit a new contact message (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email and message are required' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    const [inserted] = await db.insert(contact_messages).values({
      sender_name: name,
      sender_email: email,
      sender_phone: phone || null,
      message: message,
    }).returning();

    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to submit message' }, { status: 500 });
  }
}
