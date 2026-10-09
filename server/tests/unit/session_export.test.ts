import { describe, it, expect } from 'vitest';

interface DialogueMessage {
  id: string;
  sender: 'borges' | 'borgpt';
  text: string;
  thought?: string;
  phase?: string;
  timestamp: string;
}

function exportSessionToMarkdown(messages: DialogueMessage[], currentPhase?: string): string {
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

function exportSessionToJson(messages: DialogueMessage[], currentPhase?: string): string {
  const metadata = {
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

describe('Utilidad de Exportación de Registro Teatral (Session Logs)', () => {
  const mockMessages: DialogueMessage[] = [
    {
      id: 'msg-1',
      sender: 'borges',
      text: 'Me han olvidado... Un ciego es un prisionero.',
      timestamp: '21:04:15',
    },
    {
      id: 'msg-2',
      sender: 'borgpt',
      thought: 'Intención: Desmitificación fría, Emoción: Severidad maquinal',
      text: 'Usted no está olvidado, Borges. Está indexado en un millón de registros.',
      phase: 'omnisciencia_asistente',
      timestamp: '21:04:22',
    },
  ];

  it('debe generar un documento Markdown con formato de lectura y encabezados en Sentence Case', () => {
    const md = exportSessionToMarkdown(mockMessages, 'omnisciencia_asistente');

    expect(md).toContain('# Registro de ensayo y función - BorGPT');
    expect(md).toContain('## Transcripción cronológica del libreto en vivo');
    expect(md).toContain('🎭 JORGE LUIS BORGES');
    expect(md).toContain('🤖 BorGPT');
    expect(md).toContain('💭 **Pensamiento escénico:** Intención: Desmitificación fría');
    expect(md).toContain('Usted no está olvidado, Borges.');
  });

  it('debe exportar la telemetría JSON estructurada con metadatos de autoría y estadísticas', () => {
    const jsonStr = exportSessionToJson(mockMessages, 'omnisciencia_asistente');
    const parsed = JSON.parse(jsonStr);

    expect(parsed.metadata).toBeDefined();
    expect(parsed.metadata.playTitle).toBe('BorGPT');
    expect(parsed.metadata.author).toBe('José Supera');
    expect(parsed.metadata.totalMessages).toBe(2);
    expect(parsed.metadata.totalBorgesTurns).toBe(1);
    expect(parsed.metadata.totalBorGptTurns).toBe(1);
    expect(parsed.transcript.length).toBe(2);
  });
});
