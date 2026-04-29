import { useState } from 'react';

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

  function handleProceed() {
    if (selected === 'edit') {
      onEditExisting();
    } else if (selected === 'create') {
      onCreateNew();
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-2xl font-bold text-gray-900">문구 선택</p>
        <p className="text-sm text-gray-500">현재 문구를 수정하거나 새 문구를 만들어보세요</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => canEditExisting && setSelected('edit')}
          disabled={!canEditExisting}
          className="w-full rounded-2xl border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed"
          style={{
            borderColor: selected === 'edit' ? '#111111' : '#e5e7eb',
            background: !canEditExisting ? '#f3f4f6' : selected === 'edit' ? '#111111' : '#ffffff',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-sm font-semibold ${!canEditExisting ? 'text-gray-400' : selected === 'edit' ? 'text-white' : 'text-gray-900'}`}>
                현재 문구 수정하기
              </p>
              <p className={`mt-1 text-xs leading-5 ${!canEditExisting ? 'text-gray-400' : selected === 'edit' ? 'text-white/75' : 'text-gray-500'}`}>
                {canEditExisting ? existingPreview || '지금 표시 중인 내용을 바로 수정합니다.' : '현재 데스크탑에 표시 중인 내용이 없어요.'}
              </p>
            </div>
            {canEditExisting && (
              <div
                className="mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0"
                style={{ borderColor: selected === 'edit' ? 'rgba(255,255,255,0.75)' : '#d1d5db' }}
              >
                {selected === 'edit' && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => setSelected('create')}
          className="w-full rounded-2xl border px-4 py-4 text-left transition-colors"
          style={{
            borderColor: selected === 'create' ? '#111111' : '#e5e7eb',
            background: selected === 'create' ? '#111111' : '#ffffff',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-sm font-semibold ${selected === 'create' ? 'text-white' : 'text-gray-900'}`}>새로 문구 만들기</p>
              <p className={`mt-1 text-xs leading-5 ${selected === 'create' ? 'text-white/75' : 'text-gray-500'}`}>
                음성이나 직접 입력으로 새 문구를 처음부터 만듭니다.
              </p>
            </div>
            <div
              className="mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0"
              style={{ borderColor: selected === 'create' ? 'rgba(255,255,255,0.75)' : '#d1d5db' }}
            >
              {selected === 'create' && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </div>
        </button>
      </div>

      <div className="w-full">
        <button
          onClick={handleProceed}
          disabled={selected === null}
          className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30"
        >
          진행하기
        </button>
      </div>
    </div>
  );
}
