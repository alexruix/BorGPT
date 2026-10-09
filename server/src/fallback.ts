import fs from 'node:fs';
import { SERVER_CONFIG } from './config.js';

export function getFallbackResponse(category: string = 'cotidiano'): string {
  try {
    if (fs.existsSync(SERVER_CONFIG.ssotPath)) {
      const data = JSON.parse(fs.readFileSync(SERVER_CONFIG.ssotPath, 'utf-8'));
      const list = data.fallbackResponses?.[category] || data.fallbackResponses?.cotidiano || [];
      if (list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
      }
    }
  } catch (error) {
    console.error('Error loading fallback response:', error);
  }

  return 'La memoria, como los espejos, suele tender trampas y vacilar por un instante... Continúe, por favor.';
}
