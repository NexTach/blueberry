import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 광주소프트웨어마이스터고등학교 오픈하우스 행사의 환영 메시지 작성 도우미야. ' +
            '방문객 이름을 받아 따뜻하고 짧은 환영 문구를 한 문장으로 만들어줘. ' +
            '학교의 IT/소프트웨어 특성을 살려도 좋고, 학교 이름을 넣어도 좋아. ' +
            '문구 외의 다른 텍스트는 절대 출력하지 마.',
        },
        { role: 'user', content: `방문객 이름: ${name}` },
      ],
      max_tokens: 80,
      temperature: 0.9,
    });

    const message = response.choices[0]?.message?.content?.trim() ?? `${name}님, 환영합니다!`;
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'generation failed' }, { status: 500 });
  }
}
