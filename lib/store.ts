'use client';
import { AppState, Project, Task, Idea, DailyPriority, SessionLog } from './types';
import { SEED_TASKS } from './tasks-data';
import { SEED_IDEAS } from './ideas-data';

const KEY = 'ryp_cc_state';
const SEED_VERSION = 10; // bump to re-seed projects + tasks + ideas

const DEFAULT_PROJECTS: Project[] = [
  // ── DIGITAL PRODUCTS ─────────────────────────────────────────────────
  {
    id: 'known',
    name: 'Known',
    status: 'on-track',
    nextAction: 'Deploy manager dashboard to production',
    dueDate: '2026-04-30',
    description: 'Member recognition training app for country clubs',
    localPath: '~/Desktop/RYP-Projects/known-website',
    longDescription: 'Known is a digital platform that helps golf professionals recognize and greet every member by name. Multi-club architecture with Supabase backend, manager dashboards, and quiz-based learning system. Currently deployed at Interlachen with 17 spec items complete.',
    color: '#00af51',
    emoji: '⛳',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'interlachen',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Max',
    stack: ['Next.js 14', 'Supabase', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: 'Live App', href: 'https://known.golf', type: 'deploy' },
      { label: 'GitHub', href: 'https://github.com/lukeryp/interlachen-quiz', type: 'repo' },
    ],
    phases: [
      { id: 'k-p1', name: 'Core App', description: 'Auth, quiz, member data, dashboard', status: 'complete', items: ['Authentication flow', 'Quiz engine', 'Member database', 'Player dashboard'] },
      { id: 'k-p2', name: 'Multi-Club', description: 'Club isolation, manager roles, onboarding', status: 'on-track', items: ['Club tenant isolation', 'Manager dashboard', 'Bulk member import', 'Club onboarding flow'] },
      { id: 'k-p3', name: 'Security Hardening', description: 'RLS policies, rate limiting, audit logs', status: 'on-track', items: ['Row-level security on all tables', 'API rate limiting', 'Audit logging', 'Penetration testing'] },
    ],
    keyMetrics: [
      { label: 'Spec Items', value: '17/17' },
      { label: 'Active Club', value: 'Interlachen' },
      { label: 'Phase', value: 'Multi-Club + Security' },
    ],
  },
  {
    id: 'ryp-red',
    name: 'RYP Red',
    status: 'on-track',
    nextAction: 'Phase 1: Card scan → SSL/ESL → dashboard loop',
    dueDate: '2026-05-15',
    description: 'Golf analytics platform — prospective aim capture + strategy-execution decomposition',
    localPath: '~/Desktop/RYP-Projects/ryp-red',
    longDescription: 'RYP Red is the only golf analytics platform that captures a player\'s intended aim point BEFORE the shot, then decomposes the outcome into Course IQ (decision quality) and Strike Score (execution quality). Protected by 32 patent claims. Long-term competitor to 18 Birdies and DECADE.',
    color: '#ef4444',
    emoji: '🔴',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Max',
    stack: ['Next.js 14', 'Supabase', 'TypeScript', 'Tailwind', 'Claude API', 'Vercel'],
    links: [
      { label: 'Live App', href: 'https://ryp-red.vercel.app', type: 'deploy' },
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-red', type: 'repo' },
      { label: 'Build Plan', href: '/projects/ryp-red', type: 'spec' },
      { label: 'Patent (32 claims)', href: '#', type: 'doc' },
    ],
    phases: [
      { id: 'r-p1', name: 'Phase 1: Core Loop', description: 'Scan card → extraction → SSL/ESL → dashboard', status: 'on-track', items: ['Supabase project setup', 'Vercel deploy', 'Physical scorecard design', 'End-to-end scan loop', 'Onboarding flow', 'Consumer vocabulary UI', 'Coach invite flow', 'First 5 Interlachen players'] },
      { id: 'r-p2', name: 'Phase 2: Coach Experience', description: 'Coach dashboard, player comparison, session notes', status: 'pending', items: ['Coach dashboard', 'Player comparison', 'Session notes', 'Practice prescriptions', 'Push notifications', 'Email digests'] },
      { id: 'r-p3', name: 'Phase 3: Peer Intelligence', description: 'Anonymized peer stats, percentiles, benchmarks', status: 'pending', items: ['Peer stats pipeline', 'Course IQ percentile', 'Benchmark cards', 'Trend analysis', 'Goal setting'] },
      { id: 'r-p4', name: 'Phase 4: Multi-Club', description: 'Other clubs onboard, billing, data export', status: 'pending', items: ['Club onboarding', 'Stripe billing', 'Club analytics', 'API', 'Data export', 'Marketing site'] },
      { id: 'r-p5', name: 'Phase 5: Mobile App', description: 'Native iOS/Android with camera scan', status: 'pending', items: ['React Native app', 'Camera scan', 'On-course mode', 'Offline support'] },
      { id: 'r-p6', name: 'Phase 6: Intelligence', description: 'AI caddie, pattern detection, course-specific strategy', status: 'pending', items: ['AI caddie', 'Pattern detection', 'Course strategy', 'RYPstick integration', 'FORGE integration'] },
    ],
    keyMetrics: [
      { label: 'Patent Claims', value: '32' },
      { label: 'Test Cards Scanned', value: '5' },
      { label: 'Phase', value: '1 — Core Loop' },
    ],
  },
  {
    id: 'certification',
    name: 'Certification',
    status: 'on-track',
    nextAction: 'Beta test with 7 Interlachen pros',
    dueDate: '2026-05-30',
    description: 'L1 instructor certification — 17 chapters, quiz engine, CoachNow diagnosis',
    localPath: '~/Desktop/RYP-Projects/ryp-certification',
    longDescription: 'RYP Golf L1 Instructor Certification program. 17 chapters covering the full FORGE methodology, quiz engine with pass/fail tracking, cohort progress dashboard, and CoachNow swing diagnosis integration. Beta testing with 7 Interlachen professionals.',
    color: '#f97316',
    emoji: '🏅',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Max',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-certification', type: 'repo' },
    ],
    phases: [
      { id: 'c-p1', name: 'Content', description: '17 chapters written and reviewed', status: 'on-track', items: ['Chapter content complete', 'Quiz questions per chapter', 'Video embeds', 'Progress tracking'] },
      { id: 'c-p2', name: 'Beta', description: '7 Interlachen pros testing', status: 'on-track', items: ['Beta cohort enrolled', 'Feedback collection', 'Bug fixes', 'Content refinement'] },
      { id: 'c-p3', name: 'Launch', description: 'Public launch with pricing', status: 'pending', items: ['Pricing model', 'Payment integration', 'Marketing page', 'Instructor NDAs'] },
    ],
    keyMetrics: [
      { label: 'Chapters', value: '17' },
      { label: 'Beta Testers', value: '7' },
      { label: 'Phase', value: 'Beta' },
    ],
  },
  {
    id: 'command-center',
    name: 'Command Center',
    status: 'on-track',
    nextAction: 'Deepen project pages with expand/collapse flows',
    dueDate: '2026-04-30',
    description: 'Master brain PWA — projects, tasks, team, IP, content, sourcing',
    localPath: '~/Desktop/RYP-Projects/command-center',
    longDescription: 'The Command Center is Luke\'s operational headquarters. PWA with daily sessions, project tracker, team tasks, meeting debriefs, idea capture, IP portfolio, sourcing pipeline, and content management. Runs as an installable app on phone.',
    color: '#8b5cf6',
    emoji: '🧠',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind', 'PWA', 'localStorage'],
    links: [
      { label: 'Live App', href: 'https://command-center-nine-kappa.vercel.app', type: 'deploy' },
      { label: 'GitHub', href: 'https://github.com/lukeryp/command-center', type: 'repo' },
    ],
    phases: [
      { id: 'cc-p1', name: 'Core Modules', description: 'Projects, tasks, team, ideas, session logs', status: 'complete', items: ['Project tracker', 'Task management', 'Team page', 'Ideas capture', 'Session logs'] },
      { id: 'cc-p2', name: 'Specialist Modules', description: 'IP, sourcing, content machine', status: 'on-track', items: ['IP portfolio tracker', 'Sourcing pipeline', 'Content dashboard', 'Template gallery', 'Carousel archive'] },
      { id: 'cc-p3', name: 'Deep Pages', description: 'Expand/collapse project detail, category nav', status: 'on-track', items: ['Category-based navigation', 'Expandable project detail', 'Phase tracking per project', 'Links and metrics per project'] },
    ],
    keyMetrics: [
      { label: 'Modules', value: '8' },
      { label: 'Status', value: 'PWA Installed' },
    ],
  },

  // ── PHYSICAL PRODUCTS ────────────────────────────────────────────────
  {
    id: 'forge',
    name: 'FORGE',
    status: 'on-track',
    nextAction: 'Film 6 YouTube series drills',
    dueDate: '2026-05-15',
    description: 'Proprietary drill framework, assessment protocols, training equipment line',
    longDescription: 'FORGE is the proprietary training system powering all RYP instruction. Includes physical training aids (Hammer Schleis, lag strips, big ball, hockey helmet), assessment protocols, and a progressive curriculum. Multiple patent applications covering the methodology.',
    color: '#f4ee19',
    emoji: '🔥',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'physical-products',
    owner: 'Luke',
    stack: ['Training Aids', 'Assessment Protocols', 'Video Curriculum'],
    links: [
      { label: 'Patent — Hammer Schleis', href: '#', type: 'doc' },
      { label: 'Patent — Lag Strip', href: '#', type: 'doc' },
      { label: 'Patent — Aim/Laser', href: '#', type: 'doc' },
    ],
    phases: [
      { id: 'f-p1', name: 'Training Aids', description: 'Physical products — patents filed', status: 'on-track', items: ['Hammer Schleis (patent draft-complete)', 'Lag Strip (patent draft-complete)', 'Big Ball (patent draft)', 'Hockey Helmet (patent draft)', 'Ground Force Belt (patent draft)'] },
      { id: 'f-p2', name: 'Curriculum', description: 'Video series and assessment protocols', status: 'on-track', items: ['6 YouTube series filming', 'Assessment protocol documentation', 'Drill progression system'] },
      { id: 'f-p3', name: 'Manufacturing', description: 'Production and distribution', status: 'pending', items: ['Supplier relationships', 'Production runs', 'Shopify integration', 'Fulfillment'] },
    ],
    keyMetrics: [
      { label: 'Patents Filed', value: '5' },
      { label: 'Training Aids', value: '5' },
      { label: 'Phase', value: 'Patents + Filming' },
    ],
  },
  {
    id: 'rypstick',
    name: 'Rypstick',
    status: 'on-track',
    nextAction: 'Review rotatable shaft patent draft',
    dueDate: '2026-06-01',
    description: 'Speed training device with patented rotatable shaft system',
    longDescription: 'The Rypstick is a golf speed training device with a patented adjustable hosel/shaft system. Active Shopify store (Swing Speed Golf Lab). Rotatable shaft patent in draft-complete status.',
    color: '#22d3ee',
    emoji: '⚡',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'physical-products',
    owner: 'Luke',
    links: [
      { label: 'Shopify Store', href: '#', type: 'external' },
      { label: 'Patent — Rotatable Shaft', href: '#', type: 'doc' },
    ],
    phases: [
      { id: 'rs-p1', name: 'Product', description: 'Device design and manufacturing', status: 'on-track', items: ['Rotatable shaft patent (draft-complete)', 'Current product sales', 'Manufacturing relationship'] },
      { id: 'rs-p2', name: 'Integration', description: 'Connect with RYP Red for speed data', status: 'pending', items: ['Speed data API', 'RYP Red dispersion model feed', 'Player dashboard integration'] },
    ],
    keyMetrics: [
      { label: 'Patent', value: 'Draft Complete' },
      { label: 'Store', value: 'Active' },
    ],
  },
  {
    id: 'preformed-grip',
    name: 'Preformed Grip',
    status: 'needs-attention',
    nextAction: 'Verify supplier identity before re-engaging',
    dueDate: '2026-06-15',
    description: 'Proprietary grip molding — custom geometry for hand placement',
    longDescription: 'Custom preformed golf grip with RYP logo embossing. Supplier: Shenzhen Youquan (Alisa Cai). Active NDA in place. Note: supplier account may be compromised — verify identity before re-engaging.',
    color: '#a855f7',
    emoji: '🤚',
    tasks: [],
    notes: 'Supplier account may be compromised. Verify identity.',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'physical-products',
    owner: 'Luke',
    phases: [
      { id: 'pg-p1', name: 'Design', description: 'Grip geometry and specs', status: 'on-track', items: ['Grip mold design', 'Logo embossing specs'] },
      { id: 'pg-p2', name: 'Manufacturing', description: 'Supplier relationship and production', status: 'needs-attention', items: ['Verify supplier identity', 'NDA active', 'Production samples', 'Quality testing'] },
    ],
    keyMetrics: [
      { label: 'NDA', value: 'Active' },
      { label: 'Status', value: 'Supplier Verification' },
    ],
  },

  // ── MARKETING ────────────────────────────────────────────────────────
  {
    id: 'textbook',
    name: 'The Golf Textbook',
    status: 'needs-attention',
    nextAction: 'Masters Week launch prep (April 6)',
    dueDate: '2026-04-06',
    description: 'The definitive golf instruction textbook — Masters Week launch',
    longDescription: 'The Golf Textbook is the flagship publication for RYP Golf. Data-driven instruction manual covering the full spectrum of golf performance. Landing page needed, launch sequence planned for Masters Week (April 6, 2026).',
    color: '#6366f1',
    emoji: '📖',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'marketing',
    owner: 'Luke',
    phases: [
      { id: 't-p1', name: 'Manuscript', description: 'Content complete and formatted', status: 'on-track', items: ['All chapters written', 'No Fiction Policy verified', 'Consistency pass', 'PDF production'] },
      { id: 't-p2', name: 'Launch', description: 'Masters Week launch campaign', status: 'needs-attention', items: ['Landing page', 'Email sequence', 'Social media campaign', 'Launch day posts'] },
      { id: 't-p3', name: 'Distribution', description: 'Sales channels and fulfillment', status: 'pending', items: ['Amazon/KDP', 'Direct sales', 'Kindle/EPUB edition', 'Bulk orders for clubs'] },
    ],
    keyMetrics: [
      { label: 'Launch', value: 'Apr 6 (Masters)' },
      { label: 'Format', value: 'Print + Kindle' },
    ],
  },
  {
    id: 'content-machine',
    name: 'Content Machine',
    status: 'on-track',
    nextAction: 'Spec and build video→cascade automation pipeline',
    dueDate: '2026-04-30',
    description: 'Automated video→transcribe→cascade pipeline for all platforms',
    longDescription: 'The Content Machine automates the full content pipeline: shoot one video → transcribe → detect golf positions (P1-P8) → match clips → generate shot list → cascade to Instagram, YouTube, LinkedIn, email, Twitter, blog. Teddy executes from generated briefs.',
    color: '#10b981',
    emoji: '🎬',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'marketing',
    owner: 'Luke',
    developer: 'Claude',
    stack: ['Whisper API', 'Claude API', 'Python', 'Command Center'],
    phases: [
      { id: 'cm-p1', name: 'UI Shell', description: 'Command Center content dashboard', status: 'complete', items: ['Video intake page', 'Cascade queue', 'Content calendar', 'Recent pieces list', 'Template gallery'] },
      { id: 'cm-p2', name: 'Automation', description: 'End-to-end pipeline wiring', status: 'on-track', items: ['Transcription integration', 'Position detection (P1-P8)', 'Clip matching logic', 'Platform formatters', 'Brief generation for Teddy'] },
      { id: 'cm-p3', name: 'Series Templates', description: 'Recurring content series', status: 'pending', items: ['Tour Average series', 'The Zone Files', 'The Clinic', 'The Genome Dispatch', 'The Builders', 'Deep Science'] },
    ],
    keyMetrics: [
      { label: 'UI', value: 'Built' },
      { label: 'Automation', value: 'Spec Phase' },
      { label: 'Series', value: '6 planned' },
    ],
  },
  {
    id: 'social-media',
    name: 'Social Media',
    status: 'on-track',
    nextAction: 'Caleb carousel ready for Teddy — build posting cadence',
    dueDate: '2026-04-15',
    description: 'Instagram, YouTube, LinkedIn, email — brand voice and posting cadence',
    longDescription: 'Social media presence across all platforms. Instagram carousel templates established (Template #1 chosen as default). Teddy creates content from briefs. 45-day sprint active. Swing Study split-screen format defined.',
    color: '#f472b6',
    emoji: '📱',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'marketing',
    owner: 'Luke',
    phases: [
      { id: 'sm-p1', name: 'Brand Kit', description: 'Templates, voice, visual identity', status: 'complete', items: ['Carousel Template #1 (chosen default)', '10 template experiments archived', 'Brand colors + fonts established', 'Headshot crop dialed'] },
      { id: 'sm-p2', name: 'Content Pipeline', description: 'Regular posting cadence', status: 'on-track', items: ['Caleb VanArragon carousel (ready for Teddy)', 'Instagram posting cadence', 'YouTube descriptions', 'LinkedIn articles', 'Email newsletter'] },
      { id: 'sm-p3', name: 'Series Launch', description: '6 recurring content series', status: 'pending', items: ['Tour Average', 'The Zone Files', 'The Clinic', 'The Genome Dispatch', 'The Builders', 'Deep Science'] },
    ],
    keyMetrics: [
      { label: 'Template', value: '#1 (Light)' },
      { label: 'Carousels Ready', value: '2' },
      { label: 'Sprint', value: '45-day active' },
    ],
  },

  // ── OPERATIONS ───────────────────────────────────────────────────────
  {
    id: 'foundation',
    name: 'RYP Foundation',
    status: 'needs-attention',
    nextAction: 'Set up 501(c)(3) application',
    dueDate: '2026-07-01',
    description: 'Youth golf nonprofit — Builders Challenge, simulator programs',
    longDescription: 'RYP Golf Foundation nonprofit. Builders Challenge program with Solomon Hughes, May 1 2026 start. Golf simulators in schools. Foresight partnership. Phase 1/2/3 youth programs. Contact: Jaycee Rhodes.',
    color: '#ec4899',
    emoji: '🤝',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'operations',
    owner: 'Luke',
    phases: [
      { id: 'fn-p1', name: '501(c)(3)', description: 'Legal formation', status: 'needs-attention', items: ['501(c)(3) application', 'Board formation', 'Bylaws', 'EIN'] },
      { id: 'fn-p2', name: 'Builders Challenge', description: 'Youth program with Solomon Hughes', status: 'on-track', items: ['Program design', 'May 1 start date', 'Contact: Jaycee Rhodes', 'Foresight sim partnership'] },
      { id: 'fn-p3', name: 'School Programs', description: 'Simulators in schools', status: 'pending', items: ['School partnerships', 'Curriculum development', 'Equipment sourcing', 'Pilot program'] },
    ],
    keyMetrics: [
      { label: 'Launch', value: 'May 1 (Builders)' },
      { label: '501(c)(3)', value: 'Pending' },
    ],
  },
  {
    id: 'chip',
    name: 'CHIP',
    status: 'on-track',
    nextAction: 'Finalize Q2 marketing plan',
    dueDate: '2026-04-15',
    description: 'Golf fitness & coaching program — Interlachen member engagement',
    longDescription: 'CHIP (Coaching & High-performance Interlachen Program) is RYP\'s on-site golf fitness and instruction program at Interlachen Country Club. Covers fitness screening, strength/mobility, player development, lesson packages, and member engagement. Q2 programming underway.',
    color: '#0ea5e9',
    emoji: '🎯',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'interlachen',
    category: 'operations',
    owner: 'Luke',
    phases: [
      { id: 'ch-p1', name: 'Q2 Plan', description: 'Marketing and programming', status: 'on-track', items: ['Q2 marketing plan', 'Lesson packages', 'Member events', 'Junior programs'] },
    ],
    keyMetrics: [
      { label: 'Club', value: 'Interlachen' },
      { label: 'Phase', value: 'Q2 Planning' },
    ],
  },
  {
    id: 'pgalesson',
    name: 'pgalesson.com',
    status: 'paused',
    nextAction: 'Define strategy for RYP ecosystem fit',
    description: 'High-value domain — certification, SEO, or booking portal',
    longDescription: 'pgalesson.com is a premium domain Luke owns. Needs strategic positioning within the RYP ecosystem — could serve as certification portal, SEO funnel, or lesson booking system.',
    color: '#64748b',
    emoji: '🌐',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'operations',
    owner: 'Luke',
    keyMetrics: [
      { label: 'Domain', value: 'pgalesson.com' },
      { label: 'Status', value: 'Strategy Needed' },
    ],
  },
  // ── INFRASTRUCTURE ───────────────────────────────────────────────────
  {
    id: 'ryp-hub',
    name: 'RYP Hub',
    status: 'built',
    nextAction: 'Define purpose and deploy',
    description: 'Central RYP hub — content, products, and ecosystem entry point',
    longDescription: 'RYP Hub is the central entry point for the RYP Golf digital ecosystem. Aggregates content, products, and tools across all RYP properties. Not yet deployed.',
    color: '#00af51',
    emoji: '🌐',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'infrastructure',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/ryp-hub',
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-hub', type: 'repo' },
    ],
    keyMetrics: [
      { label: 'Status', value: 'Built — not deployed' },
      { label: 'Location', value: '~/Desktop/ryp-hub' },
    ],
  },
  {
    id: 'ryp-ui',
    name: '@ryp/ui',
    status: 'complete',
    nextAction: 'Use in all new RYP apps',
    description: 'Shared component library — used across all RYP products',
    longDescription: 'The @ryp/ui shared component library contains all reusable UI primitives: buttons, inputs, cards, modals, status badges, typography, and brand tokens. Built on Tailwind with Raleway + Work Sans fonts and RYP brand colors (#00af51, #f4ee19, #000). Starting point for every new RYP app.',
    color: '#00af51',
    emoji: '🧩',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    localPath: '~/Desktop/RYP-Projects/ryp-ui',
    owner: 'Luke',
    developer: 'Claude',
    stack: ['React', 'TypeScript', 'Tailwind'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-ui', type: 'repo' },
    ],
    keyMetrics: [
      { label: 'Status', value: 'Complete' },
      { label: 'Used By', value: 'All RYP apps' },
    ],
  },
  {
    id: 'ryp-supabase',
    name: 'Shared Supabase',
    status: 'on-track',
    nextAction: 'Keep migrations and seed data in sync across all apps',
    description: 'Shared Supabase project — migrations, seed data, and types for the RYP ecosystem',
    longDescription: 'ryp-supabase is the source of truth for all shared database migrations, seed data, and generated TypeScript types. Manages RLS policies, multi-club isolation patterns, and the shared schema used by Known, RYP Red, Certification, and Kudo.',
    color: '#3ecf8e',
    emoji: '🗄️',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    localPath: '~/Desktop/RYP-Projects/ryp-supabase',
    owner: 'Luke',
    stack: ['Supabase', 'PostgreSQL', 'TypeScript'],
    links: [
      { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard', type: 'external' },
    ],
    keyMetrics: [
      { label: 'Products Connected', value: '4' },
      { label: 'RLS', value: 'Active' },
    ],
  },

  // ── ADDITIONAL DIGITAL PRODUCTS ──────────────────────────────────────
  {
    id: 'practice-dna',
    name: 'Practice DNA',
    status: 'on-track',
    nextAction: 'Drive traffic — link from rypgolf.com and social',
    description: 'Interactive quiz identifying a golfer\'s practice style and DNA',
    longDescription: 'Practice DNA is an interactive assessment that identifies how a golfer learns and practices best. Generates a personalized practice DNA profile. Live at practice-dna.vercel.app. Top-of-funnel lead gen for the RYP ecosystem.',
    color: '#f97316',
    emoji: '🧬',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/practice-dna',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: 'Live App', href: 'https://practice-dna.vercel.app', type: 'deploy' },
      { label: 'GitHub', href: 'https://github.com/lukeryp/practice-dna', type: 'repo' },
    ],
    keyMetrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Purpose', value: 'Lead Gen / Top of Funnel' },
    ],
  },
  {
    id: 'kudo',
    name: 'Kudo',
    status: 'needs-attention',
    nextAction: 'Create Supabase project to go live',
    description: 'Testimonial pipeline app — recognition and feedback collection',
    longDescription: 'Kudo is a testimonial and recognition pipeline app for RYP Golf. Scaffold complete at ~/Desktop/RYP-Projects/kudo/. Needs Supabase project created to go live. Collects player/member feedback and generates shareable testimonial cards.',
    color: '#fbbf24',
    emoji: '⭐',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/kudo',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://kudo-gamma.vercel.app',
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/kudo', type: 'repo' },
      { label: 'Live App', href: 'https://kudo-gamma.vercel.app', type: 'live' },
    ],
    phases: [
      { id: 'kudo-p1', name: 'Scaffold', description: 'App structure and UI', status: 'complete', items: ['Next.js scaffold', 'UI components', 'Testimonial form', 'Card generator'] },
      { id: 'kudo-p2', name: 'Backend', description: 'Supabase project + live deploy', status: 'needs-attention', items: ['Create Supabase project', 'Schema migration', 'Auth setup', 'Deploy to Vercel'] },
    ],
    keyMetrics: [
      { label: 'Scaffold', value: 'Complete' },
      { label: 'Supabase', value: 'Not Yet Created' },
    ],
  },
  {
    id: 'forge-app',
    name: 'FORGE App',
    status: 'on-track',
    nextAction: 'Wire drill scoring to Supabase backend',
    dueDate: '2026-05-15',
    description: 'FORGE practice scoring app — digital companion to the drill system',
    longDescription: 'Digital companion to the FORGE training methodology. Coaches and players log practice sessions, score drills, and track progression. Data connects to the RYP Red analytics pipeline. Built as a standalone app in the RYP monorepo.',
    color: '#f4ee19',
    emoji: '🔥',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/ryp-red',
    stack: ['Node.js', 'HTML/CSS', 'Supabase'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-red', type: 'repo' },
    ],
    phases: [
      { id: 'fa-p1', name: 'Scaffold', description: 'App shell + drill scoring UI', status: 'complete', items: ['App scaffold', 'Drill scoring screens', 'Session log UI', 'Progress dashboard'] },
      { id: 'fa-p2', name: 'Backend', description: 'Supabase integration + persistence', status: 'on-track', items: ['Supabase schema', 'Session persistence', 'Player accounts', 'Score history'] },
      { id: 'fa-p3', name: 'RYP Red Integration', description: 'Feed practice data into analytics', status: 'pending', items: ['Data pipeline to RYP Red', 'Practice-to-performance correlation', 'Coach access'] },
    ],
    keyMetrics: [
      { label: 'Status', value: 'Built — needs backend' },
      { label: 'Location', value: 'monorepo/apps/forge-app' },
    ],
  },
  {
    id: 'chip-fitness',
    name: 'CHIP Fitness App',
    status: 'on-track',
    nextAction: 'Onboard first Interlachen members to the fitness tracker',
    dueDate: '2026-05-01',
    description: 'Golf fitness tracker — strength, mobility, and performance benchmarks',
    longDescription: 'CHIP Fitness is a mobile-first Next.js app for golf-specific fitness tracking. Members log strength exercises, mobility scores, and performance benchmarks. Built with full RYP brand identity (Green/Yellow/Black, Raleway). Deployed at chip.rypgolf.com.',
    color: '#0ea5e9',
    emoji: '💪',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'interlachen',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/chip',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/chip', type: 'repo' },
    ],
    phases: [
      { id: 'cf-p1', name: 'Core App', description: 'Auth, workout tracking, progress dashboard', status: 'complete', items: ['Auth flow (Supabase)', 'Workout logging', 'Mobility scoring', 'Progress dashboard'] },
      { id: 'cf-p2', name: 'Club Rollout', description: 'Interlachen member onboarding', status: 'on-track', items: ['Member accounts', 'Coach access', 'Progress reports', 'Program assignments'] },
    ],
    keyMetrics: [
      { label: 'Live URL', value: 'chip.rypgolf.com' },
      { label: 'Status', value: 'Deployed' },
    ],
  },

  // ── DIGITAL PRODUCTS (continued) ─────────────────────────────────────
  {
    id: 'player-dashboard',
    name: 'Player Dashboard',
    status: 'on-track',
    nextAction: 'Wire to live RYP Red data and deploy',
    dueDate: '2026-06-01',
    description: 'Unified performance view — Course IQ, Strike Score, practice trends',
    longDescription: 'The RYP Player Dashboard is the unified performance hub for a player\'s entire RYP ecosystem data: Course IQ from RYP Red, drill progression from FORGE, speed metrics from Rypstick, and practice DNA. Single view of the full player.',
    color: '#818cf8',
    emoji: '📊',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
    context: 'ryp',
    category: 'digital-products',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/player-dashboard',
    stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: 'GitHub', href: 'https://github.com/lukeryp/ryp-player-dashboard', type: 'repo' },
    ],
    phases: [
      { id: 'pd2-p1', name: 'Core View', description: 'Unified stats from all RYP products', status: 'on-track', items: ['RYP Red data integration', 'Course IQ + Strike Score display', 'Practice trend charts', 'Session history'] },
      { id: 'pd2-p2', name: 'Live Data', description: 'Wire to production Supabase', status: 'pending', items: ['Supabase integration', 'Auth + player profiles', 'Coach access', 'Share links'] },
    ],
    keyMetrics: [
      { label: 'Live', value: 'ryp-player-dashboard.vercel.app' },
      { label: 'Phase', value: 'Core View' },
    ],
  },

  // ── INTERLACHEN ──────────────────────────────────────────────────────
  {
    id: 'icc-junior-league',
    name: 'Junior League Applications',
    status: 'on-track',
    nextAction: 'Review 2026 applications via manager dashboard',
    dueDate: '2026-06-01',
    description: 'Junior League Applications 2026 — Manager Dashboard',
    longDescription: 'Web app for managing Interlachen Country Club junior league applications for the 2026 season. Manager dashboard at /manager (PIN protected). Players and parents submit applications online; managers review, approve, and manage rosters.',
    color: '#00af51',
    emoji: '🏌️',
    tasks: [],
    notes: 'PIN: 1909',
    updatedAt: new Date().toISOString(),
    context: 'interlachen',
    category: 'interlachen',
    owner: 'Luke',
    developer: 'Claude',
    localPath: '~/Desktop/RYP-Projects/icc-junior-league-apply',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      { label: 'Manager Dashboard', href: 'https://icc-junior-league-apply.vercel.app/manager', type: 'deploy' },
      { label: 'Apply Form', href: 'https://icc-junior-league-apply.vercel.app', type: 'external' },
      { label: 'GitHub', href: 'https://github.com/lukeryp/icc-junior-league-apply', type: 'repo' },
    ],
    keyMetrics: [
      { label: 'PIN', value: '1909' },
      { label: 'Season', value: '2026' },
      { label: 'Club', value: 'Interlachen' },
    ],
  },

];

