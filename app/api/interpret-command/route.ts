import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const { command } = await request.json();
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'command required' }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 전광판 표시 명령 해석기다. 반드시 JSON만 출력해. ' +
            '형식은 {"templateId":number,"tone":"warm|bright|formal|playful","name":"string","prompt":"string"} 이다. ' +
            'templateId는 1~7만 사용한다. 7은 AI 창의 생성, 1~6은 고정 템플릿이다. ' +
            '사용자가 창의적으로 문구를 만들라고 하거나 스타일/이모지/분위기/표현 방식을 지시하면 templateId는 7로 둔다. ' +
            '사용자가 단순 환영이나 기본 인사만 원하면 1~6 중 가장 알맞은 템플릿을 고른다. ' +
            'tone은 AI 생성일 때 특히 중요하며, 정보가 부족하면 warm로 둔다. ' +
            'name에는 명령문에서 추정되는 이름만 넣고, 없으면 빈 문자열로 둔다. ' +
            'prompt에는 사용자의 의도를 짧게 정리한 문장만 넣는다. JSON 외 텍스트는 절대 출력하지 마.',
        },
        {
          role: 'user',
          content:
            `사용자 명령: ${command}\n` +
            '예시: "이모지 넣고 밝게 환영해줘" -> templateId 7, tone bright\n' +
            '예시: "민준이 환영 문구 간단하게" -> templateId 1, name 민준',
        },
      ],
      max_completion_tokens: 180,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ templateId: 7, tone: 'warm', name: '', prompt: command });
    }

    try {
      const parsed = JSON.parse(content) as {
        templateId?: number;
        tone?: string;
        name?: string;
        prompt?: string;
      };

      const templateId = [1, 2, 3, 4, 5, 6, 7].includes(parsed.templateId ?? 0) ? parsed.templateId! : 7;
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'interpretation failed';
    return NextResponse.json({ error: 'interpretation failed', detail: message }, { status: 500 });
  }
}
