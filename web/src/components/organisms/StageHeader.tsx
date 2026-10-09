import React from 'react';
import { Button } from '../atoms';
import { StatusPill, AudioToggle, PanicButton, EmissionModeToggle, AudioSpeedControl, ExportSessionMenu } from '../molecules';
import type { DialogueMessage } from '@/types/stage';

interface StageHeaderProps {
  online: boolean;
  disconnectReason?: string;
  isGenerating: boolean;
  isPlayingAudio: boolean;
  audioEnabled: boolean;
  manualApproval: boolean;
  hasPendingRelease: boolean;
  playbackSpeed: number;
  messages: DialogueMessage[];
  currentPhase?: string;
  onChangePlaybackSpeed: (speed: number) => void;
  onToggleAudio: (state: boolean) => void;
  onToggleManualApproval: (enabled: boolean) => void;
  onInterrupt: () => void;
  onClear: () => void;
}

export const StageHeader: React.FC<StageHeaderProps> = ({
  online,
  disconnectReason,
  isGenerating,
  isPlayingAudio,
  audioEnabled,
  manualApproval,
  hasPendingRelease,
  playbackSpeed,
  messages,
  currentPhase,
  onChangePlaybackSpeed,
  onToggleAudio,
  onToggleManualApproval,
  onInterrupt,
  onClear,
}) => {
  return (
    <header className="relative bg-linear-to-r from-stage-bg via-stage-surface to-stage-bg border-b border-stage-border px-6 py-2.5 flex items-center justify-between z-20 select-none shadow-md">
      {/* Filete superior albiceleste (Tres bastones de la Selección Argentina) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 albiceleste-ribbon" aria-hidden="true" />

      {/* Brand & Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg sol-de-mayo-badge flex items-center justify-center font-display font-bold text-sm tracking-tighter">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-base tracking-wide text-arg-sol-light leading-none">
                BorGPT
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono font-medium rounded text-arg-celeste-light bg-arg-celeste-dim/20 border border-arg-celeste/30">
                ARG
              </span>
            </div>
            <span className="font-sans text-[11px] text-text-tertiary block mt-0.5">
              Consola de regiduría y cabina
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-stage-border" />

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-sans text-text-tertiary">Puesta en escena:</span>
          <span className="text-xs font-body italic text-text-secondary">BorGPT (José Supera)</span>
        </div>
      </div>

      {/* Center / Status & Emission Mode & Audio Speed */}
      <div className="flex items-center gap-3">
        <StatusPill
          online={online}
          disconnectReason={disconnectReason}
          isGenerating={isGenerating}
          isPlayingAudio={isPlayingAudio}
        />
        <EmissionModeToggle
          manualApproval={manualApproval}
          onToggle={onToggleManualApproval}
          hasPendingRelease={hasPendingRelease}
        />
        <AudioSpeedControl speed={playbackSpeed} onChangeSpeed={onChangePlaybackSpeed} />
        <AudioToggle enabled={audioEnabled} isPlaying={isPlayingAudio} onToggle={onToggleAudio} />
      </div>

      {/* Right Controls / Emergency & Export */}
      <div className="flex items-center gap-2.5">
        <ExportSessionMenu messages={messages} currentPhase={currentPhase} />
        <PanicButton onInterrupt={onInterrupt} />
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          title="Reiniciar historial de diálogo de la función"
        >
          Reiniciar diálogo
        </Button>
      </div>

    </header>
  );
};



