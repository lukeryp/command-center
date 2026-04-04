'use client';
import { useState } from 'react';
import { saveIdea, newId } from '@/lib/store';

interface Props {
  onSaved?: () => void;
}

export default function QuickCapture({ onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  function capture() {
    if (!title.trim()) return;
    saveIdea({
      id: newId(),
      title: title.trim(),
      body: body.trim(),
      status: 'raw',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => {
      setTitle('');
      setBody('');
      setSaved(false);
      setOpen(false);
      onSaved?.();
    }, 700);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 bg-[#00af51]/10 border border-[#00af51]/30 rounded-2xl px-5 py-4 text-left transition-all hover:bg-[#00af51]/15 active:scale-[0.98]"
      >
        <div className="w-8 h-8 rounded-xl bg-[#00af51] flex items-center justify-center shrink-0">
          <span className="text-black text-lg font-bold leading-none">+</span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Quick Capture</p>
          <p className="text-white/40 text-xs">Jot an idea before it disappears</p>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-t-3xl p-6 pb-10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Capture an Idea
            </h3>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's the idea?"
              className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-base outline-none placeholder:text-white/30 mb-3 focus:border-[#00af51]/50"
            />
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Any context? (optional)"
              rows={3}
              className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/30 mb-4 resize-none focus:border-[#00af51]/50"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={capture}
                disabled={!title.trim() || saved}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  saved
                    ? 'bg-[#00af51] text-black'
                    : 'bg-[#00af51] text-black hover:bg-[#00c45a] disabled:opacity-40'
                }`}
              >
                {saved ? '✓ Saved!' : 'Capture →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
