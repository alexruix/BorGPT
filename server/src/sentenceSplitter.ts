/**
 * Divisor inteligente de oraciones y cláusulas para síntesis de voz teatral en vivo.
 * Respeta delimitadores naturales (. ! ? … : ;) sin cortar palabras a la mitad.
 */
export class TheatricalSentenceSplitter {
  private buffer: string = '';

  /**
   * Agrega un fragmento de texto al buffer y extrae todas las oraciones completas listas para sintetizar.
   */
  public push(chunk: string): string[] {
    this.buffer += chunk;
    const sentences: string[] = [];

    // 1. Delimitadores que marcan fin de oración (. ! ? …)
    const sentenceRegex = /([^.!?…\n]+[.!?…]+)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = sentenceRegex.exec(this.buffer)) !== null) {
      const candidate = match[0].trim();
      if (candidate.length >= 3) {
        sentences.push(candidate);
        lastIndex = match.index + match[0].length;
      }
    }

    if (lastIndex > 0) {
      this.buffer = this.buffer.substring(lastIndex);
    }

    // 2. Si no hubo puntos y el buffer acumula más de 120 caracteres, dividir por la última coma o punto y coma
    if (sentences.length === 0 && this.buffer.length > 120) {
      const clauseMatch = this.buffer.match(/^(.+[,;:])\s+(.+)$/s);
      if (clauseMatch && clauseMatch[1].trim().length >= 15) {
        sentences.push(clauseMatch[1].trim());
        this.buffer = clauseMatch[2];
      }
    }

    return sentences;
  }

  /**
   * Extrae el remanente final al concluir el stream.
   */
  public flush(): string | null {
    const remaining = this.buffer.trim();
    this.buffer = '';
    return remaining.length > 0 ? remaining : null;
  }

  /**
   * Resetea el estado del splitter.
   */
  public reset(): void {
    this.buffer = '';
  }
}
