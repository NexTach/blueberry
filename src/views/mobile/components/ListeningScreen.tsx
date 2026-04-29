import WaveAnimation from '../../../components/WaveAnimation';

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
  return (
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
              onClick={onRetry}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
            >
              다시 시도
            </button>
            <button
              onClick={onUseTranscript}
              disabled={!transcript.trim()}
              className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium disabled:opacity-30"
            >
              텍스트로 사용
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {isInterpreting && <p className="text-sm text-gray-500 text-center">AI가 명령을 해석하고 있어요...</p>}
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={isInterpreting}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 disabled:opacity-40"
            >
              취소
            </button>
            <button
              onClick={onComplete}
              disabled={isInterpreting || !transcript}
              className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 transition-opacity"
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
