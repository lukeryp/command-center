import { SwingClip, ContentPiece, VideoIntake, SwingPosition } from './content-types';

// ── Position helpers ──────────────────────────────────────────────────────────

export function emptyPositions(): SwingClip['positions'] {
  const positions = {} as SwingClip['positions'];
  (['P1','P2','P3','P4','P5','P6','P7','P8'] as SwingPosition[]).forEach((p, i) => {
    positions[p] = { timestamp: (i + 1) * 1.2, tagged: false };
  });
  return positions;
}

function taggedPositions(tagged: SwingPosition[], base?: Partial<SwingClip['positions']>): SwingClip['positions'] {
  const pos = emptyPositions();
  tagged.forEach(p => { pos[p].tagged = true; });
  if (base) {
    Object.entries(base).forEach(([k, v]) => {
      pos[k as SwingPosition] = { ...pos[k as SwingPosition], ...v };
    });
  }
  return pos;
}

// ── Swing Clips ───────────────────────────────────────────────────────────────

export const SWING_CLIPS: SwingClip[] = [
  {
    id: 'clip-korda',
    proName: 'Nelly Korda',
    angle: 'face-on',
    club: 'driver',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P4','P6','P8'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 1.1, tagged: true },
      P4: { timestamp: 2.8, tagged: true },
      P6: { timestamp: 4.0, tagged: true },
      P8: { timestamp: 5.6, tagged: true },
    }),
    concepts: ['rotation', 'impact compression', 'hip clearance'],
    textbookChapter: 4,
    notes: 'Exceptional hip lead and spine angle retention through impact',
  },
  {
    id: 'clip-scheffler',
    proName: 'Scottie Scheffler',
    angle: 'down-the-line',
    club: 'driver',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P3','P4','P5','P6','P7'], {
      P1: { timestamp: 0.0, tagged: true },
      P3: { timestamp: 1.5, tagged: true },
      P4: { timestamp: 2.6, tagged: true },
      P5: { timestamp: 3.3, tagged: true },
      P6: { timestamp: 4.1, tagged: true },
      P7: { timestamp: 5.0, tagged: true },
    }),
    concepts: ['transition', 'lag', 'shaft lean', 'kinematic sequence'],
    textbookChapter: 6,
    notes: 'World #1 — textbook transition and lag delivery',
  },
  {
    id: 'clip-snead',
    proName: 'Sam Snead',
    angle: 'face-on',
    club: 'driver',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P4','P6','P8'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 1.2, tagged: true },
      P4: { timestamp: 3.1, tagged: true },
      P6: { timestamp: 4.5, tagged: true },
      P8: { timestamp: 6.0, tagged: true },
    }),
    concepts: ['tempo', 'rotation', 'pivot'],
    textbookChapter: 2,
    notes: 'Classic rotational model — best tempo ever filmed',
  },
  {
    id: 'clip-wright',
    proName: 'Mickey Wright',
    angle: 'down-the-line',
    club: 'iron',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P3','P4','P5','P6'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 1.0, tagged: true },
      P3: { timestamp: 1.8, tagged: true },
      P4: { timestamp: 2.7, tagged: true },
      P5: { timestamp: 3.4, tagged: true },
      P6: { timestamp: 4.2, tagged: true },
    }),
    concepts: ['plane', 'wrist conditions', 'impact compression'],
    textbookChapter: 3,
    notes: 'Ben Hogan called her the best swing he\'d ever seen',
  },
  {
    id: 'clip-hogan',
    proName: 'Ben Hogan',
    angle: 'face-on',
    club: 'iron',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P3','P4','P5','P6','P7'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 0.9, tagged: true },
      P3: { timestamp: 1.7, tagged: true },
      P4: { timestamp: 2.5, tagged: true },
      P5: { timestamp: 3.2, tagged: true },
      P6: { timestamp: 3.9, tagged: true },
      P7: { timestamp: 4.8, tagged: true },
    }),
    concepts: ['supination', 'lag', 'shaft lean', 'pivot', 'plane'],
    textbookChapter: 1,
    notes: 'The benchmark for every technical concept we teach',
  },
  {
    id: 'clip-trevino',
    proName: 'Lee Trevino',
    angle: 'down-the-line',
    club: 'iron',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P4','P6','P7','P8'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 1.3, tagged: true },
      P4: { timestamp: 2.8, tagged: true },
      P6: { timestamp: 4.0, tagged: true },
      P7: { timestamp: 4.9, tagged: true },
      P8: { timestamp: 5.8, tagged: true },
    }),
    concepts: ['fade bias', 'wrist conditions', 'open face control'],
    textbookChapter: 5,
    notes: 'Unorthodox but proves multiple positions can lead to impact — great for "One Coach Myth"',
  },
  {
    id: 'clip-mcilroy',
    proName: 'Rory McIlroy',
    angle: 'face-on',
    club: 'driver',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P3','P4','P5','P6','P7','P8'], {
      P1: { timestamp: 0.0, tagged: true },
      P3: { timestamp: 1.4, tagged: true },
      P4: { timestamp: 2.4, tagged: true },
      P5: { timestamp: 3.1, tagged: true },
      P6: { timestamp: 3.8, tagged: true },
      P7: { timestamp: 4.6, tagged: true },
      P8: { timestamp: 5.4, tagged: true },
    }),
    concepts: ['rotation', 'hip clearance', 'release', 'kinematic sequence'],
    textbookChapter: 7,
    notes: 'Best modern example of rotation-driven power',
  },
  {
    id: 'clip-tiger',
    proName: 'Tiger Woods',
    angle: 'down-the-line',
    club: 'driver',
    source: '/clips/placeholder',
    positions: taggedPositions(['P1','P2','P3','P4','P5','P6','P7','P8'], {
      P1: { timestamp: 0.0, tagged: true },
      P2: { timestamp: 0.8, tagged: true },
      P3: { timestamp: 1.5, tagged: true },
      P4: { timestamp: 2.3, tagged: true },
      P5: { timestamp: 3.0, tagged: true },
      P6: { timestamp: 3.7, tagged: true },
      P7: { timestamp: 4.4, tagged: true },
      P8: { timestamp: 5.2, tagged: true },
    }),
    concepts: ['lag', 'transition', 'shaft lean', 'impact compression', 'pivot', 'kinematic sequence'],
    textbookChapter: 1,
    notes: 'All 8 positions tagged — the complete model',
  },
];

