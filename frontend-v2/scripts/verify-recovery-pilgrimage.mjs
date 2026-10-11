import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { watchRuntime } from './verify-recovery-motion.mjs';

const locales = ['en', 'ar', 'tr'];
const sourceFiles = ['components/services/PilgrimageExperience.tsx', 'components/travel/Pages.tsx',
  'styles/recovery-pilgrimage.css', 'components/services/ServicePrimitives.tsx',
  'lib/travel-content.ts', 'lib/company-profile.ts', 'lib/turkiye.ts', 'lib/journey.ts',
  'scripts/verify-recovery-pilgrimage.mjs'];
const parse = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
function unwrap(node) {
  while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}
const declaration = (file, name) => unwrap(file.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(node => node.name.getText() === name).initializer);
const uiNode = declaration(parse('lib/i18n.ts'), 'ui');
function sourceValue(node) {
  node = unwrap(node);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(sourceValue);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Unsupported immutable source property');
    return [property.name.getText().replaceAll("'", ''), sourceValue(property.initializer)];
  }));
  if (ts.isCallExpression(node) && node.expression.getText() === 't') {
    const [en, ar, tr] = node.arguments.map(sourceValue); return { en, ar, tr };
  }
  if (ts.isPropertyAccessExpression(node) && node.expression.getText() === 'ui') return sourceValue(uiNode.properties.find(property => property.name.getText() === node.name.text).initializer);
  throw new Error('Unsupported immutable source expression ' + node.getText());
}
const services = sourceValue(declaration(parse('lib/travel-content.ts'), 'services'));
const service = services.find(item => item.slug === 'hajj-umrah');
const places = sourceValue(declaration(parse('lib/turkiye.ts'), 'turkishPlaces'));
const profile = sourceValue(declaration(parse('lib/company-profile.ts'), 'companyProfile'));
const profileFigures = sourceValue(declaration(parse('lib/company-profile.ts'), 'profileFigures'));
const intentCopy = sourceValue(declaration(parse('components/services/PilgrimageExperience.tsx'), 'copy'));
const hooks = { root: '.recovery-pilgrimage', summary: '[data-pilgrimage-summary]', points: '[data-pilgrimage-points] li p',
  brief: '[data-pilgrimage-source-brief]', question: '.rp-needs h3', answer: '[data-pilgrimage-answer]',
  processTitles: '.rp-process li h3', processBodies: '.rp-process li p', profileSource: '[data-pilgrimage-trust] small' };
const chapterIds = ['hero', 'choice', 'coordination', 'needs', 'process', 'trust', 'plan', 'continue'];
const kickerSelector = '.rp-choice .rp-kicker,.rp-coordination .rp-kicker,.rp-needs .rp-kicker,.rp-process .rp-kicker,.rp-trust .rp-kicker';
const uiFact = key => sourceValue(uiNode.properties.find(property => property.name.getText() === key).initializer);
expect(service.audience).toBe('pilgrimage'); expect(service.points).toHaveLength(3);
expect(service.related).toEqual(['flights-hotels', 'visa-assistance', 'tailor-made']);
for (const locale of locales) {
  for (const fact of [service.title, service.headline, service.summary, service.intro, service.brief, service.question, service.answer, ...service.points]) expect(fact[locale].trim().length).toBeGreaterThan(0);
  expect(profile.sourceLabel[locale].length).toBeGreaterThan(0);
}
const route = locale => `/${locale}/services/hajj-umrah`;
const placeName = (id, locale) => places.find(place => place.slug === id).name[locale];
const journeyMessage = (ids, locale) => ids.length ? `${{ en: 'Places I would like to visit', ar: 'الأماكن التي أرغب في زيارتها', tr: 'Ziyaret etmek istediğim yerler' }[locale]}: ${ids.map(id => placeName(id, locale)).join(' → ')}` : '';
const fingerprints = () => Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));

