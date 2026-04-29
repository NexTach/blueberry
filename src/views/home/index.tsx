'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-white px-6 py-12 flex items-center justify-center"
      style={{ fontFamily: "'HakgyoansimBunpil', sans-serif" }}
    >
      <main className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm tracking-[0.35em] text-black/40" style={{ fontFamily: 'sans-serif' }}>
            WELCOME
          </p>
          <div className="flex flex-col items-center gap-1">
            <img src="/images/berry.png" alt="BERRY" className="block w-[clamp(4rem,11.333vw,7.333rem)] h-auto" />
          </div>

          <p className="max-w-sm text-md text-black/60" style={{ fontFamily: 'sans-serif' }}>
            원하는 화면을 선택해
            <br />
            바로 시작할 수 있는 시작 화면입니다.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => router.push('/desktop')}
            className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left transition-colors duration-200 hover:bg-black/3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white transition-transform duration-300 group-hover:scale-[1.02]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2.5" y="4" width="19" height="12" rx="2.5" />
                <path d="M8 20h8" />
                <path d="M12 16v4" />
              </svg>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-base tracking-wide text-black">TV 화면</span>
              <span className="text-sm leading-6 text-black/45" style={{ fontFamily: 'sans-serif' }}>
                칠판 디스플레이로 이동
              </span>
            </div>
          </button>

          <button
            onClick={() => router.push('/mobile')}
            className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left transition-colors duration-200 hover:bg-black/3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white transition-transform duration-300 group-hover:scale-[1.02]">
              <svg
                width="20"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
                <path d="M12 18.2h.01" />
              </svg>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-base tracking-wide text-black">모바일</span>
              <span className="text-sm leading-6 text-black/45" style={{ fontFamily: 'sans-serif' }}>
                음성 입력 또는 직접 입력
              </span>
            </div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[10px] tracking-[0.35em] text-black/25" style={{ fontFamily: 'sans-serif' }}>
            since 2026 · BERRY
          </p>
        </div>
      </main>
    </div>
  );
}
