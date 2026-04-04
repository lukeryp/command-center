'use client';
import { useState, useEffect } from 'react';
import PinGate from './PinGate';

const SESSION_KEY = 'ryp_cc_unlocked';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = sessionStorage.getItem(SESSION_KEY) === 'true';
    setUnlocked(ok);
  }, []);

  function unlock() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setUnlocked(true);
  }

  if (unlocked === null) return null; // hydration guard
  if (!unlocked) return <PinGate onUnlock={unlock} />;
  return <>{children}</>;
}
