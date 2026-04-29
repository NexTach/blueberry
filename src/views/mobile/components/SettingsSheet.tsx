import { useState } from 'react';
import { updateTheme } from '../../../lib/firebase';
import { THEMES } from '../constants';
import type { ThemeId } from '../../../types/session';

interface SettingsSheetProps {
  onClose: () => void;
}

export default function SettingsSheet({ onClose }: SettingsSheetProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ThemeId | null>(null);

  async function handleSelectTheme(id: ThemeId) {
    setSaving(true);
    await updateTheme(id);
    setSaving(false);
    setSaved(id);
    setTimeout(() => setSaved(null), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-t-3xl px-6 pt-5 pb-10 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">TV 설정</p>
          <button onClick={onClose} className="text-sm text-gray-400">
            닫기
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">칠판 테마</p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                disabled={saving}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
                style={{ borderColor: saved === theme.id ? theme.accent : 'transparent', background: theme.bg }}
              >
                <div className="w-4 h-4 rounded-full shrink-0" style={{ background: theme.accent }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {theme.name}
                </span>
                {saved === theme.id && (
                  <svg
                    className="ml-auto shrink-0"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">선택하면 TV 화면에 즉시 반영됩니다</p>
        </div>
      </div>
    </div>
  );
}
