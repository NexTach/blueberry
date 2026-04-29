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
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  // 이름 접두어를 제거한 메시지 본문
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
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px)',
          opacity: 0.5,
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
            <div className="flex gap-2.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-white/60"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <p className="text-white/55 text-sm tracking-[0.18em]">
              {session?.visitorName}님의 환영 문구를 만들고 있어요...
            </p>
          </div>
        )}

        {/* 학교명 */}
        <div
          className="flex flex-col items-center gap-1"
          style={{ opacity: isGenerating ? 0.25 : 1 }}
        >
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2.6rem)' }}>
            GWANGJU
          </span>
          <span className="tracking-widest" style={{ color: theme.accent, fontSize: 'clamp(2.4rem, 7vw, 5.5rem)', lineHeight: 1 }}>
            SOFTWARE
          </span>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2.6rem)' }}>
            MEISTER
          </span>
        </div>

        {/* QR 코드 */}
        {!isGenerating && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-xl shadow-2xl">
              <QRCodeSVG value={mobileUrl} size={128} />
            </div>
            <p className="text-white/45 text-xs tracking-widest">스캔하여 환영 메시지 남기기</p>
          </div>
        )}
      </div>

      {/* ── 환영 화면 ── */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-center transition-opacity duration-700"
        style={{
          paddingLeft: 'clamp(48px, 8vw, 110px)',
          paddingRight: 'clamp(48px, 8vw, 110px)',
          opacity: show ? 1 : 0,
          pointerEvents: isDisplaying ? 'auto' : 'none',
        }}
      >
        {/* 코너 학교명 */}
        <div
          className="absolute top-10 left-10 flex flex-col gap-0.5 transition-all duration-700"
          style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(-10px)' }}
        >
          <span className="text-white/65 tracking-widest" style={{ fontSize: '0.65rem' }}>GWANGJU</span>
          <span className="tracking-widest" style={{ color: theme.accent, fontSize: '0.78rem', fontWeight: 700 }}>SOFTWARE</span>
          <span className="text-white/65 tracking-widest" style={{ fontSize: '0.65rem' }}>MEISTER</span>
        </div>

        {/* 분필 장식 - 핑크 */}
        <img
          src="/images/chalk-pink.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: '6%', top: '35%',
            width: 'clamp(65px, 10vw, 130px)',
            opacity: show ? 0.8 : 0,
            transition: 'opacity 1s 0.5s',
          }}
        />

        {/* 환영 문구 */}
        <div
          className="transition-all duration-700"
          style={{
            transitionDelay: '200ms',
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(28px)',
          }}
        >
          <p style={{ color: theme.accent, fontSize: 'clamp(2.4rem, 6.5vw, 5.2rem)', lineHeight: 1.15 }}>
            {session?.visitorName}
          </p>
          <p className="text-white mt-3" style={{ fontSize: 'clamp(1.3rem, 3.6vw, 2.9rem)', lineHeight: 1.55, maxWidth: '72vw' }}>
            {msgBody || '님, 환영합니다!'}
          </p>
        </div>

        {/* 분필 장식 - 초록 */}
        <img
          src="/images/chalk-green.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            right: '7%', bottom: '24%',
            width: 'clamp(55px, 8.5vw, 105px)',
            opacity: show ? 0.8 : 0,
            transition: 'opacity 1s 0.7s',
          }}
        />
      </div>

      {/* ── 푸터 ── */}
      <div className="absolute bottom-8 left-10 right-10 flex items-end justify-between z-20">
        <div className="flex flex-col gap-0.5">
          <span className="text-white/40 tracking-widest" style={{ fontSize: 'clamp(0.55rem, 1.1vw, 0.8rem)' }}>since</span>
          <span className="text-white/65 tracking-widest" style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.7rem)' }}>2017</span>
        </div>
        <button
          className="flex flex-col items-center gap-1.5"
          onClick={() => setShowThemePicker(v => !v)}
          aria-label="테마 선택"
        >
          <img src="/images/berry.png" alt="BERRY" style={{ height: 'clamp(18px, 2.5vw, 30px)', width: 'auto' }} />
          <span className="text-white/55 tabular-nums" style={{ fontSize: 'clamp(0.6rem, 1.3vw, 1rem)' }}>{time}</span>
        </button>
      </div>

      {/* ── 나무 프레임 PNG ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <img src="/images/frame.png" alt="" className="w-full h-full" style={{ objectFit: 'fill' }} />
      </div>

      {/* ── 테마 선택 오버레이 ── */}
      {showThemePicker && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={() => setShowThemePicker(false)}
        >
          <div
            className="flex flex-col gap-5 p-7 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)' }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white/70 text-center text-sm tracking-widest" style={{ fontFamily: CHALK_FONT }}>
              테마 선택
            </p>
            <div className="flex gap-5">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => selectTheme(t.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-150"
                    style={{
                      background: t.bg,
                      outline: themeId === t.id ? `3px solid ${t.accent}` : '3px solid rgba(255,255,255,0.15)',
                      transform: themeId === t.id ? 'scale(1.12)' : 'scale(1)',
                    }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: t.accent }} />
                  </div>
                  <span className="text-white/65 text-xs">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
