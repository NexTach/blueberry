import { TEMPLATES, FALLBACK_VISITOR_NAME } from '../constants';
import type { TemplateId } from '../../../lib/openai';

interface TemplatePickerProps {
  name: string;
  selectedTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplatePicker({ name, selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map((template) => {
        const selected = selectedTemplate === template.id;
        const isAi = template.mode === 'ai';

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`${isAi ? 'col-span-2' : ''} rounded-2xl border text-left p-4 transition-all ${
              selected ? 'border-black bg-gray-50 shadow-sm scale-[1.01]' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${template.accent}`}>
                {template.label}
              </div>
              <div
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selected ? 'border-black' : 'border-gray-300'
                }`}
              >
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">{template.description}</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {template.preview(name || FALLBACK_VISITOR_NAME)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
