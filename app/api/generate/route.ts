import { NextResponse } from 'next/server';
import { callAI } from '@/src/lib/ai';

const ACTION_PATTERNS = [
  { label: '환영', regex: /환영|반갑|어서 오|오신/ },
  { label: '응원', regex: /응원|힘내|파이팅/ },
  { label: '격려', regex: /격려|용기|위로/ },
  { label: '축하', regex: /축하|축복|합격/ },
  { label: '감사', regex: /감사|고맙/ },
];

function fallbackMessage() {
  return '마음을 전하는 한마디를 준비했습니다!';
}

function findAddedActions(source: string, candidate: string) {
  return ACTION_PATTERNS.filter(({ regex }) => regex.test(candidate) && !regex.test(source)).map(({ label }) => label);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { name, prompt, tone } = body as { name?: string; prompt?: string; tone?: string };
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const baseSystemPrompt =
    '너는 전광판용 한 문장 메시지 작성기다. 자연스러운 한국어 문구를 작성해. ' +
    '반드시 JSON만 출력해. 형식은 {"resolvedName":"...", "message":"..."} 이다. ' +
    'resolvedName에는 최종적으로 적용한 표시 이름만 넣어. 사용자가 교육감, 교장, 교수, 대표, 원장, 선생님 같은 직함을 함께 알려줬다면 이름에서 그 직함을 유지해. ' +
    'resolvedName에는 보통 마지막 호칭 "님"은 넣지 말고, 직함만 보존해. 예: "강기정 교육감". ' +
    'message는 데스크탑 화면에서 이름 아래에 이어질 한국어 한 문장 본문이다. ' +
    'message에는 resolvedName이나 다른 이름 호칭을 절대 넣지 마. ' +
    '원문 요청에 들어 있는 행위와 목적을 그대로 따른다. 응원은 응원으로, 격려는 격려로, 환영은 환영으로 유지하고 다른 행위로 바꾸지 마라. ' +
    '원문에 없는 새로운 행위 표현을 추가하지 마라. 격려라고 했으면 응원을 덧붙이지 말고, 환영이라고 했으면 축하를 덧붙이지 마라. 동의어 치환이나 일반화도 하지 마라. ' +
    '최적화된 지시문은 스타일과 목적 설명이므로, 거기에 사람이름이 있더라도 message에 직접 넣지 마라. resolvedName은 별도 표시용 메타데이터다. ' +
    '원본 요청에 없는 학교 방문, 행사 환영, 장소 소개 맥락을 새로 추가하지 마라. 지시문에 학교 특성이 명시된 경우에만 그 맥락을 반영해라. ' +
    '문장은 너무 길지 않게 쓰고, 전광판에 어울리게 매끄럽고 또렷하게 작성해라. JSON 외 다른 텍스트는 절대 출력하지 마.';

  const baseUserPrompt =
    `표시할 이름: ${name}\n` +
    `원하는 어체: ${tone || '따뜻하게'}\n` +
    `최적화된 지시문: ${prompt || '(없음)'}`;

  try {
    const fallback = fallbackMessage();
    const content = await callAI({
      openaiModel: 'gpt-5.2',
      openaiReasoningEffort: 'none',
      maxTokens: 80,
      systemPrompt: baseSystemPrompt,
      userPrompt: baseUserPrompt,
    });

    try {
      const parsed = JSON.parse(content) as { resolvedName?: string; message?: string };
      const resolvedName = parsed.resolvedName?.trim() || name;
      const message = parsed.message?.trim() || fallback;
      const addedActions = findAddedActions(prompt || '', message);

      if (!addedActions.length) {
        return NextResponse.json({
          resolvedName,
          message,
        });
      }

      const corrected = await callAI({
        openaiModel: 'gpt-5.2',
        openaiReasoningEffort: 'none',
        maxTokens: 80,
        systemPrompt: baseSystemPrompt,
        userPrompt:
          `${baseUserPrompt}\n` +
          `직전 결과에서 원문에 없는 행위 표현이 추가됨: ${addedActions.join(', ')}\n` +
          '원문에 있는 행위 표현만 남기고 다시 작성해.',
      });

      try {
        const reparsed = JSON.parse(corrected) as { resolvedName?: string; message?: string };
        const correctedName = reparsed.resolvedName?.trim() || resolvedName;
        const correctedMessage = reparsed.message?.trim() || fallback;
        const correctedAddedActions = findAddedActions(prompt || '', correctedMessage);
        return NextResponse.json({
          resolvedName: correctedName,
          message: correctedAddedActions.length ? fallback : correctedMessage,
        });
      } catch {
        return NextResponse.json({ resolvedName, message: fallback });
      }
    } catch {
      const message = content || fallback;
      const addedActions = findAddedActions(prompt || '', message);
      return NextResponse.json({
        resolvedName: name,
        message: addedActions.length ? fallback : message,
      });
    }
  } catch {
    return NextResponse.json({
      resolvedName: name ?? '',
      message: fallbackMessage(),
      allFailed: true,
    });
  }
}
