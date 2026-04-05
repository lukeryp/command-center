'use client';
import { useState, useRef } from 'react';

interface CaptureItem {
  id: string;
  text: string;
  type: 'idea' | 'task' | 'note' | 'decision';
  timestamp: string;
  processed: boolean;
}

const STORAGE_KEY = 'ryp_cc_quickcapture';

function loadCaptures(): CaptureItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCaptures(items: CaptureItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const TYPE_CONFIG = {
  idea:     { icon: '💡', label: 'Idea', cls: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  task:     { icon: '✅', label: 'Task', cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  note:     { icon: '📝', label: 'Note', cls: 'bg-[#0ea5e9]/15 text-[#0ea5e9] border-[#0ea5e9]/30' },
  decision: { icon: '⚖️', label: 'Decision', cls: 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/30' },
};

export default function QuickCapture({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [type, setType] = useState<CaptureItem['type']>('idea');
  const [captures, setCaptures] = useState<CaptureItem[]>(() => loadCaptures());
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const addCapture = () => {
    if (!text.trim()) return;
    const item: CaptureItem = {
      id: Date.now().toString(36),
      text: text.trim(),
      type,
      timestamp: new Date().toISOString(),
      processed: false,
    };
    const updated = [item, ...captures];
    setCaptures(updated);
    saveCaptures(updated);
    setText('');
    inputRef.current?.focus();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setText(prev => prev + (prev ? '\n' : '') + '[Voice memo recorded — transcription coming soon]');
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      // Microphone not available
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeCapture = (id: string) => {
    const updated = captures.filter(c => c.id !== id);
    setCaptures(updated);
    saveCaptures(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0d0d0d]/95 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Raleway, sans-serif' }}>Quick Capture</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors text-sm">✕</button>
        </div>

        <div className="flex gap-2 px-5 mb-3">
          {(Object.entries(TYPE_CONFIG) as [CaptureItem['type'], typeof TYPE_CONFIG['idea']][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                type === key ? cfg.cls : 'bg-white/5 text-white/30 border-white/10'
              }`}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>

        <div className="px-5 mb-3">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Capture a quick ${type}...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#00af51]/50 focus:outline-none resize-none h-24"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addCapture(); }}
            />
            <div className="absolute bottom-2 right-2 flex gap-1.5">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/30 hover:text-white/60'
                }`}
                title={isRecording ? 'Stop recording' : 'Record voice'}
              >
                <span className="text-sm">{isRecording ? '⏹' : '🎙'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 mb-4 flex gap-2">
          <button
            onClick={addCapture}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#00af51] text-black hover:bg-[#00af51]/80 transition-all disabled:opacity-30"
          >
            Capture {TYPE_CONFIG[type].icon}
          </button>
          <span className="text-white/15 text-[10px] self-center">⌘ + Enter</span>
        </div>

        {captures.length > 0 && (
          <div className="border-t border-white/[0.06] px-5 py-4 max-h-48 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Recent Captures</div>
            <div className="space-y-1.5">
              {captures.slice(0, 10).map(c => {
                const cfg = TYPE_CONFIG[c.type];
                return (
                  <div key={c.id} className="flex items-start gap-2 group">
                    <span className="text-xs mt-0.5">{cfg.icon}</span>
                    <p className="text-white/50 text-xs flex-1 leading-relaxed">{c.text}</p>
                    <span className="text-white/15 text-[10px] shrink-0">
                      {new Date(c.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => removeCapture(c.id)}
                      className="text-white/10 hover:text-red-400/60 text-[10px] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
