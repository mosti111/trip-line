import { chromium, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.QA_URL || 'http://localhost:3003';
const out = path.resolve(process.env.QA_OUT || '../tmp/frontend-qa/baseline');
fs.mkdirSync(out, { recursive: true });
const previous = process.env.QA_COMPARE ? JSON.parse(fs.readFileSync(process.env.QA_COMPARE, 'utf8')) : null;
const report = { status: 'running', base, mode: 'saved Reduced, OS reduce, settled homepage viewport', cases: [], errors: [] };
const browser = await chromium.launch();
try {
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    for (const locale of ['en', 'ar', 'tr']) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      await context.addInitScript(() => localStorage.setItem('tripline-motion', 'reduced'));
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push(String(error)));
      await page.goto(base + '/' + locale, { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('data-motion-effective', 'reduced');
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.evaluate(() => [...document.images].filter(i => {
        const box = i.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
      }).every(i => i.complete && i.naturalWidth > 0)), { timeout: 15000 }).toBe(true);
      await page.waitForTimeout(600);
      const name = locale + '-' + width;
      const png = await page.screenshot({ path: path.join(out, name + '.png'), animations: 'disabled' });
      const item = { name, locale, width, height, title: await page.title(), h1: await page.locator('h1').innerText(), pngSha256: createHash('sha256').update(png).digest('hex') };
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (previous) {
        const baseline = previous.cases.find(x => x.name === name);
        expect(baseline, name + ' baseline exists').toBeTruthy();
        expect(item, name + ' exact settled viewport/semantics').toEqual(baseline);
      }
      report.cases.push(item);
      await context.close();
    }
  }
  expect(report.errors).toEqual([]);
  report.status = 'pass';
} catch (error) {
  report.status = 'fail'; report.failure = String(error); process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}
