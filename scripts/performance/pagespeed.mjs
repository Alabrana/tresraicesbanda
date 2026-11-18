import path from 'node:path';
import { CATEGORIES, DEFAULT_PRODUCTION_URL, DEFAULT_TIMEOUT_MS, STRATEGIES } from './config.mjs';
import {
  extractFieldData,
  extractLabResult,
  extractOpportunities,
  extractResources,
  listOption,
  numberOption,
  parseArgs,
  prepareReportDirectory,
  saveSummary,
  slugify,
  writeJson,
} from './lib.mjs';

const options = parseArgs(process.argv.slice(2));
const targetUrl = new URL(options.url ?? DEFAULT_PRODUCTION_URL).href;
const strategies = listOption(options.strategies, STRATEGIES);
const timeoutMs = numberOption(options.timeout, DEFAULT_TIMEOUT_MS);
const reportRoot = path.resolve(options.output ?? 'reports/performance');
const label = options.label ?? 'production';
const apiKey = process.env.PAGESPEED_API_KEY;

for (const strategy of strategies) {
  if (!STRATEGIES.includes(strategy)) throw new Error(`Estrategia no soportada: ${strategy}`);
}

const directory = await prepareReportDirectory(reportRoot, label, 'pagespeed');
const measurements = [];
const errors = [];
let lighthouseVersion = null;

for (const strategy of strategies) {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', targetUrl);
  endpoint.searchParams.set('strategy', strategy);
  endpoint.searchParams.set('locale', 'es');
  CATEGORIES.forEach((category) => endpoint.searchParams.append('category', category));
  if (apiKey) endpoint.searchParams.set('key', apiKey);

  process.stdout.write(`PageSpeed ${strategy}: ${targetUrl}\n`);
  let response;
  try {
    response = await fetch(endpoint, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    const message = `PageSpeed no respondió: ${error.message}`;
    errors.push({ strategy, message });
    await writeJson(path.join(directory, 'raw', `${slugify(targetUrl)}-${strategy}-error.json`), { strategy, url: targetUrl, message });
    continue;
  }

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    const message = `PageSpeed devolvió una respuesta no JSON (${response.status}): ${text.slice(0, 300)}`;
    errors.push({ strategy, message });
    await writeJson(path.join(directory, 'raw', `${slugify(targetUrl)}-${strategy}-error.json`), { strategy, url: targetUrl, status: response.status, message, response: text });
    continue;
  }

  if (!response.ok) {
    const reason = payload.error?.message ?? `HTTP ${response.status}`;
    const quotaHint = response.status === 429 || /quota|rate/i.test(reason) ? ' (cuota o límite de frecuencia)' : '';
    const message = `PageSpeed falló: ${reason}${quotaHint}`;
    errors.push({ strategy, message, status: response.status });
    await writeJson(path.join(directory, 'raw', `${slugify(targetUrl)}-${strategy}-error.json`), payload);
    continue;
  }
  if (!payload.lighthouseResult) {
    const message = 'PageSpeed no incluyó Lighthouse en la respuesta.';
    errors.push({ strategy, message });
    await writeJson(path.join(directory, 'raw', `${slugify(targetUrl)}-${strategy}-error.json`), payload);
    continue;
  }

  await writeJson(path.join(directory, 'raw', `${slugify(targetUrl)}-${strategy}.json`), payload);
  const lhr = payload.lighthouseResult;
  lighthouseVersion ??= lhr.lighthouseVersion ?? null;
  measurements.push({
    url: targetUrl,
    strategy,
    successfulRuns: 1,
    lab: extractLabResult(lhr),
    field: extractFieldData(payload),
    opportunities: extractOpportunities(lhr),
    resources: extractResources(lhr),
  });
}

const summary = {
  schemaVersion: 1,
  source: 'pagespeed',
  label,
  createdAt: new Date().toISOString(),
  environment: {
    kind: 'producción / PageSpeed Insights API',
    baseUrl: targetUrl,
    strategies,
    categories: CATEGORIES,
    lighthouseVersion,
    runsPerRoute: 1,
    apiKeyUsed: Boolean(apiKey),
  },
  measurements,
  errors,
};

await saveSummary(directory, summary);
process.stdout.write(`Reporte guardado en ${directory}\n`);
if (errors.length > 0) process.exitCode = 1;
