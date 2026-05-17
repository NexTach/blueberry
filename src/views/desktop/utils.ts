import { useEffect, useState } from 'react';
import type { ThemePreset } from '../../lib/themes';
import type { DateFormat } from '../../types/session';

export function formatDateTime(date: Date, format: DateFormat = 'korean') {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (format === 'western') {
    return `${year}.${month}.${day} ${hours < 12 ? 'AM' : 'PM'} ${hours % 12 || 12}:${minutes}`;
  }
  return `${year}년 ${month}월 ${day}일 ${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}:${minutes}분`;
}

export function useClock(format: DateFormat) {
  const [time, setTime] = useState(() => formatDateTime(new Date(), format));

  useEffect(() => {
    const id = setInterval(() => setTime(formatDateTime(new Date(), format)), 1000);
    return () => clearInterval(id);
  }, [format]);

  return time;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeDisplayName(name: string | undefined) {
  return name?.trim().replace(/님\s*$/, '') ?? '';
}

export function normalizeMessageBody(message: string | undefined, name: string | undefined) {
  if (!message?.trim()) return '마음을 전하는 한마디를 준비했습니다!';
  const displayName = normalizeDisplayName(name);
  if (!displayName) return message.trim();

  return message
    .trim()
    .replace(new RegExp(`^${escapeRegex(displayName)}님,?\\s*`), '')
    .trim();
}

export function rootBackground(theme: ThemePreset) {
  if (theme.id === 'brutal-bauhaus') return theme.bg;
  if (theme.family === 'brutal') return `linear-gradient(135deg, ${theme.bg} 0%, ${theme.surface} 160%)`;
  return theme.bg;
}

export function rootFont(theme: ThemePreset) {
  return theme.bodyFont;
}
