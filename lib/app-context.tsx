'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContext } from './types';

const STORAGE_KEY = 'ryp_cc_context';

interface AppContextValue {
  activeContext: AppContext;
  setActiveContext: (ctx: AppContext) => void;
}

const Ctx = createContext<AppContextValue>({
  activeContext: 'ryp',
  setActiveContext: () => {},
});

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [activeContext, setActiveContextState] = useState<AppContext>('ryp');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AppContext | null;
    if (saved && ['interlachen', 'ryp', 'personal'].includes(saved)) {
      setActiveContextState(saved);
    }
  }, []);

  function setActiveContext(ctx: AppContext) {
    setActiveContextState(ctx);
    localStorage.setItem(STORAGE_KEY, ctx);
  }

  return <Ctx.Provider value={{ activeContext, setActiveContext }}>{children}</Ctx.Provider>;
}

export function useAppContext() {
  return useContext(Ctx);
}
