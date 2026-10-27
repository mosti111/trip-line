import { chromium, webkit, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.QA_URL || 'http://localhost:3039';
const out = path.resolve(process.env.QA_OUT || '../tmp/frontend-qa/tl014/motion');
const widths = process.env.QA_WIDTHS ? JSON.parse(process.env.QA_WIDTHS) : [320, 390, 768];
fs.mkdirSync(out, { recursive: true });
const report = { status: 'running', base, cases: [], effects: [], fallbacks: [], errors: [], limitations: ['Windows Playwright WebKit is not physical iPhone Safari. Mobile WebKit automation lacks swipe/wheel input: scroll proof uses window.scrollBy on a touch-enabled viewport plus touchscreen taps; Chromium uses native CDP touch input.'] };

async function mode(page, choice, effective) {
  await expect(page.locator('html')).toHaveAttribute('data-motion-choice', choice);
  await expect(page.locator('html')).toHaveAttribute('data-motion-effective', effective);
  await expect(page.locator('html')).toHaveAttribute('data-motion-layout', effective === 'full' ? 'motion' : 'static');
  await expect(page.locator('.v6-home')).toHaveAttribute('data-home-motion', effective === 'full' ? 'native' : 'static');
  await expect(page.locator('.footer .motion-choice select')).toHaveValue(choice);
}
function watch(page) {
  page.on('pageerror', error => report.errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
}
async function observe(context) {
  await context.addInitScript(() => {
    window.__motionModes = [];
    new MutationObserver(() => {
      const root = document.documentElement;
      if (!root?.dataset.motionEffective) return;
      const value = [root.dataset.motionChoice, root.dataset.motionEffective, root.dataset.motionLayout].join('/');
      if (window.__motionModes.at(-1) !== value) window.__motionModes.push(value);
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-motion-choice', 'data-motion-effective', 'data-motion-layout'] });
  });
}
async function stableInitialization(page, expected) {
  const modes = await page.evaluate(() => window.__motionModes);
  expect(modes.length).toBeGreaterThan(0);
  expect(modes.every(value => value === expected), JSON.stringify(modes)).toBe(true);
  return modes;
}

try {
  for (const [engine, driver] of [['chromium', chromium], ['webkit', webkit]]) {
    if (process.env.QA_ENGINE && process.env.QA_ENGINE !== engine) continue;
    const browser = await driver.launch();
    try {
      for (const width of widths) for (const locale of ['en', 'ar', 'tr']) {
        const height = width === 768 ? 1024 : 844;
        const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
        await observe(context);
        const page = await context.newPage(); watch(page);
        const key = `${engine}-${locale}-${width}`;
        await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
        await mode(page, 'full', 'full');
        const initial = await stableInitialization(page, 'full/full/motion');
        expect(await page.evaluate(() => localStorage.getItem('tripline-motion'))).toBe(null);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        await expect(page.locator('.rh-arrival')).toHaveAttribute('data-entry', 'done');
        // Chromium supports native touch dispatch. Playwright mobile WebKit lacks
        // swipe/wheel dispatch, so its scroll sampling cannot certify touch swipes.
        const cdp = engine === 'chromium' ? await context.newCDPSession(page) : null;
        const scroll = async () => {
          if (cdp) {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width / 2, y: height - 100 }] });
            for (let i = 1; i <= 14; i++) {
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: width / 2, y: height - 100 - i * 30 }] });
              await page.waitForTimeout(18);
            }
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          } else { await page.evaluate(() => scrollBy({ top: 420, behavior: 'instant' })); }
          await page.waitForTimeout(300);
        };
        for (const [name, trigger, target] of [
          ['hero', '.rh-arrival', '.rh-arrival-photo'],
          ['explorer', '.atlas-stage', width < 768 ? '.rt-preview-media' : '.rt-preview'],
          ['cappadocia', '.rh-signature-0', '.rh-signature-0 .v61-landscape-frame'],
          ['rize', '.rh-signature-1', '.rh-signature-1 .v61-landscape-frame'],
          ['antalya', '.rh-signature-2', '.rh-signature-2 .v61-landscape-frame'],
        ]) {
          await page.locator(trigger).evaluate((node, hero) => scrollTo({ top: hero ? 0 : scrollY + node.getBoundingClientRect().top - innerHeight * .8, behavior: 'instant' }), name === 'hero');
          await page.waitForTimeout(300);
          const sample = () => page.locator(target).evaluate(node => { const css = getComputedStyle(node); const matrix = css.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(css.transform); return { clip: css.clipPath, transform: css.transform, scalePercentX: Math.hypot(matrix.m11, matrix.m12) * 100, scalePercentY: Math.hypot(matrix.m21, matrix.m22) * 100 }; });
          const before = await sample(), y = await page.evaluate(() => scrollY);
          // Mobile WebKit's screenshot synchronizer injects an unnonced empty
          // stylesheet. Keep strict CSP checks in this run; capture it separately.
          if (width === 390 && engine === 'chromium') await page.screenshot({ path: path.join(out, `${key}-${name}-before.png`) });
          await scroll();
          const after = await sample();
          const distance = await page.evaluate(() => scrollY) - y;
          expect(distance, key + ' native scroll').toBeGreaterThan(100);
          const numbers = value => (JSON.stringify(value).match(/-?\d*\.?\d+/g) || []).map(Number);
          const a = numbers(before), b = numbers(after);
          const delta = Math.max(...a.map((value, index) => Math.abs(value - (b[index] ?? value))));
          expect(delta, key + ' ' + name + ' meaningful CSS change').toBeGreaterThan(1);
          if (width === 390 && engine === 'chromium') await page.screenshot({ path: path.join(out, `${key}-${name}-after.png`) });
          report.effects.push({ engine, locale, width, name, before, after, delta, scrollDistance: distance, input: cdp ? 'native Chromium CDP touch' : 'WebKit programmatic native scrolling on touch viewport' });
        }
        await page.locator('.v61-network').scrollIntoViewIfNeeded();
        const network = page.locator('.v61-network'), track = page.locator('.v61-billboard-track');
        await expect(network).toHaveAttribute('data-running', 'true');
        const position = () => track.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41);
        const moving = await position(); await page.waitForTimeout(350);
        expect(Math.abs(await position() - moving)).toBeGreaterThan(3);
        await network.locator('button').tap(); await expect(network).toHaveAttribute('data-user-paused', 'true');
        await expect(network).toHaveAttribute('data-running', 'false');
        const paused = await position(); await page.waitForTimeout(250);
        expect(Math.abs(await position() - paused)).toBeLessThan(1);
        await network.locator('button').tap(); await expect(network).toHaveAttribute('data-user-paused', 'false');
        report.effects.push({ engine, locale, width, name: 'billboard', movement: 'over 3px in 350ms', pause: 'under 1px drift in 250ms' });
        // Both selectors remain reachable and change the same persisted policy.
        await page.locator('.menu-button').tap();
        const menuControl = page.locator('.nav-dialog .motion-choice select');
        await expect(menuControl).toBeVisible(); await expect(menuControl).toHaveValue('full');
        await menuControl.selectOption('reduced');
        await page.locator('.nav-dialog .dialog-header button').tap();
        await page.reload({ waitUntil: 'networkidle' }); await mode(page, 'reduced', 'reduced');
        const reduced = await stableInitialization(page, 'reduced/reduced/static');
        await page.emulateMedia({ reducedMotion: 'no-preference' }); await mode(page, 'reduced', 'reduced');
        await page.locator('.footer .motion-choice select').selectOption('system'); await mode(page, 'system', 'full');
        await page.emulateMedia({ reducedMotion: 'reduce' }); await mode(page, 'system', 'reduced');
        await page.reload({ waitUntil: 'networkidle' }); await mode(page, 'system', 'reduced');
        const system = await stableInitialization(page, 'system/reduced/static');
        await page.emulateMedia({ reducedMotion: 'no-preference' }); await mode(page, 'system', 'full');
        await page.locator('.footer .motion-choice select').selectOption('full');
        await page.emulateMedia({ reducedMotion: 'reduce' }); await mode(page, 'full', 'full');
        await page.reload({ waitUntil: 'networkidle' }); await mode(page, 'full', 'full');
        const nextLocale = locale === 'en' ? 'ar' : locale === 'ar' ? 'tr' : 'en';
        await page.locator('.menu-button').tap();
        await page.locator(`.nav-dialog .languages a[lang=${nextLocale}]`).tap();
        await page.waitForURL(`**/${nextLocale}`); await mode(page, 'full', 'full');
        expect(await page.evaluate(() => localStorage.getItem('tripline-motion'))).toBe('full');
        report.cases.push({ engine, version: browser.version(), locale, width, osReduced: true, fresh: 'full', initial, reduced, system, persistence: 'Reduced/System/Full reload and Full locale change pass', selectors: 'menu and footer', billboardPause: true });
        await context.close();
        const fresh = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' });
        await observe(fresh); const plain = await fresh.newPage(); watch(plain);
        await plain.goto(`${base}/${locale}`, { waitUntil: 'networkidle' }); await mode(plain, 'full', 'full');
        report.cases.push({ engine, locale, width, osReduced: false, fresh: 'full', initialization: await stableInitialization(plain, 'full/full/motion') });
        await fresh.close(); console.log('TL014 PASS', key);
      }
      const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
      await fallback.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return String(type).includes('webgl') ? null : get.call(this, type, ...args); }; });
      const page = await fallback.newPage(); watch(page); await page.goto(base + '/en', { waitUntil: 'networkidle' });
      await mode(page, 'full', 'full'); await expect(page.locator('h1')).toBeVisible(); await expect(page.locator('.flight-trace-arrival')).toBeVisible(); await expect(page.locator('canvas')).toHaveCount(0);
      await page.locator('.rh-film-frame video').evaluate(video => video.dispatchEvent(new Event('error')));
      await expect(page.locator('.rh-film-frame>.photo')).toBeVisible();
      report.fallbacks.push({ engine, unavailableWebGL: 'readable SVG/content', failedFilm: 'photo retained' }); await fallback.close();
    } finally { await browser.close(); }
  }
  expect(report.errors).toEqual([]); report.status = 'passed';
} catch (error) { report.status = 'failed'; report.failure = String(error); throw error; }
finally { report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ status: report.status, cases: report.cases.length, effects: report.effects.length, errors: report.errors.length, failure: report.failure })); }
