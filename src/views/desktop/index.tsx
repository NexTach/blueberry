import React, { useEffect, useRef, useState } from 'react';
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { subscribeSession, resetSession, updateSession } from '../../lib/firebase';
import { findTheme, type ThemePreset } from '../../lib/themes';
import type { DateFormat, Session, ThemeId } from '../../types/session';

const RESET_DELAY = 30 * 60 * 1000;

function ChalkPink({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 122.296 173.669"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <filter
          id="chalk-pink-f"
          x="0"
          y="0"
          width="122.296"
          height="173.669"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="3762" />
          <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" />
          <feMerge>
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#chalk-pink-f)">
        <path
          d="M114.296 165.669C114.224 158.749 112.556 141.739 107.403 128.15C99.9471 108.487 78.1235 94.15 69.8477 96.4044C67.9718 96.9154 64.5615 99.1374 63.4701 100.65C58.5845 107.42 59.777 110.288 62.1235 115.15C63.0908 117.154 65.7745 118.753 68.0214 119.34C73.0044 120.642 77.992 119.126 81.3612 117.074C88.3889 112.795 90.1235 93.65 86.4883 81.9492C83.0865 70.9998 75.0849 62.3416 65.675 56.5064C61.2764 53.7788 54.9578 51.8612 48.5367 53.779C44.4097 55.0116 41.6235 58.7752 39.7848 61.6496C38.7193 63.3154 39.3617 67.3693 39.7848 69.2937C40.208 71.2182 41.3303 72.8812 43.3181 73.7789C45.3058 74.6766 48.125 74.7587 50.4365 74.3062C52.748 73.8536 54.4665 72.8641 55.6004 71.1909C62.9572 60.3353 60.1235 38.15 53.0946 27.9719C43.2485 13.7147 23.6235 8.01748 17.379 8.01781C14.8354 8.01794 11.9386 7.72934 8.00084 9.75534"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function ChalkGreen({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 73.7964 196.812"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <filter
          id="chalk-green-f"
          x="0"
          y="0"
          width="73.7964"
          height="196.812"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="3097" />
          <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" />
          <feMerge>
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#chalk-green-f)">
        <path
          d="M65.7958 188.811C58.311 176.569 41.317 147.862 41.5102 139.84C41.7345 130.522 58.1675 133.564 61.8447 130.634C63.6212 129.218 64.2088 126.874 64.3748 124.884C65.0467 116.826 47.7599 99.8673 22.6349 75.8412C17.4941 70.9252 14.3103 67.5227 13.5828 65.4338C11.4408 59.2833 28.9661 56.6649 35.2783 49.6083C33.9822 42.0999 26.4967 32.0804 18.4607 20.5555C14.9456 15.7863 12.573 13.2085 8.00005 8.00005"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

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

function ThemeTexture({ theme }: { theme: ThemePreset }) {
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

function ThemeFrame({ theme }: { theme: ThemePreset }) {
  if (theme.family === 'chalk') return <WoodFrame />;
  if (theme.family === 'whiteboard') return <WhiteboardFrame theme={theme} />;
  if (theme.family === 'blackboard') return <BlackboardFrame theme={theme} />;
  return <BrutalFrame theme={theme} />;
}

function StandbyHeadline({ theme }: { theme: ThemePreset }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <div className="flex flex-col items-center text-center" style={{ gap: 'clamp(0.15rem, 0.4vh, 0.8rem)' }}>
        <span
          style={{
            color: '#111',
            fontSize: 'clamp(3.4rem, 8.6vh, 11rem)',
            lineHeight: 0.92,
            fontFamily: theme.titleFont,
          }}
        >
          GWANGJU
        </span>
        <span
          style={{ color: '#111', fontSize: 'clamp(4rem, 10vh, 13rem)', lineHeight: 0.9, fontFamily: theme.titleFont }}
        >
          SOFTWARE
        </span>
        <span
          style={{
            color: '#111',
            fontSize: 'clamp(3.1rem, 7.8vh, 10rem)',
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
        className="relative flex flex-col items-center rounded-4xl"
        style={{
          padding: 'clamp(1.5rem, 2.5vh, 3.5rem) clamp(2rem, 3.5vw, 6rem)',
          gap: 'clamp(0.25rem, 0.8vh, 1rem)',
          background: theme.surface,
          border: `4px solid ${theme.border}`,
          boxShadow: `14px 14px 0 ${theme.accent}22`,
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
            fontSize: 'clamp(2.4rem, 7vh, 9rem)',
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
            fontSize: 'clamp(2.4rem, 7vh, 9rem)',
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
            fontSize: 'clamp(1.15rem, 3vh, 4rem)',
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
        className="relative flex flex-col items-center rounded-4xl"
        style={{
          padding: 'clamp(1.5rem, 2.5vh, 3.5rem) clamp(2rem, 3.5vw, 6rem)',
          gap: 'clamp(0.25rem, 0.8vh, 1rem)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(2.25rem, 6.8vh, 9rem)',
            lineHeight: 1.02,
            fontFamily: theme.titleFont,
          }}
        >
          GWANGJU
        </span>
        <span
          style={{
            color: theme.accent,
            fontSize: 'clamp(3.1rem, 9vh, 12rem)',
            lineHeight: 1,
            fontFamily: theme.titleFont,
          }}
        >
          SOFTWARE
        </span>
        <span
          style={{
            color: theme.text,
            fontSize: 'clamp(2rem, 5.8vh, 8rem)',
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
      <div className="flex flex-col items-center" style={{ gap: 'clamp(0.5rem, 1.2vh, 1.5rem)' }}>
        <div
          style={{
            padding: 'clamp(0.8rem, 1.5vh, 2rem) clamp(1.5rem, 2.5vw, 4rem)',
            background: theme.surface,
            border: '4px solid #111',
            boxShadow: `clamp(8px, 1.2vh, 16px) clamp(8px, 1.2vh, 16px) 0 ${theme.secondary}`,
            transform: 'rotate(-2deg)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontSize: 'clamp(1.7rem, 5vh, 7rem)',
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
            boxShadow: `clamp(8px, 1.2vh, 14px) clamp(8px, 1.2vh, 14px) 0 #111`,
            transform: 'rotate(1.6deg)',
          }}
        >
          <span
            style={{
              color: '#111',
              fontSize: 'clamp(2.1rem, 6.2vh, 9rem)',
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
              fontSize: 'clamp(1rem, 2.7vh, 3.5rem)',
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
    <div className="flex flex-col items-center gap-1">
      <span
        style={{
          color: theme.text,
          fontSize: 'clamp(2rem, 6.5vh, 8rem)',
          letterSpacing: '0.22em',
          fontFamily: theme.titleFont,
        }}
      >
        GWANGJU
      </span>
      <span
        style={{
          color: theme.accent,
          fontSize: 'clamp(3rem, 9.5vh, 13rem)',
          lineHeight: 1,
          letterSpacing: '0.2em',
          fontFamily: theme.titleFont,
        }}
      >
        SOFTWARE
      </span>
      <span
        style={{
          color: theme.text,
          fontSize: 'clamp(2rem, 6.5vh, 8rem)',
          letterSpacing: '0.22em',
          fontFamily: theme.titleFont,
        }}
      >
        MEISTER
      </span>
    </div>
  );
}

function DisplayDecorations({ theme, show }: { theme: ThemePreset; show: boolean }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '14%',
            left: '31%',
            width: 'clamp(16px, 1.5vw, 24px)',
            height: 'clamp(210px, 23vh, 300px)',
            background: '#111',
            transform: 'rotate(-12deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '12%',
            left: '50%',
            width: 'clamp(16px, 1.5vw, 24px)',
            height: 'clamp(190px, 21vh, 280px)',
            background: '#111',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '14%',
            right: '31%',
            width: 'clamp(16px, 1.5vw, 24px)',
            height: 'clamp(190px, 21vh, 280px)',
            background: '#111',
            transform: 'rotate(-4deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '25%',
            left: '31%',
            width: 'clamp(300px, 31vw, 470px)',
            height: 'clamp(240px, 28vh, 360px)',
            background: theme.accent,
            clipPath: 'polygon(8% 14%, 88% 0, 100% 78%, 46% 100%, 0 86%)',
            transform: 'rotate(-10deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            bottom: '20%',
            left: '10%',
            width: 'clamp(260px, 34vw, 500px)',
            height: 'clamp(170px, 21vh, 280px)',
            background: '#3fb8d9',
            clipPath: 'polygon(8% 8%, 84% 0, 100% 72%, 28% 100%, 0 66%)',
            transform: 'rotate(-8deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            bottom: '19%',
            right: '9%',
            width: 'clamp(280px, 31vw, 460px)',
            height: 'clamp(240px, 29vh, 390px)',
            background: theme.secondary,
            clipPath: 'polygon(18% 0, 100% 9%, 100% 100%, 0 90%, 7% 22%)',
            transform: 'rotate(3deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full transition-opacity duration-1000"
          style={{
            left: '17%',
            bottom: '11%',
            width: 'clamp(180px, 22vw, 330px)',
            height: 'clamp(180px, 22vw, 330px)',
            border: '10px solid #111',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            right: '27%',
            bottom: '17%',
            width: 'clamp(16px, 1.4vw, 22px)',
            height: 'clamp(180px, 21vh, 280px)',
            background: '#111',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            left: '24%',
            bottom: '4%',
            width: 'clamp(420px, 50vw, 780px)',
            height: 'clamp(150px, 18vh, 230px)',
            background: '#09b53c',
            clipPath: 'polygon(0 0, 78% 0, 100% 36%, 92% 100%, 8% 100%)',
            transform: 'rotate(-1deg)',
            opacity: show ? 1 : 0,
          }}
        />
      </>
    );
  }

  if (theme.family === 'whiteboard') {
    return (
      <>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            right: '7%',
            top: '14%',
            width: 'clamp(110px, 12vw, 180px)',
            height: 'clamp(12px, 1.6vw, 18px)',
            background: theme.accent,
            borderRadius: '999px',
            transform: 'rotate(12deg)',
            opacity: show ? 0.75 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            left: '8%',
            bottom: '16%',
            width: 'clamp(110px, 14vw, 180px)',
            height: 'clamp(80px, 10vw, 120px)',
            background: theme.id === 'white-note' ? '#fff1a6' : '#e6f0ff',
            border: `3px solid ${theme.border}`,
            transform: 'rotate(-8deg)',
            opacity: show ? 0.9 : 0,
          }}
        />
      </>
    );
  }

  if (theme.family === 'blackboard') {
    return (
      <>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '13%',
            right: '6%',
            color: theme.secondary,
            fontSize: 'clamp(1rem, 2.2vh, 1.6rem)',
            opacity: show ? 0.42 : 0,
            transform: 'rotate(6deg)',
          }}
        >
          E = mc²
        </div>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            bottom: '14%',
            left: '6%',
            color: theme.accent,
            fontSize: 'clamp(0.95rem, 2vh, 1.4rem)',
            opacity: show ? 0.36 : 0,
            transform: 'rotate(-7deg)',
          }}
        >
          x + y = welcome
        </div>
      </>
    );
  }

  if (theme.family === 'brutal') {
    return (
      <>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '16%',
            right: '7%',
            width: 'clamp(90px, 10vw, 140px)',
            height: 'clamp(90px, 10vw, 140px)',
            background: theme.accent,
            border: '4px solid #111',
            transform: 'rotate(14deg)',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            bottom: '14%',
            left: '7%',
            width: 'clamp(120px, 16vw, 220px)',
            height: 'clamp(24px, 3vh, 38px)',
            background: theme.secondary,
            border: '4px solid #111',
            transform: 'rotate(-6deg)',
            opacity: show ? 1 : 0,
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="absolute pointer-events-none transition-opacity duration-1000"
        style={{
          right: '4%',
          top: '12%',
          width: 'clamp(80px, 11vh, 160px)',
          opacity: show ? 0.9 : 0,
          transitionDelay: '500ms',
        }}
      >
        <ChalkPink color={theme.secondary} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div
        className="absolute pointer-events-none transition-opacity duration-1000"
        style={{
          left: '4%',
          bottom: '14%',
          width: 'clamp(55px, 7.5vh, 110px)',
          opacity: show ? 0.9 : 0,
          transitionDelay: '700ms',
        }}
      >
        <ChalkGreen color={theme.accent} style={{ width: '100%', height: 'auto' }} />
      </div>
    </>
  );
}

function DisplayMessage({
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
        className="relative w-full max-w-[min(78vw,980px)] transition-all duration-700"
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
          className="relative rounded-[38px] px-10 py-12"
          style={{
            background: theme.surface,
            border: `4px solid ${theme.border}`,
            boxShadow: `18px 18px 0 ${theme.accent}22`,
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

function AlternateDisplayMessage({ theme, show }: { theme: ThemePreset; show: boolean }) {
  const style: React.CSSProperties = {
    color: theme.text,
    fontSize: 'clamp(1.2rem, 3.5vh, 3rem)',
    lineHeight: 1.3,
    maxWidth: 'min(92vw, 110ch)',
    marginInline: 'auto',
    textAlign: 'center',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    transition: 'opacity 600ms ease, transform 600ms ease',
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(8px)',
  };

  return (
    <div className="text-center" style={{ pointerEvents: 'none' }}>
      <p
        style={{
          color: theme.accent,
          fontSize: 'clamp(2rem, 5vh, 4rem)',
          lineHeight: 1.05,
          margin: 0,
          opacity: show ? 1 : 0,
          transition: 'opacity 600ms ease, transform 600ms ease',
          transform: show ? 'translateY(0)' : 'translateY(6px)',
          fontFamily: theme.titleFont,
        }}
      >
        {/* no name for alternate message */}
      </p>
      <div style={style} aria-hidden={!show}>
        광주소프트웨어마이스터고등학교
        <br />
        5·18 민주화운동 기념행사에 오신 것을 환영합니다.
      </div>
    </div>
  );
}

function buildCanvasFont(computed: CSSStyleDeclaration) {
  return computed.font || `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
}

function PretextParagraph({
  as = 'div',
  children,
  style,
}: {
  as?: 'div' | 'p';
  children: string;
  style: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const probe = probeRef.current;
    if (!container || !probe || !children.trim()) {
      setLines(null);
      return;
    }

    let cancelled = false;
    let frame = 0;
    const fontSet = typeof document !== 'undefined' ? document.fonts : null;

    const updateLines = async () => {
      if (fontSet) {
        await fontSet.ready.catch(() => undefined);
      }

      if (cancelled || !containerRef.current || !probeRef.current) return;
      const maxWidth = containerRef.current.clientWidth;
      if (!maxWidth) return;

      const computed = window.getComputedStyle(probeRef.current);
      const font = buildCanvasFont(computed);
      const lineHeight = Number.parseFloat(computed.lineHeight);

      if (!font || !Number.isFinite(lineHeight) || lineHeight <= 0) {
        setLines(null);
        return;
      }

      const prepared = prepareWithSegments(children, font, { wordBreak: 'keep-all' });
      const result = layoutWithLines(prepared, maxWidth, lineHeight);

      if (cancelled) return;
      setLines(result.lines.map((line) => line.text));
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        void updateLines();
      });
    };

    scheduleUpdate();

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });
    resizeObserver.observe(container);

    fontSet?.addEventListener?.('loadingdone', scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      fontSet?.removeEventListener?.('loadingdone', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [children, style.fontFamily, style.fontSize, style.lineHeight, style.maxWidth, style.letterSpacing]);

  const content = (
    <>
      <span
        ref={probeRef}
        aria-hidden="true"
        style={{
          ...style,
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          whiteSpace: 'pre',
        }}
      >
        {children}
      </span>
      {lines ? (
        <span aria-label={children} style={{ display: 'block' }}>
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </span>
      ) : (
        children
      )}
    </>
  );

  if (as === 'p') {
    return (
      <p
        ref={(node) => {
          containerRef.current = node;
        }}
        style={style}
      >
        {content}
      </p>
    );
  }

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
      }}
      style={style}
    >
      {content}
    </div>
  );
}

function formatDateTime(date: Date, format: DateFormat = 'korean') {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (format === 'western') {
    return `${year}.${month}.${day} ${hours < 12 ? 'AM' : 'PM'} ${hours % 12 || 12}:${minutes}`;
  }
  return `${year}년 ${month}월 ${day}일 ${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}:${minutes}분`;
}

function useClock(format: DateFormat) {
  const [time, setTime] = useState(() => formatDateTime(new Date(), format));

  useEffect(() => {
    const id = setInterval(() => setTime(formatDateTime(new Date(), format)), 1000);
    return () => clearInterval(id);
  }, [format]);

  return time;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeDisplayName(name: string | undefined) {
  return name?.trim().replace(/님\s*$/, '') ?? '';
}

function normalizeMessageBody(message: string | undefined, name: string | undefined) {
  if (!message?.trim()) return '마음을 전하는 한마디를 준비했습니다!';
  const displayName = normalizeDisplayName(name);
  if (!displayName) return message.trim();

  return message
    .trim()
    .replace(new RegExp(`^${escapeRegex(displayName)}님,?\\s*`), '')
    .trim();
}

function rootBackground(theme: ThemePreset) {
  if (theme.id === 'brutal-bauhaus') return theme.bg;
  if (theme.family === 'brutal') return `linear-gradient(135deg, ${theme.bg} 0%, ${theme.surface} 160%)`;
  return theme.bg;
}

function rootFont(theme: ThemePreset) {
  return theme.bodyFont;
}

export default function DesktopPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [visible, setVisible] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGenerationIdRef = useRef('');
  const [showAlternate, setShowAlternate] = useState(false);
  const alternateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateFormat: DateFormat = session?.dateFormat ?? 'korean';
  const time = useClock(dateFormat);
  const mobileUrl = `${window.location.origin}/mobile`;

  const themeId: ThemeId = session?.themeId ?? 'green';
  const theme = findTheme(themeId);
  const displayName = normalizeDisplayName(session?.visitorName);
  const msgBody = normalizeMessageBody(session?.welcomeMessage, session?.visitorName);
  useEffect(() => subscribeSession(setSession), []);

  useEffect(() => {
    if (session?.status !== 'generating' || !session.visitorName) return;
    const prompt = session.sourcePrompt?.trim() || session.welcomeMessage?.trim() || '';
    if (!prompt) return;
    const generationId = session.generationId?.trim() || `${session.visitorName}:${prompt}:${session.tone || ''}`;
    if (lastGenerationIdRef.current === generationId) return;
    lastGenerationIdRef.current = generationId;
    let cancelled = false;

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session.visitorName,
        prompt,
        tone: session.tone,
      }),
    })
      .then((response) => response.json())
      .then((data: { resolvedName?: string; message?: string; allFailed?: boolean }) => {
        if (cancelled) return;
        if (data.allFailed) {
          toast.error('AI 메시지 생성에 실패하여 기본 문구로 처리됩니다.');
        }
        updateSession({
          status: 'displaying',
          visitorName: data.resolvedName ?? session.visitorName,
          welcomeMessage: data.message ?? '마음을 전하는 한마디를 준비했습니다!',
          sourcePrompt: prompt,
          generationId,
        });
      })
      .catch(() => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: session.visitorName,
          welcomeMessage: '마음을 전하는 한마디를 준비했습니다!',
          sourcePrompt: prompt,
          generationId,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [
    session?.status,
    session?.visitorName,
    session?.sourcePrompt,
    session?.welcomeMessage,
    session?.tone,
    session?.generationId,
  ]);

  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const startVisible = setTimeout(() => setVisible(session?.status === 'displaying'), 0);

    if (session?.status === 'displaying') {
      const animateVisible = setTimeout(() => setVisible(true), 60);
      resetTimerRef.current = setTimeout(() => resetSession(), RESET_DELAY);

      return () => {
        clearTimeout(startVisible);
        clearTimeout(animateVisible);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }

    return () => clearTimeout(startVisible);
  }, [session?.status, session?.welcomeMessage]);
  
  useEffect(() => {
    // toggle between welcome and alternate message every 7 seconds
    if (alternateTimerRef.current) {
      clearInterval(alternateTimerRef.current);
      alternateTimerRef.current = null;
    }

    if (session?.status === 'displaying') {
      void Promise.resolve().then(() => setShowAlternate(false));
      
      // toggle every 7 seconds
      alternateTimerRef.current = setInterval(() => {
        setShowAlternate(prev => !prev);
      }, 7000);
    } else {
      void Promise.resolve().then(() => setShowAlternate(false));
    }

    return () => {
      if (alternateTimerRef.current) {
        clearInterval(alternateTimerRef.current);
        alternateTimerRef.current = null;
      }
    };
  }, [session?.status, session?.welcomeMessage]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'q' || session?.status !== 'displaying' || showResetConfirm) return;
      event.preventDefault();
      setShowResetConfirm(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session?.status, showResetConfirm]);

  const isGenerating = session?.status === 'generating';
  const isDisplaying = session?.status === 'displaying';
  const show = isDisplaying && visible;

  async function handleConfirmReset() {
    setShowResetConfirm(false);
    await resetSession();
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: rootBackground(theme), fontFamily: rootFont(theme) }}
    >
      <ThemeTexture theme={theme} />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isDisplaying ? 0 : 1, pointerEvents: isDisplaying ? 'none' : 'auto' }}
      >
        {isGenerating && (
          <div className="absolute flex flex-col items-center gap-4" style={{ top: '24%' }}>
            <div className="flex gap-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-full"
                  style={{
                    width: 'clamp(10px,1.2vh,16px)',
                    height: 'clamp(10px,1.2vh,16px)',
                    background: theme.family === 'brutal' ? '#111' : theme.text,
                    opacity: 0.6,
                    animation: `bounce 1.2s ${index * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p style={{ color: theme.muted, fontSize: 'clamp(0.75rem, 1.8vh, 1.2rem)', letterSpacing: '0.18em' }}>
              {session?.visitorName}님의 메시지를 만들고 있어요...
            </p>
          </div>
        )}

        <div style={{ opacity: isGenerating ? 0.3 : 1 }}>
          <StandbyHeadline theme={theme} />
        </div>

        {!isGenerating && (
          <div className="flex flex-col items-center gap-3" style={{ marginTop: 'clamp(2rem, 5vh, 4rem)' }}>
            <div
              className="rounded-2xl"
              style={{
                background: theme.surface,
                padding: 'clamp(10px, 1.5vh, 16px)',
                border: theme.family === 'brutal' ? '4px solid #111' : `2px solid ${theme.border}`,
                boxShadow: theme.family === 'brutal' ? `10px 10px 0 ${theme.accent}` : '0 18px 44px rgba(0,0,0,0.18)',
              }}
            >
              <QRCodeSVG value={mobileUrl} size={Math.round(window.innerHeight * 0.14)} />
            </div>
            <p style={{ color: theme.muted, fontSize: 'clamp(0.7rem, 1.6vh, 1.05rem)', letterSpacing: '0.16em' }}>
              스캔하여 메시지 남기기
            </p>
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{
          paddingLeft: 'clamp(60px, 8vw, 130px)',
          paddingRight: 'clamp(60px, 8vw, 130px)',
          opacity: show ? 1 : 0,
          pointerEvents: isDisplaying ? 'auto' : 'none',
        }}
      >
        <DisplayDecorations theme={theme} show={show} />
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <DisplayMessage theme={theme} displayName={displayName} msgBody={msgBody} show={show && !showAlternate} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <AlternateDisplayMessage theme={theme} show={show && showAlternate} />
          </div>
        </div>
      </div>

      {theme.id !== 'brutal-bauhaus' && (
        <div
          className="absolute flex justify-end z-20"
          style={{ top: 'clamp(35px, 5vh, 70px)', right: 'clamp(50px, 7vw, 100px)' }}
        >
          <span
            style={{
              color: theme.muted,
              fontSize: 'clamp(0.85rem, 2.1vh, 1.45rem)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.16em',
            }}
          >
            Gwangju Software Meister High School
          </span>
        </div>
      )}

      <div
        className="absolute flex items-end justify-end z-20"
        style={{
          bottom: 'clamp(24px, 4vh, 50px)',
          left: 'clamp(50px, 7vw, 100px)',
          right: 'clamp(50px, 7vw, 100px)',
        }}
      >
        <div className="flex flex-col items-center gap-1.5">
          {theme.id === 'brutal-bauhaus' && (
            <span style={{ color: theme.text, fontSize: 'clamp(0.95rem, 1.9vh, 1.5rem)', letterSpacing: '0.08em' }}>
              GSM SMART DID DISPLAY
            </span>
          )}
          <span style={{ color: theme.text, fontSize: 'clamp(1.2rem, 3vh, 2.2rem)' }}>{time}</span>
        </div>
      </div>

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-lg font-bold text-gray-900">메시지를 삭제할까요?</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              현재 표시 중인 환영 메시지를 지우고 QR 대기 화면으로 돌아갑니다.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600"
              >
                취소
              </button>
              <button
                onClick={() => void handleConfirmReset()}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <ThemeFrame theme={theme} />
    </div>
  );
}
