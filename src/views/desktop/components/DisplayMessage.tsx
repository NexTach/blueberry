import React from 'react';
import type { ThemePreset } from '@/src/lib/themes';

function PretextParagraph({
  as = 'div',
  children,
  style,
}: {
  as?: 'div' | 'p';
  children: string;
  style: React.CSSProperties;
}) {
  if (as === 'p') return <p style={style}>{children}</p>;
  return <div style={style}>{children}</div>;
}

export function DisplayMessage({
  theme,
  displayName,
  msgBody,
  show,
}: {
  theme: ThemePreset;
  displayName: string;
  msgBody: string;
  show: boolean;
}) {
  const bodyStyle: React.CSSProperties = {
    fontSize: 'clamp(1.35rem, 4.3vh, 3.8rem)',
    lineHeight: 1.55,
    maxWidth: 'min(78vw, 22ch)',
    marginInline: 'auto',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
    textWrap: 'pretty',
  };

  if (theme.family === 'whiteboard') {
    return (
      <div
        className="relative w-full max-w-[min(72vw,920px)] transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)' }}
      >
        {theme.id === 'white-note' && (
          <div
            className="absolute -top-6 right-8 z-10 rounded-xl px-4 py-2"
            style={{ background: '#fff1a6', border: '2px solid #d7c35e', transform: 'rotate(6deg)' }}
          >
            <span className="text-xs font-bold text-gray-700">guest note</span>
          </div>
        )}
        <div
          className="relative rounded-[38px] px-8 py-10"
          style={{
            background: theme.surface,
            border: `4px solid ${theme.border}`,
            boxShadow: `12px 12px 0 ${theme.accent}22`,
          }}
        >
          <p
            style={{
              color: theme.accent,
              fontSize: 'clamp(2.5rem, 6.8vh, 6rem)',
              lineHeight: 1.04,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontFamily: theme.titleFont,
            }}
          >
            {displayName ? `${displayName}님` : '환영합니다'}
          </p>
          <div
            className="rounded-full"
            style={{
              width: 'clamp(120px, 18vw, 220px)',
              height: '6px',
              background: theme.secondary,
              marginTop: 'clamp(1rem, 2vh, 1.5rem)',
            }}
          />
          <PretextParagraph
            style={{
              ...bodyStyle,
              color: theme.text,
              marginTop: 'clamp(1rem, 2vh, 1.6rem)',
              fontFamily: theme.bodyFont,
            }}
          >
            {msgBody}
          </PretextParagraph>
        </div>
      </div>
    );
  }

  if (theme.family === 'blackboard') {
    return (
      <div
        className="flex flex-col items-center transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)' }}
      >
        <p
          style={{
            color: theme.accent,
            fontSize: 'clamp(2.6rem, 7vh, 6.3rem)',
            lineHeight: 1.06,
            whiteSpace: 'nowrap',
            fontFamily: theme.titleFont,
          }}
        >
          {displayName ? `${displayName}님` : '환영합니다'}
        </p>
        <PretextParagraph
          as="p"
          style={{
            ...bodyStyle,
            color: theme.text,
            marginTop: 'clamp(0.9rem, 1.6vh, 1.3rem)',
            textShadow: '0 0 10px rgba(255,255,255,0.06)',
            fontFamily: theme.bodyFont,
          }}
        >
          {msgBody}
        </PretextParagraph>
      </div>
    );
  }

  if (theme.family === 'brutal') {
    if (theme.id === 'brutal-bauhaus') {
      return (
        <div
          className="relative z-10 flex w-full flex-col items-center transition-all duration-700"
          style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)' }}
        >
          <p
            style={{
              color: '#111',
              fontSize: 'clamp(2.9rem, 6.8vh, 6.6rem)',
              lineHeight: 1.02,
              textAlign: 'center',
              fontFamily: theme.titleFont,
            }}
          >
            {displayName ? `${displayName}님` : '환영합니다'}
          </p>
          <PretextParagraph
            as="p"
            style={{
              color: '#111',
              fontSize: 'clamp(1.1rem, 2.5vh, 2rem)',
              lineHeight: 1.5,
              maxWidth: '18ch',
              textAlign: 'center',
              marginTop: 'clamp(0.8rem, 1.8vh, 1.4rem)',
              fontFamily: theme.bodyFont,
            }}
          >
            {msgBody}
          </PretextParagraph>
        </div>
      );
    }

    return (
      <div
        className="relative flex flex-col items-center gap-6 transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)' }}
      >
        <div
          className="px-8 py-5"
          style={{
            background: theme.surface,
            border: '5px solid #111',
            boxShadow: `14px 14px 0 ${theme.accent}`,
            transform: 'rotate(-1.6deg)',
          }}
        >
          <p
            style={{
              color: '#111',
              fontSize: 'clamp(2.3rem, 6.6vh, 5.6rem)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              fontFamily: theme.titleFont,
            }}
          >
            {displayName ? `${displayName}님` : 'WELCOME'}
          </p>
        </div>
        <div
          className="px-8 py-8"
          style={{
            background: theme.secondary,
            border: '5px solid #111',
            boxShadow: `16px 16px 0 ${theme.surface}`,
            transform: 'rotate(1.2deg)',
            maxWidth: 'min(82vw, 860px)',
          }}
        >
          <PretextParagraph
            style={{ ...bodyStyle, color: '#111', maxWidth: 'min(70vw, 18ch)', fontFamily: theme.bodyFont }}
          >
            {msgBody}
          </PretextParagraph>
        </div>
      </div>
    );
  }

  return (
    <div
      className="text-center transition-all duration-700"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)' }}
    >
      <p
        style={{
          color: theme.accent,
          fontSize: 'clamp(2.5rem, 7vh, 6.5rem)',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          fontFamily: theme.titleFont,
        }}
      >
        {displayName ? `${displayName}님` : ''}
      </p>
      <PretextParagraph
        style={{
          ...bodyStyle,
          color: theme.text,
          marginTop: 'clamp(0.5rem, 1.5vh, 1.5rem)',
          fontFamily: theme.bodyFont,
        }}
      >
        {msgBody}
      </PretextParagraph>
    </div>
  );
}
