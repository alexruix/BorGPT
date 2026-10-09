export type TheatricalAct =
  | 'despertar_asistente'
  | 'pasapalabra_tv'
  | 'tinder_catalogo'
  | 'norah_espectral'
  | 'simon_aleph'
  | 'parricidio_glitch';

export interface ActMetadata {
  id: TheatricalAct;
  actNumber: string;
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
  mode?: TheatricalAct;
  timestamp: string;
  isStreaming?: boolean;
}

export interface WsMessage {
  type: 'start' | 'thought' | 'chunk' | 'audio_sentence' | 'end' | 'interrupted' | 'mode_changed' | 'error' | 'history_cleared';
  message?: string;
  text?: string;
  mode?: TheatricalAct;
  thought?: string;
  full_text?: string;
  audio_base64?: string;
  sentence_idx?: number;
  error?: string;
}