export function createReport() {
  const startedAt = new Date().toISOString(), artifacts = path.resolve('../tmp/frontend-qa/recovery-pilgrimage', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
  fs.mkdirSync(artifacts, { recursive: true });
  return { status: 'running', startedAt, artifacts, base: process.env.QA_URL || 'http://localhost:3003',
    revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sourceFingerprints: fingerprints(),
    browser: 'Chromium', cases: [], screens: [], errors: [], checks: [],
    gaps: ['Independent rendered Astra review/final Q12 remain required; no Safari/Firefox, physical-device, assistive-technology or field-performance certification.'] };
}
export function checkpoint(report, phase) {
  const progress = { status: 'running', phase, cases: report.cases.length, screens: report.screens.length, errors: report.errors.length, at: new Date().toISOString(), artifacts: report.artifacts };
  fs.writeFileSync(path.join(report.artifacts, 'progress.json'), JSON.stringify(progress, null, 2)); console.log(JSON.stringify(progress));
}
export async function fresh(browser, report, locale, width, height, options = {}) {
  const { initScript, ...contextOptions } = options;
  report.activeCase = { locale, width, height, mode: options.javaScriptEnabled === false ? 'noJS' : options.reducedMotion === 'reduce' ? 'reduced' : 'normal', step: 'direct pilgrimage route' };
  const context = await browser.newContext({ viewport: { width, height }, ...contextOptions });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage(), css = [], pending = [], mutations = [], requestedScripts = [];
  watchRuntime(page, report, `${locale}-${width}-pilgrimage`);
  page.on('request', request => {
    if (request.resourceType() === 'script') requestedScripts.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) mutations.push({ method: request.method(), url: request.url() });
  });
  page.on('response', response => { if (response.status() === 200 && response.url().includes('.css')) pending.push(response.text().then(body => css.push({ url: response.url(), ownedPilgrimage: body.includes('.recovery-pilgrimage') }))); });
  await page.goto(report.base + route(locale), { waitUntil: 'networkidle' }); await Promise.all(pending);
  expect(css.some(item => item.ownedPilgrimage), 'fresh route loads explicit owned pilgrimage CSS').toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', locale); await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('canvas,.pin-spacer')).toHaveCount(0);
  return { context, page, css, mutations, requestedScripts };
}
export async function bounds(page) {
  const state = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth,
    brokenImages: [...document.images].filter(image => image.complete && image.currentSrc && !image.naturalWidth).map(image => image.currentSrc) }));
  expect(state.documentWidth).toBeLessThanOrEqual(state.width + 1); expect(state.brokenImages).toEqual([]); return state;
}
export async function capture(page, report, name) {
  await bounds(page); const file = path.join(report.artifacts, name + '.png'); await page.screenshot({ path: file });
  report.screens.push({ name, path: file, url: page.url(), viewport: page.viewportSize(), at: new Date().toISOString() });
}
export async function naturalMedia(root) {
  const images = await root.locator('img').evaluateAll(nodes => nodes.map(image => {
    let natural = true;
    for (let node = image; node && node.tagName !== 'BODY'; node = node.parentElement) { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); if (matrix.a <= 0 || matrix.d <= 0) natural = false; }
    return { src: image.currentSrc, natural, complete: image.complete, width: image.naturalWidth };
  }));
  for (const image of images) expect(image.natural, 'photography remains naturally oriented').toBe(true); return images;
}
export async function keyboardVisible(page, control) {
  await control.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(control).toBeFocused();
  const geometry = node => {
    const rect = node.getBoundingClientRect(), header = document.querySelector('.header').getBoundingClientRect(), css = getComputedStyle(node);
    const sticky = document.querySelector('.mobile-plan[data-visible]'), stickyRect = sticky?.getBoundingClientRect(), stickyCss = sticky && getComputedStyle(sticky);
    const painted = !!(stickyRect && stickyCss.display !== 'none' && stickyCss.visibility === 'visible' && Number(stickyCss.opacity) > 0 && sticky.getClientRects().length && stickyRect.width > 0 && stickyRect.height > 0);
    return { top: rect.top, bottom: rect.bottom, headerBottom: header.bottom, viewportHeight: innerHeight,
      unobscured: rect.top >= header.bottom - 1 && rect.bottom <= innerHeight + 1 && (!painted || rect.bottom <= stickyRect.top + 1),
      focusVisible: node.matches(':focus-visible'), outlineWidth: Number.parseFloat(css.outlineWidth), outlineStyle: css.outlineStyle, shadow: css.boxShadow,
      mobileCTA: sticky ? { painted, display: stickyCss.display, visibility: stickyCss.visibility, width: stickyRect.width, height: stickyRect.height, top: stickyRect.top } : null };
  };
  await expect.poll(() => control.evaluate(geometry)).toMatchObject({ unobscured: true, focusVisible: true });
  const state = await control.evaluate(geometry);
  expect((state.outlineWidth > 0 && state.outlineStyle !== 'none') || state.shadow !== 'none', 'actual painted native focus indicator').toBe(true); return state;
}
export async function storedJourney(page, ids, savedType) {
  const state = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tripline-journey')));
  expect(Object.keys(state).sort()).toEqual(['destinations', 'journeyType']); expect(state.destinations).toEqual(ids); expect(state.journeyType).toBe(savedType); return state;
}
export async function openDrawer(page) {
  if (await page.locator('.header-journey').isVisible()) await page.locator('.header-journey').click();
  else { await page.locator('.menu-button').click(); await expect(page.locator('.nav-dialog')).toBeVisible(); await page.locator('.nav-dialog .dialog-footer > button').click(); }
  await expect(page.locator('.journey-drawer')).toBeVisible();
}
async function closeDrawer(page) {
  // Native close dispatch and the drawer's rAF focus restoration finish before
  // the next keyboard sequence. Visibility alone precedes that restoration.
  await page.evaluate(() => {
    window.__qaDrawerClosed = new Promise(resolve => document.querySelector('.journey-drawer').addEventListener('close', () => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }, { once: true }));
  });
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.__qaDrawerClosed);
  await expect(page.locator('.journey-drawer')).toBeHidden();
  const opener = await page.locator('.header-journey').isVisible() ? page.locator('.header-journey') : page.locator('.menu-button');
  await expect(opener).toBeFocused();
}
export async function sourceContent(page, locale, hooks) {
  const root = page.locator(hooks.root);
  await expect(root.locator('h1')).toHaveText(service.headline[locale]); await expect(root.locator(hooks.summary)).toHaveText(service.summary[locale]);
  await expect(root.locator(hooks.points)).toHaveText(service.points.map(point => point[locale]));
  await expect(root.locator(hooks.brief)).toHaveText(service.brief[locale]);
  await expect(root.locator(hooks.question)).toHaveText(service.question[locale]); await expect(root.locator(hooks.answer)).toHaveText(service.answer[locale]);
  await expect(root.locator(hooks.processTitles)).toHaveText(['step1', 'step2', 'step3'].map(key => uiFact(key)[locale]));
  await expect(root.locator(hooks.processBodies)).toHaveText(['step1Body', 'step2Body', 'step3Body'].map(key => uiFact(key)[locale]));
  await expect(root.locator(hooks.profileSource)).toHaveText(profile.sourceLabel[locale]);
  await expect(root).toHaveAttribute('data-service', 'hajj-umrah');
  expect(await root.locator('[data-pilgrimage-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.pilgrimageChapter))).toEqual(chapterIds);
  await expect(root.locator('.rp-choice h2')).toHaveText(service.intro[locale]);
  await expect(root.locator('[data-pilgrimage-trust] p')).toHaveText(['licensed', 'accreditation', 'established'].map(key => profile[key][locale]));
  expect(await root.locator('[data-related-service]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.relatedService, href: node.getAttribute('href') })))).toEqual(service.related.map(id => ({ id, href: `/${locale}/services/${id}` })));
  for (const id of service.related) await expect(root.locator(`[data-related-service="${id}"] > span`)).toHaveText(services.find(item => item.slug === id).title[locale]);
  await expect(root.locator('img')).toHaveAttribute('alt', service.title[locale]);
  await expect(root.locator('canvas,video,iframe,.pin-spacer')).toHaveCount(0);
  for (const plan of await root.locator('[data-service-plan]').all()) expect(new URL(await plan.getAttribute('href'), page.url()).searchParams.get('service')).toBe('hajj-umrah');
  return { media: await naturalMedia(root), bounds: await bounds(page), coordination: service.points.map(point => point[locale]), brief: service.brief[locale], trustSource: profile.sourceLabel[locale] };
}
export async function contactContext(page, locale, ids, savedType) {
  await page.waitForURL(`**/${locale}/contact?**`);
  const params = new URL(page.url()).searchParams;
  expect(params.get('service')).toBe('hajj-umrah'); expect(params.get('journey')).toBe(ids.length ? ids.join(',') : null); expect(params.get('destination')).toBe(ids[0] || null);
  await expect(page.locator('#inquiry-service')).toHaveValue('hajj-umrah'); await expect(page.locator('#inquiry-message')).toHaveValue(journeyMessage(ids, locale));
  if (savedType) await storedJourney(page, ids, savedType);
  return { service: params.get('service'), ids, firstDestination: params.get('destination'), orderedMessage: await page.locator('#inquiry-message').inputValue() };
}

async function chooseIntent(page, value) {
  const selected = page.locator('input[name="pilgrimage-intent"]:checked');
  const keyboard = await keyboardVisible(page, selected);
  if (await selected.inputValue() !== value) await page.keyboard.press('ArrowDown');
  await expect(page.locator(`input[name="pilgrimage-intent"][value="${value}"]`)).toBeChecked();
  await expect(page.locator(hooks.root)).toHaveAttribute('data-pilgrimage-intent', value);
  return { value, nativeKeyboard: true, keyboard };
}
async function prepareAndDecode(page, locale, intent, ids, dates = '', travelers = '') {
  const submit = page.locator('[data-pilgrimage-prepare]');
  const keyboard = await keyboardVisible(page, submit); await page.keyboard.press('Enter');
  const result = page.locator('[data-pilgrimage-prepared]');
  await expect(result).toHaveAttribute('data-prepared-service', 'hajj-umrah');
  await expect(result).toHaveAttribute('data-prepared-journey', ids.join(','));
  const expected = [`${uiFact('inquiry')[locale]} — Trip Line`, `${uiFact('service')[locale]}: ${service.title[locale]}`,
    `${intentCopy.chosen[locale]}: ${intentCopy[intent][locale]}`, ...(ids.length ? [journeyMessage(ids, locale)] : []),
    ...(dates.trim() ? [`${uiFact('dates')[locale]}: ${dates.trim()}`] : []), ...(travelers ? [`${uiFact('travelers')[locale]}: ${travelers}`] : []),
    '', uiFact('nextStepsBody')[locale]].join('\n');
  await expect(result.locator('pre')).toHaveText(expected);
  await expect(result.locator('h3')).toHaveText(uiFact('ready')[locale]); await expect(result.locator(':scope > p')).toHaveText(uiFact('readyBody')[locale]);
  const whatsApp = new URL(await result.locator('[data-pilgrimage-whatsapp]').getAttribute('href')).searchParams.get('text');
  const emailBody = new URL(await result.locator('[data-pilgrimage-email]').getAttribute('href')).searchParams.get('body');
  expect(whatsApp, 'actual decoded WhatsApp chosen intent and ordered journey').toBe(expected); expect(emailBody, 'actual decoded email handoff').toBe(expected);
  const storage = await page.evaluate(() => ({ session: { ...sessionStorage }, local: { ...localStorage }, url: location.href }));
  for (const value of Object.values({ ...storage.session, ...storage.local })) {
    if (dates) expect(value, 'local form dates remain memory-only').not.toContain(dates.trim());
    expect(value).not.toContain(expected);
  }
  expect(new URL(storage.url).searchParams.has('pilgrimage-intent')).toBe(false);
  return { intent, ids, dates, travelers, decodedWhatsApp: whatsApp, decodedEmail: emailBody, keyboard, memoryOnly: true };
}
async function noPrepared(page) { await expect(page.locator('[data-pilgrimage-prepared]')).toHaveCount(0); }
async function seeded(page, ids) {
  // One initial seed per context, then every edit uses the actual native UI.
  await page.evaluate(ids => sessionStorage.setItem('tripline-journey', JSON.stringify({ destinations: ids, journeyType: 'corporate' })), ids);
  await page.reload({ waitUntil: 'networkidle' }); await storedJourney(page, ids, 'corporate');
}
async function intentFlow(page, report, locale, width) {
  const ids = ['rize-ayder', 'uzungol', 'cappadocia']; await seeded(page, ids);
  await expect(page.locator('[data-pilgrimage-journey]')).toHaveAttribute('data-pilgrimage-journey', ids.join(','));
  const hajjChoice = await chooseIntent(page, 'hajj'); const hajj = await prepareAndDecode(page, locale, 'hajj', ids);
  await capture(page, report, `${locale}-${width}-hajj-prepared`);
  const umrahChoice = await chooseIntent(page, 'umrah'); await noPrepared(page);
  const dates = 'QP07 preferred discussion dates', travelers = '7';
  await page.locator('#pilgrimage-dates').fill(dates); await page.locator('#pilgrimage-travelers').fill(travelers);
  const umrah = await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers); await storedJourney(page, ids, 'corporate');
  await capture(page, report, `${locale}-${width}-umrah-prepared`);
  await page.locator('#pilgrimage-dates').fill(dates + ' updated'); await noPrepared(page);
  await page.locator('#pilgrimage-dates').fill(dates); await noPrepared(page);
  await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers);
  await page.locator('#pilgrimage-travelers').fill('8'); await noPrepared(page);
  await page.locator('#pilgrimage-travelers').fill(travelers); await noPrepared(page);
  await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers);
  await openDrawer(page); await page.locator(`[data-journey-stop="${ids[1]}"] [data-move="-1"]`).click();
  const reordered = [ids[1], ids[0], ids[2]]; await storedJourney(page, reordered, 'corporate'); await noPrepared(page);
  await page.locator(`[data-journey-stop="${ids[1]}"] [data-move="1"]`).click(); await storedJourney(page, ids, 'corporate'); await noPrepared(page); await closeDrawer(page);
  await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers);
  await openDrawer(page); await page.locator('.journey-type-label select').selectOption('events'); await storedJourney(page, ids, 'events'); await noPrepared(page);
  await page.locator('.journey-type-label select').selectOption('corporate'); await storedJourney(page, ids, 'corporate'); await noPrepared(page); await closeDrawer(page);
  await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers);
  await page.locator('#pilgrimage-travelers').fill('0'); await page.locator('[data-pilgrimage-prepare]').click(); await noPrepared(page);
  await expect(page.locator('#pilgrimage-travelers')).toHaveAttribute('aria-invalid', 'true'); await expect(page.locator('#pilgrimage-travelers-error')).toHaveText(uiFact('invalidTravelers')[locale]);
  await page.locator('#pilgrimage-travelers').fill(travelers); await prepareAndDecode(page, locale, 'umrah', ids, dates, travelers);
  await page.reload({ waitUntil: 'networkidle' }); await noPrepared(page);
  await expect(page.locator('input[name=pilgrimage-intent][value=hajj]')).toBeChecked();
  await expect(page.locator('#pilgrimage-dates')).toHaveValue(''); await expect(page.locator('#pilgrimage-travelers')).toHaveValue(''); await storedJourney(page, ids, 'corporate');
  const plan = page.locator('[data-service-plan=hajj-umrah]'); const planKeyboard = await keyboardVisible(page, plan); await page.keyboard.press('Enter');
  const contact = await contactContext(page, locale, ids, 'corporate');
  return { hajjChoice, umrahChoice, hajj, umrah, intentAndFieldInvalidation: true, reorderAndRestoreInvalidation: true,
    typeAndRestoreInvalidation: true, validation: true, reloadMemoryReset: true, contact, planKeyboard };
}
export async function runStaticMatrix(browser, report) {
  for (const [locale, width, height] of [['en', 1440, 900], ['en', 390, 844], ['ar', 1440, 900], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const { context, page, css, mutations, requestedScripts } = await fresh(browser, report, locale, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    const facts = await sourceContent(page, locale, hooks);
    for (const chapter of ['hero', 'choice', 'coordination', 'needs', 'process', 'trust']) {
      const section = page.locator(`[data-pilgrimage-chapter="${chapter}"]`); await section.scrollIntoViewIfNeeded();
      await capture(page, report, `${locale}-${width}-${chapter}`);
    }
    const flow = await intentFlow(page, report, locale, width); expect(mutations, 'local brief does not submit').toEqual([]);
    expect(requestedScripts.filter(url => /(?:gsap|lenis|three|webgl)/i.test(url))).toEqual([]);
    report.cases.push({ locale, width, height, mode: 'source/composition/native intents/memory/ordered Contact', facts, flow, css, mutations, requestedScripts }); await context.close();
    checkpoint(report, `${locale}-${width} normal source and native intents complete`);
  }
}
export async function fallbackMatrix(browser, report) {
  for (const mode of ['reduced', 'noJS', 'SaveData']) for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const options = mode === 'noJS' ? { javaScriptEnabled: false } : mode === 'reduced' ? { reducedMotion: 'reduce' } : { initScript: () => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }) };
    const { context, page, mutations, css } = await fresh(browser, report, locale, width, height, options); const facts = await sourceContent(page, locale, hooks);
    let prepared;
    if (mode === 'noJS') {
      await expect(page.locator('.rp-choice-controls')).toBeHidden(); await expect(page.locator('.rp-brief-form')).toBeHidden();
      await expect(page.locator('.rp-choice-static p')).toHaveText(service.points.slice(0, 2).map(point => point[locale]));
      await expect(page.locator('.rp-nojs')).toHaveText(intentCopy.nojs[locale]);
    } else {
      await chooseIntent(page, 'hajj'); const hajj = await prepareAndDecode(page, locale, 'hajj', []);
      await chooseIntent(page, 'umrah'); await noPrepared(page); const umrah = await prepareAndDecode(page, locale, 'umrah', []); prepared = { hajj, umrah };
    }
    await page.locator('.rp-choice').scrollIntoViewIfNeeded(); await capture(page, report, `${locale}-${width}-${mode}-choice`);
    await page.locator('.rp-plan').scrollIntoViewIfNeeded(); await capture(page, report, `${locale}-${width}-${mode}-plan`);
    const calm = await staticKickers(page);
    await page.locator('[data-service-plan=hajj-umrah]').click(); const contact = await contactContext(page, locale, []);
    if (mode === 'noJS') { await page.goBack({ waitUntil: 'networkidle' }); const related = page.locator('[data-related-service]').first(); await related.click(); await page.waitForURL(`**/${locale}/services/${service.related[0]}`); await expect(page.locator('h1')).toBeVisible(); }
    expect(mutations).toEqual([]); report.cases.push({ locale, width, height, mode, facts, prepared, calm, contact, css, noSubmission: true }); await context.close();
  }
  checkpoint(report, 'nine reduced/noJS/SaveData source and native planning cases complete');
}

