import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { SERVER_CONFIG } from './config.js';

export class CacheManager {
  private ai: GoogleGenAI;
  private cachedContentName: string | null = null;

  constructor(ai: GoogleGenAI) {
    this.ai = ai;
  }

  public buildUnifiedCorpus(): string {
    let corpus = '# Corpus Maestro Unificado de Conocimiento y Diálogos de BorGPT\n\n';

    // 1. Prioridad Máxima: Módulos teatrales curados, personajes, escenas, entrevistas y ensayos en docs/
    if (fs.existsSync(SERVER_CONFIG.docsDir)) {
      const readDocsRecursive = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            // Evitar duplicar obras_canonicas ya que se incluyen selectivamente en el paso 3
            if (file !== 'obras_canonicas') {
              readDocsRecursive(fullPath);
            }
          } else if (file.endsWith('.md') && corpus.length < 1500000) {
            corpus += `\n\n<!-- DOCUMENTO: ${file} -->\n\n`;
            corpus += fs.readFileSync(fullPath, 'utf-8');
          }
        }
      };
      readDocsRecursive(SERVER_CONFIG.docsDir);
    }

    // 2. Prioridad Alta: Diarios íntimos Borges-Bioy Casares (conversaciones cotidianas, humor, ironías y anécdotas)
    if (fs.existsSync(SERVER_CONFIG.bioyPath) && corpus.length < 2800000) {
      corpus += '\n\n<!-- SECCIÓN: DIARIOS ÍNTIMOS BORGES - BIOY CASARES -->\n\n';
      const remainingBytes = 2800000 - corpus.length;
      const bioyContent = fs.readFileSync(SERVER_CONFIG.bioyPath, 'utf-8');
      corpus += bioyContent.substring(0, remainingBytes);
    }

    // 3. Obras Completas canónicas (hasta completar el cupo máximo de 2.8 MB / ~700.000 tokens)
    if (fs.existsSync(SERVER_CONFIG.corpusPath) && corpus.length < 2800000) {
      corpus += '\n\n<!-- SECCIÓN: OBRAS COMPLETAS (1923-1972) -->\n\n';
      const remainingBytes = 2800000 - corpus.length;
      const obrasContent = fs.readFileSync(SERVER_CONFIG.corpusPath, 'utf-8');
      corpus += obrasContent.substring(0, remainingBytes);
    }

    // Límite seguro final de 2.8 MB
    if (corpus.length > 2800000) {
      corpus = corpus.substring(0, 2800000);
    }

    return corpus;
  }

  public async initializeCache(): Promise<string | null> {
    if (!SERVER_CONFIG.geminiApiKey) {
      console.warn('GEMINI_API_KEY no configurada. Omitiendo Context Caching.');
      return null;
    }

    try {
      console.log('Construyendo corpus maestro para Context Caching...');
      const corpusText = this.buildUnifiedCorpus();

      console.log(`Corpus preparado (${(corpusText.length / 1024 / 1024).toFixed(2)} MB). Creando caché en ${SERVER_CONFIG.geminiModel}...`);
      
      const cache = await this.ai.caches.create({
        model: SERVER_CONFIG.geminiModel,
        config: {
          ttl: `${SERVER_CONFIG.cacheTtlHours * 3600}s`,
          contents: [
            {
              role: 'user',
              parts: [{ text: corpusText }]
            }
          ]
        }
      });

      this.cachedContentName = cache.name || null;
      console.log(`Context Caching activo en Google Cloud: ${this.cachedContentName}`);
      return this.cachedContentName;
    } catch (error) {
      console.error('Error al inicializar Context Cache (usando fallback en vivo):', error);
      return null;
    }
  }

  public getCacheName(): string | null {
    return this.cachedContentName;
  }
}
