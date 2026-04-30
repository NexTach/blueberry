import { isSpeechSupported } from '../../../lib/speech';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import DirectInput from './DirectInput';

interface StartScreenProps {
  showDirectInput: boolean;
  directInputText: string;
  error: string | null;
  isInterpreting: boolean;
  onStartListening: () => void;
  onDirectInputChange: (text: string) => void;
  onShowDirectInput: () => void;
  onDirectSubmit: (command: string) => void;
  onDirectBack: () => void;
  onBack: () => void;
}

export default function StartScreen({
  showDirectInput,
  directInputText,
  error,
  isInterpreting,
  onStartListening,
  onDirectInputChange,
  onShowDirectInput,
  onDirectSubmit,
  onDirectBack,
  onBack,
}: StartScreenProps) {
  const palette = mobilePalette;

  return (
    <div className="w-full max-w-sm px-1 py-2">
      <div className="flex flex-col" style={{ gap: mobileSpacing.section }}>
        <div className="w-full flex justify-start">
          <button
            onClick={onBack}
            style={{
              color: palette.subtext,
              fontSize: mobileTypography.bodySmall.fontSize,
              lineHeight: mobileTypography.bodySmall.lineHeight,
              letterSpacing: mobileTypography.bodySmall.letterSpacing,
              fontWeight: 600,
            }}
          >
            ← 이전으로
          </button>
        </div>

        <div className="flex flex-col text-center" style={{ gap: mobileSpacing.item }}>
          <p
            style={{
              color: palette.text,
              fontSize: mobileTypography.hero.fontSize,
              lineHeight: mobileTypography.hero.lineHeight,
              letterSpacing: mobileTypography.hero.letterSpacing,
              fontWeight: mobileTypography.hero.fontWeight,
            }}
          >
            표시할 내용 보내기
          </p>
          <p
            style={{
              color: palette.subtext,
              fontSize: mobileTypography.bodySmall.fontSize,
              lineHeight: mobileTypography.bodySmall.lineHeight,
              letterSpacing: mobileTypography.bodySmall.letterSpacing,
              fontWeight: mobileTypography.bodySmall.fontWeight,
            }}
          >
            {isSpeechSupported ? '마이크 버튼을 눌러 띄울 내용을 말해주세요' : '띄울 내용을 입력해주세요'}
          </p>
        </div>

        {isSpeechSupported && !showDirectInput ? (
          <>
            <div className="flex justify-center">
              <button
                onClick={onStartListening}
                disabled={isInterpreting}
                className="flex items-center justify-center rounded-full active:scale-95 transition-transform disabled:opacity-40"
                style={{
                  width: mobileControl.iconButtonSize,
                  height: mobileControl.iconButtonSize,
                  background: palette.accent,
                }}
                aria-label="음성 인식 시작"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                  <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-3.06A9 9 0 0 0 21 10h-2z" />
                </svg>
              </button>
            </div>

            <div
              className="flex flex-col items-center"
              style={{
                gap: mobileSpacing.item,
                background: palette.surface,
                padding: mobileControl.sectionPadding,
              }}
            >
              <p
                style={{
                  color: palette.subtext,
                  fontSize: mobileTypography.caption.fontSize,
                  lineHeight: mobileTypography.caption.lineHeight,
                  letterSpacing: mobileTypography.caption.letterSpacing,
                  fontWeight: mobileTypography.caption.fontWeight,
                }}
              >
                음성 입력이 어렵다면
              </p>
              <button
                onClick={onShowDirectInput}
                disabled={isInterpreting}
                className="px-4 disabled:opacity-40"
                style={{
                  minHeight: mobileControl.buttonHeight,
                  borderRadius: mobileRadius.button,
                  background: palette.accentSoft,
                  color: palette.accent,
                  fontSize: mobileTypography.bodySmall.fontSize,
                  lineHeight: mobileTypography.bodySmall.lineHeight,
                  letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  fontWeight: 600,
                }}
              >
                직접 입력하기
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col gap-3">
            {isInterpreting && (
              <p
                className="text-center"
                style={{
                  color: palette.subtext,
                  fontSize: mobileTypography.bodySmall.fontSize,
                  lineHeight: mobileTypography.bodySmall.lineHeight,
                  letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  fontWeight: mobileTypography.bodySmall.fontWeight,
                }}
              >
                AI가 명령을 해석하고 있어요...
              </p>
            )}
            {error && (
              <p
                className="text-center"
                style={{
                  color: palette.danger,
                  fontSize: mobileTypography.bodySmall.fontSize,
                  lineHeight: mobileTypography.bodySmall.lineHeight,
                  letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  fontWeight: mobileTypography.bodySmall.fontWeight,
                }}
              >
                {error}
              </p>
            )}
            <DirectInput
              value={directInputText}
              onChange={onDirectInputChange}
              onSubmit={onDirectSubmit}
              onBack={onDirectBack}
              disabled={isInterpreting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
