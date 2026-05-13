import type { Timestamp } from 'firebase/firestore';
import type { TemplateId } from '../lib/openai';

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
  | 'brutal-editorial'
  | 'brutal-bauhaus';

export interface Session {
  status: SessionStatus;
  visitorName: string;
  welcomeMessage: string;
  templateId?: TemplateId | null;
  sourcePrompt?: string;
  generationId?: string;
  themeId?: ThemeId;
  tone?: string;
  rotation?: 0 | 90 | 180 | 270;
  updatedAt: Timestamp | null;
}
