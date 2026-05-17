import type { TemplateId } from '../../lib/openai';
import type { ThemeFamily } from '../../lib/themes';
import type { ThemeId } from '../../types/session';

export type Step = 'choose' | 'start' | 'listening' | 'preview' | 'confirm' | 'done';
export type AiToneId = 'warm' | 'bright' | 'formal' | 'playful';
export type ConfirmStage = 'template' | 'content' | 'tone' | 'theme' | 'name';

export interface TemplateOption {
  id: TemplateId;
  label: string;
  description: string;
  accent: string;
  mode: 'template' | 'ai';
  preview: (name: string) => string;
}

export interface ThemeOption {
  id: ThemeId;
  family: ThemeFamily;
  name: string;
  description: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  secondary: string;
}

export interface AIToneOption {
  id: AiToneId;
  label: string;
  description: string;
}

export interface CommandInterpretation {
  templateId: TemplateId;
  tone: AiToneId;
  name: string;
  prompt: string;
}
