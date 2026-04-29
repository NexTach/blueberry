import { useEffect, useState } from 'react';
import { subscribeSession, updateSession, updateTheme } from '../../lib/firebase';
import { applyTemplate, type TemplateId } from '../../lib/openai';
import { useSpeechRecognition } from '../../lib/speech';
import { AI_TEMPLATE_ID, DEFAULT_AI_TONE, DEFAULT_TEMPLATE_ID, FALLBACK_VISITOR_NAME, THEMES } from './constants';
import type { AiToneId, CommandInterpretation, Step } from './types';
import type { ThemeId } from '../../types/session';

export function useMobileFlow() {
  const [step, setStep] = useState<Step>('start');
  const [previousStep, setPreviousStep] = useState<Step | null>(null);
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

  const speech = useSpeechRecognition();
  const { transcript, errorCode, start, stop, reset } = speech;

  useEffect(() => {
    return subscribeSession((session) => {
      if (session?.themeId) {
        setThemeId(session.themeId);
      }
    });
  }, []);

  useEffect(() => {
    if (step !== 'listening') return;
    if (errorCode === 'network' || errorCode === 'service-not-allowed' || errorCode === 'start-failed') {
      setShowDirectInput(true);
      setStep('start');
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

      const data = (await response.json()) as Partial<CommandInterpretation>;
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

  async function openComposerFromCommand(commandText: string) {
    setPreviousStep(step);
    setDirectInputText(commandText);
    setIsInterpreting(true);

    try {
      const interpretation = await interpretCommand(commandText);
      const nextName = interpretation.name;
      const nextTemplate = interpretation.templateId;

      setName(nextName);
      setSelectedTemplate(nextTemplate);
      setAiTone(interpretation.tone);
      setAiPrompt(interpretation.prompt);
      setMessage(
        nextTemplate === AI_TEMPLATE_ID ? '' : applyTemplate(nextName || FALLBACK_VISITOR_NAME, nextTemplate) ?? '',
      );
      setStep('confirm');
    } finally {
      setIsInterpreting(false);
    }
  }

  function handleStartListening() {
    reset();
    setDirectInputText('');
    setShowDirectInput(false);
    setStep('listening');
    start();
  }

  async function handleStopListening() {
    stop();
    const commandText = transcript.trim();
    if (commandText) await openComposerFromCommand(commandText);
  }

  function handleTemplateChange(id: TemplateId) {
    setSelectedTemplate(id);
    if (id !== AI_TEMPLATE_ID) {
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
    if (selectedTemplate === AI_TEMPLATE_ID) {
      await updateSession({
        status: 'generating',
        visitorName: resolvedName,
        welcomeMessage: aiPrompt.trim(),
        tone: aiTone,
        themeId,
      });
    } else {
      await updateSession({
        status: 'displaying',
        visitorName: resolvedName,
        welcomeMessage: message,
        tone: '',
        themeId,
      });
    }
    setIsSubmitting(false);
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
    setPreviousStep(null);
    setStep('start');
  }

  function handleBackToPrevious() {
    reset();
    setSelectedTemplate(DEFAULT_TEMPLATE_ID);
    setMessage('');
    if (previousStep === 'listening') {
      setStep('listening');
      start();
    } else if (previousStep === 'start') {
      setShowDirectInput(true);
      setStep('start');
    }
    setPreviousStep(null);
  }

  return {
    step,
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
    handleConfirm,
    handleRestart,
    handleBackToPrevious,
    openComposerFromCommand,
    resetSpeech: reset,
  };
}
