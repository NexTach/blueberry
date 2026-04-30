'use client';

import { useEffect, useMemo, useState } from 'react';
import { mobileControl, mobilePalette, mobileRadius, mobileSpacing, mobileTypography } from '../views/mobile/design';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type BannerMode = 'hidden' | 'installable' | 'ios';

const DISMISS_KEY = 'blueberry-pwa-install-dismissed';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function shouldShowIOSHint() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opr\//i.test(ua);
  return isIOS && isSafari && !isStandalone();
}

export default function PWAInstallBanner() {
  const [bannerMode, setBannerMode] = useState<BannerMode>(() => {
    if (typeof window === 'undefined') return 'hidden';
    if (isStandalone()) return 'hidden';
    if (window.localStorage.getItem(DISMISS_KEY) === 'true') return 'hidden';
    return shouldShowIOSHint() ? 'ios' : 'hidden';
  });
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === 'true') return;

    const handleBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      setPromptEvent(installEvent);
      setBannerMode('installable');
    };

    const handleAppInstalled = () => {
      setPromptEvent(null);
      setBannerMode('hidden');
      window.localStorage.setItem(DISMISS_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const content = useMemo(() => {
    if (bannerMode === 'installable') {
      return {
        title: '앱처럼 설치해서 바로 열기',
        description: '홈 화면에 추가하면 전체화면으로 더 빠르게 열 수 있어요.',
        actionLabel: '설치',
      };
    }

    if (bannerMode === 'ios') {
      return {
        title: '홈 화면에 추가해서 사용하기',
        description: 'Safari 공유 버튼에서 홈 화면에 추가를 선택해주세요.',
        actionLabel: '확인',
      };
    }

    return null;
  }, [bannerMode]);

  if (!content) return null;

  return (
    <div
      className="shrink-0 px-1 pb-3"
      style={{
        paddingTop: mobileSpacing.item,
      }}
    >
      <div
        className="flex items-center gap-3"
        style={{
          borderRadius: mobileRadius.field,
          border: `1px solid ${mobilePalette.accentBorder}`,
          background: mobilePalette.accentSoft,
          padding: '12px 14px',
        }}
      >
        <div className="min-w-0 flex-1">
          <p
            style={{
              color: mobilePalette.text,
              fontSize: mobileTypography.label.fontSize,
              lineHeight: mobileTypography.label.lineHeight,
              letterSpacing: mobileTypography.label.letterSpacing,
              fontWeight: mobileTypography.label.fontWeight,
            }}
          >
            {content.title}
          </p>
          <p
            style={{
              color: mobilePalette.subtext,
              fontSize: mobileTypography.caption.fontSize,
              lineHeight: mobileTypography.caption.lineHeight,
              letterSpacing: mobileTypography.caption.letterSpacing,
              fontWeight: mobileTypography.caption.fontWeight,
            }}
          >
            {content.description}
          </p>
        </div>

        <button
          onClick={async () => {
            if (bannerMode === 'installable' && promptEvent) {
              await promptEvent.prompt();
              const choice = await promptEvent.userChoice.catch(() => null);
              if (choice?.outcome === 'accepted') {
                setBannerMode('hidden');
              }
              return;
            }

            window.localStorage.setItem(DISMISS_KEY, 'true');
            setBannerMode('hidden');
          }}
          className="shrink-0"
          style={{
            minHeight: 36,
            padding: '0 14px',
            borderRadius: 12,
            border: 'none',
            background: mobilePalette.accent,
            color: '#ffffff',
            fontSize: mobileTypography.caption.fontSize,
            lineHeight: mobileTypography.caption.lineHeight,
            letterSpacing: mobileTypography.caption.letterSpacing,
            fontWeight: 700,
          }}
        >
          {content.actionLabel}
        </button>

        <button
          aria-label="설치 안내 닫기"
          onClick={() => {
            window.localStorage.setItem(DISMISS_KEY, 'true');
            setBannerMode('hidden');
          }}
          className="shrink-0"
          style={{
            width: mobileControl.buttonHeight,
            height: 36,
            borderRadius: 12,
            border: 'none',
            background: 'transparent',
            color: mobilePalette.subtextStrong,
            fontSize: 20,
            lineHeight: '20px',
            fontWeight: 500,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
