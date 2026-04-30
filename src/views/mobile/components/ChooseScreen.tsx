import { useState } from 'react';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import MobileStage from './MobileStage';

interface ChooseScreenProps {
  existingPreview?: string | null;
  canEditExisting: boolean;
  onEditExisting: () => void;
  onCreateNew: () => void;
}

export default function ChooseScreen({
  existingPreview,
  canEditExisting,
  onEditExisting,
  onCreateNew,
}: ChooseScreenProps) {
  const [selected, setSelected] = useState<'edit' | 'create' | null>(null);
  const palette = mobilePalette;
  const selectedBorder = palette.accent;

  function handleProceed() {
    if (selected === 'edit') {
      onEditExisting();
    } else if (selected === 'create') {
      onCreateNew();
    }
  }

  return (
    <MobileStage
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
            어떻게 시작할까요?
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
            현재 화면의 문구를 다듬거나, 새 문구를 처음부터 만들 수 있어요.
          </p>
        </div>
      }
      footer={
        <button
          onClick={handleProceed}
          disabled={selected === null}
          className="w-full transition-opacity disabled:opacity-40"
          style={{
            minHeight: mobileControl.buttonHeight,
            borderRadius: mobileRadius.button,
            background: palette.accent,
            color: '#ffffff',
            fontSize: mobileTypography.body.fontSize,
            lineHeight: mobileTypography.body.lineHeight,
            letterSpacing: mobileTypography.body.letterSpacing,
            fontWeight: 600,
          }}
        >
          진행하기
        </button>
      }
      centerContent
    >
      <div className="mt-6 flex flex-col" style={{ gap: mobileSpacing.item }}>
        <button
          onClick={() => setSelected('create')}
          className="w-full text-left transition-colors"
          style={{
            borderRadius: mobileRadius.section,
            border: `2px solid ${selected === 'create' ? selectedBorder : palette.line}`,
            background: palette.surface,
            padding: mobileControl.sectionPadding,
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
            새로 문구 만들기
          </p>
          <p
            className="mt-2"
            style={{
              color: palette.subtext,
              fontSize: mobileTypography.bodySmall.fontSize,
              lineHeight: mobileTypography.bodySmall.lineHeight,
              letterSpacing: mobileTypography.bodySmall.letterSpacing,
              fontWeight: mobileTypography.bodySmall.fontWeight,
            }}
          >
            음성이나 직접 입력으로 새 문구를 처음부터 만듭니다.
          </p>
        </button>

        <button
          onClick={() => canEditExisting && setSelected('edit')}
          disabled={!canEditExisting}
          className="w-full text-left transition-colors disabled:cursor-not-allowed"
          style={{
            borderRadius: mobileRadius.section,
            border: `2px solid ${!canEditExisting ? palette.line : selected === 'edit' ? selectedBorder : palette.line}`,
            background: !canEditExisting ? palette.disabled : palette.surface,
            padding: mobileControl.sectionPadding,
          }}
        >
          <p
            style={{
              color: !canEditExisting ? '#b0b8c1' : palette.text,
              fontSize: mobileTypography.body.fontSize,
              lineHeight: mobileTypography.body.lineHeight,
              letterSpacing: mobileTypography.body.letterSpacing,
              fontWeight: 600,
            }}
          >
            현재 문구 수정하기
          </p>
          <p
            className="mt-2"
            style={{
              color: !canEditExisting ? '#b0b8c1' : palette.subtext,
              fontSize: mobileTypography.bodySmall.fontSize,
              lineHeight: mobileTypography.bodySmall.lineHeight,
              letterSpacing: mobileTypography.bodySmall.letterSpacing,
              fontWeight: mobileTypography.bodySmall.fontWeight,
            }}
          >
            {canEditExisting ? existingPreview || '지금 표시 중인 내용을 바로 수정합니다.' : '현재 데스크탑에 표시 중인 내용이 없어요.'}
          </p>
        </button>
      </div>
    </MobileStage>
  );
}
