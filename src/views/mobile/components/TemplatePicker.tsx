import { TEMPLATES, FALLBACK_VISITOR_NAME } from '../constants';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../design';
import type { TemplateId } from '@/src/lib/openai';

interface TemplatePickerProps {
  name: string;
  selectedTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplatePicker({ name, selectedTemplate, onSelect }: TemplatePickerProps) {
  const palette = mobilePalette;
  const selectedBorder = palette.accent;

  return (
    <div className="grid grid-cols-2" style={{ gap: mobileSpacing.item }}>
      {TEMPLATES.map((template) => {
        const selected = selectedTemplate === template.id;
        const isAi = template.mode === 'ai';

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`${isAi ? 'col-span-2' : ''} text-left transition-colors`}
            style={{
              minHeight: mobileControl.inputMinHeight,
              borderRadius: mobileRadius.option,
              border: `2px solid ${selected ? selectedBorder : palette.line}`,
              background: palette.surface,
              padding: mobileControl.sectionPadding,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${template.accent}`}
                style={{ borderRadius: 999 }}
              >
                {template.label}
              </div>
            </div>
            <p
              className="mt-3"
              style={{
                color: palette.text,
                fontSize: mobileTypography.bodySmall.fontSize,
                lineHeight: mobileTypography.bodySmall.lineHeight,
                fontWeight: 600,
                letterSpacing: mobileTypography.bodySmall.letterSpacing,
              }}
            >
              {template.description}
            </p>
            <p
              className="mt-2"
              style={{ color: palette.subtext, fontSize: mobileTypography.caption.fontSize, lineHeight: mobileTypography.caption.lineHeight, fontWeight: mobileTypography.caption.fontWeight }}
            >
              {template.preview(name || FALLBACK_VISITOR_NAME)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
