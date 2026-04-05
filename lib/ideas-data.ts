import { Idea } from './types';

const now = new Date().toISOString();

function idea(overrides: Partial<Idea> & { id: string; title: string }): Idea {
  return {
    body: '',
    status: 'raw',
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const SEED_IDEAS: Idea[] = [
  idea({
    id: 'social-bad-coaching-one-coach-myth',
    title: '🎠 Bad Coaching — The "One Coach" Myth',
    body: `**Type:** Social Media — Instagram Carousel
**Assigned to:** Teddy Curacao
**Status:** Raw → Ready for production
**Brief:** See /content-briefs/2026-04-04-one-coach-myth-carousel.md

---

**Raw Voice-to-Text from Luke:**

Bad coaching. One version of bad coaching that we don't talk about enough is that we think a player should stay with 1 coach through thick and thin instead of switching coaches to learn something new.

Here's where we get it wrong: a lot of times, there is a lot to learn from different people with different specialties and skill sets you may not have. That could include swing coaches, short game coaches, body coaches, biomechanics coaches, motor learning coaches who can teach you how to practice, sports psychologists, tournament/recruiting specialists, college advising, core strategy.

There are so many sub-disciplines to get good at this game. And the idea that every player should NOT find time to learn from an expert in these areas is asinine. And yet there are many coaches that are afraid to let their players see and meet with different coaches.

So just let it be known: I am always in favor of letting players freely explore other coaches and ideas. And if they want to come back, great. If not, they must have found something that worked for them.

We should always want the best for our players. And we should also recognize when we may not have the ability to help them out of a problem. Good coaches can make your swing better. Great coaches know when other coaches need to be involved as well.`,
    status: 'developing',
    tags: ['social-media', 'instagram', 'carousel', 'teddy', 'thought-leadership', 'coaching-philosophy'],
  }),
];
