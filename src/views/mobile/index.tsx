import { useState } from 'react';
import WaveAnimation from '../../components/WaveAnimation';
import { useSpeechRecognition, isSpeechSupported } from '../../lib/speech';
import { applyTemplate, type TemplateId } from '../../lib/openai';
import { updateSession, updateTheme } from '../../lib/firebase';
import type { ThemeId } from '../../types/session';

type Step = 'start' | 'listening' | 'confirm' | 'done';

const TEMPLATES: { id: TemplateId; label: string; preview: (name: string) => string }[] = [
  { id: 1, label: '간단 환영', preview: (n) => `${n}님, 환영합니다!` },
  { id: 2, label: '오픈하우스', preview: (n) => `${n}님, 광주SW마이스터고 오픈하우스에 오신 것을 환영합니다!` },
  { id: 3, label: 'AI 창의 생성', preview: () => 'TV 화면에서 AI가 특별한 문구를 생성합니다 ✨' },
];

const THEMES: { id: ThemeId; name: string; bg: string; accent: string }[] = [
  { id: 'green', name: '녹색 칠판', bg: '#344034', accent: '#6abeff' },
  { id: 'black', name: '흑판',      bg: '#1e2820', accent: '#a8f0c6' },
  { id: 'navy',  name: '남색 보드', bg: '#1a2744', accent: '#ffb347' },
  { id: 'warm',  name: '먹판',      bg: '#1f1a14', accent: '#ff9fd6' },
];

function DirectInput({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit(value.trim())}
        placeholder="이름을 입력하세요"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-black transition-colors"
        autoFocus
      />
      <button
        onClick={() => value.trim() && onSubmit(value.trim())}
        disabled={!value.trim()}
        className="w-full bg-black text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-30 transition-opacity"
      >
        다음
      </button>
    </div>
  );
}

function SettingsSheet({ onClose }: { onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ThemeId | null>(null);

  async function handleSelectTheme(id: ThemeId) {
    setSaving(true);
    await updateTheme(id);
    setSaving(false);
    setSaved(id);
    setTimeout(() => setSaved(null), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl px-6 pt-5 pb-10 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">TV 설정</p>
          <button onClick={onClose} className="text-sm text-gray-400">닫기</button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">칠판 테마</p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                disabled={saving}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
                style={{ borderColor: saved === t.id ? t.accent : 'transparent', background: t.bg }}
              >
                <div className="w-4 h-4 rounded-full shrink-0" style={{ background: t.accent }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.name}</span>
                {saved === t.id && (
                  <svg className="ml-auto shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">선택하면 TV 화면에 즉시 반영됩니다</p>
        </div>
      </div>
    </div>
  );
}

export default function MobilePage() {
  const [step, setStep] = useState<Step>('start');
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { isListening, transcript, error, start, stop, reset } = useSpeechRecognition();

  function goToConfirm(recognizedName: string) {
    setName(recognizedName);
    setSelectedTemplate(1);
    setMessage(applyTemplate(recognizedName, 1) ?? '');
    setStep('confirm');
  }

  function handleStartListening() {
    reset();
    setShowDirectInput(false);
    setStep('listening');
    start();
  }

  function handleStopListening() {
    stop();
    const n = transcript.trim();
    if (n) goToConfirm(n);
  }

  function handleTemplateChange(id: TemplateId) {
    setSelectedTemplate(id);
    setMessage(applyTemplate(name, id) ?? '');
  }

  async function handleConfirm() {
    setIsSubmitting(true);
    const welcomeMessage = selectedTemplate === 3 ? '' : message;
    await updateSession({ status: 'generating', visitorName: name, welcomeMessage });
    setIsSubmitting(false);
    setStep('done');
  }

  function handleRestart() {
    reset();
    setName('');
    setMessage('');
    setShowDirectInput(false);
    setSelectedTemplate(1);
    setStep('start');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">

      {/* 설정 버튼 (우상단, start 화면에서만) */}
      {step === 'start' && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="설정"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}

      {/* Step: start */}
      {step === 'start' && (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold text-gray-900">환영 메시지 남기기</p>
            <p className="text-sm text-gray-500">
              {isSpeechSupported ? '마이크 버튼을 눌러 이름을 말해주세요' : '이름을 입력해주세요'}
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
                <p className="text-xs text-gray-400">음성 인식이 어렵다면</p>
                <button
                  onClick={() => setShowDirectInput(true)}
                  className="text-sm font-medium text-gray-600 underline underline-offset-4"
                >
                  직접 입력하기
                </button>
              </div>
            </>
          ) : (
            <DirectInput onSubmit={goToConfirm} />
          )}
        </div>
      )}

      {/* Step: listening */}
      {step === 'listening' && (
        <div className="flex flex-col items-center gap-10 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-2xl font-bold text-gray-900">듣고 있어요</p>
            <p className="text-sm text-gray-500">이름을 말씀해 주세요</p>
          </div>

          <WaveAnimation isActive={isListening} />

          {transcript && (
            <p className="text-lg font-medium text-gray-800 text-center px-4">"{transcript}"</p>
          )}

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
                  onClick={() => { reset(); setShowDirectInput(true); setStep('start'); }}
                  className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium"
                >
                  직접 입력
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { reset(); setStep('start'); }}
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

      {/* Step: confirm */}
      {step === 'confirm' && (
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-bold text-gray-900">문구 선택</p>
            <p className="text-sm text-gray-500">원하는 스타일을 골라주세요</p>
          </div>

          <div className="flex flex-col gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                  selectedTemplate === t.id ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedTemplate === t.id ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    {selectedTemplate === t.id && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.label}</span>
                </div>
                <p className="mt-1.5 text-sm text-gray-700 pl-6">{t.preview(name)}</p>
              </button>
            ))}
          </div>

          {selectedTemplate !== 3 && (
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

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
            >
              처음부터
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || (selectedTemplate !== 3 && !message.trim())}
              className="flex-1 py-3.5 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 transition-opacity"
            >
              {isSubmitting ? '전송 중...' : '화면에 표시하기'}
            </button>
          </div>
        </div>
      )}

      {/* Step: done */}
      {step === 'done' && (
        <div className="flex flex-col items-center gap-8 text-center w-full max-w-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      {/* 설정 시트 */}
      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}
