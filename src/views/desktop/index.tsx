import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { subscribeSession, resetSession, updateSession } from '../../lib/firebase';
import { findTheme } from '../../lib/themes';
import type { DateFormat, Session, ThemeId } from '../../types/session';
import { ThemeFrame, ThemeTexture } from './components/ThemeFrames';
import { StandbyHeadline } from './components/StandbyHeadline';
import { DisplayDecorations } from './components/DisplayDecorations';
import { DisplayMessage } from './components/DisplayMessage';
import { useClock, normalizeDisplayName, normalizeMessageBody, rootBackground, rootFont } from './utils';

const RESET_DELAY = 30 * 60 * 1000;

export default function DesktopPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [visible, setVisible] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGenerationIdRef = useRef('');
  const [showAlternate, setShowAlternate] = useState(false);
  const alternateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateFormat: DateFormat = session?.dateFormat ?? 'korean';
  const time = useClock(dateFormat);
  const mobileUrl = `${window.location.origin}/mobile`;

  const themeId: ThemeId = session?.themeId ?? 'green';
  const theme = findTheme(themeId);
  const displayName = normalizeDisplayName(session?.visitorName);
  const msgBody = normalizeMessageBody(session?.welcomeMessage, session?.visitorName);

  const alternateMessage =
    '광주소프트웨어마이스터고등학교 5·18 민주화운동 기념행사에 오신 것을 환영합니다.';
  const displayedMsg = showAlternate ? alternateMessage : msgBody;
  const displayedName = showAlternate ? '' : displayName;

  useEffect(() => subscribeSession(setSession), []);

  useEffect(() => {
    if (session?.status !== 'generating' || !session.visitorName) return;
    const prompt = session.sourcePrompt?.trim() || session.welcomeMessage?.trim() || '';
    if (!prompt) return;
    const generationId = session.generationId?.trim() || `${session.visitorName}:${prompt}:${session.tone || ''}`;
    if (lastGenerationIdRef.current === generationId) return;
    lastGenerationIdRef.current = generationId;
    let cancelled = false;

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session.visitorName,
        prompt,
        tone: session.tone,
      }),
    })
      .then((response) => response.json())
      .then((data: { resolvedName?: string; message?: string; allFailed?: boolean }) => {
        if (cancelled) return;
        if (data.allFailed) {
          toast.error('AI 메시지 생성에 실패하여 기본 문구로 처리됩니다.');
        }
        updateSession({
          status: 'displaying',
          visitorName: data.resolvedName ?? session.visitorName,
          welcomeMessage: data.message ?? '마음을 전하는 한마디를 준비했습니다!',
          sourcePrompt: prompt,
          generationId,
        });
      })
      .catch(() => {
        if (cancelled) return;
        updateSession({
          status: 'displaying',
          visitorName: session.visitorName,
          welcomeMessage: '마음을 전하는 한마디를 준비했습니다!',
          sourcePrompt: prompt,
          generationId,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [
    session?.status,
    session?.visitorName,
    session?.sourcePrompt,
    session?.welcomeMessage,
    session?.tone,
    session?.generationId,
  ]);

  useEffect(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const startVisible = setTimeout(() => setVisible(session?.status === 'displaying'), 0);

    if (session?.status === 'displaying') {
      const animateVisible = setTimeout(() => setVisible(true), 60);
      resetTimerRef.current = setTimeout(() => resetSession(), RESET_DELAY);

      return () => {
        clearTimeout(startVisible);
        clearTimeout(animateVisible);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }

    return () => clearTimeout(startVisible);
  }, [session?.status, session?.welcomeMessage]);

  useEffect(() => {
    if (alternateTimerRef.current) {
      clearTimeout(alternateTimerRef.current);
      alternateTimerRef.current = null;
    }

    if (session?.status === 'displaying') {
      void Promise.resolve().then(() => setShowAlternate(false));
      alternateTimerRef.current = setTimeout(() => {
        setShowAlternate(true);
      }, 5000);
    } else {
      void Promise.resolve().then(() => setShowAlternate(false));
    }

    return () => {
      if (alternateTimerRef.current) {
        clearTimeout(alternateTimerRef.current);
        alternateTimerRef.current = null;
      }
    };
  }, [session?.status, session?.welcomeMessage]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'q' || session?.status !== 'displaying' || showResetConfirm) return;
      event.preventDefault();
      setShowResetConfirm(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session?.status, showResetConfirm]);

  const isGenerating = session?.status === 'generating';
  const isDisplaying = session?.status === 'displaying';
  const show = isDisplaying && visible;

  async function handleConfirmReset() {
    setShowResetConfirm(false);
    await resetSession();
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: rootBackground(theme), fontFamily: rootFont(theme) }}
    >
      <ThemeTexture theme={theme} />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{ opacity: isDisplaying ? 0 : 1, pointerEvents: isDisplaying ? 'none' : 'auto' }}
      >
        {isGenerating && (
          <div className="absolute flex flex-col items-center gap-4" style={{ top: '24%' }}>
            <div className="flex gap-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-full"
                  style={{
                    width: 'clamp(10px,1.2vh,16px)',
                    height: 'clamp(10px,1.2vh,16px)',
                    background: theme.family === 'brutal' ? '#111' : theme.text,
                    opacity: 0.6,
                    animation: `bounce 1.2s ${index * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p style={{ color: theme.muted, fontSize: 'clamp(0.75rem, 1.8vh, 1.2rem)', letterSpacing: '0.18em' }}>
              {session?.visitorName}님의 메시지를 만들고 있어요...
            </p>
          </div>
        )}

        <div style={{ opacity: isGenerating ? 0.3 : 1 }}>
          <StandbyHeadline theme={theme} />
        </div>

        {!isGenerating && (
          <div className="flex flex-col items-center gap-3" style={{ marginTop: 'clamp(2rem, 5vh, 8rem)' }}>
            <div
              className="rounded-2xl"
              style={{
                background: theme.surface,
                padding: 'clamp(10px, 1.5vh, 16px)',
                border: theme.family === 'brutal' ? '4px solid #111' : `2px solid ${theme.border}`,
                boxShadow: theme.family === 'brutal' ? `10px 10px 0 ${theme.accent}` : '0 18px 44px rgba(0,0,0,0.18)',
              }}
            >
              <QRCodeSVG value={mobileUrl} size={Math.round(Math.min(window.innerHeight, window.innerWidth) * 0.14)} />
            </div>
            <p style={{ color: theme.muted, fontSize: 'clamp(0.7rem, 1.6vh, 1.05rem)', letterSpacing: '0.16em' }}>
              스캔하여 메시지 남기기
            </p>
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
        style={{
          paddingLeft: 'clamp(60px, 8vw, 130px)',
          paddingRight: 'clamp(60px, 8vw, 130px)',
          opacity: show ? 1 : 0,
          pointerEvents: isDisplaying ? 'auto' : 'none',
        }}
      >
        <DisplayDecorations theme={theme} show={show} />
        <DisplayMessage theme={theme} displayName={displayedName} msgBody={displayedMsg} show={show} />
      </div>

      {theme.id !== 'brutal-bauhaus' && (
        <div
          className="absolute flex justify-end z-20 overflow-hidden"
          style={{ top: 'clamp(35px, 5vh, 70px)', left: 'clamp(50px, 7vw, 100px)', right: 'clamp(50px, 7vw, 100px)' }}
        >
          <span
            style={{
              color: theme.muted,
              fontSize: 'clamp(0.75rem, min(2.1vh, 2.4vw), 1.45rem)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.16em',
            }}
          >
            Gwangju Software Meister High School
          </span>
        </div>
      )}

      <div
        className="absolute flex items-end justify-end z-20"
        style={{
          bottom: 'clamp(24px, 4vh, 50px)',
          left: 'clamp(50px, 7vw, 100px)',
          right: 'clamp(50px, 7vw, 100px)',
        }}
      >
        <div className="flex flex-col items-center gap-1.5">
          {theme.id === 'brutal-bauhaus' && (
            <span style={{ color: theme.text, fontSize: 'clamp(0.95rem, 1.9vh, 1.5rem)', letterSpacing: '0.08em' }}>
              GSM SMART DID DISPLAY
            </span>
          )}
          <span style={{ color: theme.text, fontSize: 'clamp(1.2rem, 3vh, 2.2rem)' }}>{time}</span>
        </div>
      </div>

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-lg font-bold text-gray-900">메시지를 삭제할까요?</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              현재 표시 중인 환영 메시지를 지우고 QR 대기 화면으로 돌아갑니다.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600"
              >
                취소
              </button>
              <button
                onClick={() => void handleConfirmReset()}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <ThemeFrame theme={theme} />
    </div>
  );
}
