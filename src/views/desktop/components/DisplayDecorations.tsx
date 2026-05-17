import React from 'react';
import type { ThemePreset } from '../../../lib/themes';

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

export function DisplayDecorations({ theme, show }: { theme: ThemePreset; show: boolean }) {
  if (theme.id === 'brutal-bauhaus') {
    return (
      <>
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: '14%',
            left: '31%',
            width: 'clamp(16px, 1.5vw, 24px)',
            height: 'min(23vh, 300px)',
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
            height: 'min(21vh, 280px)',
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
            height: 'min(21vh, 280px)',
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
            width: 'min(25vmin, 380px)',
            height: 'min(22vmin, 300px)',
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
            width: 'min(27vmin, 400px)',
            height: 'min(17vmin, 230px)',
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
            width: 'min(25vmin, 380px)',
            height: 'min(23vmin, 320px)',
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
            width: 'min(18vmin, 270px)',
            height: 'min(18vmin, 270px)',
            border: '10px solid #111',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            right: '27%',
            bottom: '17%',
            width: 'clamp(14px, 1.4vmin, 20px)',
            height: 'min(18vmin, 240px)',
            background: '#111',
            opacity: show ? 1 : 0,
          }}
        />
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            left: '24%',
            bottom: '4%',
            width: 'min(42vmin, 620px)',
            height: 'min(14vmin, 190px)',
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
