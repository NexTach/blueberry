import { applyTemplate, type TemplateId } from '../../lib/openai';
import { THEME_PRESETS } from '../../lib/themes';
import type { TemplateOption, ThemeOption, AIToneOption, AiToneId } from './types';

export const DEFAULT_TEMPLATE_ID: TemplateId = 2;
export const AI_TEMPLATE_ID: TemplateId = 7;
export const FALLBACK_VISITOR_NAME = '방문자';
export const DEFAULT_AI_TONE: AiToneId = 'warm';

export const TEMPLATES: TemplateOption[] = [
  {
    id: 2,
    label: '학교 환영',
    description: '학교 방문 인사',
    accent: 'bg-sky-50 text-sky-700',
    mode: 'template',
    preview: (name) => applyTemplate(name, 2) ?? '',
  },
  {
    id: 3,
    label: '밝은 안내',
    description: '가볍고 산뜻하게',
    accent: 'bg-amber-50 text-amber-700',
    mode: 'template',
    preview: (name) => applyTemplate(name, 3) ?? '',
  },
  {
    id: 4,
    label: '차분한 인사',
    description: '정돈된 톤의 문구',
    accent: 'bg-slate-100 text-slate-700',
    mode: 'template',
    preview: (name) => applyTemplate(name, 4) ?? '',
  },
  {
    id: 5,
    label: '센스 있는 한마디',
    description: '조금 더 눈에 띄게',
    accent: 'bg-pink-50 text-pink-700',
    mode: 'template',
    preview: (name) => applyTemplate(name, 5) ?? '',
  },
  {
    id: 6,
    label: '에너지 충전',
    description: '힘나는 느낌으로',
    accent: 'bg-violet-50 text-violet-700',
    mode: 'template',
    preview: (name) => applyTemplate(name, 6) ?? '',
  },
  {
    id: 7,
    label: 'AI 창의 생성',
    description: '명령에 맞춰 자유 생성',
    accent: 'bg-black text-white',
    mode: 'ai',
    preview: () => 'TV 화면에서 AI가 특별한 문구를 생성합니다 ✨',
  },
];

export const THEMES: ThemeOption[] = THEME_PRESETS;

export const AI_TONES: AIToneOption[] = [
  { id: 'warm', label: '따뜻하게', description: '포근하고 다정한 분위기' },
  { id: 'bright', label: '밝고 경쾌하게', description: '생기 있고 활발한 분위기' },
  { id: 'formal', label: '정중하게', description: '차분하고 단정한 표현' },
  { id: 'playful', label: '재치 있게', description: '센스 있고 기억에 남게' },
];
