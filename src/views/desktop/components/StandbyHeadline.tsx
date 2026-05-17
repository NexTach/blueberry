import React from 'react';
import type { ThemePreset } from '../../../lib/themes';

export function StandbyHeadline({ theme }: { theme: ThemePreset }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <div className="flex flex-col items-center text-center" style={{ gap: 'clamp(0.6rem, 2vmin, 2.5rem)' }}>
        <span
          style={{
            color: '#111',
            fontSize: 'clamp(3.4rem, 9vmin, 11rem)',
            lineHeight: 0.92,
            fontFamily: theme.titleFont,
          }}
        >
          GWANGJU
        </span>
        <span
          style={{ color: '#111', fontSize: 'clamp(4rem, 10.5vmin, 13rem)', lineHeight: 0.9, fontFamily: theme.titleFont }}
        >
          SOFTWARE
        </span>
        <span
          style={{
            color: '#111',
            fontSize: 'clamp(3.1rem, 8vmin, 10rem)',
            lineHeight: 0.94,
            fontFamily: theme.titleFont,
          }}
        >
          MEISTER
        </span>
      </div>
    );
  }

  if (theme.family === 'whiteboard') {
    return (
      <div
        className="relative flex flex-col items-center"
        style={{
          padding: 'clamp(1.2rem, 2vh, 3rem) clamp(2.5rem, 3.5vw, 6rem)',
          gap: 'clamp(0.5rem, 1.2vmin, 2rem)',
          background: theme.surface,
          border: `4px solid ${theme.border}`,
          borderRadius: 'clamp(20px, 2.5vw, 40px)',
          boxShadow: `10px 10px 0 ${theme.accent}22`,
          maxWidth: 'min(80vw, 960px)',
        }}
      >
        {theme.id === 'white-note' && (
          <div
            className="absolute -top-5 -right-5 rounded-xl px-4 py-2"
            style={{ background: '#fff1a6', border: '2px solid #d7c35e', transform: 'rotate(8deg)' }}
          >
            <span className="text-xs font-bold text-gray-700">WELCOME</span>
          </div>
        )}
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(2.4rem, min(7vh, 8vw), 9rem)',
            lineHeight: 1.05,
            fontWeight: 700,
            fontFamily: theme.titleFont,
          }}
        >
          GWANGJU
        </span>
        <span
          style={{
            color: theme.accent,
            fontSize: 'clamp(2.4rem, min(7vh, 8vw), 9rem)',
            lineHeight: 1.05,
            fontWeight: 700,
            fontFamily: theme.titleFont,
          }}
        >
          SOFTWARE
        </span>
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(1.15rem, min(3vh, 3.5vw), 4rem)',
            letterSpacing: '0.18em',
            fontWeight: 700,
            fontFamily: theme.bodyFont,
          }}
        >
          MEISTER
        </span>
      </div>
    );
  }

  if (theme.family === 'blackboard') {
    return (
      <div
        className="relative flex flex-col items-center"
        style={{
          padding: 'clamp(1.5rem, 2.5vh, 3.5rem) clamp(3rem, 4vw, 7rem)',
          gap: 'clamp(0.5rem, 1.2vmin, 2rem)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'clamp(20px, 2.5vw, 40px)',
        }}
      >
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(2.25rem, min(6.8vh, 8vw), 9rem)',
            lineHeight: 1.02,
            fontFamily: theme.titleFont,
          }}
        >
          GWANGJU
        </span>
        <span
          style={{
            color: theme.accent,
            fontSize: 'clamp(3.1rem, min(9vh, 10vw), 12rem)',
            lineHeight: 1,
            fontFamily: theme.titleFont,
          }}
        >
          SOFTWARE
        </span>
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(2rem, min(5.8vh, 7vw), 8rem)',
            lineHeight: 1.04,
            fontFamily: theme.titleFont,
          }}
        >
          MEISTER
        </span>
      </div>
    );
  }

  if (theme.family === 'brutal') {
    return (
      <div className="flex flex-col items-center" style={{ gap: 'clamp(0.7rem, 1.6vmin, 2rem)' }}>
        <div
          style={{
            padding: 'clamp(0.8rem, 1.5vh, 2rem) clamp(1.5rem, 2.5vw, 4rem)',
            background: theme.surface,
            border: '4px solid #111',
            boxShadow: `clamp(8px, 1.2vmin, 16px) clamp(8px, 1.2vmin, 16px) 0 ${theme.secondary}`,
            transform: 'rotate(-2deg)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontSize: 'clamp(1.7rem, min(5vh, 5.5vw), 7rem)',
              letterSpacing: '0.08em',
              fontFamily: theme.titleFont,
            }}
          >
            GWANGJU
          </span>
        </div>
        <div
          style={{
            padding: 'clamp(0.8rem, 1.5vh, 2rem) clamp(2rem, 3vw, 5rem)',
            background: theme.accent,
            border: '4px solid #111',
            boxShadow: `clamp(8px, 1.2vmin, 14px) clamp(8px, 1.2vmin, 14px) 0 #111`,
            transform: 'rotate(1.6deg)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontSize: 'clamp(2.1rem, min(6.2vh, 7vw), 9rem)',
              lineHeight: 1,
              fontFamily: theme.titleFont,
            }}
          >
            SOFTWARE
          </span>
        </div>
        <div
          style={{
            padding: 'clamp(0.6rem, 1.2vh, 1.5rem) clamp(1.5rem, 2.5vw, 4rem)',
            background: theme.surface,
            border: '4px solid #111',
            transform: 'rotate(-1deg)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontSize: 'clamp(1rem, min(2.7vh, 3vw), 3.5rem)',
              letterSpacing: '0.14em',
              fontFamily: theme.bodyFont,
            }}
          >
            MEISTER
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ gap: 'clamp(0.7rem, 1.8vmin, 2.8rem)' }}>
      <span
        style={{
          color: theme.text,
          fontSize: 'clamp(2rem, min(6.5vh, 7.5vw), 8rem)',
          letterSpacing: '0.22em',
          fontFamily: theme.titleFont,
        }}
      >
        GWANGJU
      </span>
      <span
        style={{
          color: theme.accent,
          fontSize: 'clamp(3rem, min(9.5vh, 11vw), 13rem)',
          lineHeight: 1.1,
          letterSpacing: '0.2em',
          fontFamily: theme.titleFont,
        }}
      >
        SOFTWARE
      </span>
      <span
        style={{
          color: theme.text,
          fontSize: 'clamp(2rem, min(6.5vh, 7.5vw), 8rem)',
          letterSpacing: '0.22em',
          fontFamily: theme.titleFont,
        }}
      >
        MEISTER
      </span>
    </div>
  );
}
