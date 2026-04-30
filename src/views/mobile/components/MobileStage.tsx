import type { ReactNode } from 'react';

interface MobileStageProps {
  topBar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  centerContent?: boolean;
}

export default function MobileStage({
  topBar,
  header,
  footer,
  children,
  centerContent = false,
}: MobileStageProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-[#e7ebf0] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        {(topBar || header) && (
          <div className="shrink-0 px-5 pt-5 pb-4">
            <div className="flex flex-col" style={{ gap: 16 }}>
              {topBar}
              {header}
            </div>
          </div>
        )}

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-5 pb-5 ${centerContent ? 'flex flex-col justify-center' : ''}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[#eef1f4] bg-[#fcfcfd] px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
