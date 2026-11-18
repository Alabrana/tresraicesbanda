import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const METRIC_AUDITS = {
  fcpMs: 'first-contentful-paint',
  lcpMs: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  speedIndexMs: 'speed-index',
  tbtMs: 'total-blocking-time',
};

const FIELD_METRICS = {
  fcpMs: 'FIRST_CONTENTFUL_PAINT_MS',
  lcpMs: 'LARGEST_CONTENTFUL_PAINT_MS',
  cls: 'CUMULATIVE_LAYOUT_SHIFT_SCORE',
  inpMs: 'INTERACTION_TO_NEXT_PAINT',
};

export function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) continue;
    const [rawKey, inlineValue] = argument.slice(2).split('=', 2);
    const next = argv[index + 1];
    const value = inlineValue ?? (next && !next.startsWith('--') ? argv[++index] : 'true');
    options[rawKey] = value;
  }
  return options;
}

export function listOption(value, fallback) {
  if (!value) return fallback;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function numberOption(value, fallback, minimum = 1) {
  if (!value) return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum) {
    throw new Error(`Valor numérico inválido: ${value}`);
  }
  return number;
}

export function timestampId(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

export function slugify(value) {
  return value
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'home';
}

export async function prepareReportDirectory(root, label, source, date = new Date()) {
  const directory = path.resolve(root, `${label}-${source}-${timestampId(date)}`);
  await mkdir(path.join(directory, 'raw'), { recursive: true });
  return directory;
}

export async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export function median(values) {
  const valid = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  const middle = Math.floor(valid.length / 2);
  return valid.length % 2 === 0 ? (valid[middle - 1] + valid[middle]) / 2 : valid[middle];
}

function numericValue(audit) {
  return Number.isFinite(audit?.numericValue) ? audit.numericValue : null;
}

export function extractLabResult(lhr) {
  const categories = lhr.categories ?? {};
  const audits = lhr.audits ?? {};
  return {
    performance: score(categories.performance),
    accessibility: score(categories.accessibility),
    bestPractices: score(categories['best-practices']),
    seo: score(categories.seo),
    ...Object.fromEntries(
      Object.entries(METRIC_AUDITS).map(([name, auditId]) => [name, numericValue(audits[auditId])]),
    ),
  };
}

function score(category) {
  return Number.isFinite(category?.score) ? Math.round(category.score * 100) : null;
}

export function aggregateLabs(labs) {
  const keys = ['performance', 'accessibility', 'bestPractices', 'seo', ...Object.keys(METRIC_AUDITS)];
  return Object.fromEntries(keys.map((key) => [key, median(labs.map((lab) => lab[key]))]));
}

export function representativeLhr(lhrs, aggregate) {
  return [...lhrs].sort((left, right) => {
    const leftScore = extractLabResult(left).performance ?? 0;
    const rightScore = extractLabResult(right).performance ?? 0;
    return Math.abs(leftScore - aggregate.performance) - Math.abs(rightScore - aggregate.performance);
  })[0];
}

export function extractOpportunities(lhr, limit = 5) {
  return Object.values(lhr.audits ?? {})
    .filter((audit) => audit?.score !== null && audit?.score < 1 && (audit.details?.type === 'opportunity' || audit.id?.endsWith('-insight')))
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      displayValue: audit.displayValue ?? null,
      savingsMs: Number.isFinite(audit.details?.overallSavingsMs)
        ? audit.details.overallSavingsMs
        : Math.max(0, ...Object.values(audit.metricSavings ?? {}).filter(Number.isFinite)),
      savingsBytes: Number.isFinite(audit.details?.overallSavingsBytes)
        ? audit.details.overallSavingsBytes
        : audit.numericUnit === 'byte' && Number.isFinite(audit.numericValue)
          ? audit.numericValue
          : audit.details?.debugData?.wastedBytes ?? 0,
    }))
    .sort((left, right) => (right.savingsMs - left.savingsMs) || (right.savingsBytes - left.savingsBytes))
    .slice(0, limit);
}

