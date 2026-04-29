import WaveAnimation from '../../components/WaveAnimation';
import { isSpeechSupported } from '../../lib/speech';
import { AI_TEMPLATE_ID } from './constants';
import AITonePicker from './components/AITonePicker';
import DirectInput from './components/DirectInput';
import SettingsSheet from './components/SettingsSheet';
import TemplatePicker from './components/TemplatePicker';
import { useMobileFlow } from './useMobileFlow';

export default function MobilePage() {
  const {
    step,
    name,
    selectedTemplate,
    message,
    aiTone,
    aiPrompt,
    isSubmitting,
    showDirectInput,
    showSettings,
    speech,
    setAiTone,
    setAiPrompt,
    setMessage,
    setShowDirectInput,
    setShowSettings,
    handleStartListening,
    handleStopListening,
    handleTemplateChange,
    handleNameChange,
    handleConfirm,
    handleRestart,
    handleBackToPrevious,
    openComposerFromCommand,
    resetSpeech,
  } = useMobileFlow();

  const { isListening, transcript, error } = speech;
  const isAiTemplate = selectedTemplate === AI_TEMPLATE_ID;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {step === 'start' && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="설정"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}

      {step === 'start' && (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold text-gray-900">표시할 내용 보내기</p>
            <p className="text-sm text-gray-500">
              {isSpeechSupported ? '마이크 버튼을 눌러 띄울 내용을 말해주세요' : '띄울 내용을 입력해주세요'}
            </p>
          </div>

          {isSpeechSupported && !showDirectInput ? (
            <>
              <button
                onClick={handleStartListening}
                className="w-28 h-28 rounded-full bg-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="음성 인식 시작"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                  <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V22h2v-3.06A9 9 0 0 0 21 10h-2z" />
                </svg>
              </button>

              <div className="w-full border-t border-gray-100 pt-6 flex flex-col items-center gap-3">
                <p className="text-xs text-gray-400">음성 입력이 어렵다면</p>
                <button
                  onClick={() => {
                    resetSpeech();
                    setShowDirectInput(true);
                  }}
                  className="text-sm font-medium text-gray-600 underline underline-offset-4"
                >
                  직접 입력하기
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <DirectInput onSubmit={openComposerFromCommand} onBack={() => setShowDirectInput(false)} />
            </div>
          )}
        </div>
      )}

      {step === 'listening' && (
        <div className="flex flex-col items-center gap-10 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold text-gray-900">듣고 있어요</p>
            <p className="text-sm text-gray-500">띄울 내용을 말씀해 주세요</p>
          </div>

          <WaveAnimation isActive={isListening} />

          {transcript && <p className="text-lg font-medium text-gray-800 text-center px-4">"{transcript}"</p>}

          {error ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-red-500 text-center">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleStartListening}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
                >
                  다시 시도
                </button>
                <button
                  onClick={() => {
                    resetSpeech();
                    setShowDirectInput(true);
                    openComposerFromCommand(transcript.trim());
                  }}
                  disabled={!transcript.trim()}
                  className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium disabled:opacity-30"
                >
                  텍스트로 사용
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleStopListening}
                disabled={!transcript}
                className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 transition-opacity"
              >
                완료
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'confirm' && (
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
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="이름이 필요하면 입력하세요"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition-colors"
            />
          </div>

          <TemplatePicker name={name} selectedTemplate={selectedTemplate} onSelect={handleTemplateChange} />

          {!isAiTemplate && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">최종 문구</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition-colors resize-none"
              />
            </div>
          )}

          {isAiTemplate && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">AI 어체</label>
                <AITonePicker selectedTone={aiTone} onSelect={setAiTone} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">AI에게 전달할 내용</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
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
              onClick={handleBackToPrevious}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
            >
              이전으로
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || (isAiTemplate ? !aiPrompt.trim() : (!name.trim() || !message.trim()))}
              className="flex-1 py-3.5 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 transition-opacity"
            >
              {isSubmitting ? '전송 중...' : '화면에 표시하기'}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center gap-8 text-center w-full max-w-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
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
            <p className="text-2xl font-bold text-gray-900">전송 완료!</p>
            <p className="text-sm text-gray-500">TV 화면을 확인해주세요 😊</p>
          </div>
          <button
            onClick={handleRestart}
            className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
          >
            처음으로
          </button>
        </div>
      )}

      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}
