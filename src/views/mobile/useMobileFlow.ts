import { startTransition, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subscribeSession, updateSession, updateTheme, resetSession } from '../../lib/firebase';
import { applyTemplate, type TemplateId } from '../../lib/openai';
import { useSpeechRecognition } from '../../lib/speech';
import { AI_TEMPLATE_ID, DEFAULT_AI_TONE, DEFAULT_TEMPLATE_ID, FALLBACK_VISITOR_NAME, THEMES } from './constants';
import type { AiToneId, CommandInterpretation, ConfirmStage, Step } from './types';
import type { ThemeId, Session } from '../../types/session';

interface ConfirmDraftSnapshot {
  templateId: TemplateId;
  name: string;
  message: string;
  aiPrompt: string;
  aiTone: AiToneId;
  themeId: ThemeId;
  sourcePrompt: string;
}

function getConfirmStages(templateId: TemplateId): ConfirmStage[] {
  if (templateId === AI_TEMPLATE_ID) {
    return ['template', 'content', 'tone', 'theme', 'name'];
  }

  return ['template', 'content', 'theme', 'name'];
}

function isValidTemplateId(templateId: number | null | undefined): templateId is TemplateId {
  return templateId === 1 || templateId === 2 || templateId === 3 || templateId === 4 || templateId === 5 || templateId === 6 || templateId === 7;
}

