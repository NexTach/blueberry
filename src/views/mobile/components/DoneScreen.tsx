interface DoneScreenProps {
  onRestart: () => void;
}

export default function DoneScreen({ onRestart }: DoneScreenProps) {
  return (
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
        onClick={onRestart}
        className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
      >
        처음으로
      </button>
    </div>
  );
}
