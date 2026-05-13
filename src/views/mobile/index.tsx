import ConfirmScreen from './components/ConfirmScreen';
import ChooseScreen from './components/ChooseScreen';
import DoneScreen from './components/DoneScreen';
import ListeningScreen from './components/ListeningScreen';
import StartScreen from './components/StartScreen';
import PWAInstallBanner from '../../components/PWAInstallBanner';
import PreviewScreen from './components/PreviewScreen';
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
    dateFormat,
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
    handleStopListeningWithPreview,
    handleTemplateChange,
    handleNameChange,
    handleThemeChange,
    handleDateFormatChange,
    handleConfirmStageBack,
    handleConfirmStageContinue,
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
    previewText,
    previewMode,
    handleBackFromPreview,
    handleProceedFromPreview,
    handleConfirmFromPreview,
  } = useMobileFlow();

  const { isListening, transcript, error } = speech;

  return (
    <div className="h-dvh overflow-hidden bg-white">
      <div
        className="mx-auto flex h-full w-full max-w-md flex-col px-4"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        }}
      >
        <PWAInstallBanner />

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
            onDirectSubmit={(cmd: string) => openComposerFromCommand(cmd, true)}
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
            onComplete={handleStopListeningWithPreview}
          />
        )}

        {step === 'preview' && (
          <PreviewScreen
            previewText={previewText}
            previewMode={previewMode}
            onBack={handleBackFromPreview}
            onConfirm={handleConfirmFromPreview}
            onCustomize={handleProceedFromPreview}
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
            dateFormat={dateFormat}
            isSubmitting={isSubmitting}
            onNameChange={handleNameChange}
            onTemplateChange={handleTemplateChange}
            onMessageChange={setMessage}
            onAiToneChange={setAiTone}
            onAiPromptChange={setAiPrompt}
            onThemeChange={handleThemeChange}
            onDateFormatChange={handleDateFormatChange}
            onReenterVoice={handleReenterVoice}
            onReenterDirect={handleReenterDirect}
            onBack={handleConfirmStageBack}
            onContinue={handleConfirmStageContinue}
          />
        )}

        {step === 'done' && <DoneScreen onRestart={handleRestart} />}
      </div>
    </div>
  );
}
