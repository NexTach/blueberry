import type { TemplateId } from '../../../lib/openai';
import { AI_TEMPLATE_ID } from '../constants';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import type { AiToneId, ConfirmStage } from '../types';
import type { ThemeId } from '../../../types/session';
import AITonePicker from './AITonePicker';
import MobileStage from './MobileStage';
import TemplatePicker from './TemplatePicker';
import ThemePicker from './ThemePicker';

interface ConfirmScreenProps {
  confirmStage: ConfirmStage;
  confirmStageIndex: number;
  confirmStageCount: number;
  canContinue: boolean;
  isLastStage: boolean;
  name: string;
  selectedTemplate: TemplateId;
  message: string;
  aiTone: AiToneId;
  aiPrompt: string;
  themeId: ThemeId;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onTemplateChange: (id: TemplateId) => void;
  onMessageChange: (message: string) => void;
  onAiToneChange: (tone: AiToneId) => void;
  onAiPromptChange: (prompt: string) => void;
  onThemeChange: (themeId: ThemeId) => void;
  onReenterVoice: () => void;
  onReenterDirect: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function ConfirmScreen({
  confirmStage,
  confirmStageIndex,
  confirmStageCount,
  canContinue,
  isLastStage,
  name,
  selectedTemplate,
  message,
  aiTone,
  aiPrompt,
  themeId,
  isSubmitting,
  onNameChange,
  onTemplateChange,
  onMessageChange,
  onAiToneChange,
  onAiPromptChange,
  onThemeChange,
  onReenterVoice,
  onReenterDirect,
  onBack,
  onContinue,
}: ConfirmScreenProps) {
  const isAiTemplate = selectedTemplate === AI_TEMPLATE_ID;
  const palette = mobilePalette;
  const labelStyle = {
    color: palette.subtext,
    fontSize: mobileTypography.caption.fontSize,
    lineHeight: mobileTypography.caption.lineHeight,
    letterSpacing: '0',
    fontWeight: 600,
  } as const;
  const helperTextStyle = {
    color: palette.subtext,
    fontSize: mobileTypography.bodySmall.fontSize,
    lineHeight: mobileTypography.bodySmall.lineHeight,
    letterSpacing: mobileTypography.bodySmall.letterSpacing,
    fontWeight: mobileTypography.bodySmall.fontWeight,
  } as const;

  const stageMeta = {
    template: {
      title: '문구 방식을 골라주세요',
      description: '고정 템플릿을 쓸지, AI로 자유 생성할지 먼저 정합니다.',
    },
    content: {
      title: isAiTemplate ? 'AI에게 전달할 내용을 확인해주세요' : '표시될 문구를 확인해주세요',
      description: isAiTemplate
        ? '말하거나 입력한 명령을 다듬어 AI 생성 방향을 정할 수 있어요.'
        : '화면에 올라갈 최종 문구를 바로 수정할 수 있어요.',
    },
    tone: {
      title: 'AI 어체를 골라주세요',
      description: '같은 내용도 어체에 따라 화면 분위기가 달라집니다.',
    },
    theme: {
      title: 'TV 테마를 골라주세요',
      description: '디자인 종류를 먼저 고르고, 세부 테마를 선택하세요.',
    },
    name: {
      title: '이름을 확인해주세요',
      description: '선택 입력입니다. 비워두면 방문자로 표시됩니다.',
    },
  }[confirmStage];

  const stageProgress = `${confirmStageIndex + 1} / ${confirmStageCount}`;
  const progressPercent = ((confirmStageIndex + 1) / confirmStageCount) * 100;

  return (
    <MobileStage
      header={
        <div className="flex flex-col" style={{ gap: 10 }}>
          <p style={labelStyle}>
            표시 내용 설정 {stageProgress}
          </p>
          <div
            aria-hidden
            style={{
              width: '100%',
              height: 6,
              borderRadius: 999,
              background: palette.line,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: 999,
                background: palette.accent,
                transition: 'width 180ms ease',
              }}
            />
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
            {stageMeta.title}
          </p>
          <p style={helperTextStyle}>{stageMeta.description}</p>
        </div>
      }
      footer={
        <div className="flex" style={{ gap: mobileSpacing.item }}>
          <button
            onClick={onBack}
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
            이전으로
          </button>
          <button
            onClick={onContinue}
            disabled={isSubmitting || !canContinue}
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
            {isSubmitting ? '전송 중...' : isLastStage ? '화면에 표시하기' : '다음'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col" style={{ gap: mobileSpacing.group }}>
        {confirmStage === 'template' && (
          <TemplatePicker name={name} selectedTemplate={selectedTemplate} onSelect={onTemplateChange} />
        )}

        {confirmStage === 'content' && (
          <div className="flex flex-col" style={{ gap: mobileSpacing.group }}>
            {!isAiTemplate ? (
              <div className="flex flex-col" style={{ gap: 6 }}>
                <label style={labelStyle}>
                  최종 문구
                </label>
                <textarea
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  rows={3}
                  className="smooth-scroll w-full resize-none px-4 py-4 outline-none transition-colors"
                  style={{
                    minHeight: mobileControl.textAreaMinHeight,
                    borderRadius: mobileRadius.field,
                    border: `1px solid transparent`,
                    background: palette.field,
                    color: palette.text,
                    fontSize: mobileTypography.body.fontSize,
                    lineHeight: mobileTypography.body.lineHeight,
                    letterSpacing: mobileTypography.body.letterSpacing,
                    fontWeight: mobileTypography.body.fontWeight,
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: 6 }}>
                <label style={labelStyle}>
                  AI에게 전달할 내용
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => onAiPromptChange(e.target.value)}
                  rows={4}
                  placeholder="예: 이모지를 넣고, 밝고 재치 있게 환영 문구를 만들어줘."
                  className="smooth-scroll w-full resize-none px-4 py-4 outline-none transition-colors"
                  style={{
                    minHeight: mobileControl.textAreaMinHeight,
                    borderRadius: mobileRadius.field,
                    border: `1px solid transparent`,
                    background: palette.field,
                    color: palette.text,
                    fontSize: mobileTypography.body.fontSize,
                    lineHeight: mobileTypography.body.lineHeight,
                    letterSpacing: mobileTypography.body.letterSpacing,
                    fontWeight: mobileTypography.body.fontWeight,
                  }}
                />
                <p
                  style={{
                    color: palette.subtext,
                    fontSize: mobileTypography.caption.fontSize,
                    lineHeight: mobileTypography.caption.lineHeight,
                    letterSpacing: mobileTypography.caption.letterSpacing,
                    fontWeight: mobileTypography.caption.fontWeight,
                  }}
                >
                  본문에 이름이 들어 있으면 AI가 그 이름을 우선 적용합니다.
                </p>
                <p style={helperTextStyle}>
                  이미 해석된 내용이 들어 있으니, 그대로 두고 다음으로 넘어가도 됩니다.
                </p>
              </div>
            )}

            <div
              className="flex flex-col"
              style={{
                gap: 8,
                borderTop: `1px solid ${palette.line}`,
                paddingTop: mobileControl.sectionPadding,
              }}
            >
              <label style={labelStyle}>
                입력 다시 받기
              </label>
              <div className="grid grid-cols-2" style={{ gap: mobileSpacing.item }}>
                <button
                  onClick={onReenterVoice}
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
                  마이크로 다시 입력
                </button>
                <button
                  onClick={onReenterDirect}
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
                  직접 다시 입력
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmStage === 'tone' && isAiTemplate && (
          <AITonePicker selectedTone={aiTone} onSelect={onAiToneChange} />
        )}

        {confirmStage === 'theme' && (
          <ThemePicker selectedTheme={themeId} onSelect={onThemeChange} />
        )}

        {confirmStage === 'name' && (
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label style={labelStyle}>
              이름 (선택)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="이름이 필요하면 입력하세요"
              className="w-full px-4 outline-none transition-colors"
              style={{
                minHeight: mobileControl.inputMinHeight,
                borderRadius: mobileRadius.field,
                border: `1px solid transparent`,
                background: palette.field,
                color: palette.text,
                fontSize: mobileTypography.body.fontSize,
                lineHeight: mobileTypography.body.lineHeight,
                letterSpacing: mobileTypography.body.letterSpacing,
                fontWeight: mobileTypography.body.fontWeight,
              }}
            />
          </div>
        )}
      </div>
    </MobileStage>
  );
}