function connectionFixture() {
  const connection = new EventTarget(), listeners = new Set();
  const add = connection.addEventListener.bind(connection), remove = connection.removeEventListener.bind(connection);
  connection.saveData = false;
  connection.addEventListener = (type, listener, options) => { if (type === 'change') listeners.add(listener); add(type, listener, options); };
  connection.removeEventListener = (type, listener, options) => { if (type === 'change') listeners.delete(listener); remove(type, listener, options); };
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  window.__qaConnection = connection; window.__qaListeners = listeners;
}
export async function decodeRecording(browser, report, videoPath, prefix) {
  const context = await browser.newContext(), page = await context.newPage();
  try {
    await page.route('http://qa-evidence.local/**', async route => {
      if (route.request().url().endsWith('/clip')) await route.fulfill({ contentType: 'video/webm', body: fs.readFileSync(videoPath) });
      else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><video muted playsinline></video><canvas></canvas>' });
    });
    await page.goto('http://qa-evidence.local/');
    const metadata = await page.evaluate(async () => {
      const video = document.querySelector('video'); video.src = URL.createObjectURL(await (await fetch('/clip')).blob());
      await new Promise((resolve, reject) => { video.addEventListener('loadeddata', resolve, { once: true }); video.addEventListener('error', reject, { once: true }); });
      return { duration: video.duration, width: video.videoWidth, height: video.videoHeight };
    });
    expect(Number.isFinite(metadata.duration)).toBe(true); expect(metadata.duration).toBeGreaterThan(2);
    const times = Array.from({ length: Math.ceil(metadata.duration / .25) }, (_, index) => index * .25).filter(time => time + .001 < metadata.duration);
    const extracted = await page.evaluate(async ({ times, prefix }) => {
      const video = document.querySelector('video'), canvas = document.querySelector('canvas');
      const width = Math.round(Math.min(360, video.videoWidth)), height = Math.round(video.videoHeight * width / video.videoWidth), columns = video.videoWidth < 600 ? 8 : 4;
      canvas.width = width * columns; canvas.height = Math.ceil(times.length / columns) * (height + 24);
      const ctx = canvas.getContext('2d'), frames = []; ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < times.length; index++) {
        const requested = times[index] + .001;
        await new Promise(resolve => { video.addEventListener('seeked', resolve, { once: true }); video.currentTime = requested; });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const x = index % columns * width, y = Math.floor(index / columns) * (height + 24);
        ctx.drawImage(video, x, y + 24, width, height); ctx.fillStyle = '#071f20'; ctx.font = '12px sans-serif'; ctx.fillText(prefix + ' actual ' + video.currentTime.toFixed(3) + 's', x + 4, y + 17);
        frames.push({ requested, currentTime: video.currentTime });
      }
      URL.revokeObjectURL(video.src); return { frames, data: canvas.toDataURL('image/png') };
    }, { times, prefix });
    for (const frame of extracted.frames) expect(Math.abs(frame.requested - frame.currentTime)).toBeLessThan(.02);
    expect(new Set(extracted.frames.map(frame => frame.currentTime)).size).toBe(times.length);
    const sheet = path.join(report.artifacts, prefix + '-actual-native-frames.png'); fs.writeFileSync(sheet, Buffer.from(extracted.data.split(',')[1], 'base64'));
    return { origin: videoPath, sheet, ...metadata, interval: .25, frames: extracted.frames, method: 'complete video Blob; distinct currentTime/seeked/two rAF; no application seeking' };
  } finally { await context.close(); }
}

