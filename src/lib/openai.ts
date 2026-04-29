export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function applyTemplate(name: string, templateId: TemplateId): string | null {
  if (templateId === 1) return `${name}님, 환영합니다!`;
  if (templateId === 2) return `${name}님, 광주SW마이스터고에 오신 것을 환영합니다!`;
  if (templateId === 3) return `${name}님, 오늘 이 공간에서 즐거운 시간 보내세요!`;
  if (templateId === 4) return `${name}님, 반갑습니다. 편안하게 둘러보세요!`;
  if (templateId === 5) return `${name}님, 오늘의 주인공처럼 빛나는 하루 보내세요!`;
  if (templateId === 6) return `${name}님, 좋은 에너지 가득 안고 다녀가세요!`;
  return null;
}

export async function generateWelcomeMessage(name: string): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) return `${name}님, 환영합니다!`;
  const data = await res.json();
  return data.message ?? `${name}님, 환영합니다!`;
}
