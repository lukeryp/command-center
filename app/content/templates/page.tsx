'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
}

const TEMPLATES: Template[] = [
  {
    id: '01',
    name: 'Current Light',
    description: 'Light gray background, circular headshot top-left, bold text. The baseline template — clean and familiar.',
    tags: ['light', 'standard', 'proven'],
    image: '/templates/template-01-current-light.jpg',
  },
  {
    id: '02',
    name: 'Dark Mode',
    description: 'Black background with green accent line, white text. Premium, high-contrast — stands out in light-mode feeds.',
    tags: ['dark', 'premium', 'high-contrast'],
    image: '/templates/template-02-dark-mode.jpg',
  },
  {
    id: '03',
    name: 'Green Header',
    description: 'Bold RYP green header band with white body below. Strong brand identification at a glance.',
    tags: ['branded', 'bold', 'institutional'],
    image: '/templates/template-03-green-header.jpg',
  },
  {
    id: '04',
    name: 'Centered',
    description: 'Headshot and text centered. Symmetrical and clean — works well for short, punchy statements.',
    tags: ['minimal', 'centered', 'balanced'],
    image: '/templates/template-04-centered.jpg',
  },
  {
    id: '05',
    name: 'Quote Card',
    description: 'Giant green quotation mark, minimal layout, attribution at bottom. Editorial and shareable.',
    tags: ['editorial', 'quotable', 'shareable'],
    image: '/templates/template-05-quote-card.jpg',
  },
  {
    id: '06',
    name: 'Editorial',
    description: 'Thin rules, regular-weight font, magazine feel. Sophisticated and professional.',
    tags: ['editorial', 'magazine', 'sophisticated'],
    image: '/templates/template-06-editorial.jpg',
  },
  {
    id: '07',
    name: 'Bold Drop Cap',
    description: 'Oversized green first letter with green bottom bar. Eye-catching and distinctive.',
    tags: ['bold', 'typographic', 'distinctive'],
    image: '/templates/template-07-bold-accent.jpg',
  },
  {
    id: '08',
    name: 'Split Panel',
    description: 'Dark sidebar with headshot and credentials, white text area. Two-column authority layout.',
    tags: ['split', 'authority', 'structured'],
    image: '/templates/template-08-split-panel.jpg',
  },
  {
    id: '09',
    name: 'Gradient',
    description: 'Green-to-black gradient background. Moody, bold, premium — strong for evening/motivational posts.',
    tags: ['dark', 'gradient', 'moody'],
    image: '/templates/template-09-gradient.jpg',
  },
  {
    id: '10',
    name: 'Yellow Highlight',
    description: 'White background with key words highlighted in RYP yellow. Emphasizes important phrases — great for teaching.',
    tags: ['highlight', 'teaching', 'yellow'],
    image: '/templates/template-10-yellow-highlight.jpg',
  },
];

const ALL_TAGS = Array.from(new Set(TEMPLATES.flatMap(t => t.tags))).sort();

export default function TemplateGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = activeTag
    ? TEMPLATES.filter(t => t.tags.includes(activeTag))
    : TEMPLATES;

  const selectedTemplate = TEMPLATES.find(t => t.id === selected);

  function toggleFav(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/content"
            className="font-mono text-[10px] text-white/40 hover:text-[#00af51] transition-colors"
          >
            ← content
          </Link>
          <span className="text-white/15 text-[10px]">/</span>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-white/35"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Carousel Templates
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/25">
          {TEMPLATES.length} templates
          {favorites.size > 0 && (
            <> · <span className="text-[#f4ee19]">{favorites.size} starred</span></>
          )}
        </span>
      </div>

      {/* Tag filters */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTag(null)}
          className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all ${
            activeTag === null
              ? 'border-[#00af51]/50 bg-[#00af51]/15 text-[#00af51]'
              : 'border-white/10 text-white/35 hover:border-white/20 hover:text-white/50'
          }`}
        >
          all
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all ${
              activeTag === tag
                ? 'border-[#00af51]/50 bg-[#00af51]/15 text-[#00af51]'
                : 'border-white/10 text-white/35 hover:border-white/20 hover:text-white/50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger">
        {filtered.map(template => {
          const isSelected = selected === template.id;
          const isFav = favorites.has(template.id);

          return (
            <div
              key={template.id}
              onClick={() => setSelected(isSelected ? null : template.id)}
              className={`glass rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group ${
                isSelected
                  ? 'ring-2 ring-[#00af51] scale-[1.02]'
                  : 'hover:border-white/15 hover:scale-[1.01]'
              }`}
            >
              {/* Preview image */}
              <div className="relative aspect-[1080/1350] bg-white/3 overflow-hidden">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Star button */}
                <button
                  onClick={e => { e.stopPropagation(); toggleFav(template.id); }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                    isFav
                      ? 'bg-[#f4ee19]/90 text-black'
                      : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <span className="text-xs">{isFav ? '★' : '☆'}</span>
                </button>

                {/* Number badge */}
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white/70 font-mono text-[9px] px-1.5 py-0.5 rounded">
                  #{template.id}
                </span>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p
                  className="text-[12px] font-semibold text-white/80 mb-1"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  {template.name}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 border border-white/6"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      {selectedTemplate && (
        <div className="mt-4 glass rounded-xl p-4 animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="relative w-32 shrink-0 aspect-[1080/1350] rounded-lg overflow-hidden">
              <Image
                src={selectedTemplate.image}
                alt={selectedTemplate.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-sm font-bold text-white/90"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  #{selectedTemplate.id} — {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => toggleFav(selectedTemplate.id)}
                  className="text-xs"
                >
                  {favorites.has(selectedTemplate.id) ? (
                    <span className="text-[#f4ee19]">★</span>
                  ) : (
                    <span className="text-white/30">☆</span>
                  )}
                </button>
              </div>
              <p className="font-mono text-[11px] text-white/50 leading-relaxed mb-3">
                {selectedTemplate.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedTemplate.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-[#00af51]/30 text-[#00af51] bg-[#00af51]/8"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: '#00af51', color: '#000' }}
                >
                  Use as Default
                </span>
                <span className="font-mono text-[10px] px-3 py-1.5 rounded-lg border border-white/15 text-white/50 hover:text-white/70 cursor-pointer transition-colors">
                  Preview Full Set
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites summary */}
      {favorites.size > 0 && (
        <div className="mt-4 glass rounded-xl p-3 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-[#f4ee19]/60"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Starred Templates
            </span>
            <span className="font-mono text-[10px] text-white/25">{favorites.size} selected</span>
          </div>
          <div className="flex gap-2">
            {TEMPLATES.filter(t => favorites.has(t.id)).map(t => (
              <div key={t.id} className="relative w-16 aspect-[1080/1350] rounded-lg overflow-hidden border border-[#f4ee19]/30">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-center font-mono text-[7px] text-white/60 py-0.5">
                  #{t.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
