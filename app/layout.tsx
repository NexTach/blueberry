import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '블루베리 - 광주SW마이스터고 환영 시스템',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
