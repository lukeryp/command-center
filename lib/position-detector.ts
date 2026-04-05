import { SwingPosition } from './content-types';

interface DetectedPosition {
  position: SwingPosition | string;
  timestamp: number;
  context: string;
  matchType: 'explicit' | 'natural-language';
}

// Direct P1-P8 pattern
const EXPLICIT_REGEX = /\bP([1-8])\b/gi;

// Natural language → position mapping
const NL_MAP: { pattern: RegExp; positions: SwingPosition[] }[] = [
  { pattern: /\baddress\b/gi,                                     positions: ['P1'] },
  { pattern: /\bset ?up\b|\bset-up\b/gi,                          positions: ['P1'] },
  { pattern: /\bsetup\b/gi,                                        positions: ['P1'] },
  { pattern: /\btakeaway\b/gi,                                     positions: ['P2'] },
  { pattern: /\bfirst move\b/gi,                                   positions: ['P2'] },
  { pattern: /\bhalf ?way back\b/gi,                               positions: ['P3'] },
  { pattern: /\barm.{0,10}parallel.{0,10}(up|back)\b/gi,          positions: ['P3'] },
  { pattern: /\btop of (the )?backswing\b/gi,                      positions: ['P4'] },
  { pattern: /\bat the top\b/gi,                                   positions: ['P4'] },
  { pattern: /\btransition\b/gi,                                   positions: ['P4', 'P5'] },
  { pattern: /\bhalf ?way down\b/gi,                               positions: ['P5'] },
  { pattern: /\barm.{0,10}parallel.{0,10}down\b/gi,               positions: ['P5'] },
  { pattern: /\bslot\b/gi,                                         positions: ['P5'] },
  { pattern: /\bimpact\b/gi,                                       positions: ['P6'] },
  { pattern: /\bcontact\b/gi,                                      positions: ['P6'] },
  { pattern: /\bbusiness end\b/gi,                                 positions: ['P6'] },
  { pattern: /\bP6\b|\bposition 6\b/gi,                           positions: ['P6'] },
  { pattern: /\brelease\b/gi,                                      positions: ['P7'] },
  { pattern: /\bfollow.{0,10}through\b/gi,                        positions: ['P7', 'P8'] },
  { pattern: /\bextension\b/gi,                                    positions: ['P7'] },
  { pattern: /\bfinish\b/gi,                                       positions: ['P8'] },
  { pattern: /\bcompletion\b/gi,                                   positions: ['P8'] },
  { pattern: /\blag\b/gi,                                          positions: ['P4', 'P5'] },
  { pattern: /\bdownswing\b/gi,                                    positions: ['P5', 'P6'] },
  { pattern: /\bbackswing\b/gi,                                    positions: ['P2', 'P3', 'P4'] },
];

function getContext(transcript: string, index: number, matchLength: number, window = 60): string {
  const start = Math.max(0, index - window);
  const end   = Math.min(transcript.length, index + matchLength + window);
  return transcript.slice(start, end).replace(/\s+/g, ' ').trim();
}

// Naive timestamp estimation: ~150 words/min speech rate
function estimateTimestamp(transcript: string, charIndex: number): number {
  const preceding = transcript.slice(0, charIndex);
  const wordCount = preceding.split(/\s+/).filter(Boolean).length;
  return Math.round((wordCount / 150) * 60 * 10) / 10; // seconds, 1dp
}

export function detectPositions(transcript: string): DetectedPosition[] {
  const results: DetectedPosition[] = [];
  const seen = new Set<string>(); // deduplicate by position+timestamp

  // 1. Explicit P1-P8 references
  let match: RegExpExecArray | null;
  const explicitRe = new RegExp(EXPLICIT_REGEX.source, 'gi');
  while ((match = explicitRe.exec(transcript)) !== null) {
    const position = `P${match[1]}` as SwingPosition;
    const timestamp = estimateTimestamp(transcript, match.index);
    const key = `${position}-${timestamp}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({
        position,
        timestamp,
        context: getContext(transcript, match.index, match[0].length),
        matchType: 'explicit',
      });
    }
  }

  // 2. Natural language references
  for (const { pattern, positions } of NL_MAP) {
    const re = new RegExp(pattern.source, 'gi');
    while ((match = re.exec(transcript)) !== null) {
      const timestamp = estimateTimestamp(transcript, match.index);
      const context   = getContext(transcript, match.index, match[0].length);
      for (const position of positions) {
        const key = `${position}-${timestamp}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ position, timestamp, context, matchType: 'natural-language' });
        }
      }
    }
  }

  // Sort by timestamp
  return results.sort((a, b) => a.timestamp - b.timestamp);
}
