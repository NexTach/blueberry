interface DirectInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (command: string) => void;
    onBack: () => void;
}

export default function DirectInput({ value, onChange, onSubmit, onBack }: DirectInputProps) {
    return (
        <div className="flex flex-col gap-3 w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit(value.trim())}
                placeholder="띄울 내용을 입력하세요"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-black transition-colors"
                autoFocus
            />

            <div className="flex gap-3 w-full">
                <button
                    onClick={onBack}
                    className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
                >
                    이전으로
                </button>
                <button
                    onClick={() => value.trim() && onSubmit(value.trim())}
                    disabled={!value.trim()}
                    className="w-full bg-black text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-30 transition-opacity"
                >
                    다음
                </button>
            </div>
        </div>
    );
}
