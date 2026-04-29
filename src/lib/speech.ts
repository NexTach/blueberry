'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export const isSpeechSupported =
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  errorCode: string | null;
}

export interface SpeechControls {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): SpeechState & SpeechControls {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (!isSpeechSupported) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognitionLike = new SR();

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const result = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(result);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      const msg: Record<string, string> = {
        'not-allowed': '마이크 권한이 필요합니다.',
        'no-speech': '음성이 인식되지 않았습니다.',
        network: '이 브라우저에서는 음성 인식 연결이 불안정합니다. 직접 입력을 사용해주세요.',
        'service-not-allowed': '이 브라우저에서는 음성 인식을 사용할 수 없습니다. 직접 입력을 사용해주세요.',
        'language-not-supported': '현재 브라우저에서 한국어 음성 인식을 지원하지 않습니다.',
      };
      setErrorCode(e.error);
      setError(msg[e.error] ?? '음성 인식 중 오류가 발생했습니다.');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setErrorCode(null);
    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      setErrorCode('start-failed');
      setError('음성 인식을 시작할 수 없습니다. 직접 입력을 사용해주세요.');
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    setIsListening(false);
    setTranscript('');
    setError(null);
    setErrorCode(null);
  }, []);

  return { isListening, transcript, error, errorCode, start, stop, reset };
}
