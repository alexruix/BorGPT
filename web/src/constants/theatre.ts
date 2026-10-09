import scriptData from '../../../data/theatre_script_ssot.json';
import type { PhaseMetadata } from '../types/stage';

export const PLAY_PHASES: PhaseMetadata[] = scriptData.phases as PhaseMetadata[];
export const SCRIPT_CUES = scriptData.scriptCues;
export const SYSTEM_COPIES = scriptData.systemMessages;
export const DESIGN_TOKENS = scriptData.designTokens;
