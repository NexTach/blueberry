const R = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

function trunc(s: string, max = 72) {
  const oneline = s.replace(/\n/g, ' ');
  return oneline.length > max ? oneline.slice(0, max) + '…' : oneline;
}

function ms(n: number) {
  return `${DIM}${n}ms${R}`;
}

export const aiLog = {
  req(provider: string, model: string, prompt: string, maxTokens: number) {
    console.log(
      ` ${CYAN}→${R} ${BOLD}[AI]${R} ${CYAN}${provider}${R}${DIM}/${model}${R}` +
        `  ${DIM}max=${maxTokens}tok${R}  ${DIM}"${trunc(prompt)}"${R}`,
    );
  },

  ok(provider: string, model: string, elapsed: number, content: string) {
    console.log(
      ` ${GREEN}←${R} ${BOLD}[AI]${R} ${GREEN}${provider}${R}${DIM}/${model}${R}` +
        `  ${ms(elapsed)}  ${DIM}${trunc(content, 120)}${R}`,
    );
  },

  fail(provider: string, model: string, elapsed: number, err: string) {
    console.log(
      ` ${RED}✗${R} ${BOLD}[AI]${R} ${RED}${provider}${R}${DIM}/${model}${R}` +
        `  ${ms(elapsed)}  ${RED}${trunc(err, 100)}${R}`,
    );
  },

  fallback(next: string) {
    console.log(` ${YELLOW}↻${R} ${BOLD}[AI]${R} ${YELLOW}falling back to ${next}${R}`);
  },

  allFailed() {
    console.log(
      ` ${RED}✗${R} ${BOLD}[AI]${R} ${RED}all providers failed — using default response${R}`,
    );
  },
};
