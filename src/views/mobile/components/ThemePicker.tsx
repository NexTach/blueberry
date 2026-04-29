import { THEME_FAMILIES } from '../../../lib/themes';
import { THEMES } from '../constants';
import type { ThemeId } from '../../../types/session';

interface ThemePickerProps {
  selectedTheme: ThemeId;
  onSelect: (id: ThemeId) => void;
}

export default function ThemePicker({ selectedTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-5">
      {THEME_FAMILIES.map((family) => (
        <div key={family.id} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-900">{family.label}</p>
            <p className="text-xs text-gray-500">{family.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {THEMES.filter((theme) => theme.family === family.id).map((theme) => {
              const selected = selectedTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => onSelect(theme.id)}
                  className="flex flex-col items-start gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all active:scale-[0.99]"
                  style={{
                    borderColor: selected ? theme.accent : theme.border,
                    background:
                      theme.family === 'whiteboard'
                        ? `linear-gradient(135deg, ${theme.surface} 0%, ${theme.bg} 100%)`
                        : theme.family === 'brutal'
                          ? `linear-gradient(135deg, ${theme.bg} 0%, ${theme.surface} 100%)`
                          : theme.bg,
                    boxShadow: selected ? `0 0 0 2px ${theme.accent}22` : 'none',
                  }}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ background: theme.accent }} />
                      <span className="text-sm font-semibold" style={{ color: theme.text }}>
                        {theme.name}
                      </span>
                    </div>
                    {selected && (
                      <svg
                        className="shrink-0"
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
                  </div>

                  <div
                    className="w-full rounded-xl px-3 py-2 text-xs leading-5"
                    style={{
                      color: theme.text,
                      background: family.id === 'chalk' || family.id === 'blackboard' ? 'rgba(255,255,255,0.12)' : `${theme.surface}cc`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {theme.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
