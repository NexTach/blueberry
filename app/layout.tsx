import type { Metadata } from 'next';
import {
  Black_Han_Sans,
  Do_Hyeon,
  Gowun_Dodum,
  Nanum_Gothic,
  Nanum_Myeongjo,
  Noto_Sans_KR,
  Song_Myung,
} from 'next/font/google';
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

const nanumGothic = Nanum_Gothic({
  variable: '--font-nanum-gothic',
  weight: ['400', '700', '800'],
  display: 'swap',
  preload: false,
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: '--font-nanum-myeongjo',
  weight: ['400', '700', '800'],
  display: 'swap',
  preload: false,
});

const blackHanSans = Black_Han_Sans({
  variable: '--font-black-han-sans',
  weight: '400',
  display: 'swap',
  preload: false,
});

const songMyung = Song_Myung({
  variable: '--font-song-myung',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '블루베리 - 광주SW마이스터고 환영 시스템',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunDodum.variable} ${doHyeon.variable} ${nanumGothic.variable} ${nanumMyeongjo.variable} ${blackHanSans.variable} ${songMyung.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
