import { NextResponse } from 'next/server';
import { callAI } from '@/src/lib/ai';

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'command required' }, { status: 400 });
    }

    const content = await callAI({
      openaiModel: 'gpt-4o-mini',
      maxTokens: 220,
      systemPrompt:
        '너는 전광판 표시 요청을 구조화하는 명령 해석기다. 반드시 JSON만 출력해. ' +
        '형식은 {"templateId":number,"tone":"warm|bright|formal|playful","name":"string","prompt":"string"} 이다. ' +
        'templateId는 2~7만 사용한다. 7은 AI 창의 생성, 2~6은 고정 템플릿이다. ' +
        '사용자가 창의적으로 문구를 만들라고 하거나 스타일/이모지/분위기/표현 방식을 지시하면 templateId는 7로 둔다. ' +
        '사용자가 단순 환영이나 기본 인사만 원하면 2~6 중 가장 알맞은 템플릿을 고른다. ' +
        'tone은 AI 생성일 때 특히 중요하며, 정보가 부족하면 warm로 둔다. ' +
        'name에는 명령문에서 추정되는 이름을 넣되, 교육감, 교장, 교수, 대표, 원장, 선생님 같은 직함이 함께 언급되면 직함까지 포함해 보존한다. 없으면 빈 문자열로 둔다. ' +
        'prompt에는 최종 문구 생성 전 단계에서 참고할 생성 초안을 넣는다. 완성 문구 자체를 쓰지 말고, 무엇을 원하는지 드러나는 자연스러운 한국어 설명으로 정리해라. ' +
        'prompt는 원래 요청의 목적과 분위기를 잃지 않도록 유지하고, 응원을 환영으로 바꾸는 식의 의미 변경을 하지 마라. ' +
        '프롬프트를 과하게 다듬거나 세부 규칙을 많이 붙이지 말고, 사용자의 요구를 해석한 1차 초안 수준으로 정리해라. JSON 외 텍스트는 절대 출력하지 마.',
      userPrompt:
        `사용자 명령: ${command}\n` +
        '예시: "이모지 넣고 밝게 환영해줘" -> templateId 7, tone bright\n' +
        '예시: "민준이 환영 문구 간단하게" -> templateId 2, name 민준\n' +
        '예시: "민준이 시험 응원 문구 만들어줘" -> templateId 7, tone warm, name 민준\n' +
        '예시 prompt: "시험을 앞둔 학생에게 힘이 되는 응원 문구를 만들어줘. 따뜻하고 짧게 써줘."',
    });

    try {
      const parsed = JSON.parse(content) as {
        templateId?: number;
        tone?: string;
        name?: string;
        prompt?: string;
      };

      const templateId = [2, 3, 4, 5, 6, 7].includes(parsed.templateId ?? 0) ? parsed.templateId! : 7;
      const tone = ['warm', 'bright', 'formal', 'playful'].includes(parsed.tone ?? '') ? parsed.tone! : 'warm';

      return NextResponse.json({
        templateId,
        tone,
        name: parsed.name?.trim() ?? '',
        prompt: parsed.prompt?.trim() || command,
      });
    } catch {
      return NextResponse.json({ templateId: 7, tone: 'warm', name: '', prompt: command });
    }
  } catch {
    return NextResponse.json({
      templateId: 7,
      tone: 'warm',
      name: '',
      prompt: '',
      allFailed: true,
    });
  }
}
