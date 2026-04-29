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
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-2xl font-bold text-gray-900">문구 선택</p>
        <p className="text-sm text-gray-500">현재 문구를 수정하거나 새 문구를 만들어보세요</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onEditExisting}
          disabled={!canEditExisting}
          className="w-full rounded-2xl border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <p className="text-sm font-semibold">현재 문구 수정하기</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {canEditExisting ? existingPreview || '지금 표시 중인 내용을 바로 수정합니다.' : '현재 데스크탑에 표시 중인 내용이 없어요.'}
          </p>
        </button>

        <button onClick={onCreateNew} className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold">
          새로 문구 만들기
        </button>
      </div>
    </div>
  );
}
