import { findTheme, THEME_FAMILIES } from '../../../lib/themes';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import { THEMES } from '../constants';
import type { ThemeId } from '../../../types/session';

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
        <div className="grid grid-cols-2" style={{ gap: mobileSpacing.item }}>
          {THEME_FAMILIES.map((family) => {
            const selected = family.id === selectedFamily;

            return (
              <button
                key={family.id}
                onClick={() => {
                  const nextTheme = THEMES.find((theme) => theme.family === family.id);
                  if (nextTheme) onSelect(nextTheme.id);
                }}
                className="text-left transition-colors"
                style={{
                  minHeight: mobileControl.inputMinHeight,
                  borderRadius: mobileRadius.field,
                  border: `2px solid ${selected ? selectedBorder : palette.line}`,
                  background: palette.surface,
                  padding: 16,
                }}
              >
                <p
                  style={{
                    color: palette.text,
                    fontSize: mobileTypography.bodySmall.fontSize,
                    lineHeight: mobileTypography.bodySmall.lineHeight,
                    letterSpacing: mobileTypography.bodySmall.letterSpacing,
                    fontWeight: 600,
                  }}
                >
                  {family.label}
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
                  {family.description}
                </p>
              </button>
            );
          })}
        </div>
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
        <div className="grid grid-cols-2" style={{ gap: mobileSpacing.item }}>
          {familyThemes.map((theme) => {
            const selected = selectedTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className="text-left transition-colors"
                style={{
                  borderRadius: mobileRadius.option,
                  border: `2px solid ${selected ? selectedBorder : palette.line}`,
                  background: palette.surface,
                  padding: mobileControl.sectionPadding,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: theme.accent }} />
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
                </div>
                <p
                  className="mt-2"
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
                <div className="mt-3 flex gap-2">
                  <span className="h-8 flex-1 rounded-md" style={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
                  <span className="h-8 w-8 rounded-md" style={{ background: theme.surface, border: `1px solid ${theme.border}` }} />
                  <span className="h-8 w-8 rounded-md" style={{ background: theme.accent }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
