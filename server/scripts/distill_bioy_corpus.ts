import fs from 'node:fs';
import path from 'node:path';

function distillBioyCorpus(inputPath: string, outputPath: string) {
  console.log(`Leyendo archivo de diarios de Bioy Casares: ${inputPath}...`);
  if (!fs.existsSync(inputPath)) {
    console.error('No se encontró el archivo de entrada.');
    return;
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const lines = raw.split('\n');
  console.log(`Total de líneas originales: ${lines.length} (${(raw.length / 1024 / 1024).toFixed(2)} MB)`);

  const distilledLines: string[] = [];
  
  // Encabezado Frontmatter conciso
  distilledLines.push('---');
  distilledLines.push('title: "Borges - Diarios íntimos (1931-1989) - Versión destilada teatral"');
  distilledLines.push('author: "Adolfo Bioy Casares"');
  distilledLines.push('genre: "Diálogos cotidianos, ironías literarias y anécdotas de sobremesa"');
  distilledLines.push('---');
  distilledLines.push('');
  distilledLines.push('# Diarios Borges - Bioy Casares (Destilado de diálogos e ironías)');
  distilledLines.push('');

  let inDiaries = false;
  let currentBlock: string[] = [];
  let blockHasBorges = false;

  const borgesKeywords = [
    'Borges', 'Borges:', 'dice Borges', 'dijo Borges', 'comenta Borges',
    'habla de', 'comentamos', 'cenamos', 'come en casa', 'vino Borges',
    'Borges me dice', 'Borges opina', 'Borges recuerda', 'Borges ríe',
    'Doña Leonor', 'Madre de Borges', 'Silvina', 'Bustos Domecq'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar comienzo de las entradas cronológicas del diario (ej: "1931", "1932", "1935", etc.)
    if (!inDiaries) {
      if (/^#*\s*(193[1-9]|194\d|195\d|196\d|197\d|198\d)/.test(line.trim())) {
        inDiaries = true;
      } else {
        continue; // Omitir prefacios, notas editoriales y abreviaturas
      }
    }

    // Si es un nuevo encabezado de año/fecha
    if (/^#+\s+/.test(line) || /^[A-ZÁÉÍÓÚ][a-z]+,\s+\d+\s+de\s+[a-z]+/i.test(line.trim())) {
      if (currentBlock.length > 0 && blockHasBorges) {
        distilledLines.push(...currentBlock);
        distilledLines.push('');
      }
      currentBlock = [line];
      blockHasBorges = false;
      continue;
    }

    // Filtrar líneas de pie de página o referencias bibliográficas aisladas
    if (/^\[\d+\]/.test(line.trim()) || /^pág\.\s+\d+/i.test(line.trim()) || /^B-BC\s*\(/i.test(line.trim())) {
      continue;
    }

    // Revisar si el bloque contiene diálogos o comentarios directos
    for (const kw of borgesKeywords) {
      if (line.includes(kw)) {
        blockHasBorges = true;
        break;
      }
    }

    currentBlock.push(line);
  }

  // Empujar último bloque
  if (currentBlock.length > 0 && blockHasBorges) {
    distilledLines.push(...currentBlock);
  }

  const finalContent = distilledLines.join('\n');
  fs.writeFileSync(outputPath, finalContent, 'utf-8');

  console.log(`\n✅ Destilación completada con éxito:`);
  console.log(`  Archivo generado: ${outputPath}`);
  console.log(`  Líneas finales: ${distilledLines.length}`);
  console.log(`  Peso final: ${(finalContent.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Reducción: ${(((raw.length - finalContent.length) / raw.length) * 100).toFixed(1)}% menos de ruido editorial.\n`);
}

const input = 'data/corpus/borges_bioy/borges_bioy_optimizado.md';
const output = 'data/corpus/borges_bioy/borges_bioy_destilado.md';

distillBioyCorpus(input, output);
