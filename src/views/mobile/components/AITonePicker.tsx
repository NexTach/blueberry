import { AI_TONES } from '../constants';
import { mobilePalette, mobileSpacing, mobileTypography } from '../design';
import type { AiToneId } from '../types';

interface AITonePickerProps {
  selectedTone: AiToneId;
  onSelect: (tone: AiToneId) => void;
}

export default function AITonePicker({ selectedTone, onSelect }: AITonePickerProps) {
  const palette = mobilePalette;
  const selectedBorder = palette.accent;

  return (
    <div className="flex flex-col" style={{ gap: mobileSpacing.item }}>
      {AI_TONES.map((tone) => (
        <button
          key={tone.id}
          onClick={() => onSelect(tone.id)}
          className="text-left transition-colors"
          style={{
            borderRadius: 18,
            border: `1px solid ${selectedTone === tone.id ? selectedBorder : palette.line}`,
            background: selectedTone === tone.id ? palette.accentSoft : palette.surface,
            padding: 14,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p style={{ color: palette.text, fontSize: mobileTypography.label.fontSize, lineHeight: mobileTypography.label.lineHeight, fontWeight: mobileTypography.label.fontWeight }}>
                {tone.label}
              </p>
              <p style={{ color: palette.subtext, fontSize: mobileTypography.caption.fontSize, lineHeight: mobileTypography.caption.lineHeight, fontWeight: mobileTypography.caption.fontWeight, marginTop: 4 }}>
                {tone.description}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full"
              style={{
                width: 20,
                height: 20,
                border: `1.5px solid ${selectedTone === tone.id ? palette.accent : palette.line}`,
                background: selectedTone === tone.id ? palette.accent : palette.surface,
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
