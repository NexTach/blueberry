import type { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'standby' | 'generating' | 'displaying';

export interface Session {
  status: SessionStatus;
  visitorName: string;
  welcomeMessage: string; // 비어있으면 desktop에서 AI 생성
  updatedAt: Timestamp | null;
}
