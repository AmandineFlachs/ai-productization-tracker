// Firecrawl crawl runner for AI Productization Tracker.
//
// Setup:
//   npm install @mendable/firecrawl-js
//
// Run (PowerShell):
//   $env:FIRECRAWL_API_KEY = "fc-..."
//   node scripts/crawl.mjs
//
// Reads crawl_plan.json at the project root, scrapes/crawls each entry,
// and writes one markdown file per page to data/raw/<entity_id>/<slug>.md.

import Firecrawl from '@mendable/firecrawl-js';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLAN_PATH = join(ROOT, 'crawl_plan.json');
const OUT_ROOT = join(ROOT, 'data', 'raw');

const DEPTH1_PAGE_LIMIT = 30;
const DEPTH1_TIMEOUT_SEC = 300;
const MAX_AGE_DAYS = Number(process.env.CRAWL_MAX_AGE_DAYS ?? 7);
const FORCE = process.env.CRAWL_FORCE === '1';

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('FIRECRAWL_API_KEY env var is not set.');
  process.exit(1);
}

const firecrawl = new Firecrawl({ apiKey });

function slugify(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/+|\/+$/g, '');
    const base = path ? path.replace(/[^a-z0-9]+/gi, '-') : 'index';
    return base.toLowerCase().slice(0, 120);
  } catch {
    return 'page';
  }
}

function pageFilePath(entityId, sourceUrl) {
  return join(OUT_ROOT, entityId, `${slugify(sourceUrl)}.md`);
}

async function fileAgeDays(file) {
  try {
    const s = await stat(file);
    return (Date.now() - s.mtimeMs) / (1000 * 60 * 60 * 24);
  } catch {
    return Infinity;
  }
}

async function writePage(entityId, sourceUrl, markdown) {
  const dir = join(OUT_ROOT, entityId);
  await mkdir(dir, { recursive: true });
  const file = pageFilePath(entityId, sourceUrl);
  const header = `<!-- source: ${sourceUrl} -->\n<!-- fetched: ${new Date().toISOString()} -->\n\n`;
  await writeFile(file, header + (markdown ?? ''), 'utf-8');
  return file;
}

async function runSinglePage(entityId, url) {
  console.log(`  scrape  ${url}`);
  const res = await firecrawl.scrape(url, { formats: ['markdown'] });
  const md = res?.markdown ?? '';
  const src = res?.metadata?.sourceURL ?? res?.metadata?.url ?? url;
  await writePage(entityId, src, md);
  return 1;
}

async function runDepth1(entityId, url) {
  console.log(`  crawl   ${url}  (maxDiscoveryDepth=1, limit=${DEPTH1_PAGE_LIMIT})`);
  const job = await firecrawl.crawl(url, {
    limit: DEPTH1_PAGE_LIMIT,
    maxDiscoveryDepth: 1,
    pollInterval: 2,
    timeout: DEPTH1_TIMEOUT_SEC,
    scrapeOptions: { formats: ['markdown'] },
  });

  const pages = job?.data ?? [];
  for (const page of pages) {
    const src = page?.metadata?.sourceURL ?? page?.metadata?.url ?? url;
    await writePage(entityId, src, page?.markdown ?? '');
  }
  return pages.length;
}

async function handle(entityId, url, mode) {
  const existing = pageFilePath(entityId, url);
  const age = await fileAgeDays(existing);
  if (!FORCE && age < MAX_AGE_DAYS) {
    console.log(`  skip    ${url}  (cached ${age.toFixed(1)}d ago, max ${MAX_AGE_DAYS}d)`);
    return { fetched: 0, skipped: true };
  }
  try {
    const count = mode === 'depth_1'
      ? await runDepth1(entityId, url)
      : await runSinglePage(entityId, url);
    return { fetched: count, skipped: false };
  } catch (err) {
    console.error(`    error on ${url}: ${err?.message ?? err}`);
    return { fetched: 0, skipped: false };
  }
}

const plan = JSON.parse(await readFile(PLAN_PATH, 'utf-8'));
let total = 0;
let skipped = 0;

console.log(`max age: ${MAX_AGE_DAYS}d${FORCE ? '  (CRAWL_FORCE=1 — ignoring cache)' : ''}`);

for (const item of plan) {
  console.log(`\n=== ${item.entity_id} ===`);

  const home = await handle(item.entity_id, item.homepage_url, item.homepage_mode);
  total += home.fetched;
  skipped += home.skipped ? 1 : 0;
  if (!home.skipped) console.log(`    homepage: +${home.fetched} page(s)  | running total: ${total}`);

  const sec = await handle(item.entity_id, item.secondary_url, item.secondary_mode);
  total += sec.fetched;
  skipped += sec.skipped ? 1 : 0;
  if (!sec.skipped) console.log(`    secondary: +${sec.fetched} page(s) | running total: ${total}`);
}

console.log(`\nDone. ${total} page(s) written, ${skipped} URL(s) skipped (cache fresh).`);
