import { mobilePalette, mobileSpacing, mobileTypography } from '../design';
import type { DateFormat } from '../../../types/session';

interface DateFormatPickerProps {
  selectedFormat: DateFormat;
  onSelect: (format: DateFormat) => void;
}

const FORMAT_OPTIONS: { id: DateFormat; label: string; preview: string }[] = [
  { id: 'korean', label: '한국어 형식', preview: '2026년 4월 13일 오후 5:43분' },
  { id: 'western', label: '서양 형식', preview: '2026.4.13 PM 5:43' },
];

export default function DateFormatPicker({ selectedFormat, onSelect }: DateFormatPickerProps) {
  const palette = mobilePalette;

  return (
    <div className="flex flex-col" style={{ gap: mobileSpacing.item }}>
      {FORMAT_OPTIONS.map((option) => {
        const selected = selectedFormat === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="text-left transition-colors"
            style={{
              borderRadius: 18,
              border: `1.5px solid ${selected ? palette.accent : palette.line}`,
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
                  {option.label}
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
                  {option.preview}
                </p>
              </div>
              {selected && (
                <div
                  className="shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: 22, height: 22, background: palette.accent }}
                >
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}