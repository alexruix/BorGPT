import type { DialogueMessage } from '../types/stage';

export interface SessionExportMetadata {
  playTitle: string;
  author: string;
  exportedAt: string;
  totalMessages: number;
  totalBorgesTurns: number;
  totalBorGptTurns: number;
  currentPhase?: string;
}

/**
 * Convierte el historial de mensajes de la sesión en un documento Markdown estructurado.
 * Cumple con la regla de documentación en Sentence Case.
 */
export function exportSessionToMarkdown(messages: DialogueMessage[], currentPhase?: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const borgesCount = messages.filter((m) => m.sender === 'borges').length;
  const borGptCount = messages.filter((m) => m.sender === 'borgpt').length;

  let md = `# Registro de ensayo y función - BorGPT\n\n`;
  md += `> **Obra:** BorGPT  \n`;
  md += `> **Autor:** José Supera  \n`;
  md += `> **Fecha:** ${dateStr} - ${timeStr}  \n`;
  md += `> **Fase dramática final:** \`${currentPhase || 'omnisciencia_asistente'}\`  \n`;
  md += `> **Estadísticas:** ${messages.length} intervenciones (${borgesCount} de Borges, ${borGptCount} de BorGPT)\n\n`;
  md += `---\n\n`;
  md += `## Transcripción cronológica del libreto en vivo\n\n`;

  if (messages.length === 0) {
    md += `*No se registraron diálogos durante esta sesión.*\n`;
    return md;
  }

  messages.forEach((msg, idx) => {
    const isBorges = msg.sender === 'borges';
    const characterName = isBorges ? '🎭 JORGE LUIS BORGES' : '🤖 BorGPT';
    const timestamp = msg.timestamp || '';
    const phaseBadge = msg.phase ? ` \`[${msg.phase}]\`` : '';

    md += `### ${idx + 1}. ${characterName}${phaseBadge} <small>(${timestamp})</small>\n\n`;

    if (msg.thought) {
      md += `> 💭 **Pensamiento escénico:** ${msg.thought}\n\n`;
    }

    md += `${msg.text}\n\n`;
    md += `---\n\n`;
  });

  md += `\n*Documento generado automáticamente por la consola teatral de BorGPT para archivo dramatúrgico y análisis del motor.*\n`;
  return md;
}

/**
 * Convierte el historial de mensajes de la sesión en un objeto JSON con metadatos.
 */
export function exportSessionToJson(messages: DialogueMessage[], currentPhase?: string): string {
  const metadata: SessionExportMetadata = {
    playTitle: 'BorGPT',
    author: 'José Supera',
    exportedAt: new Date().toISOString(),
    totalMessages: messages.length,
    totalBorgesTurns: messages.filter((m) => m.sender === 'borges').length,
    totalBorGptTurns: messages.filter((m) => m.sender === 'borgpt').length,
    currentPhase,
  };

  return JSON.stringify({ metadata, transcript: messages }, null, 2);
}

/**
 * Dispara la descarga del archivo en el navegador del usuario.
 */
export function triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