export function extractResources(lhr, limit = 8) {
  const requests = lhr.audits?.['network-requests']?.details?.items ?? [];
  return requests
    .filter((item) => item.url && !item.url.startsWith('data:'))
    .map((item) => ({
      url: item.url,
      resourceType: item.resourceType ?? 'Other',
      transferSize: Number.isFinite(item.transferSize) ? item.transferSize : 0,
      resourceSize: Number.isFinite(item.resourceSize) ? item.resourceSize : 0,
    }))
    .sort((left, right) => right.transferSize - left.transferSize)
    .slice(0, limit);
}

export function extractFieldData(response) {
  const candidates = [
    { scope: 'URL', metrics: response.loadingExperience?.metrics, status: response.loadingExperience?.overall_category },
    { scope: 'origin', metrics: response.originLoadingExperience?.metrics, status: response.originLoadingExperience?.overall_category },
  ];
  const source = candidates.find((candidate) => candidate.metrics
    && Object.values(candidate.metrics).some((metric) => Number.isFinite(metric?.percentile)));
  if (!source) return null;

  const values = {};
  for (const [name, metricId] of Object.entries(FIELD_METRICS)) {
    const percentile = source.metrics[metricId]?.percentile;
    if (Number.isFinite(percentile)) values[name] = name === 'cls' ? percentile / 100 : percentile;
  }
  return Object.keys(values).length > 0 ? { scope: source.scope, status: source.status ?? null, ...values } : null;
}

function formatScore(value) {
  return value === null || value === undefined ? '—' : String(Math.round(value));
}