function load(): AppState & { seedVersion?: number } {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState & { seedVersion?: number };
    // Merge new default projects
    const existingIds = new Set(parsed.projects.map(p => p.id));
    DEFAULT_PROJECTS.forEach(dp => {
      if (!existingIds.has(dp.id)) parsed.projects.push(dp);
      else {
        // Backfill fields on existing projects
        const idx = parsed.projects.findIndex(p => p.id === dp.id);
        if (idx >= 0) {
          if (!parsed.projects[idx].context) parsed.projects[idx].context = dp.context;
          if (!parsed.projects[idx].localPath && dp.localPath) parsed.projects[idx].localPath = dp.localPath;
          if (dp.category) parsed.projects[idx].category = dp.category;
        }
      }
    });
    // Seed tasks + ideas + sync project data if not yet at current version
    if ((parsed.seedVersion ?? 0) < SEED_VERSION) {
      // Sync project links, localPath, stack, and description from defaults
      DEFAULT_PROJECTS.forEach(dp => {
        const idx = parsed.projects.findIndex(p => p.id === dp.id);
        if (idx >= 0) {
          if (dp.links) parsed.projects[idx].links = dp.links;
          if (dp.localPath) parsed.projects[idx].localPath = dp.localPath;
          if (dp.stack) parsed.projects[idx].stack = dp.stack;
        }
      });
      const existingTaskIds = new Set(parsed.tasks.map(t => t.id));
      SEED_TASKS.forEach(st => {
        if (!existingTaskIds.has(st.id)) parsed.tasks.push(st);
      });
      const existingIdeaIds = new Set(parsed.ideas.map(i => i.id));
      SEED_IDEAS.forEach(si => {
        if (!existingIdeaIds.has(si.id)) parsed.ideas.push(si);
      });
      (parsed as AppState & { seedVersion: number }).seedVersion = SEED_VERSION;
      localStorage.setItem(KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

function defaultState(): AppState & { seedVersion: number } {
  return {
    projects: DEFAULT_PROJECTS,
    tasks: SEED_TASKS,
    ideas: [...SEED_IDEAS],
    priorities: [],
    sessions: [],
    seedVersion: SEED_VERSION,
  };
}

function save(state: AppState & { seedVersion?: number }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

// ── Projects ────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return load().projects;
}

export function getProject(id: string): Project | undefined {
  return load().projects.find(p => p.id === id);
}

export function saveProject(project: Project) {
  const state = load();
  const idx = state.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) state.projects[idx] = { ...project, updatedAt: new Date().toISOString() };
  else state.projects.push({ ...project, updatedAt: new Date().toISOString() });
  save(state);
}

// ── Tasks ────────────────────────────────────────────────────────────────────

export function getTasks(projectId?: string): Task[] {
  const tasks = load().tasks;
  if (projectId) return tasks.filter(t => t.projectId === projectId);
  return tasks;
}

export function getTasksByAssignee(assignee: string): Task[] {
  return load().tasks.filter(t => t.assignee === assignee);
}

export function saveTask(task: Task) {
  const state = load();
  const idx = state.tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) state.tasks[idx] = task;
  else state.tasks.push(task);
  save(state);
}

export function deleteTask(id: string) {
  const state = load();
  state.tasks = state.tasks.filter(t => t.id !== id);
  save(state);
}

export function completeTask(id: string) {
  const state = load();
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.status = 'done';
    task.completedAt = new Date().toISOString();
  }
  save(state);
}

