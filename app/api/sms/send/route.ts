import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json(
      { error: 'Twilio credentials not configured' },
      { status: 500 }
    );
  }

  let body: { to?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { to, message } = body;

  if (!Array.isArray(to) || to.length === 0) {
    return NextResponse.json({ error: '`to` must be a non-empty array of phone numbers' }, { status: 400 });
  }
  if (typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json({ error: '`message` must be a non-empty string' }, { status: 400 });
  }

  const client = twilio(accountSid, authToken);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < to.length; i++) {
    const number = String(to[i]).trim();
    try {
      await client.messages.create({
        body: message.trim(),
        from: fromNumber,
        to: number,
      });
      sent++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${number}: ${msg}`);
    }

    // Rate limit: 1 message/second (Twilio trial restriction)
    if (i < to.length - 1) {
      await sleep(1000);
    }
  }

  return NextResponse.json({ sent, failed, errors });
}
