import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, resetJourney } from './verify-recovery-motion.mjs';

const base = process.env.QA_URL || 'http://localhost:3003';
const out = path.resolve('../tmp/v3-reconstruction/qa');
fs.mkdirSync(out, { recursive: true });
const report = { startedAt: new Date().toISOString(), browser: 'Chromium', stage: 'full',  status: 'running', cpuThrottle: 4, cases: [], errors: [] };
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watchRuntime(page,report,'planner-4x');
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  for (const locale of ['en', 'ar', 'tr']) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
      await resetJourney(page);
      const builder = page.locator('#journey-builder');
      const first = builder.locator('input[type=checkbox][value=istanbul]');
      await first.check();
      await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul');
      await builder.locator('input[type=checkbox][value=antalya]').check();
      await first.uncheck();
      await expect(builder.locator('input[name=journey]')).toHaveValue('antalya');
      await first.check();
      await expect(builder.locator('input[name=journey]')).toHaveValue('antalya,istanbul');
      await expect(builder.locator('.rh-builder-preview>span')).toHaveText('02');
      report.cases.push({ locale, attempt, selected: 'antalya,istanbul' });
    }
  }
  expect(report.errors).toEqual([]);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  fs.writeFileSync(path.join(out, 'planner-throttled.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify(report));
}
