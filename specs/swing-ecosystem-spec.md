# RYP Swing Ecosystem — Architecture Spec

**Author:** Dr. Luke Benoit / Claude
**Date:** 2026-04-04
**Status:** Phase 1 ready to build, Phases 2-4 specced for Max
**Trade Secret Boundary:** Extraction prompts, SSL/ESL algorithms, and Mechanics Index formula are proprietary. Referenced but not detailed here.

---

## Overview

Three interconnected systems that form a flywheel: content creation feeds a swing database, the database powers a coaching product, the coaching product generates crowd-sourced data that improves the AI model, and the improved model creates better content. Each system is independently valuable, but together they create a compounding moat.

---

## SYSTEM 1: Swing Clip Engine (Content Machine)

### What it does
Ingests swing clips from any source, auto-classifies them using motion tracking, and makes them instantly searchable for content creation and coaching.

### Core Concepts

- **Clip intake:** URL paste (Instagram, YouTube, TikTok) or file upload (mp4/mov from phone)
- **Auto-classification:** Motion tracking API analyzes the swing and tags it with structured metadata
- **P1-P8 positions:** Every clip gets timestamped at 8 standard swing checkpoints
- **Searchable database:** "Show me all in-to-out iron swings from DTL angle" returns instant results
- **Content pipeline:** Feeds the Swing Study video series with perfectly matched clips

### Swing Position Taxonomy (P1-P8)

| Position | Name | What to look for |
|---|---|---|
| P1 | Address / Setup | Stance, posture, grip, alignment |
| P2 | Takeaway (shaft parallel) | Club path, wrist set, body rotation start |
| P3 | Lead arm parallel (backswing) | Arm plane, shoulder turn, wrist hinge |
| P4 | Top of backswing | Shaft position (cross the line / laid off / on plane), hip-shoulder separation, wrist load |
| P5 | Lead arm parallel (downswing) | Transition sequence, lag, slot position, hip lead |
| P6 | Impact | Shaft lean, face angle, body positions, ground force |
| P7 | Post-impact / Release | Extension, club path exit, face rotation |
| P8 | Finish | Balance, rotation completion, weight distribution |

### Swing Characteristics Tags

| Category | Values |
|---|---|
| Club path | in-to-out, out-to-in, neutral, extreme in-to-out, extreme out-to-in |
| Face angle at impact | open, closed, square |
| Shot shape | draw, fade, straight, hook, slice, push, pull |
| Top of backswing | crosses the line, laid off, on plane, short of parallel, past parallel |
| Transition | early hip fire, upper body dominant, synchronized, reverse pivot |
| Tempo | fast, moderate, smooth/slow, Snead-like, aggressive |
| Power source | ground-up, rotational, arm-dominant, mixed |
| Shaft plane | one-plane, two-plane, steep, shallow |
| Release type | full release, hold-off, flip, tumble |

### Clip Database Schema

```
swing_clips
├── id: uuid (PK)
├── pro_name: text (NOT NULL)
├── source_url: text
├── source_platform: enum('instagram', 'youtube', 'tiktok', 'original', 'other')
├── file_path: text
├── camera_angle: enum('face-on', 'down-the-line', 'behind', 'overhead', '3/4')
├── club_type: enum('driver', 'long-iron', 'mid-iron', 'short-iron', 'wedge', 'putter')
├── specific_club: text (e.g., '7-iron', 'driver', '60-degree')
├── speed: enum('real-time', 'slow-mo', 'both')
├── duration_seconds: float
│
├── -- Position timestamps (seconds into clip)
├── p1_timestamp: float
├── p2_timestamp: float
├── p3_timestamp: float
├── p4_timestamp: float
├── p5_timestamp: float
├── p6_timestamp: float
├── p7_timestamp: float
├── p8_timestamp: float
│
├── -- Swing characteristics (auto-classified or manual)
├── club_path: text
├── face_angle: text
├── shot_shape: text
├── top_position: text
├── transition_type: text
├── tempo: text
├── power_source: text
├── shaft_plane: text
├── release_type: text
│
├── -- Content metadata
├── concepts: text[] (e.g., ['lag', 'transition', 'impact compression'])
├── textbook_chapters: int[]
├── cert_modules: int[]
├── quality_rating: int (1-10, editorial quality for content use)
├── notes: text
│
├── -- Classification metadata
├── classification_method: enum('manual', 'auto-api', 'crowd-rated')
├── classification_confidence: float
├── created_at: timestamptz
├── updated_at: timestamptz
└── created_by: text
```

