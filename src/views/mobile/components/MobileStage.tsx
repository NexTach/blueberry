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
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {(topBar || header) && (
          <div className="shrink-0 px-1 pt-3 pb-4">
            <div className="flex flex-col" style={{ gap: 14 }}>
              {topBar}
              {header}
            </div>
          </div>
        )}

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-1 pb-4 ${centerContent ? 'flex flex-col justify-center' : ''}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[#e7ebf0] bg-[#f7f8fa] px-1 py-3">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
