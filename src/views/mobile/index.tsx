import ConfirmScreen from './components/ConfirmScreen';
import DoneScreen from './components/DoneScreen';
import ListeningScreen from './components/ListeningScreen';
import SettingsSheet from './components/SettingsSheet';
import SettingsButton from './components/SettingsButton';
import StartScreen from './components/StartScreen';
import { useMobileFlow } from './useMobileFlow';

export default function MobilePage() {
  const {
    step,
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
    resetSpeech,
  } = useMobileFlow();

  const { isListening, transcript, error } = speech;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {step === 'start' && <SettingsButton onClick={() => setShowSettings(true)} />}

      {step === 'start' && (
        <StartScreen
          showDirectInput={showDirectInput}
          error={error}
          onStartListening={handleStartListening}
          onShowDirectInput={() => {
            resetSpeech();
            setShowDirectInput(true);
          }}
          onDirectSubmit={openComposerFromCommand}
          onDirectBack={() => setShowDirectInput(false)}
        />
      )}

      {step === 'listening' && (
        <ListeningScreen
          isListening={isListening}
          transcript={transcript}
          error={error}
          onRetry={handleStartListening}
          onUseTranscript={() => {
            resetSpeech();
            setShowDirectInput(true);
            openComposerFromCommand(transcript.trim());
          }}
          onCancel={handleRestart}
          onComplete={handleStopListening}
        />
      )}

      {step === 'confirm' && (
        <ConfirmScreen
          name={name}
          selectedTemplate={selectedTemplate}
          message={message}
          aiTone={aiTone}
          aiPrompt={aiPrompt}
          isSubmitting={isSubmitting}
          onNameChange={handleNameChange}
          onTemplateChange={handleTemplateChange}
          onMessageChange={setMessage}
          onAiToneChange={setAiTone}
          onAiPromptChange={setAiPrompt}
          onBack={handleBackToPrevious}
          onConfirm={handleConfirm}
        />
      )}

      {step === 'done' && <DoneScreen onRestart={handleRestart} />}

      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}
