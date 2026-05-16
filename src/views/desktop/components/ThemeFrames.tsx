import React from 'react';
import type { ThemePreset } from '../../../lib/themes';

function WoodFrame() {
  const frame = 'clamp(22px, 3.2vw, 46px)';
  const wood = `
    repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(0,0,0,0.12) 18px, rgba(0,0,0,0.12) 19px, transparent 19px, transparent 38px, rgba(0,0,0,0.08) 38px, rgba(0,0,0,0.08) 39px),
    repeating-linear-gradient(0deg, transparent 0px, transparent 24px, rgba(255,255,255,0.08) 24px, rgba(255,255,255,0.08) 25px),
    repeating-linear-gradient(112deg, #D4A055 0px, #B8893F 4px, #9B7330 8px, #8B6428 12px, #C4903A 16px, #9B6430 20px, #8B5A2C 24px, #C08040 28px, #8B5A2C 32px, #B07838 36px)
  `;

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: frame, background: wood }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: frame, background: wood }}
      />
      <div
        className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
        style={{ width: frame, background: wood }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 pointer-events-none z-10"
        style={{ width: frame, background: wood }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-9"
        style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.35)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ outline: '2px solid #3A2215', outlineOffset: '-1px' }}
      />
    </>
  );
}

function WhiteboardFrame({ theme }: { theme: ThemePreset }) {
  const frame = 'clamp(16px, 2.4vw, 28px)';

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          border: `${frame} solid #d8e3ee`,
          boxShadow: 'inset 0 0 0 2px #f8fbff, inset 0 0 26px rgba(72,100,140,0.12), 0 20px 60px rgba(0,0,0,0.15)',
        }}
      />
      <div
        className="absolute inset-[clamp(16px,2.4vw,28px)] pointer-events-none z-10"
        style={{ border: `2px solid ${theme.border}` }}
      />
    </>
  );
}

function BlackboardFrame({ theme }: { theme: ThemePreset }) {
  const frame = 'clamp(18px, 2.6vw, 30px)';

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          border: `${frame} solid #0c1014`,
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.04), inset 0 0 40px rgba(0,0,0,0.45)',
        }}
      />
      <div
        className="absolute pointer-events-none z-10 rounded-full"
        style={{
          left: 'clamp(60px, 8vw, 120px)',
          right: 'clamp(60px, 8vw, 120px)',
          bottom: 'clamp(18px, 2vw, 30px)',
          height: 'clamp(12px, 1.5vw, 18px)',
          background: '#1f252b',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.08)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-9"
        style={{ boxShadow: 'inset 0 0 90px rgba(0,0,0,0.48)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ outline: `1px solid ${theme.border}`, outlineOffset: '-10px' }}
      />
    </>
  );
}

function BrutalFrame({ theme }: { theme: ThemePreset }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <>
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: 'clamp(44px, 5vh, 78px)',
            left: 'clamp(52px, 5vw, 90px)',
            width: 'clamp(34px, 4vw, 54px)',
            height: 'clamp(34px, 4vw, 54px)',
            borderTop: '8px solid #111',
            borderLeft: '8px solid #111',
            borderRadius: '8px 0 0 0',
            transform: 'rotate(-45deg)',
          }}
        />
        <div
          className="absolute pointer-events-none z-20"
          style={{
            right: 'clamp(52px, 5vw, 90px)',
            bottom: 'clamp(44px, 5vh, 78px)',
            width: 'clamp(34px, 4vw, 54px)',
            height: 'clamp(34px, 4vw, 54px)',
            borderTop: '8px solid #111',
            borderLeft: '8px solid #111',
            borderRadius: '8px 0 0 0',
            transform: 'rotate(135deg)',
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-10" style={{ border: '8px solid #111' }} />
      <div
        className="absolute pointer-events-none z-10"
        style={{
          top: 'clamp(26px, 3vw, 40px)',
          left: 'clamp(26px, 3vw, 40px)',
          width: 'clamp(70px, 9vw, 130px)',
          height: 'clamp(18px, 2vw, 28px)',
          background: theme.accent,
          border: '4px solid #111',
        }}
      />
      <div
        className="absolute pointer-events-none z-10"
        style={{
          right: 'clamp(30px, 3.2vw, 48px)',
          bottom: 'clamp(30px, 3.2vw, 48px)',
          width: 'clamp(120px, 14vw, 220px)',
          height: 'clamp(28px, 3vh, 44px)',
          background: theme.secondary,
          border: '4px solid #111',
          transform: 'rotate(-3deg)',
        }}
      />
    </>
  );
}

export function ThemeTexture({ theme }: { theme: ThemePreset }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <div
        className="absolute inset-[clamp(16px,2vw,30px)] pointer-events-none rounded-[34px]"
        style={{
          background: theme.surface,
          boxShadow: '0 18px 40px rgba(0,0,0,0.05)',
        }}
      />
    );
  }

  if (theme.family === 'chalk') {
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 6px)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 18% 16%, rgba(255,255,255,0.05), transparent 24%), radial-gradient(circle at 76% 70%, rgba(255,255,255,0.03), transparent 24%)',
          }}
        />
      </>
    );
  }

  if (theme.family === 'whiteboard') {
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.45,
            backgroundImage:
              'linear-gradient(rgba(122,148,179,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(122,148,179,0.08) 1px, transparent 1px)',
            backgroundSize: '100% 48px, 48px 100%',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 16% 12%, rgba(19,104,232,0.08), transparent 20%), radial-gradient(circle at 80% 84%, rgba(255,107,61,0.09), transparent 24%)',
          }}
        />
      </>
    );
  }

  if (theme.family === 'blackboard') {
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.18,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 0.8px, transparent 0.8px)',
            backgroundSize: '8px 8px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 25% 18%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 82% 72%, rgba(255,255,255,0.04), transparent 22%)',
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.14,
          backgroundImage:
            'linear-gradient(90deg, rgba(17,17,17,0.18) 1px, transparent 1px), linear-gradient(rgba(17,17,17,0.18) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 12% 18%, rgba(255,61,154,0.16), transparent 16%), radial-gradient(circle at 82% 76%, rgba(0,183,255,0.16), transparent 18%)',
        }}
      />
    </>
  );
}

export function ThemeFrame({ theme }: { theme: ThemePreset }) {
  if (theme.family === 'chalk') return <WoodFrame />;
  if (theme.family === 'whiteboard') return <WhiteboardFrame theme={theme} />;
  if (theme.family === 'blackboard') return <BlackboardFrame theme={theme} />;
  return <BrutalFrame theme={theme} />;
}
