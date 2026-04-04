import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

// SHA-256 of "0614"
// Generate: node -e "const c=require('crypto');console.log(c.createHash('sha256').update('0614').digest('hex'))"
const PIN_HASH = process.env.PIN_HASH || 'd1913a47aec9a99a549e8d075b5118abcabd8e8599d6fbbdb67785a5c31d9b03';

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
