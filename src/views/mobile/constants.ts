import type { TemplateId } from '../../lib/openai';
import type { TemplateOption, ThemeOption, AIToneOption, AiToneId } from './types';

export const DEFAULT_TEMPLATE_ID: TemplateId = 1;
export const AI_TEMPLATE_ID: TemplateId = 7;
export const FALLBACK_VISITOR_NAME = '방문자';
export const DEFAULT_AI_TONE: AiToneId = 'warm';

export const TEMPLATES: TemplateOption[] = [
  {
    id: 1,
    label: '간단 환영',
    description: '가장 기본적인 인사',
    accent: 'bg-emerald-50 text-emerald-700',
    mode: 'template',
    preview: (name) => `${name}님, 환영합니다!`,
  },
  {
    id: 2,
    label: '학교 환영',
    description: '학교 방문 인사',
    accent: 'bg-sky-50 text-sky-700',
    mode: 'template',
    preview: (name) => `${name}님, 광주SW마이스터고에 오신 것을 환영합니다!`,
  },
  {
    id: 3,
    label: '밝은 안내',
    description: '가볍고 산뜻하게',
    accent: 'bg-amber-50 text-amber-700',
    mode: 'template',
    preview: (name) => `${name}님, 오늘 이 공간에서 즐거운 시간 보내세요!`,
  },
  {
    id: 4,
    label: '차분한 인사',
    description: '정돈된 톤의 문구',
    accent: 'bg-slate-100 text-slate-700',
    mode: 'template',
    preview: (name) => `${name}님, 반갑습니다. 편안하게 둘러보세요!`,
  },
  {
    id: 5,
    label: '센스 있는 한마디',
    description: '조금 더 눈에 띄게',
    accent: 'bg-pink-50 text-pink-700',
    mode: 'template',
    preview: (name) => `${name}님, 오늘의 주인공처럼 빛나는 하루 보내세요!`,
  },
  {
    id: 6,
    label: '에너지 충전',
    description: '힘나는 느낌으로',
    accent: 'bg-violet-50 text-violet-700',
    mode: 'template',
    preview: (name) => `${name}님, 좋은 에너지 가득 안고 다녀가세요!`,
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

export const THEMES: ThemeOption[] = [
  { id: 'green', name: '녹색 칠판', bg: '#344034', accent: '#6abeff' },
  { id: 'black', name: '흑판', bg: '#1e2820', accent: '#a8f0c6' },
  { id: 'navy', name: '남색 보드', bg: '#1a2744', accent: '#ffb347' },
  { id: 'warm', name: '먹판', bg: '#1f1a14', accent: '#ff9fd6' },
];

export const AI_TONES: AIToneOption[] = [
  { id: 'warm', label: '따뜻하게', description: '포근하고 다정한 환영' },
  { id: 'bright', label: '밝고 경쾌하게', description: '생기 있고 활발한 분위기' },
  { id: 'formal', label: '정중하게', description: '차분하고 단정한 표현' },
  { id: 'playful', label: '재치 있게', description: '센스 있고 기억에 남게' },
];
