import WaveAnimation from '../../../components/WaveAnimation';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';

interface ListeningScreenProps {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isInterpreting: boolean;
  onRetry: () => void;
  onUseTranscript: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export default function ListeningScreen({
  isListening,
  transcript,
  error,
  isInterpreting,
  onRetry,
  onUseTranscript,
  onCancel,
  onComplete,
}: ListeningScreenProps) {
  const palette = mobilePalette;

  return (
    <div className="w-full max-w-sm px-1 py-2">
      <div className="flex flex-col items-center" style={{ gap: 32 }}>
        <div className="flex flex-col items-center text-center" style={{ gap: mobileSpacing.item }}>
          <p
            style={{
              color: palette.text,
              fontSize: mobileTypography.hero.fontSize,
              lineHeight: mobileTypography.hero.lineHeight,
              letterSpacing: mobileTypography.hero.letterSpacing,
              fontWeight: mobileTypography.hero.fontWeight,
            }}
          >
            듣고 있어요
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
            띄울 내용을 말씀해 주세요
          </p>
        </div>

        <div
          className="w-full"
          style={{
            borderRadius: mobileRadius.section,
            padding: mobileControl.sectionPadding,
            background: palette.surface,
            border: `1px solid ${palette.line}`,
          }}
        >
          <WaveAnimation isActive={isListening} />
        </div>

        {transcript && (
          <div
            className="w-full text-center"
            style={{
              borderRadius: mobileRadius.section,
              padding: mobileControl.sectionPadding,
              background: palette.surface,
              border: `1px solid ${palette.line}`,
            }}
          >
            <p
              style={{
                color: palette.text,
                fontSize: mobileTypography.body.fontSize,
                lineHeight: mobileTypography.body.lineHeight,
                letterSpacing: mobileTypography.body.letterSpacing,
                fontWeight: 600,
              }}
            >
              "{transcript}"
            </p>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center" style={{ gap: mobileSpacing.group }}>
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
            <div className="flex" style={{ gap: mobileSpacing.item }}>
              <button
                onClick={onRetry}
                style={{
                  minHeight: mobileControl.buttonHeight,
                  borderRadius: mobileRadius.button,
                  paddingInline: 20,
                  border: `1px solid ${palette.line}`,
                  background: palette.surface,
                  color: palette.subtext,
                  fontSize: mobileTypography.bodySmall.fontSize,
                  lineHeight: mobileTypography.bodySmall.lineHeight,
                  letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  fontWeight: 600,
                }}
              >
                다시 시도
              </button>
              <button
                onClick={onUseTranscript}
                disabled={!transcript.trim()}
                className="disabled:opacity-30"
                style={{
                  minHeight: mobileControl.buttonHeight,
                  borderRadius: mobileRadius.button,
                  paddingInline: 20,
                  background: palette.accent,
                  color: '#ffffff',
                  fontSize: mobileTypography.bodySmall.fontSize,
                  lineHeight: mobileTypography.bodySmall.lineHeight,
                  letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  fontWeight: 600,
                }}
              >
                텍스트로 사용
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col" style={{ gap: mobileSpacing.item }}>
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
            <div className="flex w-full" style={{ gap: mobileSpacing.item }}>
              <button
                onClick={onCancel}
                disabled={isInterpreting}
                className="flex-1 disabled:opacity-40"
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
                onClick={onComplete}
                disabled={isInterpreting || !transcript}
                className="flex-1 disabled:opacity-30 transition-opacity"
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
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
