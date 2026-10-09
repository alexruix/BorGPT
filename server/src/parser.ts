/**
 * Función canónica y pura para parsear la respuesta teatral de BorGPT
 * separando la acotación de pensamiento escénico del diálogo en vivo.
 */
export function parseTheatricalResponse(rawText: string, defaultPhase: string = 'omnisciencia_asistente'): {
  thought: string;
  dialogue: string;
} {
  if (!rawText || typeof rawText !== 'string') {
    return {
      thought: `Intención: Respuesta directa en ${defaultPhase}`,
      dialogue: '',
    };
  }

  const trimmed = rawText.trim();
  const match = trimmed.match(/^\[(.*?)\]\s*(.*)/s);

  if (match) {
    return {
      thought: match[1].trim() || `Intención: Modulación escénica en ${defaultPhase}`,
      dialogue: match[2] ? match[2].trim() : '',
    };
  }

  return {
    thought: `Intención: Respuesta directa en ${defaultPhase}`,
    dialogue: trimmed,
  };
}
