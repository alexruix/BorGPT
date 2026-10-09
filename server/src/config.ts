import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

dotenv.config({ path: path.join(rootDir, '.env') });

export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || process.env.SERVER_PORT || '8000', 10),
  host: process.env.SERVER_HOST || '0.0.0.0',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  cacheTtlHours: parseInt(process.env.CACHE_TTL_HOURS || '24', 10),
  rootDir,
  dataDir: path.join(rootDir, 'data'),
  docsDir: path.join(rootDir, 'docs'),
  ssotPath: path.join(rootDir, 'data', 'theatre_script_ssot.json'),
  corpusPath: path.join(rootDir, 'data', 'corpus', 'obras_completas_1923_1972.md'),
  bioyPath: path.join(rootDir, 'data', 'corpus', 'borges_bioy', 'borges_bioy_optimizado.md'),
};
