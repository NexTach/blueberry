import { useCallback, useEffect, useRef, useState } from 'react';

export const isSpeechSupported =
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  error: string | null;
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
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSpeechSupported) return;

    const SR =
      (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition!;

    const recognition = new SR();
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
        network: '네트워크 오류가 발생했습니다.',
      };
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
    setTranscript('');
    setIsListening(true);
    recognitionRef.current.start();
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
  }, []);

  return { isListening, transcript, error, start, stop, reset };
}
