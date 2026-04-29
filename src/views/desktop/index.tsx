import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { subscribeSession, resetSession, updateSession } from '../../lib/firebase';
import type { Session, ThemeId } from '../../types/session';

const CHALK_FONT = "'HakgyoansimBunpil', sans-serif";
const RESET_DELAY = 30 * 60 * 1000; // 30분

const THEMES = [
  { id: 'green' as ThemeId, name: '녹색 칠판', bg: '#344034', accent: '#6abeff' },
  { id: 'black' as ThemeId, name: '흑판', bg: '#1e2820', accent: '#a8f0c6' },
  { id: 'navy' as ThemeId, name: '남색 보드', bg: '#1a2744', accent: '#ffb347' },
  { id: 'warm' as ThemeId, name: '먹판', bg: '#1f1a14', accent: '#ff9fd6' },
];

function ChalkPink({ style }: { style?: React.CSSProperties }) {
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
          stroke="#E4B8D3"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function ChalkGreen({ style }: { style?: React.CSSProperties }) {
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
          stroke="#93B8A6"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function WoodFrame() {
  const FRAME = 'clamp(22px, 3.2vw, 46px)';
  const wood = `
    repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(0,0,0,0.12) 18px, rgba(0,0,0,0.12) 19px, transparent 19px, transparent 38px, rgba(0,0,0,0.08) 38px, rgba(0,0,0,0.08) 39px),
    repeating-linear-gradient(0deg, transparent 0px, transparent 24px, rgba(255,255,255,0.08) 24px, rgba(255,255,255,0.08) 25px),
    repeating-linear-gradient(112deg, #D4A055 0px, #B8893F 4px, #9B7330 8px, #8B6428 12px, #C4903A 16px, #9B6430 20px, #8B5A2C 24px, #C08040 28px, #8B5A2C 32px, #B07838 36px)
  `;
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: FRAME,
          background: wood,
          boxShadow:
            'inset 0 -2px 4px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,245,205,0.25), inset 0 -8px 16px rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: FRAME,
          background: wood,
          boxShadow:
            'inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -2px 3px rgba(255,245,205,0.25), inset 0 8px 16px rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
        style={{
          width: FRAME,
          background: wood,
          boxShadow:
            'inset -2px 0 4px rgba(0,0,0,0.35), inset 2px 0 3px rgba(255,245,205,0.25), inset -8px 0 16px rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 pointer-events-none z-10"
        style={{
          width: FRAME,
          background: wood,
          boxShadow:
            'inset 2px 0 4px rgba(0,0,0,0.35), inset -2px 0 3px rgba(255,245,205,0.25), inset 8px 0 16px rgba(0,0,0,0.3)',
        }}
      />
      {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} pointer-events-none z-10`}
          style={{
            width: FRAME,
            height: FRAME,
            background: wood,
            boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,245,205,0.2)',
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none z-9"
        style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ outline: '2px solid #3A2215', outlineOffset: '-1px' }}
      />
    </>
  );
}

function useClock() {
  const [time, setTime] = useState(() => formatDateTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatDateTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
function formatDateTime(d: Date) {
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours(),
    m = d.getMinutes().toString().padStart(2, '0');
  return `${month}월 ${day}일 ${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`;
}
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeDisplayName(name: string | undefined) {
  return name?.trim().replace(/님\s*$/, '') ?? '';
}

function normalizeMessageBody(message: string | undefined, name: string | undefined) {
  if (!message?.trim()) return '환영합니다!';
  const displayName = normalizeDisplayName(name);
  if (!displayName) return message.trim();

  return message
    .trim()
    .replace(new RegExp(`^${escapeRegex(displayName)}님,?\\s*`), '')
    .trim();
}

export default function DesktopPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [visible, setVisible] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const time = useClock();
  const mobileUrl = `${window.location.origin}/mobile`;

  // 테마는 Firestore session에서 읽음 (모바일에서 제어)
  const themeId: ThemeId = session?.themeId ?? 'green';
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  useEffect(() => {
    return subscribeSession(setSession);
  }, []);

  // generating → AI 생성 → displaying
  useEffect(() => {
    if (session?.status !== 'generating' || !session.visitorName) return;
    let cancelled = false;
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session.visitorName,
        prompt: session.welcomeMessage,
        tone: session.tone,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: data.resolvedName ?? session.visitorName,
          welcomeMessage: data.message ?? '환영합니다!',
        });
      })
      .catch(() => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: session.visitorName,
          welcomeMessage: '환영합니다!',
        });
      });
    return () => {
      cancelled = true;
    };
  }, [session?.status, session?.visitorName, session?.welcomeMessage, session?.tone]);

  // displaying 진입 애니메이션 + 자동 리셋
  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const t0 = setTimeout(() => setVisible(session?.status === 'displaying'), 0);
    if (session?.status === 'displaying') {
      const t1 = setTimeout(() => setVisible(true), 60);
      resetTimerRef.current = setTimeout(() => resetSession(), RESET_DELAY);
      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }
    return () => clearTimeout(t0);
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
  const displayName = normalizeDisplayName(session?.visitorName);

  const msgBody = normalizeMessageBody(session?.welcomeMessage, session?.visitorName);

  async function handleConfirmReset() {
    setShowResetConfirm(false);
    await resetSession();
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: theme.bg, fontFamily: CHALK_FONT }}
    >
      {/* 칠판 미세 텍스처 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 6px)',
        }}
      />

      {/* ── 대기 화면 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isDisplaying ? 0 : 1, pointerEvents: isDisplaying ? 'none' : 'auto' }}
      >
        {isGenerating && (
          <div className="absolute flex flex-col items-center gap-4" style={{ top: '26%' }}>
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full bg-white/60"
                  style={{
                    width: 'clamp(10px,1.2vh,16px)',
                    height: 'clamp(10px,1.2vh,16px)',
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-white/55 tracking-[0.18em]" style={{ fontSize: 'clamp(0.75rem, 1.8vh, 1.2rem)' }}>
              {session?.visitorName}님의 환영 문구를 만들고 있어요...
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-1" style={{ opacity: isGenerating ? 0.25 : 1 }}>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(2rem, 6.5vh, 5.5rem)' }}>
            GWANGJU
          </span>
          <span
            className="tracking-widest"
            style={{ color: theme.accent, fontSize: 'clamp(3rem, 9.5vh, 8.5rem)', lineHeight: 1 }}
          >
            SOFTWARE
          </span>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(2rem, 6.5vh, 5.5rem)' }}>
            MEISTER
          </span>
        </div>

        {!isGenerating && (
          <div className="flex flex-col items-center gap-3" style={{ marginTop: 'clamp(2rem, 5vh, 4rem)' }}>
            <div className="bg-white rounded-xl shadow-2xl" style={{ padding: 'clamp(10px, 1.5vh, 16px)' }}>
              <QRCodeSVG value={mobileUrl} size={Math.round(window.innerHeight * 0.14)} />
            </div>
            <p className="text-white/45 tracking-widest" style={{ fontSize: 'clamp(0.65rem, 1.5vh, 1rem)' }}>
              스캔하여 메시지 남기기
            </p>
          </div>
        )}
      </div>

      {/* ── 환영 화면 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{
          paddingLeft: 'clamp(60px, 8vw, 130px)',
          paddingRight: 'clamp(60px, 8vw, 130px)',
          opacity: show ? 1 : 0,
          pointerEvents: isDisplaying ? 'auto' : 'none',
        }}
      >
        {/* 분필 장식 - 핑크 (우상단) */}
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
          <ChalkPink style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* 환영 문구 */}
        <div
          className="text-center transition-all duration-700"
          style={{
            transitionDelay: '200ms',
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p style={{ color: theme.accent, fontSize: 'clamp(2.5rem, 7vh, 6.5rem)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            {displayName ? `${displayName}님` : ''}
          </p>
          <p
            className="text-white"
            style={{
              fontSize: 'clamp(1.4rem, 4.5vh, 4rem)',
              lineHeight: 1.55,
              marginTop: 'clamp(0.5rem, 1.5vh, 1.5rem)',
              maxWidth: 'min(78vw, 22ch)',
              marginInline: 'auto',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              textWrap: 'pretty',
            }}
          >
            {msgBody}
          </p>
        </div>

        {/* 분필 장식 - 초록 (좌하단) */}
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
          <ChalkGreen style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* ── 상단 정보 ── */}
      <div
        className="absolute flex justify-end z-20"
        style={{ top: 'clamp(35px, 5vh, 70px)', right: 'clamp(50px, 7vw, 100px)' }}
      >
        <span
          className="text-white/60 tracking-widest"
          style={{ fontSize: 'clamp(0.85rem, 2.1vh, 1.45rem)', whiteSpace: 'nowrap' }}
        >
          Gwangju Software Meister High School
        </span>
      </div>

      {/* ── 푸터 ── */}
      <div
        className="absolute flex items-end justify-between z-20"
        style={{ bottom: 'clamp(24px, 4vh, 50px)', left: 'clamp(50px, 7vw, 100px)', right: 'clamp(50px, 7vw, 100px)' }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-white/35 tracking-widest" style={{ fontSize: 'clamp(0.75rem, 1.8vh, 1.3rem)' }}>
            since
          </span>
          <span className="text-white/60 tracking-widest" style={{ fontSize: 'clamp(1.2rem, 3.5vh, 2.8rem)' }}>
            2017
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-white/65 tabular-nums" style={{ fontSize: 'clamp(1.2rem, 3vh, 2.2rem)' }}>
            {time}
          </span>
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

      {/* ── 나무 프레임 ── */}
      <WoodFrame />
    </div>
  );
}
