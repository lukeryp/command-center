'use client';
import { useState, useRef } from 'react';

interface SendResult {
  sent: number;
  failed: number;
  errors: string[];
}

export default function MessagingPage() {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const abortRef = useRef(false);

  const parsedNumbers = recipients
    .split('\n')
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  function handleSendClick() {
    if (!message.trim() || parsedNumbers.length === 0) return;
    setShowConfirm(true);
  }

  async function handleConfirm() {
    setShowConfirm(false);
    setSending(true);
    setResult(null);
    abortRef.current = false;
    setProgress({ current: 0, total: parsedNumbers.length });

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: parsedNumbers, message: message.trim() }),
      });
      const data: SendResult = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        sent: 0,
        failed: parsedNumbers.length,
        errors: [err instanceof Error ? err.message : 'Network error'],
      });
    } finally {
      setSending(false);
      setProgress(null);
    }
  }

  function reset() {
    setResult(null);
    setMessage('');
    setRecipients('');
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">📱</span>
          <h1 className="text-2xl font-bold tracking-tight font-[var(--font-raleway)]">
            SMS Blast
          </h1>
        </div>
        <p className="text-white/40 text-sm">Send SMS to multiple recipients via Twilio</p>
      </div>

      {/* Message composer */}
      <div
        className="rounded-2xl p-6 mb-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={5}
          disabled={sending}
          className="w-full bg-transparent text-white placeholder-white/20 resize-none outline-none text-sm leading-relaxed"
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-white/30">{message.length} chars</span>
          {message.length > 160 && (
            <span className="text-xs text-[#f4ee19]/70">
              {Math.ceil(message.length / 160)} SMS segments
            </span>
          )}
        </div>
      </div>

      {/* Recipients */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
          Recipients — one number per line
        </label>
        <textarea
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder={'+16125550001\n+16125550002\n+16125550003'}
          rows={6}
          disabled={sending}
          className="w-full bg-transparent text-white placeholder-white/20 resize-none outline-none text-sm font-mono leading-relaxed"
        />
        {parsedNumbers.length > 0 && (
          <p className="text-xs text-white/40 mt-3 pt-3 border-t border-white/5">
            {parsedNumbers.length} recipient{parsedNumbers.length !== 1 ? 's' : ''} · est.{' '}
            {parsedNumbers.length < 60
              ? `${parsedNumbers.length}s`
              : `${Math.ceil(parsedNumbers.length / 60)}m`}{' '}
            to send
          </p>
        )}
      </div>

      {/* Send button */}
      {!result && (
        <button
          onClick={handleSendClick}
          disabled={sending || !message.trim() || parsedNumbers.length === 0}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: sending ? 'rgba(0,175,81,0.3)' : '#00af51',
            color: '#0d0d0d',
          }}
        >
          {sending ? 'Sending…' : `Send to ${parsedNumbers.length} recipient${parsedNumbers.length !== 1 ? 's' : ''}`}
        </button>
      )}

      {/* Sending progress */}
      {sending && progress && (
        <div
          className="mt-4 rounded-2xl p-5"
          style={{ background: 'rgba(0,175,81,0.08)', border: '1px solid rgba(0,175,81,0.2)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#00af51] text-sm font-semibold">Sending…</span>
            <span className="text-white/30 text-xs">{progress.total} messages queued</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/10">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ background: '#00af51', width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-white/30 text-xs mt-2">Rate limited to 1 msg/sec (Twilio trial)</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          className="mt-4 rounded-2xl p-5"
          style={{
            background: result.failed === 0 ? 'rgba(0,175,81,0.08)' : 'rgba(244,238,25,0.06)',
            border: `1px solid ${result.failed === 0 ? 'rgba(0,175,81,0.25)' : 'rgba(244,238,25,0.2)'}`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#00af51' }}>{result.sent}</div>
              <div className="text-xs text-white/40 mt-1">sent</div>
            </div>
            {result.failed > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#f4ee19' }}>{result.failed}</div>
                <div className="text-xs text-white/40 mt-1">failed</div>
              </div>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Errors</p>
              <ul className="space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-xs text-[#f4ee19]/70 font-mono break-all">{e}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={reset}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Send another
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div
            className="w-full max-w-md rounded-2xl p-8"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <h2 className="text-xl font-bold mb-2">Confirm Send</h2>
            <p className="text-white/50 text-sm mb-1">
              You&apos;re about to send{' '}
              <span className="text-white font-semibold">{parsedNumbers.length} SMS message{parsedNumbers.length !== 1 ? 's' : ''}</span>.
            </p>
            <div
              className="rounded-xl p-4 my-4 text-sm text-white/70 italic"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              &ldquo;{message.length > 120 ? message.slice(0, 120) + '…' : message}&rdquo;
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#00af51', color: '#0d0d0d' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
