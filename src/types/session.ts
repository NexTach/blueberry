import type { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'standby' | 'generating' | 'displaying';
export type ThemeId =
  | 'green'
  | 'black'
  | 'navy'
  | 'warm'
  | 'white-grid'
  | 'white-note'
  | 'board-classic'
  | 'board-neon'
  | 'brutal-pop'
  | 'brutal-editorial';

export interface Session {
  status: SessionStatus;
  visitorName: string;
  welcomeMessage: string;
  themeId?: ThemeId;
  tone?: string;
  updatedAt: Timestamp | null;
}
