interface ChooseScreenProps {
  existingPreview?: string | null;
  onEditExisting: () => void;
  onCreateNew: () => void;
}

export default function ChooseScreen({ onEditExisting, onCreateNew }: ChooseScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-2xl font-bold text-gray-900">문구 선택</p>
        <p className="text-sm text-gray-500">기존 문구를 수정하거나 새로 문구를 만들어보세요</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onEditExisting}
          className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
        >
          기존 문구 수정하기
        </button>
        <button onClick={onCreateNew} className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold">
          새로 문구 만들기
        </button>
      </div>
    </div>
  );
}
