import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const locales = ['en', 'ar', 'tr'];
const places = ['istanbul','trabzon','rize-ayder','uzungol','antalya','bodrum','fethiye','marmaris','sapanca','bursa','yalova','cappadocia'];
const services = ['tours','hajj-umrah','camps','corporate','flights-hotels','tailor-made','events','training','visa-assistance'];
const countries = ['turkiye','georgia','egypt','saudi-arabia','oman','qatar','uae','maldives','malaysia','indonesia'];
const chapters = Array.from({ length: 15 }, (_, i) => String(i + 1).padStart(2, '0'));
const base = process.env.QA_URL || 'http://localhost:3003';

/** The explicit phase-two gate. Default entrypoint suites retain their motion requirements. */
export async function verifyRecoveryStatic(suite) {
  expect(['public', 'v3']).toContain(suite);
  const out = path.resolve('../tmp/frontend-qa/recovery-static', suite);
  fs.mkdirSync(out, { recursive: true });
  const report = { stage: 'static', suite, status: 'running', base, startedAt: new Date().toISOString(), browser: 'Chromium', routes: [], checks: [], cases: [], screens: [], errors: [], expectedCancellations: [], gaps: ['Full motion suite remains required after phase three; this gate asserts no canvas/pin.'] };
  const browser = await chromium.launch({ headless: true });
  const closingPages = new WeakSet();
  const closingVideo = new WeakMap();
  const operations = new WeakMap();
  const requestOperations = new WeakMap();
  const navigationPaths = new WeakMap();
  const failureTasks = [];
  const videoState = page => page.locator('video').evaluateAll(nodes => nodes.map(video => ({ paused: video.paused, decoded: video.videoWidth, mediaError: video.error?.code || null })));
  const pausedDecoded = states => states?.some(state => state.paused && state.decoded > 0 && state.mediaError === null);
  async function closePage(page) { await Promise.all(failureTasks); closingVideo.set(page, await videoState(page)); closingPages.add(page); await page.context().close(); await Promise.all(failureTasks); }
  function navigationKey(value) { const url = new URL(value); url.searchParams.delete('_rsc'); url.searchParams.sort(); return url.pathname + url.search; }
  async function recordVerifiedNavigation(page) { await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('h1')).toBeVisible(); const paths = navigationPaths.get(page) || new Set(); paths.add(navigationKey(page.url())); navigationPaths.set(page, paths); }
  async function navigate(page, method, ...args) { operations.set(page, { kind: 'explicit navigation', method }); try { const result = await page[method](...args); await recordVerifiedNavigation(page); return result; } finally { operations.delete(page); } }
  async function activateNavigation(page, action, expectedURL) { operations.set(page, { kind: 'explicit navigation', method: 'activate real link', expectedURL }); try { await action(); await page.waitForURL(expectedURL); await page.waitForLoadState('networkidle'); await recordVerifiedNavigation(page); } finally { operations.delete(page); } }
  function watch(page, name, javaScriptDisabled) {
    page.on('request', request => { const operation = operations.get(page); if (operation) requestOperations.set(request, operation); });
    page.on('pageerror', error => report.errors.push({ name, kind: 'pageerror', message: error.message }));
    page.on('console', message => { if (message.type() === 'error') report.errors.push({ name, kind: 'console', message: message.text() }); });
    page.on('requestfailed', request => {
      const url = new URL(request.url()), headers = request.headers(), message = request.failure()?.errorText;
      // History restoration may schedule its RSC request after the browser navigation promise resolves.
      // Retain only destinations with URL/H1 assertions in this fresh case, including non-RSC query.
      const operation = requestOperations.get(request) || operations.get(page) || (navigationPaths.get(page)?.has(navigationKey(url.href)) ? { kind: 'explicit navigation', method: 'verified harness navigation destination', destination: navigationKey(url.href) } : null);
      const record = { name, kind: 'requestfailed', url: request.url(), message, method: request.method(), resourceType: request.resourceType(), prefetch: headers['next-router-prefetch'] || null, rsc: headers.rsc || null, operation: operation || (closingPages.has(page) ? { kind: 'explicit context disposal' } : null) };
      const localAbort = message === 'net::ERR_ABORTED' && url.origin === new URL(base).origin && request.method() === 'GET';
      // Observed first run: Next cancels speculative RSC fetches as links leave the viewport/navigation closes them.
      // Keep their evidence, while every document/media/other network failure still fails the suite.
      if (message === 'net::ERR_ABORTED' && url.origin === new URL(base).origin && request.method() === 'GET' && request.resourceType() === 'fetch' && url.searchParams.has('_rsc') && headers.rsc === '1' && ['1','2','3'].includes(headers['next-router-prefetch'])) {
        report.expectedCancellations.push({ ...record, classification: 'Next speculative prefetch cancellation' });
      } else if (localAbort && request.resourceType() === 'fetch' && url.searchParams.has('_rsc') && headers.rsc === '1' && (operation?.kind === 'explicit navigation' || closingPages.has(page))) {
        report.expectedCancellations.push({ ...record, classification: 'Explicit harness navigation/disposal cancelled RSC stream' });
      } else if (localAbort && request.resourceType() === 'media' && url.pathname === '/media/istanbul-ferries.mp4' && (operation?.kind === 'deliberate offscreen scan' || closingPages.has(page))) {
        const task = (closingPages.has(page) ? Promise.resolve(closingVideo.get(page)) : videoState(page)).then(states => {
          if (pausedDecoded(states)) report.expectedCancellations.push({ ...record, video: states, classification: 'Deliberate offscreen scan/disposal cancelled decoded paused film stream' });
          else report.errors.push({ ...record, video: states });
        }).catch(error => report.errors.push({ ...record, inspectionError: String(error) }));
        failureTasks.push(task);
      } else if (javaScriptDisabled && message === 'csp' && url.origin === new URL(base).origin && request.method() === 'GET' && request.resourceType() === 'script' && /^\/_next\/static\/chunks\/[^/]+\.js$/.test(url.pathname)) {
        report.expectedCancellations.push({ ...record, classification: 'Explicit no-JavaScript context blocked script preload' });
      } else report.errors.push(record);
    });
  }
  async function newPage(name, options = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
    const page = await context.newPage();
    watch(page, name, options.javaScriptEnabled === false);
    return page;
  }
  async function goto(page, route) { await navigate(page, 'goto', base + route, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); }
  async function native(page) { await expect(page.locator('canvas')).toHaveCount(0); await expect(page.locator('.pin-spacer')).toHaveCount(0); }
  async function clean(page, name) {
    await expect(page.locator('h1'), name + ' H1').toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + ' overflow').toBe(true);
    expect(await page.evaluate(() => [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.currentSrc)), name + ' broken loaded images').toEqual([]);
  }
  async function home(page, locale) {
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    expect(await page.locator('.recovery-home [data-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.chapter))).toEqual(chapters);
    await expect(page.locator('.rh-world-plane')).toHaveCount(3);
    for (const plane of await page.locator('.rh-world-plane').all()) await expect(plane).toBeVisible();
    await expect(page.locator('.rt-index button')).toHaveCount(12);
    await expect(page.locator('.rh-services li a')).toHaveCount(9);
    await expect(page.locator('.rh-arrival .rh-actions a').first()).toHaveAttribute('href', `/${locale}/destinations/turkiye`);
    await expect(page.locator('.rh-beyond .journey-text-link')).toHaveAttribute('href', `/${locale}/destinations`);
    await expect(page.locator('.recovery-home [role=tab]')).toHaveCount(0);
    await native(page);
  }
  async function scan(page) {
    operations.set(page, { kind: 'deliberate offscreen scan' });
    try { await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 650) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => setTimeout(resolve, 40)); } scrollTo({ top: 0, behavior: 'instant' }); }); await page.waitForLoadState('networkidle'); await Promise.all(failureTasks); }
    finally { operations.delete(page); }
  }
  async function screenshot(page, name, details, fullPage = true) {
    const file = path.join(out, name + '.png');
    await page.screenshot({ path: file, fullPage });
    report.screens.push({ name, path: file, ...details });
  }
  async function check(name, action) { await action(); report.checks.push({ name, status: 'passed' }); console.log('PASS:', suite, name); }
  async function prepare(page, expectedName) {
    await page.locator('#inquiry-name').fill('Static QA');
    await page.locator('#inquiry-email').fill('static@example.com');
    await page.locator('#inquiry-consent').check();
    await page.locator('#inquiry form button[type=submit]').click();
    await expect(page.locator('.inquiry-result')).toBeVisible();
    const message = new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');
    expect(message).toContain('Static QA');
    if (expectedName) expect(message).toContain(expectedName);
    return message;
  }
  async function fallbacks() {
    for (const mode of ['reduced', 'saveData']) {
      const page = await newPage(mode, { reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
      if (mode === 'saveData') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }));
      await goto(page, '/en'); await home(page, 'en'); await page.locator('.rh-film').scrollIntoViewIfNeeded();
      await expect(page.locator('video[src]')).toHaveCount(0);
      expect(await page.locator('video').evaluateAll(nodes => nodes.every(video => video.paused))).toBe(true);
      await clean(page, mode); report.cases.push({ mode, locale: 'en', width: 1440, height: 1000 });
      await screenshot(page, mode, { mode, locale: 'en', width: 1440, height: 1000 }); await closePage(page);
    }
    for (const locale of locales) {
      const page = await newPage('nojs-' + locale, { javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      await goto(page, '/' + locale); await home(page, locale); await clean(page, 'nojs-' + locale);
      for (const chapter of await page.locator('.recovery-home [data-chapter]').all()) await expect(chapter.locator('h2').first()).toBeVisible();
      await expect(page.locator('#journey-builder form')).toBeVisible();
      await expect(page.locator('video[src]')).toHaveCount(0);
      await screenshot(page, 'nojs-' + locale, { mode: 'noJS', locale, width: 390, height: 844 });
      report.cases.push({ mode: 'noJS', locale, width: 390, height: 844, visibleChapterH2: 15, destinations: 12, services: 9 }); await closePage(page);
    }
  }
  try {
    if (suite === 'public') {
      await check('120 routes, branded 404 and preferred-language redirect', async () => {
        const context = await browser.newContext();
        const routes = ['', 'services', ...services.map(id => 'services/' + id), 'destinations', ...countries.map(id => 'destinations/' + id), 'business', 'about', 'contact', 'faq', 'privacy', 'terms', ...places.map(id => 'destinations/turkiye/' + id)];
        for (const locale of locales) for (const route of routes) {
          const url = `/${locale}/${route}`, response = await context.request.get(base + url), html = await response.text();
          expect(response.status(), url).toBe(200); expect(html).toContain(`lang="${locale}"`); expect((html.match(/<h1(?:\s|>)/g) || []).length, url + ' H1').toBe(1); report.routes.push(url);
        }
        const missing = await context.request.get(base + '/en/not-a-page'); expect(missing.status()).toBe(404); expect(await missing.text()).toContain('Trip Line');
        const redirect = await context.request.get(base + '/', { maxRedirects: 0, headers: { 'accept-language': 'ar-TR,ar;q=0.9,en;q=0.8' } }); expect(redirect.headers().location).toContain('/ar'); await context.close();
      });
      const page = await newPage('public-interactions');
      await check('Static chapters, primary Türkiye, secondary Beyond, index/map quickview, Explore and global Add', async () => {
        await goto(page, '/en'); await home(page, 'en');
        await page.locator('.rt-index button').filter({ hasText: 'Rize & Ayder' }).click(); await expect(page.locator('.rt-preview h3')).toHaveText('Rize & Ayder');
        await expect(page.locator('.rt-preview-actions a')).toHaveAttribute('href', '/en/destinations/turkiye/rize-ayder');
        await page.locator('.rt-desktop-map button[aria-label="Antalya"]').click(); await expect(page.locator('.rt-preview h3')).toHaveText('Antalya');
        await page.locator('.rt-preview-actions button').click(); await expect(page.locator('.header-journey')).toHaveText(/1/);
        await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('antalya');
        await activateNavigation(page, () => page.locator('.rt-preview-actions a').click(), '**/destinations/turkiye/antalya'); await expect(page.locator('h1')).toHaveText('Antalya');
      });
      await check('Grouped regional directory and PlanningBrief GET handoff; inquiry name/email/consent and stale output', async () => {
        await goto(page, '/en/destinations/turkiye'); await expect(page.locator('.rt-directory-row')).toHaveCount(12);
        await page.locator('.rt-filters').getByRole('button', { name: 'The Black Sea', exact: true }).click();
        await expect(page.locator('.rt-directory-group')).toHaveCount(1); await expect(page.locator('.rt-directory-row')).toHaveCount(3);
        expect(await page.locator('.rt-directory-row > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(['trabzon','rize-ayder','uzungol'].map(id => '/en/destinations/turkiye/' + id));
        await page.locator('.brief-fields select[name=destination]').selectOption('uzungol'); await page.locator('.brief-fields button').click(); await page.waitForURL('**/contact?**');
        await expect(page.locator('#inquiry-destination')).toHaveValue('uzungol'); await expect(page.locator('#inquiry-service')).toHaveValue('tours');
        const submit = page.locator('#inquiry form button[type=submit]'); await submit.click(); await expect(page.locator('#inquiry-name')).toBeFocused();
        await page.locator('#inquiry-name').fill('Static QA'); await submit.click(); await expect(page.locator('#inquiry-email')).toBeFocused();
        await page.locator('#inquiry-email').fill('invalid'); await submit.click(); await expect(page.locator('#inquiry-email')).toHaveAttribute('aria-invalid', 'true');
        await page.locator('#inquiry-email').fill('static@example.com'); await page.locator('#inquiry-message').fill('Please plan Uzungöl.'); await submit.click(); await expect(page.locator('#inquiry-consent')).toBeFocused();
        await prepare(page, 'Uzungöl'); await page.locator('#inquiry-message').fill('Updated inquiry'); await expect(page.locator('.inquiry-result')).toHaveCount(0);
      });
      await check('Locale preserves query, cookie persists, mobile menu and journey drawer have scoped Escape/focus return', async () => {
        const query = new URL(page.url()).search; await page.locator('.header .languages a[lang=ar]').click(); await expect(page.locator('html')).toHaveAttribute('dir', 'rtl'); expect(new URL(page.url()).search).toBe(query);
        await expect(page.locator('#inquiry-destination')).toHaveValue('uzungol'); await goto(page, '/'); expect(new URL(page.url()).pathname).toBe('/ar');
        await page.setViewportSize({ width: 390, height: 844 }); await page.locator('.menu-button').click(); await expect(page.locator('.nav-dialog')).toBeVisible(); await expect(page.locator('.journey-drawer')).not.toBeVisible();
        await page.keyboard.press('Escape'); await expect(page.locator('.nav-dialog')).not.toBeVisible(); await expect(page.locator('.menu-button')).toBeFocused();
        await page.setViewportSize({ width: 1440, height: 1000 }); await page.locator('.header-journey').click(); await expect(page.locator('.journey-drawer')).toBeVisible(); await expect(page.locator('.nav-dialog')).not.toBeVisible();
        await page.keyboard.press('Escape'); await expect(page.locator('.journey-drawer')).not.toBeVisible(); await expect(page.locator('.header-journey')).toBeFocused();
      });
      await check('Relocated Istanbul film decodes, plays, pauses/resumes, and pauses hidden/offscreen', async () => {
        await goto(page, '/en'); const film = page.locator('.rh-film'), video = film.locator('video'); await film.scrollIntoViewIfNeeded();
        await expect.poll(() => video.evaluate(node => node.videoWidth), { timeout: 15000 }).toBeGreaterThan(0); await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
        await film.getByRole('button', { name: 'Pause film', exact: true }).click(); await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
        await film.getByRole('button', { name: 'Play Istanbul film', exact: true }).click(); await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
        await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); }); await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
        await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); }); await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
        await page.locator('#journey-builder').scrollIntoViewIfNeeded(); await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
      });
      await closePage(page);
      await check('Six representative public templates: loaded images, H1, overflow and screenshots', async () => {
        for (const [name, route, width, height] of [['home','/en',1440,1000],['turkiye-desktop','/en/destinations/turkiye',1280,900],['turkiye-arabic','/ar/destinations/turkiye',390,844],['rize-mobile','/ar/destinations/turkiye/rize-ayder',360,800],['antalya-tablet','/tr/destinations/turkiye/antalya',768,1024],['contact','/en/contact?destination=trabzon',430,932]]) {
          const sample = await newPage(name, { viewport: { width, height } }); await goto(sample, route); await scan(sample); await clean(sample, name); if (name === 'home') await home(sample, 'en');
          await screenshot(sample, name, { route, width, height, mode: 'normal static' }); report.cases.push({ name, route, width, height, mode: 'normal static' }); await closePage(sample);
        }
      });
      await check('Reduced-motion, saveData and three-locale no-JS static fallback semantics', fallbacks);
    } else {
      await check('Global intents and ordered stops, keyboard boundary/remove focus, flexible dates/travelers, localized GET/messages and session privacy', async () => {
        for (const locale of locales) {
          const page = await newPage('journey-' + locale); await goto(page, '/' + locale); await home(page, locale);
          const builder = page.locator('#journey-builder'); await expect(builder.locator('input[name=journey]')).toHaveValue('');
          for (const [index, id] of ['tours','hajj-umrah','corporate'].entries()) { const control = page.locator('.rh-intent').nth(index); await control.focus(); await page.keyboard.press('Enter'); await expect(control).toHaveAttribute('aria-pressed', 'true'); await expect(page.locator('#builder-service')).toHaveValue(id); }
          for (const id of ['istanbul','cappadocia','antalya']) await builder.locator(`input[value="${id}"]`).check();
          const earlier = builder.locator('[data-stop="antalya"] [data-move="-1"]'); await earlier.focus(); await page.keyboard.press('Enter'); await expect(earlier).toBeFocused(); await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya,cappadocia');
          await page.keyboard.press('Enter'); await expect(builder.locator('[data-stop="antalya"] [data-move="1"]')).toBeFocused(); await expect(builder.locator('input[name=journey]')).toHaveValue('antalya,istanbul,cappadocia');
          const remove = builder.locator('[data-stop="antalya"] button').last(); await remove.focus(); await page.keyboard.press('Enter'); await expect(builder.locator('input[value="antalya"]')).toBeFocused();
          await builder.locator('input[value="antalya"]').check(); await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,cappadocia,antalya');
          await builder.locator('#builder-dates').fill('October 2027'); await expect(builder.locator('.rh-flexible input')).not.toBeChecked(); await builder.locator('.rh-flexible input').check(); await expect(builder.locator('#builder-dates')).toHaveValue('');
          await builder.locator('#builder-travelers').fill('4'); const date = await builder.locator('input[name=dates]').inputValue(); const names = await builder.locator('[data-stop] strong').allTextContents();
          const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tripline-journey'))); expect(Object.keys(stored).sort()).toEqual(['destinations','journeyType']); expect(stored).toEqual({ destinations: ['istanbul','cappadocia','antalya'], journeyType: 'corporate' });
          await builder.locator('button[type=submit]').click(); await page.waitForURL(`**/${locale}/contact?**`); const query = new URL(page.url()).searchParams;
          expect(query.get('journey')).toBe('istanbul,cappadocia,antalya'); expect(query.get('destination')).toBe('istanbul'); expect(query.get('service')).toBe('corporate'); expect(query.get('dates')).toBe(date); expect(query.get('travelers')).toBe('4');
          await expect(page.locator('#inquiry-message')).toHaveValue(new RegExp(names.join(' → '))); await expect(page.locator('#inquiry-dates')).toHaveValue(date); await expect(page.locator('#inquiry-travelers')).toHaveValue('4');
          const prepared = await prepare(page, names.join(' → ')); expect(prepared).toContain(names.join(' → ')); await page.locator('#inquiry-dates').fill('June 2027'); await expect(page.locator('.inquiry-result')).toHaveCount(0);
          const search = new URL(page.url()).search; const nextLocale = locale === 'ar' ? 'tr' : 'ar'; await page.locator(`.header .languages a[lang=${nextLocale}]`).click(); expect(new URL(page.url()).search).toBe(search); await expect(page.locator('#inquiry-destination')).toHaveValue('istanbul'); await expect(page.locator('#inquiry-service')).toHaveValue('corporate');
          const translated = []; for (const id of ['istanbul','cappadocia','antalya']) translated.push(await page.locator(`#inquiry-destination option[value="${id}"]`).textContent());
          await expect(page.locator('#inquiry-message')).toHaveValue(new RegExp(translated.join(' → '))); await prepare(page, translated.join(' → ')); await page.locator('#inquiry-travelers').fill('5'); await expect(page.locator('.inquiry-result')).toHaveCount(0);
          await goto(page, '/' + locale); await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('istanbul,cappadocia,antalya'); await expect(page.locator('#builder-service')).toHaveValue('corporate'); await expect(page.locator('#builder-travelers')).toHaveValue(''); await expect(page.locator('#builder-dates')).toHaveValue('');
          report.cases.push({ mode: 'journey keyboard/GET/session', locale, width: 1440, height: 1000 }); await closePage(page);
        }
      });
      await check('Unknown/duplicate IDs and invalid travelers sanitized; signature navigation/back/forward/refresh', async () => {
        const page = await newPage('navigation'); await goto(page, '/en/contact?journey=fake,antalya,antalya,istanbul&travelers=-1'); await expect(page.locator('#inquiry-message')).toHaveValue(/Antalya → Istanbul/); await expect(page.locator('#inquiry-travelers')).toHaveValue('');
        await goto(page, '/en'); await activateNavigation(page, () => page.locator('.rh-signature-image').first().click(), '**/cappadocia'); await expect(page.locator('h1')).toHaveText('Cappadocia'); await navigate(page, 'reload', { waitUntil: 'networkidle' }); await expect(page.locator('h1')).toHaveText('Cappadocia'); await navigate(page, 'goBack', { waitUntil: 'networkidle' }); await expect(page.locator('#journey-builder')).toBeAttached(); await navigate(page, 'goForward', { waitUntil: 'networkidle' }); await expect(page.locator('h1')).toHaveText('Cappadocia'); await closePage(page);
      });
      await check('All nine service links keyboard-operable and route-valid in three locales', async () => {
        for (const locale of locales) {
          const page = await newPage('services-' + locale); await goto(page, '/' + locale); const links = page.locator('.rh-services li a');
          expect((await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).sort()).toEqual(services.map(id => `/${locale}/services/${id}`).sort());
          for (let i = 0; i < 9; i++) { const link = links.nth(i), target = await link.getAttribute('href'); await link.focus(); await expect(link).toBeFocused(); await activateNavigation(page, () => page.keyboard.press('Enter'), base + target); await expect(page.locator('h1')).toBeVisible(); await navigate(page, 'goBack', { waitUntil: 'networkidle' }); }
          await closePage(page);
        }
      });
      await check('Manual map/index selection resists guide; delayed Yalova retains last decoded preview with at most two images', async () => {
        const page = await newPage('preview'); await page.route('**/*', async route => { if (decodeURIComponent(route.request().url()).includes('/media/yalova.jpg')) await new Promise(resolve => setTimeout(resolve, 2500)); await route.continue(); });
        await goto(page, '/en'); const explorer = page.locator('.rt-explorer'); await explorer.scrollIntoViewIfNeeded();
        await expect.poll(() => explorer.locator('.rt-preview-image[data-active=true] img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
        await explorer.locator('.rt-index button').filter({ hasText: 'Yalova' }).click(); await expect(explorer.locator('.rt-preview h3')).toHaveText('Yalova');
        expect(await explorer.locator('.rt-preview-image').count()).toBeLessThanOrEqual(2); await expect(explorer.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('src', /istanbul/);
        await page.waitForTimeout(500); await expect(explorer.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('src', /istanbul/);
        await expect.poll(() => explorer.locator('.rt-preview-image[data-active=true] img').getAttribute('src'), { timeout: 5000 }).toContain('yalova');
        await expect.poll(() => explorer.locator('.rt-preview-image').count()).toBe(1); await expect.poll(() => explorer.locator('.rt-preview-image[data-active=true] img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
        await explorer.locator('.rt-desktop-map button[aria-label="Antalya"]').click(); await page.evaluate(() => dispatchEvent(new CustomEvent('bronze-place', { detail: 'trabzon' }))); await expect(explorer.locator('.rt-preview h3')).toHaveText('Antalya');
        await explorer.locator('.rt-index button').filter({ hasText: 'Bursa' }).click(); await page.evaluate(() => dispatchEvent(new CustomEvent('bronze-place', { detail: 'istanbul' }))); await expect(explorer.locator('.rt-preview h3')).toHaveText('Bursa'); await page.waitForLoadState('networkidle'); expect(await explorer.locator('.rt-preview-image').count()).toBeLessThanOrEqual(2); await closePage(page);
      });
      await check('Six static locale/width screenshots, 55–65% opening ratio and natural Arabic geography/images', async () => {
        let mapShape;
        for (const locale of locales) for (const width of [1440,390]) {
          const height = width === 390 ? 844 : 1000, name = `home-${locale}-${width}`, page = await newPage(name, { viewport: { width, height }, hasTouch: width === 390, isMobile: width === 390 });
          await goto(page, '/' + locale); await home(page, locale); await scan(page); await clean(page, name);
          const heights = await page.locator('.recovery-home [data-chapter]').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height)); const ratio = heights.slice(0,6).reduce((a,b) => a+b,0) / heights.reduce((a,b) => a+b,0); expect(ratio, name + ' first six proportion').toBeGreaterThanOrEqual(.55); expect(ratio, name + ' first six proportion').toBeLessThanOrEqual(.65);
          const shape = await page.locator('.rt-desktop-map .rt-boundary path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d'))); expect(shape.length, name + ' geographic paths').toBeGreaterThan(0); if (!mapShape) mapShape = shape; expect(shape).toEqual(mapShape);
          expect(await page.locator('.rt-map').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).direction === 'ltr'))).toBe(true);
          expect(await page.locator('.recovery-home img,.rt-map svg').evaluateAll(nodes => nodes.every(node => { for (let current = node; current && current !== document.querySelector('.recovery-home'); current = current.parentElement) { const transform = getComputedStyle(current).transform; if (transform !== 'none' && new DOMMatrixReadOnly(transform).a < 0) return false; } return true; }))).toBe(true);
          await screenshot(page, name, { locale, width, height, mode: 'normal static', firstSixRatio: ratio }); report.cases.push({ name, locale, width, height, mode: 'normal static', firstSixRatio: ratio, chapterHeights: heights }); await closePage(page);
        }
      });
      await check('Hero glyph bounds and profile figure gutters at 360/430 in all locales', async () => {
        for (const locale of locales) for (const width of [360,430]) {
          const page = await newPage(`bounds-${locale}-${width}`, { viewport: { width, height: 844 } }); await goto(page, '/' + locale);
          const bounds = await page.locator('.rh-arrival h1').evaluate(node => { const range = document.createRange(); range.selectNodeContents(node); const outer = node.closest('.rh-arrival').getBoundingClientRect(); return [...range.getClientRects()].every(rect => rect.left >= outer.left - 1 && rect.right <= outer.right + 1 && rect.top >= outer.top - 1 && rect.bottom <= outer.bottom + 1); }); expect(bounds, `${locale}/${width} hero`).toBe(true);
          expect(await page.locator('.rh-figure strong').evaluateAll(nodes => nodes.every(node => { const range = document.createRange(); range.selectNodeContents(node); const rect = range.getBoundingClientRect(), outer = node.closest('.rh-wrap').getBoundingClientRect(); return rect.left >= outer.left - 1 && rect.right <= outer.right + 1; })), `${locale}/${width} figures`).toBe(true);
          const heights = await page.locator('.recovery-home [data-chapter]').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height)); const firstSixRatio = heights.slice(0,6).reduce((a,b) => a+b,0) / heights.reduce((a,b) => a+b,0);
          await clean(page, `bounds-${locale}-${width}`); await screenshot(page, `bounds-${locale}-${width}`, { locale, width, height: 844, mode: 'hero/figure bounds' }, false); report.cases.push({ locale, width, height: 844, mode: 'hero/figure bounds', firstSixRatio }); await closePage(page);
        }
      });
      await check('Native touch 390/1280 and short 1280×600: no pin/canvas', async () => {
        for (const [width,height,touch] of [[390,844,true],[1280,900,true],[1280,600,false]]) {
          const page = await newPage(`native-${width}-${height}`, { viewport: { width,height }, hasTouch: touch, isMobile: touch }); await goto(page, '/ar'); if (touch) {
            expect(await page.evaluate(() => matchMedia('(pointer:coarse)').matches)).toBe(true); await page.locator('#journey-builder input[value=istanbul]').tap(); await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('istanbul');
            if (width === 390) { await page.locator('.menu-button').tap(); await expect(page.locator('.nav-dialog')).toBeVisible(); await page.locator('.nav-dialog .dialog-header button').tap(); await expect(page.locator('.nav-dialog')).not.toBeVisible(); }
            else { await expect(page.locator('.menu-button')).not.toBeVisible(); await expect(page.locator('.desktop-nav')).toBeVisible(); const toggle = page.locator('.nav-turkiye-link button'); await toggle.tap(); await expect(page.locator('.turkiye-mega')).toBeVisible(); await toggle.tap(); await expect(page.locator('.turkiye-mega')).not.toBeVisible(); }
          } await native(page); await home(page, 'ar'); await scan(page); await clean(page, `native-${width}-${height}`); report.cases.push({ locale: 'ar',width,height,mode: touch ? 'touch/native static' : 'short/fine native static' }); await closePage(page);
        }
      });
      await check('Reduced-motion, saveData and three-locale no-JS static fallback semantics', fallbacks);
    }
    await Promise.all(failureTasks); expect(report.errors, 'Unexpected browser errors/failed requests').toEqual([]);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed'; report.failure = String(error); throw error;
  } finally {
    report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2)); await browser.close();
    console.log(JSON.stringify({ stage: report.stage, suite, status: report.status, routes: report.routes.length, checks: report.checks.length, cases: report.cases.length, screenshots: report.screens.length, errors: report.errors, expectedCancellations: report.expectedCancellations.length, failure: report.failure }, null, 2));
  }
}