// ── Content Pieces ────────────────────────────────────────────────────────────

export const CONTENT_PIECES: ContentPiece[] = [
  {
    id: 'cp-one-coach-myth',
    sourceVideoId: 'vid-001',
    platform: 'instagram-carousel',
    series: 'The Builders',
    title: 'The One Coach Myth',
    status: 'ready',
    scheduledDate: '2026-04-07',
    hashtags: ['#golfinstruction', '#golfswing', '#RYPGolf', '#TheBuildersGolf'],
    body: `Slide 1: "There is no one golf swing."
Cover image: Split-screen Hogan vs. Trevino at P6 — identical impact, radically different paths.

Slide 2: Two totally different backswings.
Hogan: upright, laid off at P4. Trevino: flat, across the line. Both Hall of Famers. Both major winners.

Slide 3: But look at P6.
Freeze both at impact. Shaft lean identical. Hip position identical. Belt buckle pointing forward on both. The body doesn't lie.

Slide 4: This is why we say: there are many roads to impact.
Your job isn't to copy someone's backswing. Your job is to build YOUR road to P6.

Slide 5: The Genome Framework doesn't give you one swing. It gives you YOUR swing — built on the positions that actually matter.

Slide 6: Follow for the swing science nobody else is teaching. @rypgolf`,
    shotList: [
      {
        transcriptTimestamp: 12.4,
        positionReference: 'P4',
        suggestedClips: ['clip-hogan', 'clip-trevino'],
        clipType: 'freeze',
        notes: 'Side-by-side split screen at top of backswing — contrast the paths',
      },
      {
        transcriptTimestamp: 28.1,
        positionReference: 'P6',
        suggestedClips: ['clip-hogan', 'clip-trevino'],
        clipType: 'freeze',
        notes: 'Freeze both at impact — show how different paths converge at the same P6',
      },
      {
        transcriptTimestamp: 45.0,
        positionReference: 'P5',
        suggestedClips: ['clip-scheffler', 'clip-mcilroy'],
        clipType: 'slow-mo-loop',
        notes: 'Modern player transition comparison — P5 slot delivery',
      },
    ],
  },
  {
    id: 'cp-transition-deep-dive',
    sourceVideoId: 'vid-002',
    platform: 'linkedin',
    series: 'Swing Study',
    title: 'The 0.3-Second Window That Separates Tour Players From Amateurs',
    status: 'draft',
    hashtags: ['#golfcoaching', '#swingscience', '#RYPGolf'],
    body: `The transition — P4 to P5 — lasts about 0.3 seconds.

In that window, the best players in the world do something most amateurs never learn: they sequence.

Hips first. Then torso. Then arms. Then club.

When that order breaks down, everything downstream gets compensated for. You can't build a reliable swing on a broken sequence.

Here's what we look for at RYP when we evaluate a swing's transition...`,
  },
  {
    id: 'cp-korda-hip-study',
    sourceVideoId: 'vid-003',
    platform: 'instagram-carousel',
    series: 'Tour Average',
    title: 'Nelly Korda\'s Hip Lead — What the Data Shows',
    status: 'review',
    hashtags: ['#NellyKorda', '#golfswing', '#womensgolf', '#RYPGolf'],
    body: `Slide 1: The stat that changed how we coach women players.
Korda's hip lead at P6: 42 degrees ahead of her shoulder turn. World #1. Not a coincidence.

Slide 2-4: Frame by frame breakdown of her P5 → P6 sequence...`,
  },
  {
    id: 'cp-zone-files-lag',
    sourceVideoId: 'vid-004',
    platform: 'youtube',
    series: 'Zone Files',
    title: 'Zone Files: The Lag Zone (P4 → P5)',
    status: 'draft',
    body: `Full-length breakdown of the lag zone. Everything that happens between the top of the backswing and the arm-parallel-down position. Why it matters, what creates it, and how to train it without losing width.`,
  },
  {
    id: 'cp-genome-dispatch-01',
    sourceVideoId: 'vid-005',
    platform: 'email',
    series: 'Genome Dispatch',
    title: 'Genome Dispatch #1 — The Framework Issue',
    status: 'posted',
    scheduledDate: '2026-03-24',
    body: `This week I want to talk about frameworks vs. drills — and why most instruction gets it backwards...`,
  },
  {
    id: 'cp-snead-tempo',
    sourceVideoId: 'vid-006',
    platform: 'twitter',
    series: 'Swing Study',
    title: 'Sam Snead had the best tempo ever filmed. Here\'s why.',
    status: 'ready',
    scheduledDate: '2026-04-08',
    hashtags: ['#SamSnead', '#golf', '#golfswing'],
    body: `Sam Snead had the best tempo ever filmed.

3:1 backswing-to-downswing ratio. Every single time.

We've tracked 200+ tour players. Nobody matches it.

Here's what he was actually doing [thread]`,
  },
];

