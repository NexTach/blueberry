import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { subscribeSession, resetSession, updateSession } from '../../lib/firebase';
import type { Session } from '../../types/session';

const CHALK_FONT = "'HakgyoansimBunpil', sans-serif";
const RESET_DELAY = 30_000;

const THEMES = [
  { id: 'green', name: '녹색 칠판', bg: '#344034', accent: '#6abeff' },
  { id: 'black', name: '흑판',      bg: '#1e2820', accent: '#a8f0c6' },
  { id: 'navy',  name: '남색 보드', bg: '#1a2744', accent: '#ffb347' },
  { id: 'warm',  name: '먹판',      bg: '#1f1a14', accent: '#ff9fd6' },
] as const;
type ThemeId = typeof THEMES[number]['id'];

// Figma 원본 분필 낙서 SVG (fractalNoise 텍스처 포함)
function ChalkPink({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 122.296 173.669"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <filter id="chalk-pink-f" x="0" y="0" width="122.296" height="173.669" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="3762" />
          <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" />
          <feMerge><feMergeNode in="displacedImage" /></feMerge>
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
        <filter id="chalk-green-f" x="0" y="0" width="73.7964" height="196.812" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.25 0.25" numOctaves="3" seed="3097" />
          <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" />
          <feMerge><feMergeNode in="displacedImage" /></feMerge>
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

// CSS 나무 프레임 오버레이
function WoodFrame() {
  const FRAME = 'clamp(22px, 3.2vw, 46px)';
  
  // 고퀄리티 나무 질감: 여러 겹의 그라디언트와 패턴 조합
  const wood = `
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 18px,
      rgba(0, 0, 0, 0.12) 18px,
      rgba(0, 0, 0, 0.12) 19px,
      transparent 19px,
      transparent 38px,
      rgba(0, 0, 0, 0.08) 38px,
      rgba(0, 0, 0, 0.08) 39px
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 24px,
      rgba(255, 255, 255, 0.08) 24px,
      rgba(255, 255, 255, 0.08) 25px
    ),
    repeating-linear-gradient(
      112deg,
      #D4A055 0px,
      #B8893F 4px,
      #9B7330 8px,
      #8B6428 12px,
      #C4903A 16px,
      #9B6430 20px,
      #8B5A2C 24px,
      #C08040 28px,
      #8B5A2C 32px,
      #B07838 36px
    )
  `;

  const topBottomShadow = 'inset 0 -2px 4px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,245,205,0.25), inset 0 -8px 16px rgba(0,0,0,0.3)';
  const leftRightShadow = 'inset -2px 0 4px rgba(0,0,0,0.35), inset 2px 0 3px rgba(255,245,205,0.25), inset -8px 0 16px rgba(0,0,0,0.3)';
  const cornerShadow = 'inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,245,205,0.2), inset -6px -6px 12px rgba(0,0,0,0.3)';

  return (
    <>
      {/* 상단 */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: FRAME, background: wood,
          boxShadow: topBottomShadow }} />
      {/* 하단 */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: FRAME, background: wood,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -2px 3px rgba(255,245,205,0.25), inset 0 8px 16px rgba(0,0,0,0.3)' }} />
      {/* 좌측 */}
      <div className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
        style={{ width: FRAME, background: wood,
          boxShadow: leftRightShadow }} />
      {/* 우측 */}
      <div className="absolute top-0 right-0 bottom-0 pointer-events-none z-10"
        style={{ width: FRAME, background: wood,
          boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.35), inset -2px 0 3px rgba(255,245,205,0.25), inset 8px 0 16px rgba(0,0,0,0.3)' }} />
      {/* 모서리 조각 (겹침 보완) */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(pos => (
        <div key={pos} className={`absolute ${pos} pointer-events-none z-10`}
          style={{ width: FRAME, height: FRAME, background: wood,
            boxShadow: cornerShadow }} />
      ))}
      {/* 프레임 내부 그림자 (칠판과의 깊이감) */}
      <div className="absolute inset-0 pointer-events-none z-[9]"
        style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)' }} />
      {/* 외곽 선과 모서리 강조 */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ outline: '2px solid #3A2215', outlineOffset: '-1px', boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)' }} />
    </>
  );
}

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
function formatTime(d: Date) {
  const h = d.getHours(), m = d.getMinutes().toString().padStart(2, '0');
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`;
}
function escapeRegex(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

export default function DesktopPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [visible, setVisible] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>(
    () => ((localStorage.getItem('desktopTheme') as ThemeId) ?? 'green'),
  );
  const [showThemePicker, setShowThemePicker] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const time = useClock();
  const mobileUrl = `${window.location.origin}/mobile`;
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  useEffect(() => { return subscribeSession(setSession); }, []);

  // generating → AI 생성 → displaying
  useEffect(() => {
    if (session?.status !== 'generating' || !session.visitorName) return;
    let cancelled = false;
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: session.visitorName }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: session.visitorName,
          welcomeMessage: data.message ?? `${session.visitorName}님, 환영합니다!`,
        });
      })
      .catch(() => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: session.visitorName,
          welcomeMessage: `${session.visitorName}님, 환영합니다!`,
        });
      });
    return () => { cancelled = true; };
  }, [session?.status, session?.visitorName]);

  // displaying 진입 애니메이션 + 자동 리셋
  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (session?.status === 'displaying') {
      setVisible(false);
      const t1 = setTimeout(() => setVisible(true), 60);
      resetTimerRef.current = setTimeout(() => resetSession(), RESET_DELAY);
      return () => {
        clearTimeout(t1);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }
    setVisible(false);
  }, [session?.status, session?.welcomeMessage]);

  function selectTheme(id: ThemeId) {
    setThemeId(id);
    localStorage.setItem('desktopTheme', id);
    setShowThemePicker(false);
  }

  const isGenerating = session?.status === 'generating';
  const isDisplaying = session?.status === 'displaying';
  const show = isDisplaying && visible;

  const msgBody = session?.welcomeMessage
    ?.replace(new RegExp(`^${escapeRegex(session.visitorName ?? '')}님,?\\s*`), '')
    .trim() ?? '';

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: theme.bg, fontFamily: CHALK_FONT }}
    >
      {/* 칠판 미세 텍스처 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 6px)',
        }}
      />

      {/* ── 대기 화면 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isDisplaying ? 0 : 1, pointerEvents: isDisplaying ? 'none' : 'auto' }}
      >
        {/* 생성 중 인디케이터 */}
        {isGenerating && (
          <div className="absolute flex flex-col items-center gap-4" style={{ top: '26%' }}>
            <div className="flex gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-full bg-white/60"
                  style={{ width: 'clamp(10px,1.2vh,16px)', height: 'clamp(10px,1.2vh,16px)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p className="text-white/55 tracking-[0.18em]" style={{ fontSize: 'clamp(0.75rem, 1.8vh, 1.2rem)' }}>
              {session?.visitorName}님의 환영 문구를 만들고 있어요...
            </p>
          </div>
        )}

        {/* 학교명 */}
        <div className="flex flex-col items-center gap-1" style={{ opacity: isGenerating ? 0.25 : 1 }}>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.4rem, 5vh, 4.5rem)' }}>
            GWANGJU
          </span>
          <span className="tracking-widest" style={{ color: theme.accent, fontSize: 'clamp(2.5rem, 7.5vh, 7rem)', lineHeight: 1 }}>
            SOFTWARE
          </span>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.4rem, 5vh, 4.5rem)' }}>
            MEISTER
          </span>
        </div>

        {/* QR 코드 */}
        {!isGenerating && (
          <div className="flex flex-col items-center gap-3" style={{ marginTop: 'clamp(2rem, 5vh, 4rem)' }}>
            <div className="bg-white rounded-xl shadow-2xl" style={{ padding: 'clamp(10px, 1.5vh, 16px)' }}>
              <QRCodeSVG value={mobileUrl} size={Math.round(window.innerHeight * 0.14)} />
            </div>
            <p className="text-white/45 tracking-widest" style={{ fontSize: 'clamp(0.65rem, 1.5vh, 1rem)' }}>
              스캔하여 환영 메시지 남기기
            </p>
          </div>
        )}
      </div>

      {/* ── 환영 화면 ── */}
      <div
        className="absolute inset-0 flex flex-col justify-center transition-opacity duration-700"
        style={{
          paddingLeft: 'clamp(60px, 8vw, 130px)',
          paddingRight: 'clamp(60px, 8vw, 130px)',
          opacity: show ? 1 : 0,
          pointerEvents: isDisplaying ? 'auto' : 'none',
        }}
      >
        {/* 코너 학교명 */}
        <div
          className="absolute flex flex-col gap-0.5 transition-all duration-700"
          style={{
            top: 'clamp(40px,6vh,80px)', left: 'clamp(50px,7vw,100px)',
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          <span className="text-white/65 tracking-widest" style={{ fontSize: 'clamp(0.6rem, 1.5vh, 1rem)' }}>GWANGJU</span>
          <span className="tracking-widest" style={{ color: theme.accent, fontSize: 'clamp(0.7rem, 1.8vh, 1.2rem)', fontWeight: 700 }}>SOFTWARE</span>
          <span className="text-white/65 tracking-widest" style={{ fontSize: 'clamp(0.6rem, 1.5vh, 1rem)' }}>MEISTER</span>
        </div>

        {/* 분필 장식 - 핑크 (왼쪽) */}
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            left: '5%', top: '38%',
            width: 'clamp(80px, 11vh, 160px)',
            opacity: show ? 0.9 : 0,
            transitionDelay: '500ms',
          }}
        >
          <ChalkPink style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* 환영 문구 */}
        <div
          className="transition-all duration-700"
          style={{
            transitionDelay: '200ms',
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p style={{ color: theme.accent, fontSize: 'clamp(2.5rem, 7vh, 6.5rem)', lineHeight: 1.1 }}>
            {session?.visitorName}
          </p>
          <p className="text-white" style={{ fontSize: 'clamp(1.4rem, 4.5vh, 4rem)', lineHeight: 1.55, maxWidth: '75vw', marginTop: 'clamp(0.5rem, 1.5vh, 1.5rem)' }}>
            {msgBody || '님, 환영합니다!'}
          </p>
        </div>

        {/* 분필 장식 - 초록 (오른쪽 하단) */}
        <div
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            right: '7%', bottom: '22%',
            width: 'clamp(55px, 7.5vh, 110px)',
            opacity: show ? 0.9 : 0,
            transitionDelay: '700ms',
          }}
        >
          <ChalkGreen style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* ── 푸터 ── */}
      <div
        className="absolute flex items-end justify-between z-20"
        style={{
          bottom: 'clamp(24px, 4vh, 50px)',
          left: 'clamp(50px, 7vw, 100px)',
          right: 'clamp(50px, 7vw, 100px)',
        }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-white/40 tracking-widest" style={{ fontSize: 'clamp(0.55rem, 1.2vh, 0.85rem)' }}>since</span>
          <span className="text-white/65 tracking-widest" style={{ fontSize: 'clamp(0.9rem, 2.8vh, 2.2rem)' }}>2017</span>
        </div>
        <button
          className="flex flex-col items-center gap-1.5"
          onClick={() => setShowThemePicker(v => !v)}
          aria-label="테마 선택"
        >
          <img src="/images/berry.png" alt="BERRY" style={{ height: 'clamp(20px, 3vh, 36px)', width: 'auto' }} />
          <span className="text-white/55 tabular-nums" style={{ fontSize: 'clamp(0.6rem, 1.4vh, 1rem)' }}>{time}</span>
        </button>
      </div>

      {/* ── CSS 나무 프레임 ── */}
      <WoodFrame />

      {/* ── 테마 선택 오버레이 ── */}
      {showThemePicker && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={() => setShowThemePicker(false)}
        >
          <div
            className="flex flex-col gap-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', padding: 'clamp(1.5rem, 3vh, 2.5rem)' }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white/70 text-center tracking-widest" style={{ fontFamily: CHALK_FONT, fontSize: 'clamp(0.8rem, 1.8vh, 1.1rem)' }}>
              테마 선택
            </p>
            <div className="flex gap-5">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => selectTheme(t.id)} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-xl flex items-center justify-center transition-all duration-150"
                    style={{
                      width: 'clamp(52px, 7vh, 72px)', height: 'clamp(52px, 7vh, 72px)',
                      background: t.bg,
                      outline: themeId === t.id ? `3px solid ${t.accent}` : '3px solid rgba(255,255,255,0.15)',
                      transform: themeId === t.id ? 'scale(1.12)' : 'scale(1)',
                    }}
                  >
                    <div className="rounded-full" style={{ width: '30%', height: '30%', background: t.accent }} />
                  </div>
                  <span className="text-white/65" style={{ fontSize: 'clamp(0.65rem, 1.3vh, 0.85rem)' }}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
