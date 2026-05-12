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
  const shouldKeepListeningRef = useRef(false);
  const manuallyStoppedRef = useRef(false);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (!isSpeechSupported) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognitionLike = new SR();

    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      // 최종 결과만 finalTranscriptRef에 누적
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        
        if (e.results[i].isFinal) {
          // 최종 결과: finalTranscriptRef에 누적
          finalTranscriptRef.current += transcript;
        } else {
          // 임시 결과: UI에만 표시 (누적하지 않음)
          interimTranscript += transcript;
        }
      }

      // 상태 업데이트 (최종 결과 + 임시 결과)
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'aborted') return;

      shouldKeepListeningRef.current = false;
      manuallyStoppedRef.current = true;

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

    recognition.onend = () => {
      if (shouldKeepListeningRef.current && !manuallyStoppedRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
          } catch {
            shouldKeepListeningRef.current = false;
            setErrorCode('start-failed');
            setError('음성 인식을 다시 시작할 수 없습니다. 직접 입력을 사용해주세요.');
            setIsListening(false);
          }
        }, 250);
        return;
      }

      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      shouldKeepListeningRef.current = false;
      manuallyStoppedRef.current = true;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      recognition.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldKeepListeningRef.current = true;
    manuallyStoppedRef.current = false;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    setError(null);
    setErrorCode(null);
    setTranscript('');
    finalTranscriptRef.current = '';
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
    shouldKeepListeningRef.current = false;
    manuallyStoppedRef.current = true;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    shouldKeepListeningRef.current = false;
    manuallyStoppedRef.current = true;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    recognitionRef.current?.abort();
    setIsListening(false);
    setTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
    setErrorCode(null);
  }, []);

  return { isListening, transcript, error, errorCode, start, stop, reset };
}
