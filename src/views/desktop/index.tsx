import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { subscribeSession, resetSession, updateSession } from '../../lib/firebase';
import type { Session } from '../../types/session';

const CHALK_FONT = "'HakgyoansimBunpil', sans-serif";
const RESET_DELAY = 30_000;

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h < 12 ? '오전' : '오후';
  const h12 = h % 12 || 12;
  return `${period} ${h12}:${m}`;
}

export default function DesktopPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [visible, setVisible] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const time = useClock();
  const mobileUrl = `${window.location.origin}/mobile`;

  useEffect(() => {
    const unsub = subscribeSession(setSession);
    return unsub;
  }, []);

  // AI 생성: generating 상태 감지 → /api/generate 호출 → displaying으로 전환
  useEffect(() => {
    if (session?.status !== 'generating' || !session.visitorName) return;
    let cancelled = false;
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: session.visitorName }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const msg = data.message ?? `${session.visitorName}님, 환영합니다!`;
        updateSession({ status: 'displaying', visitorName: session.visitorName, welcomeMessage: msg });
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

  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    if (session?.status === 'displaying') {
      setVisible(false);
      const enterTimer = setTimeout(() => setVisible(true), 50);
      resetTimerRef.current = setTimeout(() => resetSession(), RESET_DELAY);
      return () => {
        clearTimeout(enterTimer);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    } else {
      setVisible(false);
    }
  }, [session?.status, session?.welcomeMessage]);

  const isGenerating = session?.status === 'generating';
  const isDisplaying = session?.status === 'displaying';

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: '#344034', fontFamily: CHALK_FONT }}
    >
      {/* 나무 프레임 테두리 */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute inset-0 border-[28px] rounded-sm"
          style={{
            borderColor: '#7a4f2e',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* 칠판 텍스처 */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* 대기 화면 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isDisplaying ? 0 : 1, pointerEvents: isDisplaying ? 'none' : 'auto' }}
      >
        {isGenerating && (
          <div className="absolute top-1/4 flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white/60 rounded-full"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <p className="text-white/60 text-sm tracking-widest">
              {session?.visitorName}님의 환영 문구를 만들고 있어요...
            </p>
          </div>
        )}
        <div className={`flex flex-col items-center gap-1 ${isGenerating ? 'opacity-30' : 'animate-pulse'}`}>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
            GWANGJU
          </span>
          <span
            style={{ color: '#6abeff', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1 }}
            className="tracking-widest"
          >
            SOFTWARE
          </span>
          <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
            MEISTER
          </span>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <QRCodeSVG value={mobileUrl} size={140} />
          </div>
          <p className="text-white/60 text-sm tracking-wider">스캔하여 환영 메시지 남기기</p>
        </div>
      </div>

      {/* 환영 화면 */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-center px-[8vw] transition-opacity duration-700"
        style={{ opacity: isDisplaying && visible ? 1 : 0, pointerEvents: isDisplaying ? 'auto' : 'none' }}
      >
        {/* 코너 학교 이름 */}
        <div
          className="absolute top-14 left-14 flex flex-col gap-0.5 transition-all duration-700"
          style={{
            opacity: isDisplaying && visible ? 1 : 0,
            transform: isDisplaying && visible ? 'translateY(0)' : 'translateY(-12px)',
          }}
        >
          <span className="text-white/80 tracking-widest text-sm">GWANGJU</span>
          <span style={{ color: '#6abeff' }} className="tracking-widest font-bold text-base">
            SOFTWARE
          </span>
          <span className="text-white/80 tracking-widest text-sm">MEISTER</span>
        </div>

        {/* 환영 문구 */}
        <div
          className="transition-all duration-700 delay-200"
          style={{
            opacity: isDisplaying && visible ? 1 : 0,
            transform: isDisplaying && visible ? 'translateY(0)' : 'translateY(32px)',
          }}
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span style={{ color: '#6abeff', fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 1.1 }}>
              {session?.visitorName}
            </span>
            <span className="text-white" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', lineHeight: 1.2 }}>
              님,
            </span>
          </div>
          <p className="text-white mt-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1.4, maxWidth: '80vw' }}>
            {session?.welcomeMessage?.replace(`${session.visitorName}님, `, '')}
          </p>
        </div>

        {/* 분필 낙서 장식 */}
        <svg
          className="absolute"
          style={{
            bottom: '15%',
            right: '10%',
            opacity: isDisplaying && visible ? 0.5 : 0,
            transition: 'opacity 1s 0.6s',
          }}
          width="120"
          height="50"
          viewBox="0 0 120 50"
          fill="none"
        >
          <path d="M10 35 Q30 10 55 25 Q75 38 100 20" stroke="#ff9fd6" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
        <svg
          className="absolute"
          style={{
            top: '30%',
            right: '8%',
            opacity: isDisplaying && visible ? 0.4 : 0,
            transition: 'opacity 1s 0.8s',
          }}
          width="80"
          height="30"
          viewBox="0 0 80 30"
          fill="none"
        >
          <path d="M5 20 Q20 5 40 18 Q58 28 70 12" stroke="#6affd4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 하단: since + BERRY + 시계 */}
      <div className="absolute bottom-10 left-14 right-14 flex items-end justify-between z-20">
        <div className="flex flex-col gap-0.5">
          <span className="text-white/40 text-xs tracking-widest">since</span>
          <span className="text-white/70 tracking-widest" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
            2017
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white/50 text-xs tracking-[0.3em]">BERRY</span>
          <span className="text-white/70 tabular-nums" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)' }}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
