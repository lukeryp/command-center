# RYP RED — Strategic Build Plan
## Long-Term Competitor to 18 Birdies & DECADE
### Dr. Luke Benoit · RYP Golf · April 2026

---

## THE PRODUCT VISION

RYP Red is the only golf analytics platform that captures a player's intended aim point BEFORE the shot, then decomposes the outcome into exactly how much was caused by bad decisions (SSL → "Course IQ") and how much was caused by bad execution (ESL → "Strike Score").

No competitor does this. 18 Birdies captures aim AFTER the shot. Arccos captures where the ball went. DECADE prescribes where to aim. None of them capture what the player actually chose, when they chose it, and measure the quality of that choice independently from their ball-striking.

This is not a feature advantage — it is a category-defining difference protected by 32 patent claims.

---

## COMPETITIVE LANDSCAPE

| Platform | What They Do | What They Don't Do |
|---|---|---|
| 18 Birdies | GPS, retrospective aim, shot tracking | No prospective aim, no SSL, no execution isolation |
| Arccos | Sensor-based shot tracking, AI caddie | No aim capture at all, no decision quality metric |
| DECADE | Pre-round strategy prescription | No on-course capture, no actual vs optimal comparison |
| Shot Scope | Wearable shot tracking, statistics | No aim data, no strategy decomposition |
| Golfmetrics | Strokes gained analysis | Retrospective only, no real-time capture |

RYP Red's moat: prospective aim capture + SSL/ESL decomposition + AI card scan extraction + temporal integrity (Claim 2). This combination is patented and no competitor can replicate without licensing.

---

## WHAT'S ALREADY BUILT (Current State Audit)

The ryp-red/ codebase at ~/Desktop/RYP-Projects/ryp-red/ is a substantial working app:

**Complete:**
- Next.js 14 App Router with TypeScript strict mode
- Supabase multi-tenant database (clubs, users, players, rounds, holes) with RLS
- Authentication (email/password, session management, role hierarchy)
- SSL/ESL calculation engine (fully unit tested, patent-compliant)
- 2-factor dispersion model (FCF × SAF, blueprint calibration)
- ESL drift detection
- Claude AI card scan extraction endpoint (/api/scan-card)
- Player dashboard with metric cards and charts
- Analytics page with SSL/ESL trends
- Round creation and history
- API middleware (auth, rate limiting, validation, Zod schemas)
- Role-based access: super_admin, club_admin, coach, player

**Needs Work:**
- Coach interface (template only)
- Settings page (template only)
- Peer comparison UI (data models ready)
- Mobile app (Phase 2)
- Subscription/billing
- Onboarding flow
- Data export
- Push notifications

---

## 8 SOURCE FILES (Downloads)

1. `ryp_par4_simulator_v2.jsx` — Source of truth for computation logic (88K)
2. `ryp_par4_simulator.jsx` — Original simulator (79K)
3. `ryp_dashboard.html` — Working card extraction prototype (24K)
4. `RYP RED - Developer Handoff & Build Spec.md` — Full build spec for Max (26K)
5. `RYP RED - Provisional Patent Application.md` — 26 original claims (21K)
6. `RYP RED - Prior Art Search & Patent Strategy.md` — Competitive IP analysis (16K)
7. `RYP_Idea_Handoff_Master_Prompt_v4.0.md` — Master prompt / operating system (48K)
8. `RYP_RED_patent.docx` — Original patent DOCX (31K)

Updated patent (32 claims, 6 new): `RYP_RED_Patent_Updated_April2026.docx` in RYP-Projects.

---

## PHASED BUILD STRATEGY

### PHASE 1: CORE LOOP (Weeks 1-4)
**Goal:** One player can scan a card and see their Course IQ.

- [ ] Connect to live Supabase project (create or use existing)
- [ ] Deploy to Vercel (rypred.rypgolf.com or red.rypgolf.com)
- [ ] Design and print the RYP Red physical scorecard
- [ ] Complete the card scan → extraction → SSL/ESL → dashboard loop end-to-end
- [ ] Onboarding flow: handicap, driver carry, club set
- [ ] Consumer vocabulary throughout UI (Course IQ, Sim Score, Decision Gap, Strike Score — never SSL/ESL)
- [ ] Coach can invite players via QR code or email
- [ ] First 5 Interlachen players scanning real cards

**Key Decisions:**
- Physical card design (Luke designs, Claude validates extraction)
- Supabase project: new or shared with Known?
- Domain: red.rypgolf.com vs rypred.com?

