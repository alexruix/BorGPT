import React, { useState, useEffect } from 'react';
import { PLAY_PHASES } from '@/constants/theatre';
import { useStageAudio, useStageWebSocket } from '@/hooks';
import { StageHeader, ActsSidebar, DialogueStream, ControlsSidebar } from '@/components/organisms';
import { StageHelpModal } from '@/components/molecules/StageHelpModal';

export const StageCabinaPage: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [manualApproval, setManualApproval] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const { isPlayingAudio, playbackSpeed, setPlaybackSpeed, enqueueAudio, stopAudio } = useStageAudio(audioEnabled);

  const {
    online,
    disconnectReason,
    isGenerating,
    currentPhase,
    messages,
    pendingText,
    pendingThought,
    pendingAudio,
    setPendingText,
    sendUserMessage,
    setPhase,
    interrupt,
    injectPrompt,
    clearHistory,
    releasePending,
    discardPending,
  } = useStageWebSocket({
    audioEnabled,
    manualApproval,
    onAudioSentence: enqueueAudio,
    onInterruptAudio: stopAudio,
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'INPUT';

      // ?: Open / Close Help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        if (!isInputFocused) {
          e.preventDefault();
          setIsHelpOpen((prev) => !prev);
          return;
        }
      }

      // ESC: Close Help or Emergency Interrupt
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isHelpOpen) {
          setIsHelpOpen(false);
        } else {
          interrupt();
        }
        return;
      }

      // Space: Release Pending in Manual Mode
      if (!isInputFocused && e.code === 'Space' && pendingText) {
        e.preventDefault();
        releasePending();
        return;
      }

      // Ctrl+M: Toggle Audio
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setAudioEnabled((prev) => !prev);
        return;
      }

      // 1-4: Switch Phases if not typing
      if (!isInputFocused && ['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (PLAY_PHASES[index]) {
          e.preventDefault();
          setPhase(PLAY_PHASES[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [pendingText, releasePending, interrupt, setPhase, isHelpOpen]);

  const handleSend = () => {
    if (!userInput.trim() || isGenerating) return;
    sendUserMessage(userInput.trim());
    setUserInput('');
  };

  const handleClear = () => {
    if (window.confirm('¿Desea reiniciar el diálogo de la función?')) {
      clearHistory();
    }
  };

  return (
    <div
      data-phase={currentPhase}
      className="h-screen flex flex-col bg-stage-bg text-text-primary overflow-hidden select-none transition-colors duration-500"
    >
      <StageHeader
        online={online}
        disconnectReason={disconnectReason}
        isGenerating={isGenerating}
        isPlayingAudio={isPlayingAudio}
        audioEnabled={audioEnabled}
        manualApproval={manualApproval}
        hasPendingRelease={!!pendingText}
        playbackSpeed={playbackSpeed}
        messages={messages}
        currentPhase={currentPhase}
        onChangePlaybackSpeed={setPlaybackSpeed}
        onToggleAudio={setAudioEnabled}
        onToggleManualApproval={setManualApproval}
        onInterrupt={interrupt}
        onClear={handleClear}
      />

      <main className="flex-1 flex overflow-hidden">
        <ActsSidebar currentPhase={currentPhase} onSelectPhase={setPhase} />
        <DialogueStream
          messages={messages}
          userInput={userInput}
          onChangeInput={setUserInput}
          onSend={handleSend}
          disabled={isGenerating}
          manualApproval={manualApproval}
          pendingText={pendingText}
          pendingThought={pendingThought}
          pendingAudio={pendingAudio}
          onChangePendingText={setPendingText}
          onReleasePending={releasePending}
          onDiscardPending={discardPending}
        />
        <ControlsSidebar
          onQuickSend={(text) => setUserInput(text)}
          onInjectCue={injectPrompt}
          disabled={isGenerating}
        />
      </main>

      <StageHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

