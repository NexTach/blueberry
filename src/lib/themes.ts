import type { ThemeId } from '../types/session';

export type ThemeFamily = 'chalk' | 'whiteboard' | 'blackboard' | 'brutal';

const CHALK_KR = "'HakgyoansimBunpil', sans-serif";
const WHITEBOARD_MARKER_TITLE = "'Cafe24SsuksukLight', 'Cafe24Ssuksuk', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const WHITEBOARD_MARKER_BODY = "'Cafe24SsuksukLight', 'Cafe24Gowoonbam', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const WHITEBOARD_NOTE_TITLE = "'Cafe24Gowoonbam', 'Cafe24SsuksukLight', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const WHITEBOARD_NOTE_BODY = "'Cafe24SsuksukLight', 'Cafe24Gowoonbam', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const BLACKBOARD_MARKER_TITLE = "'Cafe24SuperMagic', 'Cafe24Ssuksuk', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const BLACKBOARD_MARKER_BODY = "'Cafe24Ssuksuk', 'Cafe24SsuksukLight', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const BLACKBOARD_NEON_TITLE = "'Cafe24SuperMagic', 'Cafe24Gowoonbam', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const BLACKBOARD_NEON_BODY = "'Cafe24SsuksukLight', 'Cafe24Ssuksuk', 'Apple SD Gothic Neo', 'Malgun Gothic', cursive";
const BRUTAL_POP_TITLE = "'KccSign', 'Cafe24Surround', var(--font-black-han-sans), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
const BRUTAL_POP_BODY = "'Cafe24SurroundAir', 'Cafe24Surround', var(--font-do-hyeon), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
const BRUTAL_EDITORIAL_TITLE = "'Cafe24Surround', 'KccSign', var(--font-black-han-sans), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
const BRUTAL_EDITORIAL_BODY = "'Cafe24SurroundAir', 'Cafe24Gowoonbam', var(--font-song-myung), 'Apple SD Gothic Neo', 'Malgun Gothic', serif";
const BRUTAL_BAUHAUS_TITLE = "'KccSign', 'Cafe24Surround', var(--font-black-han-sans), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
const BRUTAL_BAUHAUS_BODY = "'Cafe24SurroundAir', 'Cafe24Surround', var(--font-do-hyeon), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

export interface ThemePreset {
  id: ThemeId;
  family: ThemeFamily;
  name: string;
  description: string;
  titleFont: string;
  bodyFont: string;
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
  { id: 'chalk', label: '칠판', description: '학교 칠판 느낌의 익숙한 화면' },
  { id: 'whiteboard', label: '화이트보드', description: '밝고 깔끔한 보드 화면' },
  { id: 'blackboard', label: '블랙보드', description: '더 진하고 선명한 검정 보드' },
  { id: 'brutal', label: '포스터 스타일', description: '강한 색과 박스형 그래픽 화면' },
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'green',
    family: 'chalk',
    name: '기본 칠판',
    description: '가장 무난한 초록 칠판',
    titleFont: CHALK_KR,
    bodyFont: CHALK_KR,
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
    name: '진한 칠판',
    description: '더 또렷한 어두운 칠판',
    titleFont: CHALK_KR,
    bodyFont: CHALK_KR,
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
    name: '청록 칠판',
    description: '시원한 느낌의 청록 칠판',
    titleFont: CHALK_KR,
    bodyFont: CHALK_KR,
    bg: '#274842',
    surface: '#fbfbf4',
    text: '#eff5ee',
    muted: 'rgba(255,255,255,0.55)',
    border: '#1a302d',
    accent: '#ffd66b',
    secondary: '#8fd7ff',
  },
  {
    id: 'white-grid',
    family: 'whiteboard',
    name: '기본 화이트보드',
    description: '깨끗하고 정돈된 화이트보드',
    titleFont: WHITEBOARD_MARKER_TITLE,
    bodyFont: WHITEBOARD_MARKER_BODY,
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
    name: '메모 화이트보드',
    description: '메모가 붙은 친근한 화이트보드',
    titleFont: WHITEBOARD_NOTE_TITLE,
    bodyFont: WHITEBOARD_NOTE_BODY,
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
    name: '기본 블랙보드',
    description: '깊은 검정 톤의 클래식 보드',
    titleFont: BLACKBOARD_MARKER_TITLE,
    bodyFont: BLACKBOARD_MARKER_BODY,
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
    name: '네온 블랙보드',
    description: '포인트 색이 강한 야간 느낌 보드',
    titleFont: BLACKBOARD_NEON_TITLE,
    bodyFont: BLACKBOARD_NEON_BODY,
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
    name: '팝 포스터',
    description: '톡톡 튀는 색감의 포스터 화면',
    titleFont: BRUTAL_POP_TITLE,
    bodyFont: BRUTAL_POP_BODY,
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
    name: '스택 포스터',
    description: '블록이 겹치는 강한 포스터 화면',
    titleFont: BRUTAL_EDITORIAL_TITLE,
    bodyFont: BRUTAL_EDITORIAL_BODY,
    bg: '#ffb347',
    surface: '#fff8ee',
    text: '#111111',
    muted: 'rgba(17,17,17,0.7)',
    border: '#111111',
    accent: '#ff5a36',
    secondary: '#4d6bff',
  },
  {
    id: 'brutal-bauhaus',
    family: 'brutal',
    name: '바우하우스 포스터',
    description: '도형과 굵은 타이포가 중심인 전시 포스터 화면',
    titleFont: BRUTAL_BAUHAUS_TITLE,
    bodyFont: BRUTAL_BAUHAUS_BODY,
    bg: '#ece9e2',
    surface: '#f4f2ed',
    text: '#111111',
    muted: 'rgba(17,17,17,0.68)',
    border: '#111111',
    accent: '#ff5a36',
    secondary: '#ffd400',
  },
];

export function findTheme(themeId: ThemeId | undefined) {
  return THEME_PRESETS.find((theme) => theme.id === themeId) ?? THEME_PRESETS[0];
}