### Clip Intake Flow

1. User pastes URL or drops file
2. System downloads/stores the clip
3. If motion tracking API is connected: auto-classify → store tags with confidence scores
4. If not: queue for manual tagging (P1-P8 timestamps + characteristics)
5. Clip appears in searchable database immediately
6. When Luke mentions a position in a video transcript, system matches clips by position timestamp + characteristics

### Motion Tracking API Options (Phase 2)

| Provider | What it does | Cost | Integration |
|---|---|---|---|
| MediaPipe (Google) | Free pose estimation, 33 body landmarks per frame | Free | Python SDK, runs locally |
| Sportsbox.ai | Golf-specific 3D motion capture from 2D video | $$ | API, golf-specific metrics |
| Kinetica AI | Sports biomechanics analysis | $$ | API |
| Custom (OpenCV + MediaPipe) | Build our own golf-specific classifier | Free (dev time) | Python |

**Recommendation:** Start with MediaPipe (free, runs locally) for P1-P8 timestamp detection. Use body landmark positions to identify each swing phase. Custom classifier on top for golf-specific tags (club path, face angle, etc.) trained on the crowd-rated data from System 3.

---

## SYSTEM 2: Mechanics Index App (RYP Product)

### What it does
Gives any golfer a quantified swing quality score and tells them exactly what to improve. This is the consumer product that monetizes the swing database.

### Core Concepts

- **Mechanics Index (MI):** A composite score that rates swing quality
- **Three input factors:** Swing mechanics, swing speed, centerness of contact (skill)
- **Algorithm:** `MI = f(mechanics_quality, speed_factor, contact_quality)` (exact formula is proprietary)
- **Peer comparison:** "Your MI is 72 — better than 68% of golfers in your handicap band"
- **Prescription engine:** Links weak areas to specific textbook chapters, cert modules, and drills

### Mechanics Index Components

| Component | What it measures | How we get it |
|---|---|---|
| Mechanics Quality | How well the swing positions match efficient patterns (P1-P8 scoring) | Video upload → motion tracking analysis |
| Speed Factor | Clubhead speed relative to physical potential | User-reported or launch monitor data |
| Contact Quality | Centerness of contact, consistency of strike | Impact tape test, launch monitor data, or Rypstick sensor |

### Algorithm Architecture (High Level — Details Proprietary)

```
mechanics_score = weighted_sum(position_scores[P1..P8])
  where each position is scored against:
    - Tour average positions (from classified database)
    - Efficient movement patterns (from biomechanics research)
    - Player's own consistency (variance across multiple swings)

speed_factor = clubhead_speed / expected_speed(age, gender, fitness)

contact_quality = f(smash_factor, dispersion, consistency)

MI = alpha * mechanics_score + beta * speed_factor + gamma * contact_quality
  where alpha + beta + gamma = 1.0
  (exact weights are proprietary and may vary by handicap band)
```

### User Flow

1. Player opens PWA → creates account
2. Uploads 3-5 swing videos (face-on + DTL recommended)
3. System analyzes swings → produces Mechanics Index score
4. Dashboard shows: overall MI, breakdown by component, P1-P8 position scores
5. "Improve" tab: prioritized list of what to work on, linked to textbook chapters and video lessons
6. Track progress over time: MI trend line, before/after comparisons
7. Upsell: book a lesson with an RYP certified coach, buy the textbook, join certification

### Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind
- Backend: Supabase (Auth + DB + Storage for videos)
- Motion Analysis: MediaPipe (local) + custom classifier
- AI: Claude API for natural language coaching feedback
- Hosting: Vercel
- Video Processing: Server-side (Vercel Functions or separate worker)

### Data Model

```
players
├── id: uuid (PK)
├── email: text (UNIQUE)
├── name: text
├── handicap: float
├── age: int
├── gender: enum
├── club_id: uuid (FK, nullable — for club-affiliated players)
├── subscription_tier: enum('free', 'basic', 'pro')
├── created_at: timestamptz

swing_uploads
├── id: uuid (PK)
├── player_id: uuid (FK)
├── video_url: text
├── camera_angle: enum
├── club_used: text
├── analysis_status: enum('pending', 'processing', 'complete', 'failed')
├── created_at: timestamptz

swing_analyses
├── id: uuid (PK)
├── swing_upload_id: uuid (FK)
├── player_id: uuid (FK)
├── mechanics_index: float
├── mechanics_score: float
├── speed_factor: float
├── contact_quality: float (nullable — requires additional data)
├── position_scores: jsonb { P1: float, P2: float, ... P8: float }
├── characteristics: jsonb { club_path, face_angle, tempo, ... }
├── improvement_priorities: jsonb []
├── textbook_refs: int[]
├── analyzed_at: timestamptz

mi_history
├── id: uuid (PK)
├── player_id: uuid (FK)
├── mechanics_index: float
├── recorded_at: timestamptz
```

