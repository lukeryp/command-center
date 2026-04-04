export type SourcingStatus =
  | 'active'
  | 'stalled'
  | 'completed'
  | 'nda-stage'
  | 'offer-received'
  | 'quote-received'
  | 'reorder-ready'
  | 'no-order'
  | 'no-engagement';

export type SourcingPriority = 'high' | 'medium' | 'low';
export type SourcingCategory = 'key-strategic' | 'alibaba';

export interface SourcingProject {
  id: string;
  name: string;
  category: SourcingCategory;
  status: SourcingStatus;
  priority: SourcingPriority;
  contact?: string;
  factory?: string;
  product: string;
  pricing?: string;
  lastContact?: string;
  nextSteps?: string;
  notes?: string;
  isAlibaba: boolean;
  ndaDocUrl?: string;
  conversationSummary?: string;
}

export const SOURCING_PROJECTS: SourcingProject[] = [
  // ── KEY STRATEGIC ──────────────────────────────────────────────────────────
  {
    id: 'preformed-grip',
    name: 'Preformed Grip',
    category: 'key-strategic',
    status: 'nda-stage',
    priority: 'high',
    contact: 'Alisa Cai',
    factory: 'Shenzhen Youquan Industry Co.',
    product: 'Custom preformed golf grip',
    lastContact: 'Oct 2025',
    nextSteps: 'Investigate if Alisa\'s account is compromised. Re-establish contact via new channel. Follow up on NDA execution and RYP logo embossing spec.',
    notes: 'Supplier account may be compromised — verify identity before sharing any further IP.',
    isAlibaba: true,
    ndaDocUrl: 'https://docs.google.com/document/d/1L4UaLj4yhEJjktxy0W2FwoyAXQxM3YeZzYqHZNKPE-8/edit',
    conversationSummary: 'Advanced negotiation stage. NDA exchanged in October 2025 — both parties reviewed. Quotation confirmed. RYP logo embossing requested and acknowledged by factory. Conversation stalled after suspected account compromise on supplier side. No hostile activity, but responses became inconsistent and tone changed. The NDA Google Doc has been shared. Luke to determine safe path to re-engage and verify Alisa\'s identity before proceeding.',
  },
  {
    id: 'lag-strip',
    name: 'Lag Strip',
    category: 'key-strategic',
    status: 'active',
    priority: 'high',
    contact: 'TBD',
    product: 'Lag training strip / feedback device',
    nextSteps: 'Luke to provide full details — sourcing channel, contact info, and product spec.',
    notes: 'Non-Alibaba project. Details pending from Luke.',
    isAlibaba: false,
    conversationSummary: 'Project details to be added by Luke. Not an Alibaba sourcing project.',
  },
  {
    id: 'adjustable-shaft',
    name: 'Adjustable Shaft / Hosel',
    category: 'key-strategic',
    status: 'active',
    priority: 'high',
    contact: 'TBD',
    product: 'Adjustable shaft / hosel system',
    nextSteps: 'Luke to provide sourcing contact and product spec.',
    notes: 'Non-Alibaba project. Details pending from Luke.',
    isAlibaba: false,
    conversationSummary: 'Project details to be added by Luke. Not an Alibaba sourcing project.',
  },
  {
    id: 'schleis-partnership',
    name: 'The Hammer — Schleis Partnership',
    category: 'key-strategic',
    status: 'active',
    priority: 'high',
    contact: 'Schleis (domestic)',
    product: 'The Hammer training device',
    nextSteps: 'Maintain relationship. Align on production timeline and co-development scope.',
    notes: 'Domestic US partner. Key strategic relationship for The Hammer product line.',
    isAlibaba: false,
    conversationSummary: 'Schleis is a domestic US manufacturing partner and key relationship for The Hammer product. This is a co-development / partnership model, not a traditional factory sourcing project. Relationship requires ongoing attention and alignment.',
  },

  // ── ALIBABA PROJECTS ───────────────────────────────────────────────────────
  {
    id: 'pickleball-gen3',
    name: 'Pickleball Paddles (Gen 3)',
    category: 'alibaba',
    status: 'reorder-ready',
    priority: 'high',
    contact: 'Peiren Lin',
    factory: 'Shenzhen Yunshi Sport Goods',
    product: 'Gen 3 pickleball paddles',
    pricing: '$26/unit · MOQ 200 · Reorder total ~$5,200',
    lastContact: 'Recent',
    nextSteps: 'Confirm reorder quantity. Place order for ~200 units ($5,200). Verify current lead time.',
    notes: 'Established supplier. Previous orders fulfilled successfully. Gen 3 reorder ready.',
    isAlibaba: true,
    conversationSummary: 'Successful ongoing supplier relationship. Gen 3 paddles priced at $26/unit at 200 quantity. Total reorder cost approximately $5,200. Factory has fulfilled previous orders. Contact is Peiren Lin at Shenzhen Yunshi Sport Goods. Ready to place reorder — just needs green light on quantity and timing.',
  },
  {
    id: 'fiberglass-training-aid',
    name: 'Fiberglass Training Aid',
    category: 'alibaba',
    status: 'stalled',
    priority: 'medium',
    contact: 'Yazhen Wang',
    factory: 'Jinjiang Chaote Casting',
    product: 'Fiberglass swing training aid',
    lastContact: 'Oct 2025',
    nextSteps: 'Request improved sample with QC fixes (remove exposed metal bands, fix fiberglass shards). Await revised sample before committing to order.',
    notes: 'Original sample had serious QC issues: exposed metal bands and fiberglass shards. Safety hazard.',
    isAlibaba: true,
    conversationSummary: 'First sample received October 2025. Major QC failures: exposed metal bands at joints and fiberglass shards on surface — both safety hazards for a training device. Raised issues with Yazhen Wang at Jinjiang Chaote Casting. Factory acknowledged and committed to an improved sample. Improved sample is pending. No order placed. Do not proceed until revised sample passes safety review.',
  },
  {
    id: 'training-ropes',
    name: 'Golf Swing Training Ropes',
    category: 'alibaba',
    status: 'stalled',
    priority: 'low',
    contact: 'Jack Tan',
    factory: 'Dongguan Jiechu Sporting Goods',
    product: 'Golf swing training ropes',
    pricing: '$8.40–$8.80/piece · Sample discussed: 20 pieces',
    lastContact: 'Stalled',
    nextSteps: 'Decide if this product fits RYP lineup. If yes, request 20-piece sample. Otherwise, deprioritize.',
    isAlibaba: true,
    conversationSummary: 'Early-stage conversation with Jack Tan at Dongguan Jiechu Sporting Goods. Pricing at $8.40–$8.80/piece. Discussed a 20-piece sample run. Conversation stalled — no sample ordered. Needs internal decision on whether training ropes fit the RYP product strategy before re-engaging.',
  },
  {
    id: 'custom-golf-balls',
    name: 'Custom Golf Balls',
    category: 'alibaba',
    status: 'offer-received',
    priority: 'medium',
    contact: 'Yular Ho',
    factory: 'Hangzhou Taisly Sporting Goods',
    product: 'Custom-branded golf balls',
    pricing: 'Sample: $119 · Offer sheet sent to Luke@rypgolf.com',
    lastContact: 'Recent',
    nextSteps: 'Review offer sheet in Luke@rypgolf.com inbox. Decide on sample order ($119). Evaluate branding/printing capabilities.',
    isAlibaba: true,
    conversationSummary: 'Active conversation with Yular Ho at Hangzhou Taisly Sporting Goods. Offer sheet has been sent to Luke@rypgolf.com — needs to be reviewed. Sample pricing at $119. Factory offers custom printing and RYP logo branding on balls. Awaiting internal decision to move forward with sample.',
  },
  {
    id: 'simulator-wall-panels',
    name: 'Golf Simulator Wall Panels',
    category: 'alibaba',
    status: 'completed',
    priority: 'low',
    contact: 'Connie Duan',
    factory: 'Haining Green Import & Export',
    product: 'Golf simulator wall/impact panels',
    pricing: '~$950 order — CLOSED',
    lastContact: 'Order completed',
    nextSteps: 'Order delivered. Contact Connie if repurchase or additional panels are needed.',
    isAlibaba: true,
    conversationSummary: 'Order placed and delivered. ~$950 total order for golf simulator wall panels. Connie Duan at Haining Green Import & Export handled the order smoothly. No issues reported. Supplier available for reorders.',
  },
  {
    id: 'alloy-mini-driver',
    name: 'Alloy Mini Driver (320cc)',
    category: 'alibaba',
    status: 'quote-received',
    priority: 'medium',
    contact: 'Flora W',
    factory: 'Xiamen Justin Sports Equipment',
    product: '320cc alloy mini driver head',
    pricing: '$6/piece · MOQ 5,000 units',
    lastContact: 'Quote received',
    nextSteps: 'Evaluate MOQ of 5,000 vs. demand projection. MOQ is high for current volume — determine if a lower MOQ is negotiable or if project should wait.',
    notes: 'High MOQ at 5,000 is a barrier. May need to negotiate or wait for higher demand.',
    isAlibaba: true,
    conversationSummary: 'Quote received from Flora W at Xiamen Justin Sports Equipment. 320cc alloy mini driver head at $6/piece with a 5,000 unit MOQ. The MOQ is high relative to current RYP volume. Needs strategic review — either negotiate a lower MOQ or defer until the volume justifies the commitment.',
  },
  {
    id: 'aluminum-putter',
    name: 'Aluminum Alloy Putter',
    category: 'alibaba',
    status: 'completed',
    priority: 'low',
    contact: 'Peng Linda',
    factory: 'Huizhou Xiangsheng Sports',
    product: 'Aluminum alloy putter',
    pricing: '1 unit ordered',
    lastContact: 'Order completed',
    nextSteps: 'Single unit received. Evaluate quality and determine if bulk order makes sense.',
    isAlibaba: true,
    conversationSummary: 'Single unit ordered for evaluation from Peng Linda at Huizhou Xiangsheng Sports. Order completed. Putter received. Quality assessment determines next steps — contact Peng Linda if bulk order is warranted.',
  },
  {
    id: 'golf-nets',
    name: 'Golf Nets',
    category: 'alibaba',
    status: 'completed',
    priority: 'low',
    contact: 'Jason Jiang',
    factory: 'Weihai Deyuan Network Industry',
    product: 'Golf practice nets',
    pricing: 'Repurchase pricing available',
    lastContact: 'Order delivered',
    nextSteps: 'Order delivered successfully. Contact Jason Jiang for repurchase pricing when ready to reorder.',
    isAlibaba: true,
    conversationSummary: 'Order placed and delivered with no issues. Jason Jiang at Weihai Deyuan Network Industry is a reliable supplier. Repurchase pricing is available on request. Good candidate for repeat orders.',
  },
  {
    id: 'cribbage-sets',
    name: 'Cribbage Sets',
    category: 'alibaba',
    status: 'no-order',
    priority: 'low',
    contact: 'Nicole Chen',
    factory: 'Ningbo Hooleesh International Trading',
    product: 'Custom cribbage sets',
    pricing: '$6.20/set · MOQ 200 units',
    lastContact: 'Quoted',
    nextSteps: 'No order placed. Revisit if RYP expands into lifestyle/game products.',
    isAlibaba: true,
    conversationSummary: 'Quote received from Nicole Chen at Ningbo Hooleesh International Trading. $6.20/set at 200 unit MOQ. No order placed — product doesn\'t fit current RYP roadmap. File for potential future consideration if lifestyle product line is pursued.',
  },
  {
    id: 'custom-apparel',
    name: 'Custom Apparel',
    category: 'alibaba',
    status: 'no-engagement',
    priority: 'low',
    contact: 'Jade Yan',
    factory: 'QIANDAO INDUSTRIAL (HONGKONG)',
    product: 'Custom polo, jacket, hat',
    nextSteps: 'No engagement yet. Reach out if RYP branded apparel becomes a priority.',
    isAlibaba: true,
    conversationSummary: 'No conversation history. Jade Yan at QIANDAO INDUSTRIAL has been identified as a capable supplier for polo shirts, jackets, and hats with RYP branding. File for future use when apparel enters the roadmap.',
  },
  {
    id: 'foam-pickleball-alt',
    name: 'Foam Core Pickleball (Alt)',
    category: 'alibaba',
    status: 'no-engagement',
    priority: 'low',
    contact: 'Jacky Zhang',
    factory: 'Zhejiang Ama Sport Goods',
    product: 'Foam core pickleball (alternative supplier)',
    nextSteps: 'No engagement yet. Evaluate as alternative/backup supplier to Shenzhen Yunshi.',
    isAlibaba: true,
    conversationSummary: 'No conversation history. Jacky Zhang at Zhejiang Ama Sport Goods identified as a potential alternative pickleball supplier. Could serve as backup or cost-comparison option against the current Gen 3 supplier (Shenzhen Yunshi).',
  },
];
