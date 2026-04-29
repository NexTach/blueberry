import type { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'standby' | 'generating' | 'displaying';
export type ThemeId = 'green' | 'black' | 'navy' | 'warm';

export interface Session {
  status: SessionStatus;
  visitorName: string;
  welcomeMessage: string;
  themeId?: ThemeId;
  updatedAt: Timestamp | null;
}
