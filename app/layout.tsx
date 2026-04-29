import type { Metadata } from 'next';
import { Do_Hyeon, Gowun_Dodum, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

const gowunDodum = Gowun_Dodum({
  variable: '--font-gowun-dodum',
  weight: '400',
  display: 'swap',
  preload: false,
});

const doHyeon = Do_Hyeon({
  variable: '--font-do-hyeon',
  weight: '400',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: '블루베리 - 광주SW마이스터고 환영 시스템',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${gowunDodum.variable} ${doHyeon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
