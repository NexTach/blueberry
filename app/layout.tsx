import type { Metadata } from 'next';
import {
  Black_Han_Sans,
  Do_Hyeon,
  Gowun_Batang,
  Gowun_Dodum,
  Jua,
  Nanum_Gothic,
  Nanum_Myeongjo,
  Nanum_Pen_Script,
  Noto_Sans_KR,
  Poor_Story,
  Single_Day,
  Song_Myung,
  Stylish,
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

const stylish = Stylish({
  variable: '--font-stylish',
  weight: '400',
  display: 'swap',
});

const jua = Jua({
  variable: '--font-jua',
  weight: '400',
  display: 'swap',
  preload: false,
});

const songMyung = Song_Myung({
  variable: '--font-song-myung',
  weight: '400',
  display: 'swap',
});

const gowunBatang = Gowun_Batang({
  variable: '--font-gowun-batang',
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
});

const singleDay = Single_Day({
  variable: '--font-single-day',
  weight: '400',
  display: 'swap',
  preload: false,
});

const nanumPenScript = Nanum_Pen_Script({
  variable: '--font-nanum-pen-script',
  weight: '400',
  display: 'swap',
  preload: false,
});

const poorStory = Poor_Story({
  variable: '--font-poor-story',
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
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunDodum.variable} ${doHyeon.variable} ${nanumGothic.variable} ${nanumMyeongjo.variable} ${blackHanSans.variable} ${stylish.variable} ${jua.variable} ${songMyung.variable} ${gowunBatang.variable} ${singleDay.variable} ${nanumPenScript.variable} ${poorStory.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
