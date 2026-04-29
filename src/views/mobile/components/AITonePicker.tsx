import { AI_TONES } from '../constants';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import type { AiToneId } from '../types';

interface AITonePickerProps {
  selectedTone: AiToneId;
  onSelect: (tone: AiToneId) => void;
}

export default function AITonePicker({ selectedTone, onSelect }: AITonePickerProps) {
  const palette = mobilePalette;
  const selectedBorder = palette.accent;

  return (
    <div className="grid grid-cols-2" style={{ gap: mobileSpacing.item }}>
      {AI_TONES.map((tone) => (
        <button
          key={tone.id}
          onClick={() => onSelect(tone.id)}
          className="text-left transition-colors"
          style={{
            minHeight: mobileControl.inputMinHeight,
            borderRadius: mobileRadius.field,
            border: `2px solid ${selectedTone === tone.id ? selectedBorder : palette.line}`,
            background: palette.surface,
            padding: 16,
          }}
        >
          <p style={{ color: palette.text, fontSize: mobileTypography.label.fontSize, lineHeight: mobileTypography.label.lineHeight, fontWeight: mobileTypography.label.fontWeight }}>
            {tone.label}
          </p>
          <p style={{ color: palette.subtext, fontSize: mobileTypography.caption.fontSize, lineHeight: mobileTypography.caption.lineHeight, fontWeight: mobileTypography.caption.fontWeight, marginTop: 4 }}>
            {tone.description}
          </p>
        </button>
      ))}
    </div>
  );
}
