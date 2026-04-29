import type { TemplateId } from '../../../lib/openai';
import { AI_TEMPLATE_ID } from '../constants';
import type { AiToneId } from '../types';
import AITonePicker from './AITonePicker';
import TemplatePicker from './TemplatePicker';

interface ConfirmScreenProps {
  name: string;
  selectedTemplate: TemplateId;
  message: string;
  aiTone: AiToneId;
  aiPrompt: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onTemplateChange: (id: TemplateId) => void;
  onMessageChange: (message: string) => void;
  onAiToneChange: (tone: AiToneId) => void;
  onAiPromptChange: (prompt: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmScreen({
  name,
  selectedTemplate,
  message,
  aiTone,
  aiPrompt,
  isSubmitting,
  onNameChange,
  onTemplateChange,
  onMessageChange,
  onAiToneChange,
  onAiPromptChange,
  onBack,
  onConfirm,
}: ConfirmScreenProps) {
  const isAiTemplate = selectedTemplate === AI_TEMPLATE_ID;

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold text-gray-900">표시 내용 설정</p>
        <p className="text-sm text-gray-500">AI 생성 또는 템플릿 방식을 골라주세요</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">이름 (선택)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름이 필요하면 입력하세요"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition-colors"
        />
      </div>

      <TemplatePicker name={name} selectedTemplate={selectedTemplate} onSelect={onTemplateChange} />

      {!isAiTemplate && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">최종 문구</label>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition-colors resize-none"
          />
        </div>
      )}

      {isAiTemplate && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">AI 어체</label>
            <AITonePicker selectedTone={aiTone} onSelect={onAiToneChange} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">AI에게 전달할 내용</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => onAiPromptChange(e.target.value)}
              rows={4}
              placeholder="예: 이모지를 넣고, 밝고 재치 있게 환영 문구를 만들어줘."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition-colors resize-none"
            />
            <p className="text-xs text-gray-400">본문에 이름이 들어 있으면 AI가 그 이름을 우선 적용합니다.</p>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
        >
          이전으로
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting || (isAiTemplate ? !aiPrompt.trim() : (!name.trim() || !message.trim()))}
          className="flex-1 py-3.5 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 transition-opacity"
        >
          {isSubmitting ? '전송 중...' : '화면에 표시하기'}
        </button>
      </div>
    </div>
  );
}
