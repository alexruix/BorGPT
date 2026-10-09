export type TheatricalPhase =
  | 'omnisciencia_asistente'
  | 'provocacion_slang'
  | 'crueldad_algoritmica'
  | 'parricidio_glitch';

export interface PhaseMetadata {
  id: TheatricalPhase;
  phaseNumber: string;
  title: string;
  badge: string;
  colorClass: string;
  description: string;
}

export interface DialogueMessage {
  id: string;
  sender: 'borges' | 'borgpt';
  text: string;
  thought?: string;
  phase?: TheatricalPhase;
  timestamp: string;
  isStreaming?: boolean;
}

export interface WsMessage {
  type: 'start' | 'thought' | 'chunk' | 'audio_sentence' | 'end' | 'interrupted' | 'mode_changed' | 'error' | 'history_cleared';
  message?: string;
  text?: string;
  mode?: TheatricalPhase;
  thought?: string;
  full_text?: string;
  audio_base64?: string;
  sentence_idx?: number;
  error?: string;
}
