'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/projects', label: 'Projects', icon: '◈' },
  { href: '/team', label: 'Team', icon: '◉' },
  { href: '/ideas', label: 'Ideas', icon: '◎' },
  { href: '/session', label: 'Session', icon: '◆' },
  { href: '/sourcing', label: 'Sourcing', icon: '◫' },
  { href: '/ip', label: 'IP', icon: '⚖' },
];

export default function Header() {
  const path = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/8 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00af51] flex items-center justify-center">
            <span className="text-black text-xs font-bold">R</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Command Center
          </span>
        </div>
        <div className="text-white/40 text-xs">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-xl border-t border-white/8 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-[44px] ${
                  active ? 'text-[#00af51]' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span className="text-lg leading-none">{icon}</span>
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
