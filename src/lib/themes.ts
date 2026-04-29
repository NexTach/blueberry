import type { ThemeId } from '../types/session';

export type ThemeFamily = 'chalk' | 'whiteboard' | 'blackboard' | 'brutal';

export interface ThemePreset {
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

export interface ThemeFamilyPreset {
  id: ThemeFamily;
  label: string;
  description: string;
}

export const THEME_FAMILIES: ThemeFamilyPreset[] = [
  { id: 'chalk', label: '칠판 디자인', description: '목재 프레임과 분필 질감 중심' },
  { id: 'whiteboard', label: '화이트보드', description: '마커 기반의 밝은 보드 스타일' },
  { id: 'blackboard', label: '블랙보드', description: '더 깊고 차가운 검정 보드 무드' },
  { id: 'brutal', label: '네오 브루탈리즘', description: '강한 테두리와 포스터형 그래픽' },
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'green',
    family: 'chalk',
    name: '클래식 그린',
    description: '가장 익숙한 학교 칠판',
    bg: '#344034',
    surface: '#f9f7ef',
    text: '#f7f6ef',
    muted: 'rgba(255,255,255,0.58)',
    border: '#263327',
    accent: '#6abeff',
    secondary: '#e4b8d3',
  },
  {
    id: 'black',
    family: 'chalk',
    name: '크리스프 차콜',
    description: '선명한 대비의 짙은 칠판',
    bg: '#1e2820',
    surface: '#fcfcf7',
    text: '#f8f8f3',
    muted: 'rgba(255,255,255,0.56)',
    border: '#101510',
    accent: '#a8f0c6',
    secondary: '#f6d676',
  },
  {
    id: 'navy',
    family: 'chalk',
    name: '스카이 초크',
    description: '청록 바탕에 밝은 분필 포인트',
    bg: '#274842',
    surface: '#fbfbf4',
    text: '#eff5ee',
    muted: 'rgba(255,255,255,0.55)',
    border: '#1a302d',
    accent: '#ffd66b',
    secondary: '#8fd7ff',
  },
  {
    id: 'warm',
    family: 'chalk',
    name: '올리브 클래식',
    description: '빈티지한 올리브 계열 보드',
    bg: '#4b5024',
    surface: '#fbf7ec',
    text: '#f7f6ea',
    muted: 'rgba(255,255,255,0.56)',
    border: '#323616',
    accent: '#bfe7ff',
    secondary: '#f7c784',
  },
  {
    id: 'white-grid',
    family: 'whiteboard',
    name: '클린 화이트',
    description: '정갈한 마커 화이트보드',
    bg: '#eef7ff',
    surface: '#ffffff',
    text: '#0f1726',
    muted: 'rgba(15,23,38,0.58)',
    border: '#b7cde3',
    accent: '#1368e8',
    secondary: '#ff6b3d',
  },
  {
    id: 'white-note',
    family: 'whiteboard',
    name: '스티키 메모',
    description: '포스트잇이 붙은 화이트보드',
    bg: '#fff9ed',
    surface: '#ffffff',
    text: '#20212a',
    muted: 'rgba(32,33,42,0.58)',
    border: '#d7c7a8',
    accent: '#ff8a3d',
    secondary: '#27a39b',
  },
  {
    id: 'board-classic',
    family: 'blackboard',
    name: '딥 블랙보드',
    description: '분필 가루가 살아있는 검정 보드',
    bg: '#121619',
    surface: '#f7f6f1',
    text: '#f7f6f1',
    muted: 'rgba(255,255,255,0.58)',
    border: '#07090b',
    accent: '#f3f0a1',
    secondary: '#7ee6d7',
  },
  {
    id: 'board-neon',
    family: 'blackboard',
    name: '네온 초크',
    description: '야간 행사 느낌의 차가운 보드',
    bg: '#101318',
    surface: '#fbfaf7',
    text: '#f7fbff',
    muted: 'rgba(255,255,255,0.6)',
    border: '#050608',
    accent: '#59f0ff',
    secondary: '#ff63b0',
  },
  {
    id: 'brutal-pop',
    family: 'brutal',
    name: '팝 스트라이크',
    description: '형광 핑크와 시안의 충돌',
    bg: '#ffe45c',
    surface: '#ffffff',
    text: '#111111',
    muted: 'rgba(17,17,17,0.68)',
    border: '#111111',
    accent: '#ff3d9a',
    secondary: '#00b7ff',
  },
  {
    id: 'brutal-editorial',
    family: 'brutal',
    name: '오렌지 스택',
    description: '포스터형 블록이 겹치는 구도',
    bg: '#ffb347',
    surface: '#fff8ee',
    text: '#111111',
    muted: 'rgba(17,17,17,0.7)',
    border: '#111111',
    accent: '#ff5a36',
    secondary: '#4d6bff',
  },
];

export function findTheme(themeId: ThemeId | undefined) {
  return THEME_PRESETS.find((theme) => theme.id === themeId) ?? THEME_PRESETS[0];
}
