'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { AppContext } from '@/lib/types';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: '⌂' },
      { href: '/projects', label: 'All Projects', icon: '◈' },
      { href: '/notifications', label: 'Notifications', icon: '🔔' },
      { href: '/team', label: 'Team', icon: '◉' },
      { href: '/session', label: 'Session', icon: '◆' },
    ],
  },
  {
    label: 'Digital Products',
    items: [
      { href: '/projects?cat=digital-products&p=known', label: 'Known', icon: '⛳' },
      { href: '/projects?cat=digital-products&p=ryp-red', label: 'RYP Red', icon: '🔴' },
      { href: '/projects?cat=digital-products&p=certification', label: 'Certification', icon: '🏅' },
      { href: '/projects?cat=digital-products&p=command-center', label: 'Command Center', icon: '🧠' },
    ],
  },
  {
    label: 'Physical Products',
    items: [
      { href: '/projects?cat=physical-products&p=forge', label: 'FORGE', icon: '🔥' },
      { href: '/projects?cat=physical-products&p=rypstick', label: 'Rypstick', icon: '⚡' },
      { href: '/projects?cat=physical-products&p=preformed-grip', label: 'Preformed Grip', icon: '🤚' },
    ],
  },
  {
    label: 'Marketing & Content',
    items: [
      { href: '/projects?cat=marketing&p=textbook', label: 'Textbook', icon: '📖' },
      { href: '/projects?cat=marketing&p=content-machine', label: 'Content Machine', icon: '🎬' },
      { href: '/projects?cat=marketing&p=social-media', label: 'Social Media', icon: '📱' },
      { href: '/content', label: 'Content Hub', icon: '◑' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/projects?cat=operations&p=foundation', label: 'Foundation', icon: '🤝' },
      { href: '/projects?cat=operations&p=chip', label: 'CHIP', icon: '🎯' },
      { href: '/projects?cat=operations&p=pgalesson', label: 'pgalesson.com', icon: '🌐' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/decisions', label: 'Decision Log', icon: '⚖' },
      { href: '/meetings', label: 'Meeting Debriefs', icon: '📋' },
      { href: '/competitors', label: 'Competitor Watch', icon: '🎯' },
      { href: '/revenue', label: 'Revenue Tracker', icon: '💰' },
      { href: '/map', label: 'Dependency Map', icon: '🔗' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/ideas', label: 'Ideas', icon: '◎' },
      { href: '/sourcing', label: 'Sourcing', icon: '◫' },
      { href: '/ip', label: 'IP Portfolio', icon: '⚖' },
    ],
  },
];

const CONTEXTS: { value: AppContext; label: string; short: string }[] = [
  { value: 'interlachen', label: 'Interlachen', short: 'Club' },
  { value: 'ryp', label: 'RYP', short: 'RYP' },
  { value: 'personal', label: 'Personal', short: 'Me' },
];

export default function Header() {
  const path = usePathname();
  const { activeContext, setActiveContext } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    if (href.includes('?')) {
      const base = href.split('?')[0];
      const params = new URLSearchParams(href.split('?')[1]);
      const projectId = params.get('p');
      return path === base && typeof window !== 'undefined' && window.location.search.includes(`p=${projectId}`);
    }
    return path.startsWith(href);
  };

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/8 px-4 h-14 flex items-center justify-between gap-3">
        {/* Menu + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="text-sm">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00af51] flex items-center justify-center">
              <span className="text-black text-xs font-bold">R</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Command Center
            </span>
          </div>
        </div>

        {/* Context switcher pill */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 backdrop-blur-sm">
          {CONTEXTS.map(ctx => {
            const active = activeContext === ctx.value;
            return (
              <button
                key={ctx.value}
                onClick={() => setActiveContext(ctx.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active ? 'text-black' : 'text-white/40 hover:text-white/70'
                }`}
                style={active ? { background: '#00af51', boxShadow: '0 0 14px #00af5155' } : {}}
              >
                <span className="hidden sm:inline">{ctx.label}</span>
                <span className="sm:hidden">{ctx.short}</span>
              </button>
            );
          })}
        </div>

        {/* Date */}
        <div className="text-white/40 text-xs shrink-0 hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-45 w-72 bg-[#0d0d0d]/95 backdrop-blur-xl border-r border-white/8 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 45 }}
      >
        <div className="py-4 px-3">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? 'mt-5' : ''}>
              <div className="px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                  {section.label}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                        active
                          ? 'bg-[#00af51]/15 text-[#00af51]'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-base w-6 text-center shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Bottom nav — compact quick access */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-xl border-t border-white/8 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {[
            { href: '/', label: 'Home', icon: '⌂' },
            { href: '/projects', label: 'Projects', icon: '◈' },
            { href: '/notifications', label: 'Alerts', icon: '🔔' },
            { href: '/content', label: 'Content', icon: '◑' },
            { href: '/ideas', label: 'Ideas', icon: '◎' },
          ].map(({ href, label, icon }) => {
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
