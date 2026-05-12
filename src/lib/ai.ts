import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { aiLog } from './logger';

export interface CallAIParams {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  openaiModel: string;
  openaiReasoningEffort?: 'none' | 'low' | 'medium' | 'high';
}

async function callOpenAI(params: CallAIParams): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens, openaiModel, openaiReasoningEffort } = params;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  aiLog.req('OpenAI', openaiModel, userPrompt, maxTokens);
  const t = Date.now();

  try {
    const response = await client.chat.completions.create({
      model: openaiModel,
      ...(openaiReasoningEffort ? { reasoning_effort: openaiReasoningEffort } : {}),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: maxTokens,
      response_format: { type: 'json_object' },
    });
    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw new Error('empty response');
    aiLog.ok('OpenAI', openaiModel, Date.now() - t, text);
    return text;
  } catch (e) {
    aiLog.fail('OpenAI', openaiModel, Date.now() - t, e instanceof Error ? e.message : String(e));
    throw e;
  }
}

async function callGemini(params: CallAIParams): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens } = params;
  const model = 'gemini-2.5-flash';
  const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  aiLog.req('Gemini', model, userPrompt, maxTokens);
  const t = Date.now();

  try {
    const response = await genai.models.generateContent({
      model,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        maxOutputTokens: maxTokens,
        thinkingConfig: { thinkingBudget: 0 },
      },
      contents: userPrompt,
    });
    const text = response.text;
    if (!text) throw new Error('empty response');
    aiLog.ok('Gemini', model, Date.now() - t, text);
    return text;
  } catch (e) {
    aiLog.fail('Gemini', model, Date.now() - t, e instanceof Error ? e.message : String(e));
    throw e;
  }
}

async function callGLM(params: CallAIParams): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens } = params;
  const model = 'glm-4-flash';
  const client = new OpenAI({
    apiKey: process.env.GLM_API_KEY!,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  });

  aiLog.req('GLM', model, userPrompt, maxTokens);
  const t = Date.now();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });
    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw new Error('empty response');
    aiLog.ok('GLM', model, Date.now() - t, text);
    return text;
  } catch (e) {
    aiLog.fail('GLM', model, Date.now() - t, e instanceof Error ? e.message : String(e));
    throw e;
  }
}

export async function callAI(params: CallAIParams): Promise<string> {
  try {
    return await callOpenAI(params);
  } catch {
    aiLog.fallback('Gemini');
    try {
      return await callGemini(params);
    } catch {
      aiLog.fallback('GLM');
      try {
        return await callGLM(params);
      } catch {
        aiLog.allFailed();
        throw new Error('all AI providers failed');
      }
    }
  }
}