---

## SYSTEM 3: Swing Rating Community (Research + Data Flywheel)

### What it does
A PWA where golf enthusiasts watch and rate swings. They get free coaching content in return. Their ratings train the AI model that powers the Mechanics Index.

### Core Concepts

- **Citizen science:** Contributors are part of the Golfer's Genome Project
- **Rating tasks:** Watch a swing, rate it (1-10 overall, or A-vs-B comparison)
- **Content feed:** Between ratings, users see RYP coaching content (Swing Study clips, carousels, tips)
- **Perception research:** How humans perceive "good" swings, and how that changes over time
- **Model training:** Crowd ratings create labeled data for the Mechanics Index AI
- **Gamification:** Contributor levels, streaks, leaderboard of most active raters

### Rating Task Types

| Task Type | What the user does | Data produced |
|---|---|---|
| Overall rating | Watch one swing, rate 1-10 | Single-swing quality label |
| A/B comparison | Watch two swings, pick the better one | Pairwise preference data (Elo-style) |
| Position rating | Watch a freeze-frame at P4, rate the position | Position-specific quality label |
| Diagnosis | "What's the biggest issue?" Multiple choice | Classification training data |
| Spot the difference | Before/after swings, identify what changed | Change detection training data |

### Why Users Participate

1. **Free coaching content** — RYP's feed of Swing Study videos, tips, and analysis between rating tasks
2. **Learn by comparing** — rating swings builds pattern recognition (this IS coaching)
3. **Contributor status** — badge, profile, leaderboard ("You've rated 500 swings — Top 5% contributor")
4. **Early access** — to new RYP tools, Mechanics Index beta, etc.
5. **Community** — golf junkies who love analyzing swings

### Research Value

This produces a dataset that doesn't exist anywhere:

- **Perception vs. mechanics:** Do humans rate "beautiful" swings higher than mechanically efficient ones?
- **Expertise effect:** Do low-handicap raters perceive differently than high-handicap raters?
- **Temporal drift:** Does the collective definition of a "good swing" change over years?
- **Cultural variation:** Do raters from different regions/traditions value different swing attributes?
- **Inter-rater reliability:** How consistent are humans at evaluating swings?

This is publishable research AND proprietary training data. Dual value.

### Data Model

```
raters
├── id: uuid (PK)
├── email: text
├── display_name: text
├── handicap: float (self-reported)
├── experience_level: enum('beginner', 'intermediate', 'advanced', 'teaching-pro')
├── total_ratings: int
├── contributor_level: enum('new', 'active', 'expert', 'elite')
├── streak_days: int
├── created_at: timestamptz

ratings
├── id: uuid (PK)
├── rater_id: uuid (FK)
├── task_type: enum('overall', 'comparison', 'position', 'diagnosis', 'spot-difference')
├── clip_id: uuid (FK → swing_clips)
├── clip_b_id: uuid (FK, nullable — for A/B comparisons)
├── position_focus: enum('P1'..'P8', nullable)
├── score: float (1-10 for overall, null for comparison)
├── choice: enum('A', 'B', nullable — for comparisons)
├── diagnosis_tags: text[] (nullable — for diagnosis tasks)
├── response_time_ms: int
├── created_at: timestamptz

rating_aggregates
├── clip_id: uuid (FK)
├── mean_rating: float
├── rating_count: int
├── elo_score: float (from pairwise comparisons)
├── position_scores: jsonb { P1: float, ... P8: float }
├── inter_rater_agreement: float (Krippendorff's alpha)
├── updated_at: timestamptz
```

### Tech Stack

- Frontend: Next.js 14, PWA (installable, offline-capable rating queue)
- Backend: Supabase (Auth + DB + Storage)
- Video: Cloudflare Stream or Mux (for efficient clip delivery)
- Analytics: PostHog or Mixpanel (engagement, retention, rating patterns)
- Hosting: Vercel
- Research pipeline: Python notebooks for analysis, publishable to OSF

