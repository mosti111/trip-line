import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, resetJourney } from './verify-recovery-motion.mjs';

const base = process.env.QA_URL || 'http://localhost:3003';
const out = path.resolve(process.env.QA_OUT || '../tmp/v3-reconstruction/qa');
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
      const earlier=builder.locator('[data-stop=istanbul] [data-move="-1"]');
      await earlier.focus();await page.keyboard.press('Enter');
      await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya');
      await expect(builder.locator('[data-stop=istanbul] [data-move="1"]')).toBeFocused();
      await builder.locator('[data-stop=istanbul] button').last().focus();await page.keyboard.press('Enter');
      await expect(first).toBeFocused();await expect(builder.locator('input[name=journey]')).toHaveValue('antalya');
      report.cases.push({ locale, attempt, selectedBeforeKeyboard: 'antalya,istanbul', afterKeyboard: 'antalya', boundaryFocus: true, removalFocus: true });
    }
  }
  report.persistence=[];
  for(const locale of ['en','ar','tr']){
    await page.goto(`${base}/${locale}`,{waitUntil:'networkidle'});await resetJourney(page);
    const builder=page.locator('#journey-builder');await builder.locator('input[value=istanbul]').check();await builder.locator('input[value=antalya]').check();await builder.locator('#builder-service').selectOption('corporate');await page.reload({waitUntil:'networkidle'});
    await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya');await expect(builder.locator('#builder-service')).toHaveValue('corporate');
    expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('tripline-journey')))).toEqual({destinations:['istanbul','antalya'],journeyType:'corporate'});report.persistence.push({locale,ordered:'istanbul,antalya',journeyType:'corporate',cpuThrottle:4});
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