### PHASE 2: COACH EXPERIENCE (Weeks 5-8)
**Goal:** Luke can manage all his players from one dashboard.

- [ ] Coach dashboard: all assigned players, their rounds, trends
- [ ] Player comparison view (anonymized within handicap bands)
- [ ] Session notes: coach can annotate rounds with teaching observations
- [ ] Practice prescriptions: auto-generated based on SSL/ESL breakdown
- [ ] Push notifications when a player submits a round
- [ ] Email summaries: weekly player progress digest for coaches
- [ ] Bulk invite: coach sends link, players self-onboard

### PHASE 3: PEER INTELLIGENCE (Weeks 9-12)
**Goal:** "How do I compare to other 15-handicaps?"

- [ ] Peer stats aggregation pipeline (anonymized)
- [ ] Course IQ percentile within handicap band
- [ ] Benchmark cards: "This round, your decisions were better than 72% of similar players"
- [ ] Trend analysis: Course IQ trajectory over 10/25/50 rounds
- [ ] Handicap-adjusted normative database
- [ ] Goal setting: "To reach single-digit Course IQ, focus on approach aim"

### PHASE 4: MULTI-CLUB & GROWTH (Weeks 13-20)
**Goal:** Other clubs can use RYP Red.

- [ ] Club onboarding flow (admin creates club, invites coaches)
- [ ] Club branding: custom logo, colors per club
- [ ] Subscription billing (Stripe)
- [ ] Club analytics: aggregate player performance for director of instruction
- [ ] API for third-party integrations
- [ ] Data export (CSV, PDF reports)
- [ ] Marketing site at rypred.com with demo mode

### PHASE 5: MOBILE APP (Weeks 21-30)
**Goal:** Native iOS/Android experience.

- [ ] React Native (Expo) app sharing computation engine with web
- [ ] Camera-native card scan (no file upload needed)
- [ ] On-course mode: hole-by-hole aim entry during round
- [ ] Push notifications for round analysis ready
- [ ] Offline support: queue card scans when no signal
- [ ] App Store / Google Play submission

### PHASE 6: INTELLIGENCE LAYER (Ongoing)
**Goal:** The platform gets smarter with every round.

- [ ] AI caddie: pre-round strategy recommendations based on player's dispersion model
- [ ] Pattern detection: "You lose 0.8 strokes/round aiming at tucked pins with 7-iron"
- [ ] Course-specific strategy: accumulate enough rounds on a course to prescribe optimal play
- [ ] Integration with RYPstick: speed data feeds dispersion model directly
- [ ] Integration with FORGE: training prescriptions based on RYP Red weaknesses
- [ ] Season-long analytics and year-over-year comparison

---

## QUESTIONS FOR LUKE

Before I write the first line of Phase 1 code, I need clarity on these:

**Product:**
1. The physical scorecard — do you have a design already, or do we need to create one? The card layout directly affects extraction accuracy. Simpler = better for AI.
2. On-course workflow: does the player fill out the card during the round and scan after? Or do they enter aim data on their phone during the round (Phase 5 feature brought forward)?
3. Consumer vocabulary — are Course IQ / Sim Score / Decision Gap / Strike Score still the final four terms? Any changes?

**Business:**
4. Pricing model: per-player subscription? Per-club license? Free for players, paid for coaches? This affects the entire multi-club architecture.
5. First customers beyond Interlachen — do you have clubs lined up, or is Phase 4 speculative?
6. 18 Birdies has ~5M users. DECADE targets competitive players. Where does RYP Red position: serious amateurs, competitive players, or all golfers?

**Technical:**
7. Supabase: new project for Red, or share with Known? I'd recommend separate for clean isolation.
8. The extraction prompt (trade secret) — is it dialed, or does it need refinement for the actual RYP Red card format?
9. Max's involvement: is he building alongside me, or am I building and handing off?

**Timeline:**
10. When do you want the first real player scanning a card? That's the forcing function for Phase 1.

---

## ENGINEERING STANDARDS (Non-Negotiable)

Every line of code follows senior developer production standards:

- TypeScript strict mode, no `any` types
- Zod validation on every API route
- Parameterized queries only (Supabase query builder)
- Named constants, never magic numbers
- RLS policies on every table
- Rate limiting on every endpoint
- Error boundaries in every page
- Unit tests for every engine function
- E2E tests for critical paths (scan → dashboard)
- Environment variables for all secrets
- Git commits with semantic messages
- Code review before merge to main

This is not a prototype. This is production software designed to scale to thousands of clubs.
