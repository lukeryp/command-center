export type IPStatus = 'draft' | 'draft-complete' | 'filed' | 'pending' | 'granted' | 'active' | 'registered' | 'concept';
export type IPCategory = 'patent' | 'trademark' | 'trade-secret' | 'nda' | 'document' | 'idea';
export type IPPriority = 'high' | 'medium' | 'low';

export interface IPItem {
  id: string;
  name: string;
  category: IPCategory;
  status: IPStatus;
  priority: IPPriority;
  description: string;
  attorney?: string;
  docUrl?: string;
  docTab?: string;
  dateModified?: string;
  notes?: string;
  formalTitle?: string;
  relatedProject?: { name: string; href: string };
}

const MASTER_DOC = 'https://docs.google.com/document/d/1Z1VzFiuFLEuNfMqW_sw7OxIaBwatS0zkm1uaubHe_Ns/edit';

export const IP_ITEMS: IPItem[] = [
  // ── PATENTS ───────────────────────────────────────────────────────────────
  {
    id: 'hammer-schleis',
    name: 'Hammer Schleis',
    category: 'patent',
    status: 'draft-complete',
    priority: 'high',
    description: 'Utility patent application — 3 parts, 35 pages. Includes Strategic Mandate & Letter of Instruction for Patent Counsel and "Project Rosetta Stone — Live Validation" study protocol.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: '03_Hammer Schleis',
    dateModified: 'Oct 8, 2025',
    formalTitle: 'Utility Patent Application — Hammer Schleis Training System',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },
  {
    id: 'rotatable-shaft',
    name: 'Rotatable Shaft',
    category: 'patent',
    status: 'draft-complete',
    priority: 'high',
    description: 'Utility patent application — Final Fortified Draft, 3 parts. Adjustable hosel/shaft system for custom club fitting.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: '04_ Rotatable Shaft',
    dateModified: 'Oct 8, 2025',
    formalTitle: 'Utility Patent Application (Final Fortified Draft) — Rotatable Shaft',
    relatedProject: { name: 'Rypstick', href: '/projects' },
  },
  {
    id: 'lag-strip-patent',
    name: 'Lag Strip / Proportional Difficulty',
    category: 'patent',
    status: 'draft-complete',
    priority: 'high',
    description: 'Patent 1 of 3: "System and Method for Proportional Difficulty Athletic Training" — Final Fortified Version. Covers the lag strip training methodology.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: 'Update Lag strip',
    dateModified: 'Oct 8, 2025',
    formalTitle: 'System and Method for Proportional Difficulty Athletic Training',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },
  {
    id: 'aim-laser',
    name: 'Aim / Laser Bias Diagnosis',
    category: 'patent',
    status: 'draft-complete',
    priority: 'high',
    description: 'Patent 2 of 3: "System and Method for Diagnosing Intrinsic Athletic Aiming Bias" — Final Fortified Version. Laser-based aiming diagnosis system.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: 'Updated Aim/laser',
    dateModified: 'Oct 8, 2025',
    formalTitle: 'System and Method for Diagnosing Intrinsic Athletic Aiming Bias',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },
  {
    id: 'ground-force',
    name: 'Ground Force & Hip Speed Training',
    category: 'patent',
    status: 'draft',
    priority: 'medium',
    description: 'Training system patent for ground force measurement and hip speed development. Speed belt integration.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: 'Ground Force and Hip Speed Training',
    dateModified: 'Oct 8, 2025',
    notes: 'Related doc: "Ground force and speed belt patent" (Dec 2024) in Drive Patents/trademarks folder.',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },
  {
    id: 'big-ball',
    name: 'Big Ball',
    category: 'patent',
    status: 'draft',
    priority: 'medium',
    description: 'Training aid patent — oversized ball training methodology for motor learning and skill transfer.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: 'Big Ball',
    dateModified: 'Oct 8, 2025',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },
  {
    id: 'hockey-helmet',
    name: 'Hockey Helmet',
    category: 'patent',
    status: 'draft',
    priority: 'medium',
    description: 'Training aid patent — helmet-based visual constraint training for golf skill development.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    docTab: 'Hockey Helmet',
    dateModified: 'Oct 8, 2025',
    relatedProject: { name: 'FORGE Training System', href: '/projects' },
  },

  {
    id: 'ryp-red-ssl-esl',
    name: 'RYP RED — SSL/ESL Golf Analytics',
    category: 'patent',
    status: 'draft-complete',
    priority: 'high',
    description: '32-claim provisional patent — prospective aim capture, SSL/ESL decomposition, 2-factor dispersion model, AI card scan extraction, temporal integrity. 6 new claims (13A-13F) added April 2026: miss-from-target metric, aim vector pipeline, wind extraction, multi-image stitching, diagnostic reports, confidence-weighted extraction.',
    attorney: 'Sam (Upwork)',
    docUrl: MASTER_DOC,
    dateModified: 'Apr 4, 2026',
    formalTitle: 'System and Method for Prospective Aim Capture and Strategy-Execution Decomposition in Golf Analytics',
    notes: 'Updated DOCX in RYP-Projects: RYP_RED_Patent_Updated_April2026.docx. Source files in Downloads: patent app (.md), developer handoff, prior art search, simulator v2 (.jsx), dashboard prototype (.html). Crown jewel: Claim 13A miss-from-target metric. 18Birdies-proof via Claim 4 temporal integrity.',
    relatedProject: { name: 'RYP Red', href: '/projects' },
  },

  // ── TRADEMARKS ────────────────────────────────────────────────────────────
  {
    id: 'tm-ryp-golf',
    name: 'RYP Golf',
    category: 'trademark',
    status: 'active',
    priority: 'high',
    description: 'Primary brand trademark — covers instruction, training products, and golf technology.',
  },
  {
    id: 'tm-forge',
    name: 'FORGE',
    category: 'trademark',
    status: 'active',
    priority: 'high',
    description: 'Training system brand — covers the proprietary drill framework, assessment methodology, and training equipment line.',
    relatedProject: { name: 'FORGE', href: '/projects' },
  },
  {
    id: 'tm-known',
    name: 'Known',
    category: 'trademark',
    status: 'active',
    priority: 'medium',
    description: 'Member recognition platform — covers the Known.golf digital platform and service model.',
    relatedProject: { name: 'Known platform', href: '/projects' },
  },
  {
    id: 'tm-rypstick',
    name: 'Rypstick',
    category: 'trademark',
    status: 'active',
    priority: 'medium',
    description: 'Golf training product — speed training device. Has active Shopify store (Swing Speed Golf Lab).',
    notes: 'Rypstick Patent.pdf exists in Google Drive (Sep 2025). Has associated patent application.',
    relatedProject: { name: 'Rypstick', href: '/projects' },
  },

  // ── TRADE SECRETS ─────────────────────────────────────────────────────────
  {
    id: 'ts-forge-method',
    name: 'FORGE Methodology',
    category: 'trade-secret',
    status: 'active',
    priority: 'high',
    description: 'Proprietary drill framework, assessment protocols, and training progression system. Core IP for RYP instruction and certification.',
    notes: 'Protected via certification program access controls, instructor NDAs, and platform security.',
    relatedProject: { name: 'FORGE', href: '/projects' },
  },
  {
    id: 'ts-extraction-prompt',
    name: 'Extraction Prompt Protocols',
    category: 'trade-secret',
    status: 'active',
    priority: 'high',
    description: 'Proprietary AI prompt engineering for golf instruction analysis, student assessment, and training prescription generation.',
    notes: 'Never expose to external systems. Protected as confidential trade secret.',
  },

  // ── NDAs ──────────────────────────────────────────────────────────────────
  {
    id: 'nda-preformed-grip',
    name: 'Preformed Grip NDA',
    category: 'nda',
    status: 'active',
    priority: 'high',
    description: 'NDA with Shenzhen Youquan Industry Co., Ltd. (Alisa Cai) — covers preformed golf grip design, RYP logo embossing specs, and manufacturing process.',
    docUrl: 'https://docs.google.com/document/d/1L4UaLj4yhEJjktxy0W2FwoyAXQxM3YeZzYqHZNKPE-8/edit',
    dateModified: 'Oct 9, 2025',
    notes: 'Supplier account may be compromised. Verify identity before re-engaging.',
    relatedProject: { name: 'Sourcing Pipeline', href: '/sourcing' },
  },

  // ── REFERENCE DOCUMENTS ───────────────────────────────────────────────────
  {
    id: 'doc-patents-master',
    name: 'Patents Master Doc',
    category: 'document',
    status: 'active',
    priority: 'medium',
    description: 'Master patents overview document in Drive Patents/trademarks folder.',
    dateModified: 'Oct 21, 2025',
  },
  {
    id: 'doc-luk004',
    name: 'LUK004 Patent v3b',
    category: 'document',
    status: 'active',
    priority: 'medium',
    description: 'Formal patent document (Word format) — version 3b of LUK004 filing.',
    dateModified: 'Feb 15, 2025',
  },
  {
    id: 'doc-rypstick-patent',
    name: 'Rypstick Patent PDF',
    category: 'document',
    status: 'active',
    priority: 'medium',
    description: 'Rypstick training device patent documentation.',
    dateModified: 'Sep 5, 2025',
  },
  {
    id: 'doc-downshift-search',
    name: 'Patent Search — Downshift Board Golf',
    category: 'document',
    status: 'active',
    priority: 'low',
    description: 'Prior art search results for downshift board golf training aid.',
    dateModified: 'Oct 6, 2025',
  },
  {
    id: 'doc-liveview-patents',
    name: 'Live View Sports — Mirror & Training Patents',
    category: 'document',
    status: 'active',
    priority: 'low',
    description: 'Competitive patent research — mirroring and training technology patents held by Live View Sports.',
    dateModified: 'Feb 7, 2026',
  },
  {
    id: 'doc-eisele',
    name: 'Eisele — Ryp Golf 2025',
    category: 'document',
    status: 'active',
    priority: 'medium',
    description: 'Attorney/legal documentation from Eisele relating to RYP Golf IP strategy.',
    dateModified: 'Jan 6, 2025',
  },
  {
    id: 'doc-rnd',
    name: 'Research & Development Overview',
    category: 'document',
    status: 'active',
    priority: 'low',
    description: 'R&D documentation covering product development pipeline and innovation roadmap.',
    dateModified: 'Aug 8, 2025',
  },

  // ── IDEAS ─────────────────────────────────────────────────────────────────
  {
    id: 'idea-preformed-grip',
    name: 'Preformed Grip',
    category: 'idea',
    status: 'concept',
    priority: 'high',
    description: 'Proprietary grip molding design — custom preformed grip geometry for improved hand placement and consistency.',
    notes: 'Related to sourcing relationship with Shenzhen Youquan. Covered under active NDA.',
    relatedProject: { name: 'Sourcing Pipeline', href: '/sourcing' },
  },
  {
    id: 'idea-speed-belt',
    name: 'Speed Belt Integration',
    category: 'idea',
    status: 'concept',
    priority: 'medium',
    description: 'Wearable training belt with embedded force sensors for real-time hip speed measurement and feedback during swing training.',
  },
  {
    id: 'idea-visual-constraint-visor',
    name: 'Visual Constraint Visor',
    category: 'idea',
    status: 'concept',
    priority: 'medium',
    description: 'Alternative to hockey helmet for visual constraint training — lighter form factor with targeted field-of-view restriction.',
  },
  {
    id: 'idea-swing-plane-laser',
    name: 'Swing Plane Laser Array',
    category: 'idea',
    status: 'concept',
    priority: 'low',
    description: 'Multi-laser system that projects the ideal swing plane in real-time, providing immediate visual feedback for plane training.',
  },
];

export const MASTER_PATENT_DOC_URL = MASTER_DOC;
