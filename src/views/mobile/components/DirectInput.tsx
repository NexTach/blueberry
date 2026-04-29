import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';

interface DirectInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function DirectInput({ value, onChange, onSubmit, onBack, disabled = false }: DirectInputProps) {
  const palette = mobilePalette;

  return (
    <div className="flex w-full flex-col" style={{ gap: mobileSpacing.item }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit(value.trim())}
        placeholder="띄울 내용을 입력하세요"
        disabled={disabled}
        className="w-full px-4 outline-none transition-colors disabled:opacity-50"
        style={{
          minHeight: mobileControl.inputMinHeight,
          borderRadius: mobileRadius.field,
          border: `1px solid ${palette.line}`,
          background: palette.surface,
          color: palette.text,
          fontSize: mobileTypography.body.fontSize,
          lineHeight: mobileTypography.body.lineHeight,
          letterSpacing: mobileTypography.body.letterSpacing,
          fontWeight: mobileTypography.body.fontWeight,
        }}
        autoFocus
      />

      <div className="flex w-full" style={{ gap: mobileSpacing.item }}>
        <button
          onClick={onBack}
          disabled={disabled}
          className="w-full disabled:opacity-40"
          style={{
            minHeight: mobileControl.buttonHeight,
            borderRadius: mobileRadius.button,
            border: `1px solid ${palette.line}`,
            background: palette.surface,
            color: palette.subtext,
            fontSize: mobileTypography.bodySmall.fontSize,
            lineHeight: mobileTypography.bodySmall.lineHeight,
            letterSpacing: mobileTypography.bodySmall.letterSpacing,
            fontWeight: 600,
          }}
        >
          이전으로
        </button>
        <button
          onClick={() => value.trim() && onSubmit(value.trim())}
          disabled={disabled || !value.trim()}
          className="w-full disabled:opacity-30 transition-opacity"
          style={{
            minHeight: mobileControl.buttonHeight,
            borderRadius: mobileRadius.button,
            background: palette.accent,
            color: '#ffffff',
            fontSize: mobileTypography.bodySmall.fontSize,
            lineHeight: mobileTypography.bodySmall.lineHeight,
            letterSpacing: mobileTypography.bodySmall.letterSpacing,
            fontWeight: 600,
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
