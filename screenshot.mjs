import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = parseInt(process.argv[4] || '1440', 10);
const height = parseInt(process.argv[5] || '900', 10);

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error('Chrome executable not found.');
  process.exit(1);
}

const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const existing = fs
  .readdirSync(outDir)
  .map((f) => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const next = existing.length ? Math.max(...existing) + 1 : 1;
const fileName = `screenshot-${next}${label ? `-${label}` : ''}.png`;
const outPath = path.join(outDir, fileName);

const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2200)); // let hero ledger animation finish

  // Scroll through the full page to trigger IntersectionObserver reveals.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 300));

  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} finally {
  await browser.close();
}
