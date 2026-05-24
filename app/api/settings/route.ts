import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { site_settings } from '@/lib/schema';
import { uploadFileToMediaBucket } from '@/lib/storage';

export async function GET() {
  try {
    const rows = await db.select().from(site_settings);
    const data = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
      await db.insert(site_settings)
        .values({ key, value, updated_at: new Date() })
        .onConflictDoUpdate({ target: site_settings.key, set: { value, updated_at: new Date() } });
    }
    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}

// POST: handle multipart file upload (logo) and persist URL
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ success: false, error: 'Unsupported Content-Type' }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const { url: publicUrl } = await uploadFileToMediaBucket(file, 'logos');

    // Persist the logo URL to site_settings
    await db.insert(site_settings)
      .values({ key: 'logo_url', value: publicUrl, updated_at: new Date() })
      .onConflictDoUpdate({ target: site_settings.key, set: { value: publicUrl, updated_at: new Date() } });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
