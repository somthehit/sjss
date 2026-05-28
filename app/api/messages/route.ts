import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET: Fetch all messages (admin)
export async function GET() {
  try {
    const { data: rows, error } = await supabaseAdmin()
      .from('contact_messages')
      .select()
      .order('submitted_at', { ascending: false });

    if (error) throw error;
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

    const { data: inserted, error } = await supabaseAdmin()
      .from('contact_messages')
      .insert({
        sender_name: name,
        sender_email: email,
        sender_phone: phone || null,
        message: message,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: inserted }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to submit message' }, { status: 500 });
  }
}