export function useMobileFlow() {
  const [step, setStep] = useState<Step>('choose');
  const [previousStep, setPreviousStep] = useState<Step | null>(null);
  const [confirmStageIndex, setConfirmStageIndex] = useState(0);
  const [directInputText, setDirectInputText] = useState('');
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE_ID);
  const [message, setMessage] = useState('');
  const [aiTone, setAiTone] = useState<AiToneId>(DEFAULT_AI_TONE);
  const [aiPrompt, setAiPrompt] = useState('');
  const [themeId, setThemeId] = useState<ThemeId>(THEMES[0].id);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [lastSession, setLastSession] = useState<Session | null>(null);
  const [initialConfirmSnapshot, setInitialConfirmSnapshot] = useState<ConfirmDraftSnapshot | null>(null);
  const [previewText, setPreviewText] = useState('');
  const [previewMode, setPreviewMode] = useState<'displaying' | 'generating'>('displaying');

  const speech = useSpeechRecognition();
  const { transcript, errorCode, start, stop, reset } = speech;
  const confirmStages = getConfirmStages(selectedTemplate);
  const normalizedConfirmStageIndex = Math.min(confirmStageIndex, confirmStages.length - 1);
  const confirmStage = confirmStages[normalizedConfirmStageIndex];

  function inferTemplateId(visitorName: string, welcomeMessage: string, tone?: string): TemplateId {
    const normalizedMessage = welcomeMessage.trim();
    const normalizedName = visitorName.trim() || FALLBACK_VISITOR_NAME;
    const templateIds: Exclude<TemplateId, 7>[] = [1, 2, 3, 4, 5, 6];

    for (const templateId of templateIds) {
      if (applyTemplate(normalizedName, templateId) === normalizedMessage) {
        return templateId;
      }
    }

    if (tone) return AI_TEMPLATE_ID;

    return DEFAULT_TEMPLATE_ID;
  }

  function hydrateComposerFromSession(session: Session | null) {
    if (!session || (session.status === 'standby' && !session.welcomeMessage.trim() && !session.visitorName.trim())) {
      setStep('choose');
      return;
    }

    const nextName = session.visitorName?.trim() ?? '';
    const nextMessage = session.welcomeMessage?.trim() ?? '';
    const nextTemplate = isValidTemplateId(session.templateId)
      ? session.templateId
      : inferTemplateId(nextName, nextMessage, session.tone);
    const nextPrompt = nextTemplate === AI_TEMPLATE_ID ? session.sourcePrompt?.trim() || nextMessage : '';
    const nextTone: AiToneId =
      session.tone === 'bright' || session.tone === 'formal' || session.tone === 'playful' || session.tone === 'warm'
        ? session.tone
        : DEFAULT_AI_TONE;

    setName(nextName);
    setSelectedTemplate(nextTemplate);
    setMessage(
      nextTemplate === AI_TEMPLATE_ID
        ? nextMessage
        : nextMessage || (applyTemplate(nextName || FALLBACK_VISITOR_NAME, nextTemplate) ?? ''),
    );
    setAiPrompt(nextTemplate === AI_TEMPLATE_ID ? nextPrompt : '');
    setAiTone(nextTone);
    setDirectInputText('');
    setShowDirectInput(false);
    setInitialConfirmSnapshot({
      templateId: nextTemplate,
      name: nextName,
      message: nextMessage,
      aiPrompt: nextPrompt,
      aiTone: nextTone,
      themeId: session.themeId ?? themeId,
      sourcePrompt: session.sourcePrompt?.trim() || nextPrompt,
    });
    setConfirmStageIndex(0);
    setStep('confirm');
  }

  useEffect(() => {
    return subscribeSession((session) => {
      if (session?.themeId) {
        setThemeId(session.themeId);
      }
      setLastSession(session);
    });
  }, []);

  useEffect(() => {
    if (step !== 'listening') return;
    if (errorCode === 'network' || errorCode === 'service-not-allowed' || errorCode === 'start-failed') {
      startTransition(() => {
        setShowDirectInput(true);
        setStep('start');
      });
    }
  }, [errorCode, step]);

  async function interpretCommand(commandText: string): Promise<CommandInterpretation> {
    try {
      const response = await fetch('/api/interpret-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandText }),
      });

      if (!response.ok) {
        return { templateId: AI_TEMPLATE_ID, tone: DEFAULT_AI_TONE, name: '', prompt: commandText };
      }

      const data = (await response.json()) as Partial<CommandInterpretation> & { allFailed?: boolean };
      if (data.allFailed) {
        toast.error('명령 해석에 실패하여 기본 설정으로 처리됩니다.');
      }
      return {
        templateId: data.templateId ?? AI_TEMPLATE_ID,
        tone: data.tone ?? DEFAULT_AI_TONE,
        name: data.name?.trim() ?? '',
        prompt: data.prompt?.trim() || commandText,
      };
    } catch {
      return { templateId: AI_TEMPLATE_ID, tone: DEFAULT_AI_TONE, name: '', prompt: commandText };
    }
  }

  async function optimizePrompt(promptText: string, tone: AiToneId, visitorName: string) {
    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          tone,
          name: visitorName,
        }),
      });

      if (!response.ok) {
        return promptText;
      }

      const data = (await response.json()) as { prompt?: string; allFailed?: boolean };
      if (data.allFailed) {
        toast.error('프롬프트 최적화에 실패하여 원본 지시문으로 처리됩니다.');
      }

      return data.prompt?.trim() || promptText;
    } catch {
      return promptText;
    }
  }

  async function openComposerFromCommand(commandText: string, isVoice = false) {
    setPreviousStep(step);
    setDirectInputText(commandText);
    setIsInterpreting(true);

    try {
      const interpretation = await interpretCommand(commandText);
      const nextName = interpretation.name;
      const nextTemplate = interpretation.templateId;
      const optimizedPrompt =
        nextTemplate === AI_TEMPLATE_ID
          ? await optimizePrompt(interpretation.prompt || commandText, interpretation.tone, nextName)
          : interpretation.prompt;

      setName(nextName);
      setSelectedTemplate(nextTemplate);
      setAiTone(interpretation.tone);
      setAiPrompt(optimizedPrompt);

      const recommendedText =
        nextTemplate === AI_TEMPLATE_ID
          ? optimizedPrompt || ''
          : (applyTemplate(nextName || FALLBACK_VISITOR_NAME, nextTemplate) ?? '');

      setMessage(nextTemplate === AI_TEMPLATE_ID ? '' : recommendedText);
      setInitialConfirmSnapshot(null);
      setConfirmStageIndex(0);

      if (isVoice) {
        if (nextTemplate !== AI_TEMPLATE_ID) {
          setPreviewMode('displaying');
          setPreviewText(recommendedText);
          await updateSession({
            status: 'displaying',
            visitorName: nextName || FALLBACK_VISITOR_NAME,
            welcomeMessage: recommendedText,
            templateId: nextTemplate,
            sourcePrompt: '',
            generationId: '',
            tone: '',
            themeId,
          });
          setStep('preview');
        } else {
          const generationId = crypto.randomUUID();
          setPreviewMode('generating');
          setPreviewText('AI가 요청을 바탕으로 전광판 문구를 생성하고 있어요.');
          await updateSession({
            status: 'generating',
            visitorName: nextName || FALLBACK_VISITOR_NAME,
            templateId: AI_TEMPLATE_ID,
            welcomeMessage: '',
            sourcePrompt: optimizedPrompt || commandText,
            generationId,
            tone: interpretation.tone,
            themeId,
          });
          setStep('preview');
        }
      } else {
        if (nextTemplate === AI_TEMPLATE_ID) {
          await resetSession();
        }
        setStep('confirm');
      }
    } finally {
      setIsInterpreting(false);
    }
  }

  function handleStartListening() {
    reset();
    setDirectInputText('');
    setShowDirectInput(false);
    // remember that we came from the start screen so "이전으로" returns there
    setPreviousStep('start');
    setStep('listening');
    start();
  }

  async function handleStopListening() {
    stop();
    const commandText = transcript.trim();
    if (commandText) await openComposerFromCommand(commandText);
  }

  async function handleStopListeningWithPreview() {
    stop();
    const commandText = transcript.trim();
    if (commandText) await openComposerFromCommand(commandText, true);
  }

  function handleTemplateChange(id: TemplateId) {
    setSelectedTemplate(id);
    if (id === AI_TEMPLATE_ID) {
      if (!aiPrompt.trim()) {
        setAiPrompt(directInputText.trim() || message.trim());
      }
    } else {
      setMessage(applyTemplate(name.trim() || FALLBACK_VISITOR_NAME, id) ?? '');
    }
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    if (selectedTemplate !== AI_TEMPLATE_ID) {
      setMessage(applyTemplate(nextName.trim() || FALLBACK_VISITOR_NAME, selectedTemplate) ?? '');
    }
  }

  async function handleThemeChange(nextThemeId: ThemeId) {
    setThemeId(nextThemeId);
    await updateTheme(nextThemeId);
  }

  async function handleConfirm() {
    setIsSubmitting(true);
    const resolvedName = name.trim() || FALLBACK_VISITOR_NAME;
    try {
      const draftAiPrompt =
        aiPrompt.trim() || directInputText.trim() || message.trim() || `${resolvedName} 관련 한 문장 전광판 문구를 만들어줘`;
      if (selectedTemplate === AI_TEMPLATE_ID) {
        const optimizedAiPrompt = await optimizePrompt(draftAiPrompt, aiTone, resolvedName);
        setAiPrompt(optimizedAiPrompt);

        const shouldRegenerate =
          initialConfirmSnapshot?.templateId !== AI_TEMPLATE_ID ||
          initialConfirmSnapshot.aiPrompt.trim() !== optimizedAiPrompt ||
          initialConfirmSnapshot.aiTone !== aiTone;

        if (!shouldRegenerate) {
          await updateSession({
            status: 'displaying',
            visitorName: resolvedName,
            templateId: AI_TEMPLATE_ID,
            welcomeMessage: initialConfirmSnapshot?.message || message || '환영합니다!',
            sourcePrompt: initialConfirmSnapshot?.sourcePrompt || optimizedAiPrompt,
            generationId: '',
            tone: aiTone,
            themeId,
          });
        } else {
          const generationId = crypto.randomUUID();
          await updateSession({
            status: 'generating',
            visitorName: resolvedName,
            templateId: AI_TEMPLATE_ID,
            welcomeMessage: '',
            sourcePrompt: optimizedAiPrompt,
            generationId,
            tone: aiTone,
            themeId,
          });
        }
      } else {
        await updateSession({
          status: 'displaying',
          visitorName: resolvedName,
          templateId: selectedTemplate,
          welcomeMessage: message,
          sourcePrompt: '',
          generationId: '',
          tone: '',
          themeId,
        });
      }
      setStep('done');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleConfirmStageBack() {
    if (normalizedConfirmStageIndex > 0) {
      setConfirmStageIndex((current) => Math.max(0, current - 1));
      return;
    }

    handleBackToPrevious();
  }

  async function handleConfirmStageContinue() {
    if (normalizedConfirmStageIndex < confirmStages.length - 1) {
      setConfirmStageIndex((current) => Math.min(current + 1, confirmStages.length - 1));
      return;
    }

    await handleConfirm();
  }

  function startCreateNew() {
    reset();
    setDirectInputText('');
    setName('');
    setMessage('');
    setAiPrompt('');
    setAiTone(DEFAULT_AI_TONE);
    setShowDirectInput(false);
    setSelectedTemplate(DEFAULT_TEMPLATE_ID);
    setInitialConfirmSnapshot(null);
    setConfirmStageIndex(0);
    setPreviousStep('choose');
    setStep('start');
  }

  function startEditExisting() {
    if (!canEditExisting) return;
    setPreviousStep('choose');
    hydrateComposerFromSession(lastSession);
  }

  function handleReenterDirect() {
    reset();
    setDirectInputText('');
    setShowDirectInput(false);
    setPreviousStep('confirm');
    setShowDirectInput(true);
    setStep('start');
  }

  function handleReenterVoice() {
    reset();
    setDirectInputText('');
    setShowDirectInput(false);
    setPreviousStep('confirm');
    setStep('listening');
    start();
  }

  async function handleBackFromPreview() {
    // return to the UI the user came from:
    // - if they came from listening, restart listening
    // - otherwise go back to the start screen and show direct input
    if (selectedTemplate === AI_TEMPLATE_ID) {
      await resetSession();
    }
    reset();
    if (previousStep === 'listening') {
      setStep('listening');
      start();
    } else {
      setShowDirectInput(true);
      setStep('start');
    }
    setPreviousStep(null);
  }

  async function handleProceedFromPreview() {
    // user wants to customize the displayed content
    if (selectedTemplate === AI_TEMPLATE_ID) {
      await resetSession();
      setInitialConfirmSnapshot(null);
    } else {
      setInitialConfirmSnapshot({
        templateId: selectedTemplate,
        name,
        message: previewText || message,
        aiPrompt: aiPrompt || previewText || '',
        aiTone,
        themeId,
        sourcePrompt: aiPrompt || previewText || '',
      });
    }
    setConfirmStageIndex(0);
    setPreviousStep('preview');
    setStep('confirm');
  }

  function handleConfirmFromPreview() {
    // preview was already pushed to desktop; finish flow
    setStep('done');
  }

  function handleRestart() {
    reset();
    setDirectInputText('');
    setName('');
    setMessage('');
    setAiPrompt('');
    setAiTone(DEFAULT_AI_TONE);
    setIsInterpreting(false);
    setShowDirectInput(false);
    setSelectedTemplate(DEFAULT_TEMPLATE_ID);
    setInitialConfirmSnapshot(null);
    setConfirmStageIndex(0);
    setPreviousStep(null);
    setStep('choose');
  }

  async function handleRotate() {
    const currentRotation = lastSession?.rotation ?? 0;
    const nextRotation = ((currentRotation + 90) % 360) as 0 | 90 | 180 | 270;
    await updateSession({ rotation: nextRotation });
  }

  function handleBackToPrevious() {
    reset();
    if (previousStep === 'listening') {
      setSelectedTemplate(DEFAULT_TEMPLATE_ID);
      setMessage('');
      setStep('listening');
      start();
    } else if (previousStep === 'start') {
      setSelectedTemplate(DEFAULT_TEMPLATE_ID);
      setMessage('');
      setShowDirectInput(false);
      setStep('start');
    } else if (previousStep === 'choose') {
      setShowDirectInput(false);
      setStep('choose');
    } else if (previousStep === 'confirm') {
      setShowDirectInput(false);
      setStep('confirm');
    }
    // fallback: if previousStep was not set, go back to the choose screen
    if (previousStep === null) {
      setShowDirectInput(false);
      setStep('choose');
    }

    setPreviousStep(null);
  }

  const canEditExisting = lastSession?.status === 'displaying' && Boolean(lastSession.welcomeMessage?.trim());
  const canContinueConfirmStage =
    confirmStage !== 'content' || selectedTemplate === AI_TEMPLATE_ID || Boolean(message.trim());
  const isLastConfirmStage = normalizedConfirmStageIndex === confirmStages.length - 1;

  return {
    step,
    confirmStage,
    confirmStageIndex: normalizedConfirmStageIndex,
    confirmStageCount: confirmStages.length,
    canContinueConfirmStage,
    isLastConfirmStage,
    directInputText,
    name,
    selectedTemplate,
    message,
    aiTone,
    aiPrompt,
    isInterpreting,
    isSubmitting,
    showDirectInput,
    themeId,
    speech,
    setAiTone,
    setAiPrompt,
    setMessage,
    setDirectInputText,
    setShowDirectInput,
    handleStartListening,
    handleStopListening,
    handleTemplateChange,
    handleNameChange,
    handleThemeChange,
    handleConfirmStageBack,
    handleConfirmStageContinue,
    handleConfirm,
    handleRestart,
    handleBackToPrevious,
    openComposerFromCommand,
    handleStopListeningWithPreview,
    resetSpeech: reset,
    lastSession,
    canEditExisting,
    startCreateNew,
    startEditExisting,
    handleReenterDirect,
    handleReenterVoice,
    previewText,
    previewMode,
    handleBackFromPreview,
    handleProceedFromPreview,
    handleConfirmFromPreview,
    handleRotate,
  };
}
