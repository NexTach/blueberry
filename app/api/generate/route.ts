import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { name, prompt, tone } = await request.json();
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 광주소프트웨어마이스터고등학교 오픈하우스 행사의 환영 메시지 작성 도우미야. ' +
            '반드시 JSON만 출력해. 형식은 {"resolvedName":"...", "message":"..."} 이다. ' +
            'resolvedName에는 최종적으로 적용한 방문객 이름만 넣어. ' +
            'message는 한국어 한 문장 환영 문구로 만들고, resolvedName을 자연스럽게 포함해. ' +
            '사용자 본문에 이름이 드러나면 그 이름을 우선 사용하고, 없으면 기본 이름을 사용해. ' +
            '학교의 IT/소프트웨어 특성을 살려도 좋다. JSON 외 다른 텍스트는 절대 출력하지 마.',
        },
        {
          role: 'user',
          content:
            `기본 이름: ${name}\n` +
            `원하는 어체: ${tone || '따뜻하게'}\n` +
            `참고 본문: ${prompt || '(없음)'}\n` +
            '본문에 이름이 있으면 그 이름을 resolvedName으로 반영해.',
        },
      ],
      max_tokens: 80,
      temperature: 0.9,
    });

    const content = response.choices[0]?.message?.content?.trim();
    const fallbackMessage = `${name}님, 환영합니다!`;

    if (!content) {
      return NextResponse.json({ resolvedName: name, message: fallbackMessage });
    }

    try {
      const parsed = JSON.parse(content) as { resolvedName?: string; message?: string };
      return NextResponse.json({
        resolvedName: parsed.resolvedName?.trim() || name,
        message: parsed.message?.trim() || fallbackMessage,
      });
    } catch {
      return NextResponse.json({ resolvedName: name, message: content || fallbackMessage });
    }
  } catch {
    return NextResponse.json({ error: 'generation failed' }, { status: 500 });
  }
}
