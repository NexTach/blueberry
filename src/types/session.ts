import type { Timestamp } from 'firebase/firestore';
import type { TemplateId } from '../lib/openai';

export type SessionStatus = 'standby' | 'generating' | 'displaying';
export type DateFormat = 'korean' | 'western';
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
  dateFormat?: DateFormat;
  tone?: string;
  updatedAt: Timestamp | null;
}
