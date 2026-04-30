import React from 'react';

interface Props {
  previewText: string;
  onBack: () => void;
  onConfirm: () => void; // '확인' - finish
  onCustomize: () => void; // '표시내용 맞춤설정' - go to confirm/customize
}

export default function PreviewScreen({ previewText, onBack, onConfirm, onCustomize }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <div className="text-sm text-gray-500">데스크탑을 확인해 주세요</div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
          <div className="text-sm text-gray-400 mb-2">TV에 추천 문구를 바로 띄웠어요</div>
          <div className="whitespace-pre-wrap wrap-break-word text-lg text-gray-900">{previewText}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-md border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700"
          onClick={onBack}
        >
          이전으로
        </button>
        <button
          type="button"
          className="flex-1 rounded-md bg-blue-600 py-3 text-sm font-medium text-white"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>

      <div className="mt-3">
        <button
          type="button"
          className="w-full rounded-md border border-blue-600 bg-white py-3 text-sm font-medium text-blue-600"
          onClick={onCustomize}
        >
          표시내용 맞춤설정하기
        </button>
      </div>
    </div>
  );
}
