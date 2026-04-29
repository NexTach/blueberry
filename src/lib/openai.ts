import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export type TemplateId = 1 | 2 | 3;

export function applyTemplate(name: string, templateId: TemplateId): string | null {
  if (templateId === 1) return `${name}님, 환영합니다!`;
  if (templateId === 2) return `${name}님, 광주SW마이스터고 오픈하우스에 오신 것을 환영합니다!`;
  return null; // GPT 생성
}

export async function generateWelcomeMessage(name: string): Promise<string> {
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
      {
        role: 'user',
        content: `방문객 이름: ${name}`,
      },
    ],
    max_tokens: 80,
    temperature: 0.9,
  });

  return response.choices[0]?.message?.content?.trim() ?? `${name}님, 환영합니다!`;
}
