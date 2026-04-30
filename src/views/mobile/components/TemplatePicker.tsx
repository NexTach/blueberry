import { TEMPLATES, FALLBACK_VISITOR_NAME } from '../constants';
import { mobileControl, mobilePalette, mobileSpacing, mobileTypography } from '../design';
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
    <div className="flex flex-col" style={{ gap: mobileSpacing.item }}>
      {TEMPLATES.map((template) => {
        const selected = selectedTemplate === template.id;

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="text-left transition-colors"
            style={{
              minHeight: mobileControl.inputMinHeight,
              borderRadius: 18,
              border: `1.5px solid ${selected ? selectedBorder : palette.line}`,
              background: selected ? palette.surface : 'transparent',
              padding: 14,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  style={{
                    color: palette.text,
                    fontSize: mobileTypography.bodySmall.fontSize,
                    lineHeight: mobileTypography.bodySmall.lineHeight,
                    fontWeight: 600,
                    letterSpacing: mobileTypography.bodySmall.letterSpacing,
                  }}
                >
                  {template.label}
                </p>
                <p
                  className="mt-1"
                  style={{
                    color: palette.subtext,
                    fontSize: mobileTypography.caption.fontSize,
                    lineHeight: mobileTypography.caption.lineHeight,
                    fontWeight: mobileTypography.caption.fontWeight,
                  }}
                >
                  {template.description}
                </p>
              </div>
              <div
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${template.accent}`}
              style={{ borderRadius: 999 }}
            >
              {template.mode === 'ai' ? 'AI' : '템플릿'}
            </div>
            </div>
            <p
              className="mt-2"
              style={{
                color: palette.subtext,
                fontSize: mobileTypography.caption.fontSize,
                lineHeight: mobileTypography.caption.lineHeight,
                fontWeight: mobileTypography.caption.fontWeight,
              }}
            >
              {template.preview(name || FALLBACK_VISITOR_NAME)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
