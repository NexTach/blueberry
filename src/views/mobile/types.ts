import type { TemplateId } from '../../lib/openai';
import type { ThemeId } from '../../types/session';

export type Step = 'choose' | 'start' | 'listening' | 'confirm' | 'done';
export type AiToneId = 'warm' | 'bright' | 'formal' | 'playful';

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
  name: string;
  bg: string;
  accent: string;
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
