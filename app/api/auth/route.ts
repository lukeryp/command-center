import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

// SHA-256 of "1909"
// Generate: node -e "const c=require('crypto');console.log(c.createHash('sha256').update('1909').digest('hex'))"
const PIN_HASH = process.env.PIN_HASH || '8e614d39a1f1279958da1c9f7e8df51db4aabca8cc3a3e84f8c3dc5f88e1fcfb';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { pin } = body as { pin?: string };

  if (!pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid PIN format' }, { status: 400 });
  }

  const hash = createHash('sha256').update(pin).digest('hex');
  if (hash !== PIN_HASH) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
