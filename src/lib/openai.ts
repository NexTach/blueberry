export type TemplateId = 1 | 2 | 3;

export function applyTemplate(name: string, templateId: TemplateId): string | null {
  if (templateId === 1) return `${name}님, 환영합니다!`;
  if (templateId === 2) return `${name}님, 광주SW마이스터고 오픈하우스에 오신 것을 환영합니다!`;
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
