import { isSpeechSupported } from '../../../lib/speech';
import DirectInput from './DirectInput';

interface StartScreenProps {
  showDirectInput: boolean;
  error: string | null;
  onStartListening: () => void;
  onShowDirectInput: () => void;
  onDirectSubmit: (command: string) => void;
  onDirectBack: () => void;
}

export default function StartScreen({
  showDirectInput,
  error,
  onStartListening,
  onShowDirectInput,
  onDirectSubmit,
  onDirectBack,
}: StartScreenProps) {
  return (
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
            onClick={onStartListening}
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
              onClick={onShowDirectInput}
              className="text-sm font-medium text-gray-600 underline underline-offset-4"
            >
              직접 입력하기
            </button>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <DirectInput onSubmit={onDirectSubmit} onBack={onDirectBack} />
        </div>
      )}
    </div>
  );
}