async function motionIsolation(page) {
  const state = await page.locator(hooks.root).evaluate((root, selector) => {
    const targets = [...root.querySelectorAll(selector)];
    return { targets: targets.length, animations: root.getAnimations({ subtree: true }).map(animation => ({ name: animation.animationName, kicker: targets.includes(animation.effect?.target) })),
      staticMedia: [...root.querySelectorAll('img,svg,path,section,h1,h2')].map(node => ({ tag: node.tagName, transform: getComputedStyle(node).transform, animations: node.getAnimations().length })),
      essential: [...root.querySelectorAll('h1,h2,p,a,button')].filter(node => node.getClientRects().length > 0).map(node => ({ tag: node.tagName, opacity: getComputedStyle(node).opacity })) };
  }, kickerSelector);
  expect(state.targets).toBe(5);
  for (const animation of state.animations) { expect(animation.kicker, 'actual P07 animation target is only a nonessential kicker').toBe(true); expect(animation.name).toBe('rp-kicker-arrival'); }
  for (const item of state.staticMedia) { expect(item.transform, 'image/route/chapter/title has no transform').toBe('none'); expect(item.animations).toBe(0); }
  for (const item of state.essential) expect(item.opacity, 'essential copy/actions never fade').toBe('1'); return state;
}
async function staticKickers(page) {
  await expect(page.locator(hooks.root)).not.toHaveAttribute('data-pilgrimage-motion', 'enhanced');
  const nativeCleanup = await page.locator(kickerSelector).evaluateAll(async nodes => {
    const before = nodes.map(node => ({ reveal: node.getAttribute('data-pilgrimage-reveal'), opacity: getComputedStyle(node).opacity,
      transform: getComputedStyle(node).transform, animations: node.getAnimations().map(animation => ({
        class: animation.constructor.name, property: animation.transitionProperty, timing: animation.effect.getTiming(), keyframes: animation.effect.getKeyframes(),
      })) }));
    const transitions = nodes.flatMap(node => node.getAnimations());
    for (const [index, item] of before.entries()) {
      if (item.reveal !== null || item.transform !== 'none') throw new Error('Calm kicker retains reveal or transform');
      if (!item.animations.length && item.opacity !== '1') throw new Error('Calm kicker is not final and has no identified native cleanup');
      for (const animation of item.animations) {
        const frames = animation.keyframes;
        if (animation.class !== 'CSSTransition' || animation.property !== 'opacity' || animation.timing.duration !== .01 ||
          animation.timing.delay !== 0 || animation.timing.iterations !== 1 || frames.length !== 2 || frames[0].opacity !== '0.7' || frames[1].opacity !== '1') {
          throw new Error('Unexpected calm kicker animation at target ' + index);
        }
      }
    }
    const start = performance.now();
    // Only the identified native .01ms reduced-motion transition may finish.
    // This does not accept an active reveal or replace final-state assertions.
    await Promise.all(transitions.map(animation => animation.finished));
    return { before, awaitedTransitions: transitions.length, elapsed: performance.now() - start };
  });
  const state = await page.locator(kickerSelector).evaluateAll(nodes => nodes.map(node => ({ reveal: node.getAttribute('data-pilgrimage-reveal'), opacity: getComputedStyle(node).opacity,
    transform: getComputedStyle(node).transform, animations: node.getAnimations().length })));
  expect(state).toHaveLength(5); for (const item of state) expect(item).toEqual({ reveal: null, opacity: '1', transform: 'none', animations: 0 });
  return { nativeCleanup, kickers: state, isolation: await motionIsolation(page) };
}
async function finiteKicker(page, report, selector, label) {
  report.activeCase.step = 'actual finite kicker ' + label;
  await expect(page.locator(selector)).toHaveAttribute('data-pilgrimage-reveal', 'pending');
  const result = await page.evaluate(async selector => {
    const target = document.querySelector(selector);
    const sample = start => ({ elapsed: performance.now() - start, wall: Date.now(), reveal: target.dataset.pilgrimageReveal,
      opacity: Number(getComputedStyle(target).opacity), transform: getComputedStyle(target).transform,
      animations: target.getAnimations().map(animation => ({ name: animation.animationName, currentTime: animation.currentTime, state: animation.playState, duration: animation.effect.getTiming().duration, iterations: animation.effect.getTiming().iterations })) });
    const start = performance.now(), initial = sample(start), rect = target.getBoundingClientRect();
    scrollTo({ top: scrollY + rect.top - document.querySelector('.header').getBoundingClientRect().height - 35, behavior: 'instant' });
    const frames = [];
    await new Promise(resolve => { const tick = () => { const frame = sample(start); frames.push(frame); if (frame.elapsed >= 1200) resolve(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return { selector, initial, frames };
  }, selector);
  (report.motionSamples ||= []).push(result);
  expect(result.initial.opacity).toBe(.7); expect(result.frames.some(frame => frame.reveal === 'visible')).toBe(true);
  expect(result.frames.some(frame => frame.opacity > .71 && frame.opacity < .99), 'actual intermediate opacity').toBe(true);
  const animations = result.frames.flatMap(frame => frame.animations);
  expect(animations.length).toBeGreaterThan(0);
  for (const animation of animations) { expect(animation.name).toBe('rp-kicker-arrival'); expect(animation.duration).toBe(900); expect(animation.iterations).toBe(1); }
  expect(animations.some(animation => animation.state === 'finished'), 'finite kicker actually settles').toBe(true);
  expect(result.frames.at(-1).opacity).toBe(1); expect(result.frames.every(frame => frame.transform === 'none')).toBe(true);
  const isolation = await motionIsolation(page); await capture(page, report, `${report.activeCase.locale}-${report.activeCase.width}-${label}-settled`);
  return { ...result, isolation };
}
async function nativeMatrix(browser, report) {
  for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844]]) {
    const { context, page, requestedScripts } = await fresh(browser, report, locale, width, height, { initScript: connectionFixture,
      recordVideo: { dir: path.join(report.artifacts, 'recordings'), size: { width, height } } });
    await expect(page.locator(hooks.root)).toHaveAttribute('data-pilgrimage-motion', 'enhanced');
    const choice = await finiteKicker(page, report, '.rp-choice .rp-kicker', 'choice-kicker');
    const trust = await finiteKicker(page, report, '.rp-trust .rp-kicker', 'trust-kicker');
    const video = page.video(); await context.close(); const recording = await video.path();
    const decoded = await decodeRecording(browser, report, recording, `${locale}-${width}`);
    report.cases.push({ locale, width, height, mode: 'actual native kicker recording', choice, trust, recording, decoded, requestedScripts,
      isolationLimit: 'Shared Photo client Sections module imports motion/react/BronzeJourney/Ribbon; actual target/no-canvas/no-pin and requests checked, complete tree-shaken bundle not certified.' });
    checkpoint(report, `${locale}-${width} actual native kicker recording and frames complete`);
  }
  const { context, page } = await fresh(browser, report, 'en', 1440, 900, { initScript: connectionFixture });
  await finiteKicker(page, report, '.rp-choice .rp-kicker', 'cleanup-choice'); const choice = page.locator('.rp-choice .rp-kicker');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  await page.evaluate(() => { window.__qaConnection.saveData = true; window.__qaConnection.dispatchEvent(new Event('change')); }); const saveData = await staticKickers(page);
  await page.evaluate(() => { window.__qaConnection.saveData = false; window.__qaConnection.dispatchEvent(new Event('change')); });
  await expect(choice).toHaveAttribute('data-pilgrimage-reveal', 'settled'); expect(await choice.evaluate(node => node.getAnimations().length)).toBe(0);
  await page.locator('.motion-choice select').selectOption('reduced'); const siteCalm = await staticKickers(page);
  await page.locator('.motion-choice select').selectOption('system'); await expect(choice).toHaveAttribute('data-pilgrimage-reveal', 'settled');
  await page.emulateMedia({ reducedMotion: 'reduce' }); const systemCalm = await staticKickers(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await expect(choice).toHaveAttribute('data-pilgrimage-reveal', 'settled'); expect(await choice.evaluate(node => node.getAnimations().length)).toBe(0);
  await page.evaluate(() => { window.__qaDetachedRoot = document.querySelector('.recovery-pilgrimage'); });
  await page.locator('[data-service-plan=hajj-umrah]').click(); await page.waitForURL('**/en/contact?**');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(0);
  const detached = await page.evaluate(() => ({ connected: window.__qaDetachedRoot.isConnected, motion: window.__qaDetachedRoot.dataset.pilgrimageMotion || null,
    reveals: window.__qaDetachedRoot.querySelectorAll('[data-pilgrimage-reveal]').length, animations: window.__qaDetachedRoot.getAnimations({ subtree: true }).length }));
  expect(detached).toEqual({ connected: false, motion: null, reveals: 0, animations: 0 });
  await page.goBack({ waitUntil: 'networkidle' }); await expect(page.locator(hooks.root)).toHaveAttribute('data-pilgrimage-motion', 'enhanced');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  report.cases.push({ locale: 'en', width: 1440, height: 900, mode: 'native lifecycle', saveData, siteCalm, systemCalm, seenNoReplay: true, detached, remountListeners: 1 }); await context.close();
  for (const [label, initScript, calm] of [
    ['partial SaveData', () => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }), true],
    ['add-only connection', () => { window.__qaAddCalls = 0; Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false, addEventListener() { window.__qaAddCalls++; } } }); }, false],
    ['absent IO', () => Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined }), true],
  ]) {
    const { context, page } = await fresh(browser, report, 'en', 1440, 900, { initScript });
    const state = calm ? await staticKickers(page) : await motionIsolation(page);
    if (!calm) { await expect(page.locator(hooks.root)).toHaveAttribute('data-pilgrimage-motion', 'enhanced'); expect(await page.evaluate(() => window.__qaAddCalls)).toBe(0); }
    report.cases.push({ locale: 'en', width: 1440, height: 900, mode: label, state, noSubscription: label === 'add-only connection' }); await context.close();
  }
  checkpoint(report, 'six native timing/lifecycle/resilience cases complete');
}

