import ConfirmScreen from './components/ConfirmScreen';
import ChooseScreen from './components/ChooseScreen';
import DoneScreen from './components/DoneScreen';
import ListeningScreen from './components/ListeningScreen';
import StartScreen from './components/StartScreen';
import { useMobileFlow } from './useMobileFlow';

export default function MobilePage() {
  const {
    step,
    confirmStage,
    confirmStageIndex,
    confirmStageCount,
    canContinueConfirmStage,
    isLastConfirmStage,
    directInputText,
    name,
    selectedTemplate,
    message,
    aiTone,
    aiPrompt,
    themeId,
    isInterpreting,
    isSubmitting,
    showDirectInput,
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
    resetSpeech,
    lastSession,
    canEditExisting,
    startCreateNew,
    startEditExisting,
    handleReenterDirect,
    handleReenterVoice,
  } = useMobileFlow();

  const { isListening, transcript, error } = speech;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {step === 'choose' && (
        <ChooseScreen
          existingPreview={lastSession?.welcomeMessage ?? null}
          canEditExisting={canEditExisting}
          onEditExisting={startEditExisting}
          onCreateNew={startCreateNew}
        />
      )}

      {step === 'start' && (
        <StartScreen
          showDirectInput={showDirectInput}
          directInputText={directInputText}
          error={error}
          isInterpreting={isInterpreting}
          onStartListening={handleStartListening}
          onDirectInputChange={setDirectInputText}
          onShowDirectInput={() => {
            resetSpeech();
            setShowDirectInput(true);
          }}
          onDirectSubmit={openComposerFromCommand}
          onDirectBack={handleBackToPrevious}
          onBack={handleBackToPrevious}
        />
      )}

      {step === 'listening' && (
        <ListeningScreen
          isListening={isListening}
          transcript={transcript}
          error={error}
          isInterpreting={isInterpreting}
          onRetry={handleStartListening}
          onUseTranscript={() => {
            resetSpeech();
            setShowDirectInput(true);
            openComposerFromCommand(transcript.trim());
          }}
          onCancel={handleBackToPrevious}
          onComplete={handleStopListening}
        />
      )}

      {step === 'confirm' && (
        <ConfirmScreen
          confirmStage={confirmStage}
          confirmStageIndex={confirmStageIndex}
          confirmStageCount={confirmStageCount}
          canContinue={canContinueConfirmStage}
          isLastStage={isLastConfirmStage}
          name={name}
          selectedTemplate={selectedTemplate}
          message={message}
          aiTone={aiTone}
          aiPrompt={aiPrompt}
          themeId={themeId}
          isSubmitting={isSubmitting}
          onNameChange={handleNameChange}
          onTemplateChange={handleTemplateChange}
          onMessageChange={setMessage}
          onAiToneChange={setAiTone}
          onAiPromptChange={setAiPrompt}
          onThemeChange={handleThemeChange}
          onReenterVoice={handleReenterVoice}
          onReenterDirect={handleReenterDirect}
          onBack={handleConfirmStageBack}
          onContinue={handleConfirmStageContinue}
        />
      )}

      {step === 'done' && <DoneScreen onRestart={handleRestart} />}
    </div>
  );
}
