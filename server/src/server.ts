import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { SERVER_CONFIG } from './config.js';
import { BorGPTEngine } from './engine.js';
import { TTSService } from './ttsService.js';
import { TheatricalSentenceSplitter } from './sentenceSplitter.js';

const engine = new BorGPTEngine();
const ttsService = TTSService.getInstance();

// 1. Servidor HTTP básico para Health Check y archivos estáticos
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Health check endpoint
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      engine: 'Gemini 2.0 Flash (Enterprise TypeScript Engine)',
      current_phase: engine.getCurrentPhase(),
      time: new Date().toISOString()
    }));
    return;
  }

  // Fallback o servir build de web/dist si existe
  const distDir = path.join(SERVER_CONFIG.rootDir, 'web', 'dist');
  let filePath = path.join(distDir, url.pathname === '/' ? 'index.html' : url.pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'BorGPT Theatre WebSocket & Gemini Server Online' }));
  }
});

// 2. Servidor WebSocket para streaming teatral en tiempo real
const wss = new WebSocketServer({ server, path: '/ws/stage' });

wss.on('connection', (ws: WebSocket) => {
  console.log('Cliente de cabina teatral conectado vía WebSocket.');

  ws.on('message', async (data: string) => {
    try {
      const payload = JSON.parse(data.toString());
      const action = payload.action || 'chat';

      if (action === 'set_phase' || action === 'set_mode') {
        const newPhase = payload.phase || payload.mode || 'omnisciencia_asistente';
        engine.setPhase(newPhase);
        ws.send(JSON.stringify({ type: 'mode_changed', mode: newPhase }));
        return;
      }

      if (action === 'interrupt') {
        engine.interrupt();
        ws.send(JSON.stringify({ type: 'interrupted' }));
        return;
      }

      if (action === 'inject') {
        const cue = payload.text || '';
        engine.addOperatorInject(cue);
        ws.send(JSON.stringify({ type: 'inject_received', cue }));
        return;
      }

      if (action === 'clear') {
        engine.clearHistory();
        ws.send(JSON.stringify({ type: 'history_cleared' }));
        return;
      }

      if (action === 'chat') {
        const userMsg = payload.message || '';
        if (!userMsg.trim()) return;

        const activePhase = engine.getCurrentPhase();
        ws.send(JSON.stringify({ type: 'start', message: userMsg, mode: activePhase }));

        const sentenceSplitter = new TheatricalSentenceSplitter();

        for await (const event of engine.streamResponse(userMsg, payload.temperature)) {
          if (event.type === 'thought') {
            ws.send(JSON.stringify({ type: 'thought', text: event.text }));
          } else if (event.type === 'speech_chunk') {
            ws.send(JSON.stringify({ type: 'chunk', text: event.text }));

            if (payload.audio) {
              const readySentences = sentenceSplitter.push(event.text);
              for (const sentence of readySentences) {
                ttsService.synthesize(sentence).then((audioBase64) => {
                  if (audioBase64 && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                      type: 'audio_sentence',
                      text: sentence,
                      audio_base64: audioBase64
                    }));
                  }
                }).catch((e) => console.error('Error sintetizando oración:', e));
              }
            }
          }
        }

        // Sintetizar resto final si quedó texto pendiente
        if (payload.audio) {
          const finalSentence = sentenceSplitter.flush();
          if (finalSentence) {
            ttsService.synthesize(finalSentence).then((audioBase64) => {
              if (audioBase64 && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'audio_sentence',
                  text: finalSentence,
                  audio_base64: audioBase64
                }));
              }
            }).catch((e) => console.error('Error sintetizando resto de audio:', e));
          }
        }

        ws.send(JSON.stringify({ type: 'end' }));
      }
    } catch (err) {
      console.error('Error al procesar mensaje WebSocket:', err);
    }
  });

  ws.on('close', () => {
    console.log('Cliente de cabina desconectado.');
  });
});

// 3. Iniciar servidor
server.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, async () => {
  console.log(`=======================================================`);
  console.log(`🎭 BORGPT ENTERPRISE THEATRE SERVER`);
  console.log(`   Host: http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
  console.log(`   WebSocket: ws://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}/ws/stage`);
  console.log(`=======================================================`);
  await engine.initialize();
});
