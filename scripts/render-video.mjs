// Render docs/architecture.svg into an MP4 (and optional GIF) for sharing on
// social platforms that don't play SVG SMIL animations.
//
// Usage:  npm run render-video
//
// Strategy: launch a headless Chromium via Puppeteer, load the SVG, pause its
// SMIL animations, then step setCurrentTime() frame-by-frame and screenshot
// each frame. ffmpeg-static assembles the frames into an MP4 (yuv420p, libx264
// — broadly compatible with LinkedIn, X, etc.).

import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SVG_PATH = path.join(ROOT, 'docs', 'architecture.svg');
const OUT_MP4 = path.join(ROOT, 'docs', 'architecture.mp4');
const TMP_DIR = path.join(ROOT, 'docs', '.tmp-frames');

const FPS = 24;
const DURATION_S = 12;
const WIDTH = 1280;
const HEIGHT = 720;
const TOTAL_FRAMES = FPS * DURATION_S;

async function main() {
  if (!existsSync(SVG_PATH)) {
    console.error('Missing', SVG_PATH);
    process.exit(1);
  }

  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });

  console.log(`Launching browser, rendering ${TOTAL_FRAMES} frames…`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  await page.goto('file:///' + SVG_PATH.replace(/\\/g, '/'), { waitUntil: 'load' });

  // SVG SMIL: pause then step through with setCurrentTime
  await page.evaluate(() => {
    const svg = document.documentElement;
    if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
  });

  const t0 = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((time) => {
      document.documentElement.setCurrentTime(time);
    }, t);
    const file = path.join(TMP_DIR, `frame-${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: file, omitBackground: false, captureBeyondViewport: false });
    if (i % 24 === 0) process.stdout.write(`  ${i}/${TOTAL_FRAMES}\r`);
  }
  console.log(`  ${TOTAL_FRAMES}/${TOTAL_FRAMES} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  await browser.close();

  console.log('Assembling MP4 with ffmpeg…');
  await runFfmpeg([
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(TMP_DIR, 'frame-%04d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-movflags', '+faststart',
    OUT_MP4,
  ]);

  console.log('Cleaning up frames…');
  rmSync(TMP_DIR, { recursive: true, force: true });

  console.log('Wrote', OUT_MP4);
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    proc.on('error', reject);
    proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('ffmpeg exited ' + code))));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
