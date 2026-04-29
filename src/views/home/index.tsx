'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-[#344034] flex flex-col items-center justify-center px-6 gap-16"
      style={{ fontFamily: "'HakgyoansimBunpil', sans-serif" }}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
          GWANGJU
        </span>
        <span
          style={{ color: '#6abeff', fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1 }}
          className="tracking-widest"
        >
          SOFTWARE
        </span>
        <span className="text-white tracking-widest" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
          MEISTER
        </span>
        <p className="text-white/40 text-xs tracking-[0.3em] mt-3">WELCOME SYSTEM</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <button
          onClick={() => router.push('/desktop')}
          className="flex-1 group flex flex-col items-center gap-4 px-8 py-10 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white text-base tracking-wide">TV 화면</span>
            <span className="text-white/40 text-xs tracking-wider" style={{ fontFamily: 'sans-serif' }}>
              칠판 디스플레이
            </span>
          </div>
        </button>

        <button
          onClick={() => router.push('/mobile')}
          className="flex-1 group flex flex-col items-center gap-4 px-8 py-10 rounded-2xl border border-[#6abeff]/40 bg-[#6abeff]/10 hover:bg-[#6abeff]/20 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-[#6abeff]/20 flex items-center justify-center group-hover:bg-[#6abeff]/30 transition-colors">
            <svg width="24" height="28" viewBox="0 0 24 24" fill="none" stroke="#6abeff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span style={{ color: '#6abeff' }} className="text-base tracking-wide">모바일</span>
            <span className="text-white/40 text-xs tracking-wider" style={{ fontFamily: 'sans-serif' }}>
              음성 입력
            </span>
          </div>
        </button>
      </div>

      <p className="text-white/20 text-xs tracking-widest" style={{ fontFamily: 'sans-serif' }}>
        since 2017 · BERRY
      </p>
    </div>
  );
}