function formatMs(value) {
  return value === null || value === undefined ? '—' : value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function formatCls(value) {
  return value === null || value === undefined ? '—' : Number(value).toFixed(3);
}

function formatBytes(value) {
  if (!Number.isFinite(value)) return '—';
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  return `${Math.round(value / 1024)} KB`;
}

function cleanCell(value) {
  return String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function renderSummaryMarkdown(summary) {
  const lines = [
    `# Rendimiento — ${summary.label}`,
    '',
    `- Fecha: ${summary.createdAt}`,
    `- Entorno: ${summary.environment.kind}`,
    `- Base: ${summary.environment.baseUrl}`,
    `- Lighthouse: ${summary.environment.lighthouseVersion ?? 'no disponible'}`,
    `- Repeticiones por ruta/estrategia: ${summary.environment.runsPerRoute ?? 1}`,
    '',
    '## Datos de laboratorio',
    '',
    '| URL | Estrategia | Perf. | Acc. | Buenas prácticas | SEO | FCP | LCP | CLS | Speed Index | TBT |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const measurement of summary.measurements) {
    const lab = measurement.lab;
    lines.push(`| ${cleanCell(measurement.url)} | ${measurement.strategy} | ${formatScore(lab.performance)} | ${formatScore(lab.accessibility)} | ${formatScore(lab.bestPractices)} | ${formatScore(lab.seo)} | ${formatMs(lab.fcpMs)} | ${formatMs(lab.lcpMs)} | ${formatCls(lab.cls)} | ${formatMs(lab.speedIndexMs)} | ${formatMs(lab.tbtMs)} |`);
  }

  if (summary.errors?.length > 0) {
    lines.push('', '## Errores de medición', '');
    for (const error of summary.errors) lines.push(`- ${error.strategy ?? 'general'}: ${error.message}`);
  }

  const fieldMeasurements = summary.measurements.filter((measurement) => measurement.field);
  lines.push('', '## Datos de campo CrUX', '');
  if (fieldMeasurements.length === 0) {
    lines.push('No hubo datos de campo CrUX válidos. INP no se informa ni se estima con datos de laboratorio.');
  } else {
    const hasInp = fieldMeasurements.some((measurement) => Number.isFinite(measurement.field.inpMs));
    lines.push(
      hasInp ? '| URL | Alcance | Estado | FCP | LCP | CLS | INP |' : '| URL | Alcance | Estado | FCP | LCP | CLS |',
      hasInp ? '|---|---|---|---:|---:|---:|---:|' : '|---|---|---|---:|---:|---:|',
    );
    for (const measurement of fieldMeasurements) {
      const field = measurement.field;
      const cells = `| ${cleanCell(measurement.url)} | ${field.scope} | ${field.status ?? '—'} | ${formatMs(field.fcpMs)} | ${formatMs(field.lcpMs)} | ${formatCls(field.cls)} |`;
      lines.push(hasInp ? `${cells} ${formatMs(field.inpMs)} |` : cells);
    }
  }

  lines.push('', '## Oportunidades principales', '');
  for (const measurement of summary.measurements) {
    if (measurement.opportunities.length === 0) continue;
    lines.push(`### ${measurement.strategy} — ${measurement.url}`, '');
    for (const opportunity of measurement.opportunities.slice(0, 3)) {
      const impact = [opportunity.displayValue, opportunity.savingsMs ? `ahorro estimado ${formatMs(opportunity.savingsMs)}` : null, opportunity.savingsBytes ? formatBytes(opportunity.savingsBytes) : null].filter(Boolean).join('; ');
      lines.push(`- ${opportunity.title}${impact ? ` — ${impact}` : ''}`);
    }
    lines.push('');
  }

  lines.push('## Recursos de mayor transferencia', '');
  for (const measurement of summary.measurements) {
    const resources = measurement.resources.slice(0, 5);
    if (resources.length === 0) continue;
    lines.push(`### ${measurement.strategy} — ${measurement.url}`, '', '| Recurso | Tipo | Transferencia | Tamaño |', '|---|---|---:|---:|');
    for (const resource of resources) {
      lines.push(`| ${cleanCell(resource.url)} | ${resource.resourceType} | ${formatBytes(resource.transferSize)} | ${formatBytes(resource.resourceSize)} |`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

export async function saveSummary(directory, summary) {
  await writeJson(path.join(directory, 'summary.json'), summary);
  await writeFile(path.join(directory, 'SUMMARY.md'), renderSummaryMarkdown(summary), 'utf8');
}

export function renderComparisonMarkdown(comparison) {
  const lines = [
    '# Comparación de rendimiento',
    '',
    `- Fecha: ${comparison.createdAt}`,
    `- Antes: ${comparison.before.label} (${comparison.before.createdAt})`,
    `- Después: ${comparison.after.label} (${comparison.after.createdAt})`,
    '',
    'Los deltas de puntuación están en puntos Lighthouse. En las métricas temporales y CLS, un delta negativo significa mejora.',
    '',
    '| URL | Estrategia | Perf. antes | Perf. después | Δ Perf. | LCP antes | LCP después | Δ LCP | CLS antes | CLS después | Δ CLS | TBT antes | TBT después | Δ TBT |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const row of comparison.rows) {
    lines.push(`| ${cleanCell(row.url)} | ${row.strategy} | ${formatScore(row.before.performance)} | ${formatScore(row.after.performance)} | ${signed(row.delta.performance, 0)} | ${formatMs(row.before.lcpMs)} | ${formatMs(row.after.lcpMs)} | ${signedMs(row.delta.lcpMs)} | ${formatCls(row.before.cls)} | ${formatCls(row.after.cls)} | ${signed(row.delta.cls, 3)} | ${formatMs(row.before.tbtMs)} | ${formatMs(row.after.tbtMs)} | ${signedMs(row.delta.tbtMs)} |`);
  }
  return `${lines.join('\n')}\n`;
}

function signed(value, decimals) {
  if (!Number.isFinite(value)) return '—';
  const fixed = Number(value).toFixed(decimals);
  return value > 0 ? `+${fixed}` : fixed;
}

function signedMs(value) {
  if (!Number.isFinite(value)) return '—';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${Math.round(value)} ms`;
}