---

## PHASED BUILD PLAN

### Phase 1 — NOW (Claude + Command Center)
**Timeline:** April 2026
**Who:** Claude builds in Command Center

- Swing clip database with manual tagging (Command Center /content/swings)
- Content machine pipeline: video transcript → position detection → shot list → cascade
- Carousel image generator (proven — Pillow-based, pixel-matched to brand template)
- Teddy's queue (carousel briefs tracker)
- Content calendar and library
- Clip intake from URL paste (YouTube, Instagram, TikTok)

### Phase 2 — Auto-Classification (Max)
**Timeline:** May 2026
**Who:** Max builds, Claude specs

- MediaPipe integration for automatic P1-P8 timestamp detection
- Custom golf classifier for swing characteristics (club path, face angle, etc.)
- Batch processing: drop 50 clips, auto-tag all of them
- Confidence scoring: flag low-confidence classifications for manual review
- API endpoint: POST /api/classify-swing → returns full tag set

### Phase 3 — Mechanics Index PWA (Max)
**Timeline:** June-July 2026
**Who:** Max builds, Claude specs

- Player-facing PWA at mechanics.rypgolf.com or similar
- Swing upload → analysis → MI score → coaching prescription
- Dashboard with MI trend, position breakdown, improvement priorities
- Integration with textbook chapters and cert modules
- Free tier (3 analyses/month) + Pro tier (unlimited + detailed reports)
- Club integration: coaches can view their students' MI scores

### Phase 4 — Swing Rating Community (Max)
**Timeline:** August 2026
**Who:** Max builds, Claude specs, Luke designs research protocol

- Public PWA with rating interface
- Content feed integration (shows RYP content between ratings)
- Contributor profiles, levels, streaks
- Research data pipeline → anonymized dataset
- Model training loop: ratings → improve classifier → better MI scores
- IRB consideration for publishable research
- Golfer's Genome Project branding

---

## INTEGRATION MAP

```
                     ┌─────────────────────────┐
                     │   CLIP INTAKE            │
                     │ (Instagram, YouTube,     │
                     │  TikTok, phone, original)│
                     └────────────┬────────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │   SWING CLIP DATABASE    │
                     │ (P1-P8 tagged, classified│
                     │  searchable by any attr) │
                     └──┬──────────┬──────────┬─┘
                        │          │          │
            ┌───────────┘          │          └───────────┐
            ▼                      ▼                      ▼
  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
  │ CONTENT MACHINE │   │ MECHANICS INDEX  │   │ RATING COMMUNITY│
  │                 │   │                  │   │                 │
  │ Swing Study     │   │ Player uploads   │   │ Rate swings     │
  │ videos, reels,  │   │ swing → gets MI  │   │ Get coaching    │
  │ carousels,      │   │ score + coaching │   │ Train the model │
  │ blog, email     │   │ prescription     │   │ Research data   │
  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
           │                     │                      │
           │                     │                      │
           └──────── FLYWHEEL ───┴──────────────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   COMMAND CENTER         │
                     │ (Dashboard, tracking,    │
                     │  calendar, analytics)    │
                     └─────────────────────────┘
```

---

## OPEN QUESTIONS — Luke's Decisions Required

1. **Mechanics Index hosting:** Subdomain of rypgolf.com (mechanics.rypgolf.com) or separate domain? Recommendation: subdomain.

2. **Rating community branding:** Part of Golfer's Genome Project or separate brand? Recommendation: Genome Project — leverages existing research credibility.

3. **Free tier limits for MI:** How many free swing analyses per month? Recommendation: 3/month free, unlimited at $9.99/month.

4. **Clip sourcing legality:** Using tour pro swings from Instagram/YouTube for content — fair use for educational commentary? Recommendation: consult IP attorney (Mike Eisele). For the rating app, use only original content or properly licensed clips.

5. **Motion tracking provider:** MediaPipe (free, local, we control it) vs. Sportsbox.ai (golf-specific, $$, they control it)? Recommendation: MediaPipe + custom classifier. Own the tech.

6. **Research protocol:** Want to pre-register the perception study on OSF for academic publication? Recommendation: yes, adds credibility and is free.

7. **Priority order for Max:** Phase 2 (auto-classification) before Phase 3 (MI app), or skip to Phase 3 with manual classification? Recommendation: Phase 2 first — auto-classification is needed for Phase 3 to scale.
