export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const TEMPLATE_MESSAGES: Record<Exclude<TemplateId, 7>, (name: string) => string> = {
  1: (name) => `${name}님, 환영합니다!`,
  2: (name) => `${name}님, 광주SW마이스터고에 오신 것을 환영합니다!`,
  3: (name) => `${name}님, 오늘 이 공간에서 즐거운 시간 보내세요!`,
  4: (name) => `${name}님, 반갑습니다. 편안하게 둘러보세요!`,
  5: (name) => `${name}님, 오늘의 주인공처럼 빛나는 하루 보내세요!`,
  6: (name) => `${name}님, 좋은 에너지 가득 안고 다녀가세요!`,
};

export function applyTemplate(name: string, templateId: TemplateId): string | null {
  if (templateId === 7) return null;
  return TEMPLATE_MESSAGES[templateId](name);
}
