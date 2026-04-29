import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { name, prompt, tone } = await request.json();
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const response = await client.chat.completions.create({
      model: 'gpt-5.2',
      reasoning_effort: 'none',
      messages: [
        {
          role: 'system',
          content:
            '너는 광주소프트웨어마이스터고등학교의 행사 환영 메시지 작성 도우미야. ' +
            '반드시 JSON만 출력해. 형식은 {"resolvedName":"...", "message":"..."} 이다. ' +
            'resolvedName에는 최종적으로 적용한 방문객 이름만 넣어. 사용자가 교육감, 교장, 교수, 대표, 원장, 선생님 같은 직함을 함께 알려줬다면 이름에서 그 직함을 유지해. ' +
            'resolvedName에는 보통 마지막 호칭 "님"은 넣지 말고, 직함만 보존해. 예: "강기정 교육감". ' +
            'message는 데스크탑 화면에서 이름 아래에 이어질 한국어 한 문장 본문이다. ' +
            'message에는 resolvedName이나 다른 이름 호칭을 절대 넣지 마. ' +
            '예: "광주SW마이스터고에 방문해 주셔서 반갑습니다!" 같은 형태로 써라. ' +
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
      max_completion_tokens: 80,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim();
    const fallbackMessage = '환영합니다!';

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'generation failed';
    return NextResponse.json({ error: 'generation failed', detail: message }, { status: 500 });
  }
}
