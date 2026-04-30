import WaveAnimation from '../../../components/WaveAnimation';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import MobileStage from './MobileStage';

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
  const footer = error ? (
    <div className="flex w-full" style={{ gap: mobileSpacing.item }}>
      <button
        onClick={onRetry}
        className="flex-1"
        style={{
          minHeight: mobileControl.buttonHeight,
          borderRadius: mobileRadius.button,
          border: 'none',
          background: palette.weak,
          color: palette.subtextStrong,
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
        className="flex-1 disabled:opacity-30"
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
        텍스트로 사용
      </button>
    </div>
  ) : (
    <div className="flex w-full" style={{ gap: mobileSpacing.item }}>
      <button
        onClick={onCancel}
        disabled={isInterpreting}
        className="flex-1 disabled:opacity-40"
        style={{
          minHeight: mobileControl.buttonHeight,
          borderRadius: mobileRadius.button,
          border: 'none',
          background: palette.weak,
          color: palette.subtextStrong,
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
  );

  return (
    <MobileStage
      header={
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
      }
      footer={footer}
      centerContent
    >
      <div className="flex flex-col items-center" style={{ gap: mobileSpacing.section }}>
        <div
          className="w-full"
          style={{
            borderRadius: mobileRadius.section,
            padding: mobileControl.sectionPadding,
            background: palette.field,
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
              background: palette.field,
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
              {transcript}
            </p>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center text-center" style={{ gap: mobileSpacing.group }}>
            <p
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
            {!!transcript.trim() && (
              <p
                style={{
                  color: palette.subtext,
                  fontSize: mobileTypography.caption.fontSize,
                  lineHeight: mobileTypography.caption.lineHeight,
                  letterSpacing: mobileTypography.caption.letterSpacing,
                  fontWeight: mobileTypography.caption.fontWeight,
                }}
              >
                인식된 문장을 그대로 사용할 수도 있습니다.
              </p>
            )}
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
          </div>
        )}
      </div>
    </MobileStage>
  );
}