// ── Video Intakes ─────────────────────────────────────────────────────────────

export const VIDEO_INTAKES: VideoIntake[] = [
  {
    id: 'vid-001',
    title: 'The One Coach Myth — Instagram Carousel Session',
    transcript: `Today I want to talk about something that frustrates me every time I see it online. The idea that there's one golf swing. One perfect model. One teacher who has "the answer." It's nonsense — and I can prove it with two names: Hogan and Trevino. Look at these two at the top of the backswing — completely different. Hogan is upright, slightly laid off. Trevino is flat, across the line. But now look at impact. Freeze them both right at P6. The shaft lean is the same. The hip position is the same. Belt buckle pointing forward on both. The body converges on the same impact conditions even though the roads there were completely different. That's the whole point of the Genome Framework. There's no one swing. There's YOUR swing — built around the positions that actually matter.`,
    detectedPositions: [
      { position: 'P4', timestamp: 12.4, context: 'at the top of the backswing — completely different' },
      { position: 'P6', timestamp: 28.1, context: 'freeze them both right at P6' },
      { position: 'P6', timestamp: 35.0, context: 'same impact conditions' },
    ],
    cascadeStatus: {
      'instagram-carousel': 'complete',
      'linkedin': 'draft',
      'twitter': 'pending',
    },
    createdAt: '2026-04-01T14:30:00Z',
  },
  {
    id: 'vid-002',
    title: 'Transition Deep Dive — The 0.3 Second Window',
    transcript: `Let's talk about transition. P4 to P5. This is where the swing is actually built or destroyed. In most amateurs the arms start the downswing. They fire before the hips have started to rotate. That's the death move. In tour players you see the hips initiate the transition before the club even stops moving. The kinematic sequence has to be hips, torso, arms, club. In that order. Every time. Scheffler is the best modern example of this — look at how he drops into P5 while his backswing is still completing at the top. That's lag creation that doesn't require any manipulation.`,
    detectedPositions: [
      { position: 'P4', timestamp: 4.1, context: 'P4 to P5. This is where the swing is actually built' },
      { position: 'P5', timestamp: 4.5, context: 'P4 to P5' },
      { position: 'P5', timestamp: 42.0, context: 'drops into P5 while his backswing is still completing' },
      { position: 'P4', timestamp: 45.2, context: 'still completing at the top' },
    ],
    cascadeStatus: {
      'instagram-carousel': 'pending',
      'linkedin': 'complete',
      'youtube': 'pending',
    },
    createdAt: '2026-04-02T10:00:00Z',
  },
];
