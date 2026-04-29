import { AI_TONES } from '../constants';
import type { AiToneId } from '../types';

interface AITonePickerProps {
  selectedTone: AiToneId;
  onSelect: (tone: AiToneId) => void;
}

export default function AITonePicker({ selectedTone, onSelect }: AITonePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {AI_TONES.map((tone) => (
        <button
          key={tone.id}
          onClick={() => onSelect(tone.id)}
          className={`rounded-xl border px-3 py-3 text-left transition-all ${
            selectedTone === tone.id ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
          }`}
        >
          <p className="text-sm font-semibold text-gray-900">{tone.label}</p>
          <p className="mt-1 text-xs text-gray-500">{tone.description}</p>
        </button>
      ))}
    </div>
  );
}