// This first checkpoint prepares immutable source facts and reusable verification
// utilities. Runtime dispatch awaits the delivered intent/message hooks and gate.
if (process.env.QA_PREPARE_ONLY === '1') {
  console.log(JSON.stringify({ status: 'preparation pass', route: 'services/hajj-umrah', locales, localizedRecords: locales.length,
    relatedSourceOrder: service.related, profileSource: profile.sourceLabel,
    profileFigures: profileFigures.filter(figure => !figure.requiresClarification).map(figure => ({ id: figure.id, value: figure.value, suffix: figure.suffix })),
    browserLaunched: false, applicationExecuted: false, intentRuntimePending: false, enhancedRuntimePending: false,
    staticCases: 5, fallbackCases: 9, nativeCases: 6, intentSourceLabels: { hajj: intentCopy.hajj, umrah: intentCopy.umrah } }));
} else {
  const report = createReport(); let browser;
  try {
    browser = await chromium.launch(); report.browserVersion = browser.version();
    await runStaticMatrix(browser, report); await fallbackMatrix(browser, report); await nativeMatrix(browser, report);
    expect(report.cases).toHaveLength(20); expect(report.errors).toEqual([]);
    report.finalFingerprints = fingerprints(); expect(report.finalFingerprints, 'all source remains frozen').toEqual(report.sourceFingerprints); report.status = 'pass';
  } catch (error) {
    report.status = 'fail'; report.failure = { message: error.message, stack: error.stack, activeCase: report.activeCase, at: new Date().toISOString() }; process.exitCode = 1;
    if (browser) for (const context of browser.contexts()) for (const page of context.pages()) {
      try { await page.screenshot({ path: path.join(report.artifacts, 'first-failure-' + browser.contexts().indexOf(context) + '.png') }); } catch { /* Keep original failure. */ }
    }
  } finally {
    if (browser) await browser.close(); report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(report.artifacts, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ status: report.status, cases: report.cases.length, screens: report.screens.length, errors: report.errors.length, artifacts: report.artifacts, failure: report.failure?.message }));
  }
}
