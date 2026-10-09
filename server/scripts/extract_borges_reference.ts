import fs from 'node:fs';
import path from 'node:path';

// Script optimizado en memoria usando streams o Float32Array para analizar archivos WAV gigantes (55 min)
function analyzeAndExtractWav(inputPath: string, outputPath: string) {
  console.log(`Analizando archivo de audio: ${inputPath}...`);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: No existe el archivo ${inputPath}`);
    return;
  }

  // Abrir file descriptor para lectura selectiva sin cargar 600MB en un solo array JS
  const fd = fs.openSync(inputPath, 'r');
  const headerBuf = Buffer.alloc(44);
  fs.readSync(fd, headerBuf, 0, 44, 0);

  const numChannels = headerBuf.readUInt16LE(22);
  const sampleRate = headerBuf.readUInt32LE(24);
  const bitsPerSample = headerBuf.readUInt16LE(34);

  // Buscar bloque 'data'
  let dataOffset = 12;
  const chunkHeader = Buffer.alloc(8);
  while (dataOffset < 1000) {
    fs.readSync(fd, chunkHeader, 0, 8, dataOffset);
    const chunkId = chunkHeader.toString('ascii', 0, 4);
    const chunkSize = chunkHeader.readUInt32LE(4);
    if (chunkId === 'data') {
      dataOffset += 8;
      break;
    }
    dataOffset += 8 + chunkSize;
  }

  const stat = fs.fstatSync(fd);
  const bytesPerSample = bitsPerSample / 8;
  const totalSamples = (stat.size - dataOffset) / (bytesPerSample * numChannels);
  const durationSec = totalSamples / sampleRate;

  console.log(`\nInformación del audio:`);
  console.log(`  Canales: ${numChannels}`);
  console.log(`  Frecuencia de muestreo: ${sampleRate} Hz`);
  console.log(`  Profundidad: ${bitsPerSample} bits`);
  console.log(`  Duración total: ${durationSec.toFixed(2)} segundos (${(durationSec / 60).toFixed(2)} min)`);

  // Analizaremos los primeros 8 minutos (480 segundos) que contienen el inicio claro de la conferencia
  const searchDurationSec = 480;
  const bytesToRead = Math.min(stat.size - dataOffset, searchDurationSec * sampleRate * numChannels * bytesPerSample);
  const searchBuffer = Buffer.alloc(bytesToRead);
  fs.readSync(fd, searchBuffer, 0, bytesToRead, dataOffset);

  const windowSec = 10.0;
  const stepSec = 0.5;
  const windowBytes = Math.floor(windowSec * sampleRate) * numChannels * bytesPerSample;
  const stepBytes = Math.floor(stepSec * sampleRate) * numChannels * bytesPerSample;

  let bestByteOffset = Math.floor(30 * sampleRate) * numChannels * bytesPerSample; // saltar primeros 30s de presentación
  let bestScore = -Infinity;

  for (let offset = bestByteOffset; offset <= bytesToRead - windowBytes; offset += stepBytes) {
    let sumSq = 0;
    const numSamplesInWindow = Math.floor(windowSec * sampleRate);

    for (let i = 0; i < numSamplesInWindow; i += 4) { // muestreo cada 4 para velocidad
      const sampleVal = searchBuffer.readInt16LE(offset + i * numChannels * bytesPerSample) / 32768.0;
      sumSq += sampleVal * sampleVal;
    }

    const rms = Math.sqrt(sumSq / (numSamplesInWindow / 4));

    // Puntuación: buscamos voz clara sin saturación ni ruido extremo (RMS entre 0.08 y 0.28)
    if (rms >= 0.06 && rms <= 0.30) {
      const score = rms * 100;
      if (score > bestScore) {
        bestScore = score;
        bestByteOffset = offset;
      }
    }
  }

  const bestStartTime = bestByteOffset / (sampleRate * numChannels * bytesPerSample);
  console.log(`\n🎯 Mejor segmento de voz de Borges identificado:`);
  console.log(`  Inicio: ${bestStartTime.toFixed(2)}s (${Math.floor(bestStartTime / 60)}m ${(bestStartTime % 60).toFixed(1)}s)`);
  console.log(`  Fin: ${(bestStartTime + windowSec).toFixed(2)}s`);

  // Extraer el segmento de 10s
  const extractBuffer = Buffer.alloc(windowBytes);
  fs.readSync(fd, extractBuffer, 0, windowBytes, dataOffset + bestByteOffset);
  fs.closeSync(fd);

  // Crear archivo WAV de salida
  const outHeader = Buffer.alloc(44);
  outHeader.write('RIFF', 0);
  outHeader.writeUInt32LE(36 + windowBytes, 4);
  outHeader.write('WAVE', 8);
  outHeader.write('fmt ', 12);
  outHeader.writeUInt32LE(16, 16);
  outHeader.writeUInt16LE(1, 20); // PCM
  outHeader.writeUInt16LE(numChannels, 22);
  outHeader.writeUInt32LE(sampleRate, 24);
  outHeader.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  outHeader.writeUInt16LE(numChannels * bytesPerSample, 32);
  outHeader.writeUInt16LE(bitsPerSample, 34);
  outHeader.write('data', 36);
  outHeader.writeUInt32LE(windowBytes, 40);

  const finalWav = Buffer.concat([outHeader, extractBuffer]);
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, finalWav);
  console.log(`\n✅ Archivo de referencia creado exitosamente en:`);
  console.log(`   ${outputPath} (${(finalWav.length / 1024 / 1024).toFixed(2)} MB)`);
}

const input = 'Jorge_Luis_Borges_Siete_Noches_-_La_Divina_Comedia_Conferencia.wav';
const output = 'data/audio/borges_reference.wav';

analyzeAndExtractWav(input, output);
