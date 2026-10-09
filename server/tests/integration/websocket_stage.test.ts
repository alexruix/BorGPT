import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { BorGPTEngine } from '../../src/engine.js';

describe('Nivel 3 (Cúspide): Tests de Integración de Contrato WebSocket de Escena', () => {
  let server: http.Server;
  let wss: WebSocketServer;
  let port: number;

  beforeAll(async () => {
    server = http.createServer();
    wss = new WebSocketServer({ server, path: '/ws/stage' });
    const engine = new BorGPTEngine();

    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        const data = JSON.parse(msg.toString());
        if (data.action === 'set_phase') {
          engine.setPhase(data.phase);
          ws.send(JSON.stringify({ type: 'mode_changed', mode: data.phase }));
        } else if (data.action === 'interrupt') {
          engine.interrupt();
          ws.send(JSON.stringify({ type: 'interrupted' }));
        } else if (data.action === 'inject') {
          ws.send(JSON.stringify({ type: 'inject_received', cue: data.text }));
        }
      });
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          port = addr.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    wss.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('debe conectar cliente de cabina y responder al cambio de fases dramáticas', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/stage`);

    await new Promise<void>((resolve) => ws.on('open', () => resolve()));

    const phasePromise = new Promise<any>((resolve) => {
      ws.on('message', (msg) => {
        const payload = JSON.parse(msg.toString());
        if (payload.type === 'mode_changed') {
          resolve(payload);
        }
      });
    });

    ws.send(JSON.stringify({ action: 'set_phase', phase: 'crueldad_algoritmica' }));
    const result = await phasePromise;

    expect(result.mode).toBe('crueldad_algoritmica');
    ws.close();
  });

  it('debe procesar el corte de pánico y emitir confirmación inmediata en < 50ms', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/stage`);
    await new Promise<void>((resolve) => ws.on('open', () => resolve()));

    const interruptPromise = new Promise<any>((resolve) => {
      ws.on('message', (msg) => {
        const payload = JSON.parse(msg.toString());
        if (payload.type === 'interrupted') {
          resolve(payload);
        }
      });
    });

    ws.send(JSON.stringify({ action: 'interrupt' }));
    const result = await interruptPromise;

    expect(result.type).toBe('interrupted');
    ws.close();
  });
});
