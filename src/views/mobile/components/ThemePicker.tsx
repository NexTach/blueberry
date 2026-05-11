import { findTheme, THEME_FAMILIES } from '@/src/lib/themes';
import { mobilePalette, mobileSpacing, mobileTypography } from '../design';
import { THEMES } from '../constants';
import type { ThemeId } from '@/src/types/session';

interface ThemePickerProps {
  selectedTheme: ThemeId;
  onSelect: (id: ThemeId) => void;
}

export default function ThemePicker({ selectedTheme, onSelect }: ThemePickerProps) {
  const palette = mobilePalette;
  const selectedBorder = palette.accent;
  const selectedFamily = findTheme(selectedTheme).family;
  const familyThemes = THEMES.filter((theme) => theme.family === selectedFamily);

  return (
    <div className="flex flex-col" style={{ gap: mobileSpacing.group }}>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <p
          style={{
            color: palette.text,
            fontSize: mobileTypography.label.fontSize,
            lineHeight: mobileTypography.label.lineHeight,
            fontWeight: mobileTypography.label.fontWeight,
          }}
        >
          디자인 종류
        </p>
        <div className="flex flex-wrap" style={{ gap: mobileSpacing.item }}>
          {THEME_FAMILIES.map((family) => {
            const selected = family.id === selectedFamily;

            return (
              <button
                key={family.id}
                onClick={() => {
                  const nextTheme = THEMES.find((theme) => theme.family === family.id);
                  if (nextTheme) onSelect(nextTheme.id);
                }}
                className="transition-colors"
                style={{
                  minHeight: 38,
                  borderRadius: 999,
                  border: `1.5px solid ${selected ? selectedBorder : palette.line}`,
                  background: selected ? palette.accentSoft : palette.surface,
                  paddingInline: 14,
                  paddingBlock: 8,
                }}
              >
                <p
                  style={{
                    color: palette.text,
                    fontSize: mobileTypography.label.fontSize,
                    lineHeight: mobileTypography.label.lineHeight,
                    letterSpacing: mobileTypography.label.letterSpacing,
                    fontWeight: 600,
                  }}
                >
                  {family.label}
                </p>
              </button>
            );
          })}
        </div>
        <p
          style={{
            color: palette.subtext,
            fontSize: mobileTypography.caption.fontSize,
            lineHeight: mobileTypography.caption.lineHeight,
            letterSpacing: mobileTypography.caption.letterSpacing,
            fontWeight: mobileTypography.caption.fontWeight,
          }}
        >
          {THEME_FAMILIES.find((family) => family.id === selectedFamily)?.description}
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 8 }}>
        <p
          style={{
            color: palette.text,
            fontSize: mobileTypography.label.fontSize,
            lineHeight: mobileTypography.label.lineHeight,
            fontWeight: mobileTypography.label.fontWeight,
          }}
        >
          세부 테마
        </p>
        <div className="flex flex-col" style={{ gap: mobileSpacing.item }}>
          {familyThemes.map((theme) => {
            const selected = selectedTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className="text-left transition-colors"
                style={{
                  borderRadius: 18,
                  border: `1.5px solid ${selected ? selectedBorder : palette.line}`,
                  background: selected ? palette.accentSoft : palette.surface,
                  padding: 14,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      style={{
                        color: palette.text,
                        fontSize: mobileTypography.bodySmall.fontSize,
                        lineHeight: mobileTypography.bodySmall.lineHeight,
                        letterSpacing: mobileTypography.bodySmall.letterSpacing,
                        fontWeight: 600,
                      }}
                    >
                      {theme.name}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        color: palette.subtext,
                        fontSize: mobileTypography.caption.fontSize,
                        lineHeight: mobileTypography.caption.lineHeight,
                        letterSpacing: mobileTypography.caption.letterSpacing,
                        fontWeight: mobileTypography.caption.fontWeight,
                      }}
                    >
                      {theme.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <span className="h-6 w-6 rounded-full" style={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
                    <span className="h-6 w-6 rounded-full" style={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
                    <span className="h-6 w-6 rounded-full" style={{ background: theme.accent }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
