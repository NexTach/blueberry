import type { ThemeId } from '../types/session';

export type ThemeStyle = 'chalk' | 'whiteboard' | 'brutal';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  style: ThemeStyle;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  secondary: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'green',
    name: '녹색 칠판',
    description: '가장 익숙한 클래식 분필 보드',
    style: 'chalk',
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
    name: '흑판',
    description: '짙은 대비의 진한 블랙보드',
    style: 'chalk',
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
    name: '화이트보드',
    description: '마커 느낌의 밝은 보드 화면',
    style: 'whiteboard',
    bg: '#eef7ff',
    surface: '#ffffff',
    text: '#0f1726',
    muted: 'rgba(15,23,38,0.58)',
    border: '#b7cde3',
    accent: '#1368e8',
    secondary: '#ff6b3d',
  },
  {
    id: 'warm',
    name: '네오 브루탈',
    description: '강한 대비와 박스형 그래픽',
    style: 'brutal',
    bg: '#ffe45c',
    surface: '#ffffff',
    text: '#111111',
    muted: 'rgba(17,17,17,0.66)',
    border: '#111111',
    accent: '#ff3d9a',
    secondary: '#00b7ff',
  },
];
