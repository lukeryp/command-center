export type SwingPosition = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8';

export const POSITION_NAMES: Record<SwingPosition, string> = {
  P1: 'Address',
  P2: 'Takeaway',
  P3: 'Arm Parallel Up',
  P4: 'Top',
  P5: 'Arm Parallel Down',
  P6: 'Impact',
  P7: 'Release',
  P8: 'Finish',
};

export interface SwingClip {
  id: string;
  proName: string;
  angle: 'face-on' | 'down-the-line' | 'overhead' | 'behind';
  club: 'driver' | 'iron' | 'wedge' | 'putter';
  source: string;
  positions: Record<SwingPosition, { timestamp: number; tagged: boolean }>;
  concepts: string[];
  textbookChapter?: number;
  notes?: string;
}

export interface ShotListItem {
  transcriptTimestamp: number;
  positionReference: SwingPosition | string;
  suggestedClips: string[];
  clipType: 'freeze' | 'slow-mo-loop' | 'full-speed';
  notes: string;
}

export interface ContentPiece {
  id: string;
  sourceVideoId: string;
  platform: 'instagram-carousel' | 'instagram-reel' | 'linkedin' | 'youtube' | 'email' | 'twitter' | 'blog';
  title: string;
  body: string;
  status: 'draft' | 'review' | 'ready' | 'scheduled' | 'posted';
  scheduledDate?: string;
  series?: string;
  hashtags?: string[];
  shotList?: ShotListItem[];
}

export interface VideoIntake {
  id: string;
  title: string;
  transcript: string;
  detectedPositions: { position: SwingPosition | string; timestamp: number; context: string }[];
  cascadeStatus: Record<string, 'pending' | 'draft' | 'complete'>;
  createdAt: string;
}

export type ContentPlatform = ContentPiece['platform'];
export type ContentStatus = ContentPiece['status'];

export const PLATFORMS: { value: ContentPlatform; label: string; short: string }[] = [
  { value: 'instagram-carousel', label: 'Instagram Carousel', short: 'IG Carousel' },
  { value: 'instagram-reel',     label: 'Instagram Reel',     short: 'IG Reel' },
  { value: 'linkedin',           label: 'LinkedIn',           short: 'LinkedIn' },
  { value: 'youtube',            label: 'YouTube',            short: 'YouTube' },
  { value: 'email',              label: 'Email',              short: 'Email' },
  { value: 'twitter',            label: 'Twitter / X',        short: 'Twitter' },
  { value: 'blog',               label: 'Blog',               short: 'Blog' },
];

export const SERIES_LIST = [
  'Swing Study',
  'Tour Average',
  'Zone Files',
  'The Clinic',
  'Genome Dispatch',
  'The Builders',
];

export const STATUS_COLORS: Record<ContentStatus, string> = {
  draft:     '#555',
  review:    '#f4ee19',
  ready:     '#00af51',
  scheduled: '#3b82f6',
  posted:    '#22d3ee',
};
