import { THEMES } from '../constants';
import type { ThemeId } from '../../../types/session';

interface ThemePickerProps {
  selectedTheme: ThemeId;
  onSelect: (id: ThemeId) => void;
}

export default function ThemePicker({ selectedTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {THEMES.map((theme) => {
        const selected = selectedTheme === theme.id;

        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
            style={{ borderColor: selected ? theme.accent : 'transparent', background: theme.bg }}
          >
            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: theme.accent }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {theme.name}
            </span>
            {selected && (
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
        );
      })}
    </div>
  );
}
