import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, readJson, renderComparisonMarkdown, timestampId, writeJson } from './lib.mjs';

const options = parseArgs(process.argv.slice(2));
const reportRoot = path.resolve(options.output ?? 'reports/performance');
const [beforeDirectory, afterDirectory] = await resolveInputs(reportRoot, options.before, options.after);
const before = await readJson(path.join(beforeDirectory, 'summary.json'));
const after = await readJson(path.join(afterDirectory, 'summary.json'));

const afterByKey = new Map(after.measurements.map((measurement) => [key(measurement), measurement]));
const rows = before.measurements.flatMap((beforeMeasurement) => {
  const afterMeasurement = afterByKey.get(key(beforeMeasurement));
  if (!afterMeasurement) return [];
  const metrics = ['performance', 'accessibility', 'bestPractices', 'seo', 'fcpMs', 'lcpMs', 'cls', 'speedIndexMs', 'tbtMs'];
  return [{
    url: beforeMeasurement.url,
    strategy: beforeMeasurement.strategy,
    before: beforeMeasurement.lab,
    after: afterMeasurement.lab,
    delta: Object.fromEntries(metrics.map((metric) => [metric, delta(beforeMeasurement.lab[metric], afterMeasurement.lab[metric])])),
  }];
});

if (rows.length === 0) throw new Error('Los reportes no tienen rutas/estrategias comparables.');
const comparison = {
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  before: { directory: beforeDirectory, label: before.label, createdAt: before.createdAt },
  after: { directory: afterDirectory, label: after.label, createdAt: after.createdAt },
  rows,
};
const baseName = `comparison-${timestampId()}`;
await writeJson(path.join(reportRoot, `${baseName}.json`), comparison);
await writeFile(path.join(reportRoot, `${baseName}.md`), renderComparisonMarkdown(comparison), 'utf8');
process.stdout.write(`Comparación guardada en ${path.join(reportRoot, `${baseName}.md`)}\n`);

function key(measurement) {
  return `${measurement.url}|${measurement.strategy}`;
}

function delta(beforeValue, afterValue) {
  return Number.isFinite(beforeValue) && Number.isFinite(afterValue) ? afterValue - beforeValue : null;
}

async function resolveInputs(root, beforeOption, afterOption) {
  if (beforeOption && afterOption) return [path.resolve(beforeOption), path.resolve(afterOption)];
  if (beforeOption || afterOption) throw new Error('Usa --before y --after juntos, o ninguno para comparar los dos reportes locales más recientes.');

  const entries = await readdir(root, { withFileTypes: true });
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(root, entry.name);
    try {
      const summary = await readJson(path.join(directory, 'summary.json'));
      if (summary.source === 'lighthouse-local') candidates.push({ directory, createdAt: summary.createdAt });
    } catch {
      // Ignora carpetas parciales o reportes de otra fuente.
    }
  }
  candidates.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  if (candidates.length < 2) throw new Error('Se necesitan al menos dos reportes locales para comparar.');
  return [candidates[1].directory, candidates[0].directory];
}
