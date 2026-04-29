import type { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'standby' | 'displaying';

export interface Session {
  status: SessionStatus;
  visitorName: string;
  welcomeMessage: string;
  updatedAt: Timestamp | null;
}