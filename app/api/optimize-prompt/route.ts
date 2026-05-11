import { NextResponse } from 'next/server';
import { callAI } from '@/src/lib/ai';

const ACTION_PATTERNS = [
  { label: '환영', regex: /환영|반갑|어서 오|오신/ },
  { label: '응원', regex: /응원|힘내|파이팅/ },
  { label: '격려', regex: /격려|용기|위로/ },
  { label: '축하', regex: /축하|축복|합격/ },
  { label: '감사', regex: /감사|고맙/ },
];

function findAddedActions(source: string, candidate: string) {
  return ACTION_PATTERNS.filter(({ regex }) => regex.test(candidate) && !regex.test(source)).map(({ label }) => label);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { prompt, tone, name } = body as { prompt?: string; tone?: string; name?: string };

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'prompt required' }, { status: 400 });
  }

  const baseSystemPrompt =
    '너는 전광판 문구 생성 직전에 사용하는 프롬프트 최적화기다. 반드시 JSON만 출력해. 형식은 {"prompt":"..."} 이다. ' +
    '입력 프롬프트의 핵심 의도와 목적을 유지한 채, 최종 문구 생성 AI가 더 안정적으로 한 문장 메시지를 만들 수 있게 한국어 지시문으로 다듬어라. ' +
    '원문 요청에 들어 있는 행위와 목적을 절대 바꾸지 마라. 응원은 응원으로, 격려는 격려로, 환영은 환영으로, 감사는 감사로 그대로 유지해라. ' +
    '원문에 없는 새로운 행위 표현을 추가하지 마라. 격려라고 했으면 응원을 덧붙이지 말고, 환영이라고 했으면 축하를 덧붙이지 마라. 동의어 치환이나 일반화도 하지 마라. ' +
    '사람 이름, 직함, 직접 호칭은 prompt에 넣지 마라. 이름은 별도 메타데이터로 처리된다고 가정하고, 본문 지시에는 학생, 방문객, 귀빈, 수상자처럼 중립적인 역할 표현만 써라. ' +
    '원본 요청에 없는 학교 방문, 행사 환영, 장소 소개 같은 맥락을 새로 추가하지 마라. ' +
    '최적화된 prompt는 최종 완성 문장이 아니라 생성 지시문이어야 한다. 분위기, 길이, 어체, 강조 포인트를 2~4개 정도 자연스럽게 포함해라. ' +
    '보통 한두 문장으로 충분하며, 전광판에 맞게 너무 길지 않고 또렷한 문구가 나오도록 유도해라. JSON 외 텍스트는 절대 출력하지 마.';

  const baseUserPrompt =
    `현재 이름 메타데이터: ${name?.trim() || '(없음)'}\n` +
    `원하는 어체: ${tone || '따뜻하게'}\n` +
    `원문 요청: ${prompt}`;

  try {
    const content = await callAI({
      openaiModel: 'gpt-4o-mini',
      maxTokens: 180,
      systemPrompt: baseSystemPrompt,
      userPrompt: baseUserPrompt,
    });

    try {
      const parsed = JSON.parse(content) as { prompt?: string };
      const optimizedPrompt = parsed.prompt?.trim() || prompt.trim();
      const addedActions = findAddedActions(prompt, optimizedPrompt);

      if (!addedActions.length) {
        return NextResponse.json({ prompt: optimizedPrompt });
      }

      const corrected = await callAI({
        openaiModel: 'gpt-4o-mini',
        maxTokens: 180,
        systemPrompt: baseSystemPrompt,
        userPrompt:
          `${baseUserPrompt}\n` +
          `직전 결과에서 원문에 없는 행위 표현이 추가됨: ${addedActions.join(', ')}\n` +
          '원문에 있는 행위 표현만 남기고 다시 작성해.',
      });

      try {
        const reparsed = JSON.parse(corrected) as { prompt?: string };
        const correctedPrompt = reparsed.prompt?.trim() || prompt.trim();
        const correctedAddedActions = findAddedActions(prompt, correctedPrompt);
        return NextResponse.json({
          prompt: correctedAddedActions.length ? prompt.trim() : correctedPrompt,
        });
      } catch {
        return NextResponse.json({ prompt: prompt.trim() });
      }
    } catch {
      const optimizedPrompt = content.trim() || prompt.trim();
      const addedActions = findAddedActions(prompt, optimizedPrompt);
      return NextResponse.json({
        prompt: addedActions.length ? prompt.trim() : optimizedPrompt,
      });
    }
  } catch {
    return NextResponse.json({
      prompt: prompt.trim(),
      allFailed: true,
    });
  }
}
