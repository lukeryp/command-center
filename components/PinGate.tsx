'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  onUnlock: () => void;
}

export default function PinGate({ onUnlock }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setError('');
    if (val.length === 4) {
      setChecking(true);
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: val }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          onUnlock();
        } else {
          triggerError('Incorrect PIN');
        }
      } catch {
        // fallback: client-side hash check
        const hash = await sha256(val);
        if (hash === '8e614d39a1f1279958da1c9f7e8df51db4aabca8cc3a3e84f8c3dc5f88e1fcfb') {
          onUnlock();
        } else {
          triggerError('Incorrect PIN');
        }
      } finally {
        setChecking(false);
      }
    }
  }

  function triggerError(msg: string) {
    setError(msg);
    setShake(true);
    setTimeout(() => { setPin(''); setShake(false); inputRef.current?.focus(); }, 650);
  }

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center gap-6 z-50">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[#00af51] flex items-center justify-center shadow-lg shadow-[#00af51]/30">
          <span className="text-3xl font-bold text-black">R</span>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Command Center
        </h1>
        <p className="text-white/40 text-sm">RYP Golf — Luke Benoit</p>
      </div>

      {/* PIN Card */}
      <div
        className={`bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-5 w-72 backdrop-blur-xl shadow-2xl transition-transform ${shake ? 'animate-shake' : ''}`}
      >
        <p className="text-white/60 text-sm font-medium tracking-wide uppercase">Enter PIN</p>

        {/* Dot indicators */}
        <div className="flex gap-4">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length ? 'bg-[#00af51] scale-110' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={handleChange}
          className="opacity-0 absolute pointer-events-none"
          aria-label="PIN input"
        />

        {/* Numeric keypad overlay trigger — tap dots to focus */}
        <button
          onClick={() => inputRef.current?.focus()}
          className="text-white/30 text-xs"
        >
          {checking ? 'Checking…' : 'Tap to type PIN'}
        </button>

        {error && (
          <p className="text-red-400 text-sm font-medium">{error}</p>
        )}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => (
          <button
            key={i}
            disabled={!key}
            onClick={() => {
              if (key === '⌫') {
                setPin(p => p.slice(0, -1));
              } else if (key && pin.length < 4) {
                const next = pin + key;
                setPin(next);
                setError('');
                // Trigger check via synthetic onChange
                handleChange({ target: { value: next } } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            className={`h-14 rounded-xl text-white text-xl font-semibold transition-all active:scale-95 ${
              key
                ? 'bg-white/8 hover:bg-white/15 border border-white/10'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
