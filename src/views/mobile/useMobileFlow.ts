import { useEffect, useState } from 'react';
import { updateSession } from '../../lib/firebase';
import { applyTemplate, type TemplateId } from '../../lib/openai';
import { useSpeechRecognition } from '../../lib/speech';
import { AI_TEMPLATE_ID, DEFAULT_AI_TONE, DEFAULT_TEMPLATE_ID, FALLBACK_VISITOR_NAME } from './constants';
import type { AiToneId, Step } from './types';

export function useMobileFlow() {
  const [step, setStep] = useState<Step>('start');
  const [previousStep, setPreviousStep] = useState<Step | null>(null);
  const [directInputText, setDirectInputText] = useState('');
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE_ID);
  const [message, setMessage] = useState('');
  const [aiTone, setAiTone] = useState<AiToneId>(DEFAULT_AI_TONE);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const speech = useSpeechRecognition();
  const { transcript, errorCode, start, stop, reset } = speech;

  useEffect(() => {
    if (step !== 'listening') return;
    if (errorCode === 'network' || errorCode === 'service-not-allowed' || errorCode === 'start-failed') {
      setShowDirectInput(true);
      setStep('start');
    }
  }, [errorCode, step]);

  function openComposerFromCommand(commandText: string) {
    setPreviousStep(step);
    setDirectInputText(commandText);
    setName('');
    setSelectedTemplate(AI_TEMPLATE_ID);
    setMessage('');
    setAiPrompt(commandText);
    setStep('confirm');
  }

  function handleStartListening() {
    reset();
    setShowDirectInput(false);
    setStep('listening');
    start();
  }

  function handleStopListening() {
    stop();
    const commandText = transcript.trim();
    if (commandText) openComposerFromCommand(commandText);
  }

  function handleTemplateChange(id: TemplateId) {
    setSelectedTemplate(id);
    if (id !== AI_TEMPLATE_ID) {
      setMessage(applyTemplate(name, id) ?? '');
    }
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    if (selectedTemplate !== AI_TEMPLATE_ID) {
      setMessage(applyTemplate(nextName, selectedTemplate) ?? '');
    }
  }

  async function handleConfirm() {
    setIsSubmitting(true);
    if (selectedTemplate === AI_TEMPLATE_ID) {
      await updateSession({
        status: 'generating',
        visitorName: name.trim() || FALLBACK_VISITOR_NAME,
        welcomeMessage: aiPrompt.trim(),
        tone: aiTone,
      });
    } else {
      await updateSession({
        status: 'displaying',
        visitorName: name.trim(),
        welcomeMessage: message,
        tone: '',
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
    isSubmitting,
    showDirectInput,
    showSettings,
    speech,
    setAiTone,
    setAiPrompt,
    setMessage,
    setDirectInputText,
    setShowDirectInput,
    setShowSettings,
    handleStartListening,
    handleStopListening,
    handleTemplateChange,
    handleNameChange,
    handleConfirm,
    handleRestart,
    handleBackToPrevious,
    openComposerFromCommand,
    resetSpeech: reset,
  };
}