// ── Ideas ─────────────────────────────────────────────────────────────────────

export function getIdeas(): Idea[] {
  return load().ideas.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveIdea(idea: Idea) {
  const state = load();
  const idx = state.ideas.findIndex(i => i.id === idea.id);
  if (idx >= 0) state.ideas[idx] = { ...idea, updatedAt: new Date().toISOString() };
  else state.ideas.push({ ...idea, updatedAt: new Date().toISOString() });
  save(state);
}

export function deleteIdea(id: string) {
  const state = load();
  state.ideas = state.ideas.filter(i => i.id !== id);
  save(state);
}

// ── Daily Priorities ──────────────────────────────────────────────────────────

export function getTodayPriorities(): DailyPriority[] {
  const today = new Date().toISOString().slice(0, 10);
  return load().priorities.filter(p => p.date === today).sort((a, b) => a.order - b.order);
}

export function savePriority(priority: DailyPriority) {
  const state = load();
  const idx = state.priorities.findIndex(p => p.id === priority.id);
  if (idx >= 0) state.priorities[idx] = priority;
  else state.priorities.push(priority);
  save(state);
}

export function deletePriority(id: string) {
  const state = load();
  state.priorities = state.priorities.filter(p => p.id !== id);
  save(state);
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export function getSessions(): SessionLog[] {
  return load().sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveSession(session: SessionLog) {
  const state = load();
  const idx = state.sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) state.sessions[idx] = session;
  else state.sessions.push(session);
  save(state);
}

// ── Utils ─────────────────────────────────────────────────────────────────────

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
