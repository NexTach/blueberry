import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import MobileStage from './MobileStage';

interface Props {
  previewText: string;
  previewMode: 'displaying' | 'generating';
  onBack: () => void;
  onConfirm: () => void; // finish without further customization
  onCustomize: () => void; // go to confirm/customize
}

export default function PreviewScreen({ previewText, previewMode, onBack, onConfirm, onCustomize }: Props) {
  const palette = mobilePalette;
  const isGenerating = previewMode === 'generating';

  return (
    <MobileStage
      topBar={
        <div className="w-full flex justify-start">
          <button
            onClick={onBack}
            style={{
              color: palette.subtextStrong,
              fontSize: mobileTypography.bodySmall.fontSize,
              lineHeight: mobileTypography.bodySmall.lineHeight,
              letterSpacing: mobileTypography.bodySmall.letterSpacing,
              fontWeight: 600,
            }}
          >
            ← 이전으로
          </button>
        </div>
      }
      header={
        <div className="flex flex-col" style={{ gap: mobileSpacing.item }}>
          <p
            style={{
              color: palette.text,
              fontSize: mobileTypography.hero.fontSize,
              lineHeight: mobileTypography.hero.lineHeight,
              letterSpacing: mobileTypography.hero.letterSpacing,
              fontWeight: mobileTypography.hero.fontWeight,
            }}
          >
            데스크탑을 확인해 주세요
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
            {isGenerating ? 'AI가 TV에 띄울 문구를 만들고 있습니다.' : '문구를 TV에 바로 띄웠습니다.'}
          </p>
        </div>
      }
      footer={
        <div className="flex" style={{ gap: mobileSpacing.item }}>
          <button
            onClick={onConfirm}
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
            {isGenerating ? '생성 맡기기' : '확인'}
          </button>
          <button
            onClick={onCustomize}
            className="flex-1"
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
            맞춤설정하기
          </button>
        </div>
      }
    >
      <div className="flex flex-col" style={{ gap: mobileSpacing.group }}>
        <div
          style={{
            borderRadius: mobileRadius.section,
            border: `1px solid ${palette.line}`,
            background: palette.field,
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
            {isGenerating ? 'TV에서 현재 생성 중인 요청' : 'TV에 추천 문구를 바로 띄웠어요'}
          </p>
          <div
            className="whitespace-pre-wrap wrap-break-word mt-2"
            style={{
              color: palette.text,
              fontSize: mobileTypography.body.fontSize,
              lineHeight: mobileTypography.body.lineHeight,
              letterSpacing: mobileTypography.body.letterSpacing,
              fontWeight: mobileTypography.body.fontWeight,
            }}
          >
            {previewText}
          </div>
        </div>
      </div>
    </MobileStage>
  );
}
