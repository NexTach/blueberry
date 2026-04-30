import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import MobileStage from './MobileStage';

interface DoneScreenProps {
  onRestart: () => void;
}

export default function DoneScreen({ onRestart }: DoneScreenProps) {
  const palette = mobilePalette;

  return (
    <MobileStage
      footer={
        <button
          onClick={onRestart}
          className="w-full"
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
          처음으로
        </button>
      }
      centerContent
    >
      <div className="flex flex-col items-center text-center" style={{ gap: 32 }}>
        <div className="flex flex-col items-center" style={{ gap: mobileSpacing.item }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: palette.accent }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p
            style={{
              color: palette.text,
              fontSize: mobileTypography.hero.fontSize,
              lineHeight: mobileTypography.hero.lineHeight,
              letterSpacing: mobileTypography.hero.letterSpacing,
              fontWeight: mobileTypography.hero.fontWeight,
            }}
          >
            전송 완료!
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
            TV 화면을 확인해주세요.
          </p>
        </div>
      </div>
    </MobileStage>
  );
}
