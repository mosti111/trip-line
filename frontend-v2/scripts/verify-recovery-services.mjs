import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { watchRuntime } from './verify-recovery-motion.mjs';

const sourceFiles = ['components/services/TravelServicesHub.tsx', 'components/services/ServiceExperience.tsx',
  'components/services/ServicePrimitives.tsx', 'components/travel/Pages.tsx', 'styles/recovery-services.css',
  'lib/travel-content.ts', 'lib/turkiye.ts', 'lib/journey.ts', 'scripts/verify-recovery-services.mjs'];
const serviceIds = ['tours', 'hajj-umrah', 'camps', 'corporate', 'flights-hotels', 'tailor-made', 'events', 'training', 'visa-assistance'];
const needDestinations = ['tailor-made', 'tours', 'flights-hotels', 'visa-assistance'];
const locales = ['en', 'ar', 'tr'];
const sourceFile = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
function unwrap(node) {
  while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}
const declaration = (file, name) => unwrap(file.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(node => node.name.getText() === name).initializer);
const uiNode = declaration(sourceFile('lib/i18n.ts'), 'ui');

// Immutable TypeScript content is read as syntax, never executed as application
// code. The pilgrimage title resolves its actual ui.pilgrimage source reference.
function sourceValue(node) {
  node = unwrap(node);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(sourceValue);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Unsupported source property');
    return [property.name.getText().replaceAll("'", ''), sourceValue(property.initializer)];
  }));
  if (ts.isCallExpression(node) && node.expression.getText() === 't') {
    const [en, ar, tr] = node.arguments.map(sourceValue); return { en, ar, tr };
  }
  if (ts.isPropertyAccessExpression(node) && node.expression.getText() === 'ui') {
    return sourceValue(uiNode.properties.find(property => property.name.getText() === node.name.text).initializer);
  }
  throw new Error('Unsupported immutable source expression ' + node.getText());
}
const services = sourceValue(declaration(sourceFile('lib/travel-content.ts'), 'services'));
const places = sourceValue(declaration(sourceFile('lib/turkiye.ts'), 'turkishPlaces'));
expect(services.map(service => service.slug)).toEqual(serviceIds);
for (const service of services) {
  expect(service.points).toHaveLength(3); expect(service.related).toHaveLength(3);
  expect(new Set(service.related).size).toBe(3); expect(service.related).not.toContain(service.slug);
  for (const id of service.related) expect(serviceIds).toContain(id);
  for (const locale of locales) for (const item of [service.title, service.headline, service.summary, service.intro, service.brief, ...service.points]) expect(item[locale].trim().length).toBeGreaterThan(0);
}
const serviceById = id => services.find(service => service.slug === id);
const placeById = id => places.find(place => place.slug === id);
const servicePath = (locale, id) => `/${locale}/services${id ? '/' + id : ''}`;
const placePath = (locale, id) => `/${locale}/destinations/turkiye/${id}`;
const journeyMessage = (locale, ids) => `${{ en: 'Places I would like to visit', ar: 'الأماكن التي أرغب في زيارتها', tr: 'Ziyaret etmek istediğim yerler' }[locale]}: ${ids.map(id => placeById(id).name[locale]).join(' → ')}`;
const fingerprints = () => Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
const uiFact = key => sourceValue(uiNode.properties.find(property => property.name.getText() === key).initializer);
const hooks = { hubRoot: '.recovery-services.rs-hub', detailRoot: '.recovery-services.rs-detail',
  heroSummary: '[data-service-summary]', points: '[data-service-points] li p', brief: '[data-service-brief]',
  related: '[data-service-related] [data-related-service]', plan: '[data-service-plan]',
  inspiration: '[data-service-inspiration]', needs: '[data-need]' };
const experienceSource = sourceFile('components/services/ServiceExperience.tsx');
const inspirationFunction = experienceSource.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'ServiceInspiration');
const inspirationIds = inspirationFunction.body.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(node => node.name.getText() === 'ids').initializer;
expect(ts.isConditionalExpression(inspirationIds)).toBe(true);
const inspirationGroups = { business: sourceValue(inspirationIds.whenTrue), travel: sourceValue(inspirationIds.whenFalse) };
for (const ids of Object.values(inspirationGroups)) for (const id of ids) expect(placeById(id)).toBeTruthy();

function createReport() {
  const startedAt = new Date().toISOString();
  const out = path.resolve('../tmp/frontend-qa/recovery-services', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
  fs.mkdirSync(out, { recursive: true });
  return { startedAt, status: 'running', base: process.env.QA_URL || 'http://localhost:3003', artifacts: out,
    revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sourceFingerprints: fingerprints(),
    browser: 'Chromium', cases: [], screens: [], checks: [], errors: [], gaps: ['Independent rendered Astra review and final Q12 remain required; no Safari/Firefox, physical-device, AT or field-performance certification.'] };
}
function checkpoint(report, phase) {
  const progress = { status: 'running', phase, cases: report.cases.length, screens: report.screens.length, errors: report.errors.length, at: new Date().toISOString(), artifacts: report.artifacts };
  fs.writeFileSync(path.join(report.artifacts, 'progress.json'), JSON.stringify(progress, null, 2)); console.log(JSON.stringify(progress));
}

// This continuation inherits only the explicitly reviewed, byte-identical first
// attempt. It never changes the default full matrix or treats that failure as a pass.
function inheritedCoverage(report) {
  const knownPath = path.resolve('../tmp/frontend-qa/recovery-services/2026-10-09T11-52-38-314Z/report.json');
  expect(path.resolve(process.env.QA_PRIOR_REPORT || ''), 'authorized prior report path').toBe(knownPath);
  const bytes = fs.readFileSync(knownPath), sha256 = createHash('sha256').update(bytes).digest('hex');
  expect(sha256).toBe('ce8b6db4084587aeb70e20942717b19b2c1b1d88eede8d79492fd668990c9111');
  const prior = JSON.parse(bytes);
  expect(prior.status).toBe('fail'); expect(prior.errors).toEqual([]);
  expect(prior.cases).toHaveLength(48); expect(prior.screens).toHaveLength(54);
  expect(prior.sourceFingerprints['scripts/verify-recovery-services.mjs']).toBe('3bfa00fb036c3981ff3bd49b6ec0fe74328277b5b563b4bad05aa7824893a484');
  expect(prior.failure.stack).toContain('keyboardVisible'); expect(prior.failure.stack).toContain('audienceContext');
  expect(prior.failure.activeCase).toEqual({ locale: 'tr', id: 'hub', width: 1280, height: 800, mode: 'normal', step: 'fresh direct navigation' });
  for (const file of sourceFiles.slice(0, -1)) expect(report.sourceFingerprints[file], 'immutable source ' + file).toBe(prior.sourceFingerprints[file]);
  return { path: knownPath, sha256, status: prior.status, startedAt: prior.startedAt, finishedAt: prior.finishedAt,
    previousHelper: prior.sourceFingerprints['scripts/verify-recovery-services.mjs'], sourceFingerprints: prior.sourceFingerprints,
    cases: prior.cases, screens: prior.screens, checks: prior.checks, failure: prior.failure,
    explanation: '48 completed cases inherited from preserved failing first attempt; fresh continuation runs only the remaining 25. This is not one fresh full-matrix pass.' };
}

async function fresh(browser, report, locale, id, width = 1440, height = 900, options = {}) {
  report.activeCase = { locale, id: id || 'hub', width, height, mode: options.javaScriptEnabled === false ? 'noJS' : options.reducedMotion === 'reduce' ? 'reduced' : 'normal', step: 'fresh direct navigation' };
  const { initScript, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width, height }, ...contextOptions });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage(); watchRuntime(page, report, `${locale}-${id || 'hub'}-${width}`);
  const css = [], pending = [], requestedScripts = [];
  page.on('request', request => { if (request.resourceType() === 'script') requestedScripts.push(request.url()); });
  page.on('response', response => { if (response.status() === 200 && response.url().includes('.css')) pending.push(response.text().then(body => css.push({ url: response.url(), ownedServices: body.includes('.recovery-services') }))); });
  await page.goto(report.base + servicePath(locale, id), { waitUntil: 'networkidle' }); await Promise.all(pending);
  expect(css.some(item => item.ownedServices), 'fresh direct route loads explicit service-family CSS').toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', locale); await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('canvas,.pin-spacer')).toHaveCount(0);
  return { context, page, css, requestedScripts };
}

async function bounds(page) {
  const state = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter(image => image.complete && image.currentSrc && !image.naturalWidth).map(image => image.currentSrc) }));
  expect(state.documentWidth).toBeLessThanOrEqual(state.width + 1); expect(state.broken).toEqual([]); return state;
}
async function capture(page, report, name) {
  await bounds(page); const file = path.join(report.artifacts, name + '.png'); await page.screenshot({ path: file });
  report.screens.push({ name, path: file, url: page.url(), viewport: page.viewportSize(), at: new Date().toISOString() });
}
async function naturalMedia(root) {
  const state = await root.locator('img').evaluateAll(images => images.map(image => {
    let natural = true;
    for (let node = image; node && node.tagName !== 'BODY'; node = node.parentElement) { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); if (matrix.a <= 0 || matrix.d <= 0) natural = false; }
    return { src: image.currentSrc, complete: image.complete, width: image.naturalWidth, natural };
  }));
  for (const image of state) expect(image.natural, 'photography never mirrors').toBe(true); return state;
}

async function detailContent(page, locale, id, hooks) {
  const service = serviceById(id), root = page.locator(hooks.detailRoot);
  await expect(root).toHaveAttribute('data-service', id);
  await expect(root.locator('h1')).toHaveText(service.headline[locale]);
  await expect(root.locator(hooks.heroSummary)).toHaveText(service.summary[locale]);
  await expect(root.locator(hooks.points)).toHaveText(service.points.map(point => point[locale]));
  await expect(root.locator(hooks.brief)).toHaveText(service.brief[locale]);
  await expect(root.locator('[data-service-quick-summary] dd')).toHaveText([service.intro[locale], service.summary[locale], service.brief[locale]]);
  await expect(root.locator('.rs-service-answer h3')).toHaveText(service.question[locale]);
  await expect(root.locator('.rs-service-answer p')).toHaveText(service.answer[locale]);
  await expect(root.locator('.rs-process h2')).toHaveText(uiFact('processTitle')[locale]);
  await expect(root.locator('.rs-process li h3')).toHaveText(['step1', 'step2', 'step3'].map(key => uiFact(key)[locale]));
  await expect(root.locator('.rs-process li p')).toHaveText(['step1Body', 'step2Body', 'step3Body'].map(key => uiFact(key)[locale]));
  const related = await root.locator(hooks.related).evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(related, 'explicit source related editorial order').toEqual(service.related.map(relatedId => servicePath(locale, relatedId)));
  for (const relatedId of service.related) await expect(root.locator(hooks.related).filter({ hasText: serviceById(relatedId).title[locale] })).toHaveCount(1);
  for (const link of await root.locator(hooks.plan).all()) {
    const params = new URL(await link.getAttribute('href'), page.url()).searchParams;
    expect(params.get('service'), 'explicit detail service').toBe(id);
  }
  await expect(root.locator(hooks.plan).first()).toBeVisible();
  if (['visa-assistance', 'hajj-umrah'].includes(id)) await expect(root.locator(hooks.inspiration)).toHaveCount(0);
  else await sourceInspiration(root, locale, service.audience === 'business' ? 'business' : 'travel');
  return { related, sourcePoints: service.points.map(point => point[locale]), media: await naturalMedia(root), bounds: await bounds(page) };
}

async function hubContent(page, locale, hooks) {
  const root = page.locator(hooks.hubRoot);
  const needs = await root.locator(hooks.needs).evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect([...needs].sort(), 'four exact approved need destinations; no imposed display order').toEqual(needDestinations.map(id => servicePath(locale, id)).sort());
  const directory = await root.locator('[data-service-link]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.serviceLink, href: node.getAttribute('href') })));
  expect(directory.map(item => item.id).sort(), 'all nine service memberships retained').toEqual([...serviceIds].sort());
  for (const item of directory) expect(item.href).toBe(servicePath(locale, item.id));
  for (const id of ['hajj-umrah', 'corporate']) await expect(root.locator(`a[href="${servicePath(locale, id)}"]`).first()).toBeVisible();
  await sourceInspiration(root, locale, 'travel');
  return { needsInRenderedOrder: needs, directory, media: await naturalMedia(root), bounds: await bounds(page) };
}

async function sourceInspiration(root, locale, family) {
  const rows = root.locator('[data-service-inspiration] [data-inspiration-place]');
  const ids = await rows.evaluateAll(nodes => nodes.map(node => node.dataset.inspirationPlace));
  expect(ids, 'actual source-selected inspiration order').toEqual(inspirationGroups[family]);
  for (const id of ids) {
    const place = placeById(id);
    const item = root.locator(`[data-inspiration-place="${id}"]`);
    await expect(item.locator('h3')).toHaveText(place.name[locale]); await expect(item.locator('p')).toHaveText(place.note[locale]);
    for (const link of await item.locator('a').all()) await expect(link).toHaveAttribute('href', placePath(locale, id));
    await expect(item.locator('button.journey-action')).toHaveCount(1);
    const coordinate = item.locator('bdi');
    if (await coordinate.count()) { await expect(coordinate).toHaveText(`${place.lat.toFixed(2)}° N / ${place.lon.toFixed(2)}° E`); await expect(coordinate).toHaveAttribute('dir', 'ltr'); }
  }
  return ids;
}

async function audienceContext(page, report, locale, audience) {
  await page.goto(`${report.base}${servicePath(locale)}?audience=${audience}`, { waitUntil: 'networkidle' });
  const root = page.locator(hooks.hubRoot); await expect(root).toHaveAttribute('data-requested-audience', audience);
  const link = root.locator('[data-audience-context]'); await expect(link).toHaveAttribute('data-audience-context', audience); await expect(link).toHaveAttribute('href', '#services-' + audience);
  const keyboard = await keyboardVisible(page, link); await page.keyboard.press('Enter');
  await expect.poll(() => new URL(page.url()).hash).toBe('#services-' + audience);
  if (audience !== 'travel') await expect(root.locator(`[data-service-family="${audience}"]`)).toHaveAttribute('data-requested', 'true');
  await expect(root.locator('#services-' + audience)).toBeVisible();
  return { audience, nativeContextAnchor: true, keyboard };
}

async function journeyFlow(page, report, locale, width) {
  await page.evaluate(() => sessionStorage.setItem('tripline-journey', JSON.stringify({ destinations: ['trabzon'], journeyType: 'corporate' })));
  await page.reload({ waitUntil: 'networkidle' });
  const ids = ['trabzon', ...inspirationGroups.travel.slice(0, 2)];
  for (const id of ids.slice(1)) {
    const add = page.locator(`[data-inspiration-place="${id}"] button.journey-action`);
    await add.click(); await add.click();
  }
  await journeyState(page, ids, 'corporate'); await openDrawer(page);
  await expect(page.locator('.journey-stops li > a')).toHaveText(ids.map(id => placeById(id).name[locale]));
  await page.keyboard.press('Escape');
  await page.locator(`[data-inspiration-place="${ids[1]}"] a`).first().click(); await page.waitForURL('**' + placePath(locale, ids[1]));
  await expect(page.locator('h1')).toHaveText(placeById(ids[1]).name[locale]); await journeyState(page, ids, 'corporate');
  await page.goBack({ waitUntil: 'networkidle' }); await expect(page.locator(hooks.hubRoot)).toBeVisible();
  await page.locator('[data-need=tours]').click(); await page.waitForURL('**' + servicePath(locale, 'tours'));
  const related = serviceById('tours').related[0]; await page.locator(`[data-related-service="${related}"]`).click();
  await page.waitForURL('**' + servicePath(locale, related)); await journeyState(page, ids, 'corporate');
  await page.goBack({ waitUntil: 'networkidle' }); await expect(page.locator(hooks.detailRoot)).toHaveAttribute('data-service', 'tours');
  await page.goForward({ waitUntil: 'networkidle' }); await expect(page.locator(hooks.detailRoot)).toHaveAttribute('data-service', related);
  await page.reload({ waitUntil: 'networkidle' }); await journeyState(page, ids, 'corporate');
  const nextLocale = locale === 'ar' ? 'tr' : 'ar'; await page.locator(`.header .languages a[lang="${nextLocale}"]`).click();
  await page.waitForURL('**' + servicePath(nextLocale, related)); await journeyState(page, ids, 'corporate');
  const plan = page.locator('.rs-brief [data-service-plan]'); const keyboard = await keyboardVisible(page, plan); await page.keyboard.press('Enter');
  const inquiry = await orderedContact(page, nextLocale, ids, related, 'corporate');
  await capture(page, report, `${locale}-${width}-ordered-service-contact-${nextLocale}`);
  return { ...inquiry, sourceAddDeduplication: true, drawer: true, explore: true, relatedBackForward: true, reload: true, locale: nextLocale, keyboard };
}

async function keyboardVisible(page, control) {
  await control.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(node => {
    const rect = node.getBoundingClientRect(), header = document.querySelector('.header').getBoundingClientRect();
    const sticky = document.querySelector('.mobile-plan[data-visible]'), stickyRect = sticky?.getBoundingClientRect(), stickyCss = sticky && getComputedStyle(sticky);
    const obstruction = stickyRect && stickyCss.display !== 'none' && stickyCss.visibility === 'visible' && Number(stickyCss.opacity) > 0 && sticky.getClientRects().length > 0 && stickyRect.width > 0 && stickyRect.height > 0 ? stickyRect : null;
    return rect.top >= header.bottom - 1 && rect.bottom <= innerHeight + 1 && (!obstruction || rect.bottom <= obstruction.top + 1);
  })).toBe(true);
  const state = await control.evaluate(node => { const rect = node.getBoundingClientRect(), css = getComputedStyle(node), sticky = document.querySelector('.mobile-plan[data-visible]'), stickyRect = sticky?.getBoundingClientRect(), stickyCss = sticky && getComputedStyle(sticky); return { tag: node.tagName, href: node.getAttribute('href'), top: rect.top, bottom: rect.bottom, focusVisible: node.matches(':focus-visible'), outline: css.outline, outlineWidth: Number.parseFloat(css.outlineWidth), outlineStyle: css.outlineStyle, shadow: css.boxShadow,
    mobileCTA: sticky ? { display: stickyCss.display, visibility: stickyCss.visibility, opacity: stickyCss.opacity, clientRects: sticky.getClientRects().length, top: stickyRect.top, bottom: stickyRect.bottom, width: stickyRect.width, height: stickyRect.height } : null }; });
  expect(state.focusVisible, 'native keyboard focus visible').toBe(true);
  expect((state.outlineWidth > 0 && state.outlineStyle !== 'none') || state.shadow !== 'none', 'actual painted focus indicator').toBe(true);
  return state;
}
async function journeyState(page, ids, type = null) {
  const value = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tripline-journey')));
  expect(Object.keys(value).sort()).toEqual(['destinations', 'journeyType']); expect(value.destinations).toEqual(ids);
  expect(serviceIds).toContain(value.journeyType);
  if (type !== null) expect(value.journeyType).toBe(type); return value;
}
async function openDrawer(page) {
  if (await page.locator('.header-journey').isVisible()) await page.locator('.header-journey').click();
  else { await page.locator('.menu-button').click(); await expect(page.locator('.nav-dialog')).toBeVisible(); await page.locator('.nav-dialog .dialog-footer > button').click(); }
  await expect(page.locator('.journey-drawer')).toBeVisible();
}
async function orderedContact(page, locale, ids, service, storedType) {
  await page.waitForURL(`**/${locale}/contact?**`);
  const params = new URL(page.url()).searchParams;
  expect(params.get('service')).toBe(service); expect(params.get('journey')).toBe(ids.join(',')); expect(params.get('destination')).toBe(ids[0]);
  await expect(page.locator('#inquiry-service')).toHaveValue(service); await expect(page.locator('#inquiry-destination')).toHaveValue(ids[0]);
  await expect(page.locator('#inquiry-message')).toHaveValue(journeyMessage(locale, ids));
  await page.locator('#inquiry-name').fill('Services QA'); await page.locator('#inquiry-email').fill('qa@example.com'); await page.locator('#inquiry-consent').check();
  await page.locator('#inquiry button[type=submit]').click(); await expect(page.locator('.inquiry-result')).toBeVisible();
  const prepared = new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');
  expect(prepared).toContain(journeyMessage(locale, ids)); expect(prepared).toContain(serviceById(service).title[locale]); expect(prepared).toContain('Services QA');
  await journeyState(page, ids, storedType); await page.locator('#inquiry-message').fill('Updated service request'); await expect(page.locator('.inquiry-result')).toHaveCount(0);
  return { ids, service, storedType, preparedMessage: true, staleResultCleared: true, personalDataNotPersisted: true };
}

async function runSourceInventory(browser, report, hooks) {
  for (const locale of locales) for (const service of services) {
    const { context, page, css } = await fresh(browser, report, locale, service.slug);
    report.cases.push({ locale, id: service.slug, width: 1440, height: 900, mode: 'source record', css, ...await detailContent(page, locale, service.slug, hooks) }); await context.close();
  }
  report.checks.push('27 fresh localized service records: exact source hero/summary/three points/brief/source related order/contextual Plan and source media');
  checkpoint(report, 'source inventory complete');
}

async function composition(page, report, locale, id, width) {
  const selectors = id ? ['.rs-hero', '.rs-summary', '.rs-brief', '.rs-related'] : ['.rs-hero', '.rs-needs', '.rs-inspiration', '.rs-other'];
  if (id && serviceById(id).audience === 'business') selectors.splice(2, 0, '.rs-inspiration');
  for (const selector of selectors) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    for (const image of await page.locator(selector + ' img').all()) await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
    await capture(page, report, `${locale}-${id || 'hub'}-${width}-${selector.slice(1)}`);
  }
  const plan = page.locator(id ? '.rs-brief [data-service-plan]' : '.rs-final [data-service-plan]');
  const keyboard = await keyboardVisible(page, plan);
  if (width < 768) await expect(page.locator('.mobile-plan')).toHaveCSS('visibility', 'hidden');
  return { keyboard };
}

async function runCore(browser, report) {
  await runSourceInventory(browser, report, hooks);
  for (const [locale, id, width, height] of [
    ...[undefined, 'tours', 'visa-assistance', 'corporate'].flatMap(id => [['en', id, 1440, 900], ['en', id, 390, 844]]),
    ['ar', undefined, 390, 844], ['ar', 'tours', 390, 844], ['tr', undefined, 1280, 800], ['tr', 'corporate', 1280, 800],
  ]) {
    const { context, page, css } = await fresh(browser, report, locale, id, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    const facts = id ? await detailContent(page, locale, id, hooks) : await hubContent(page, locale, hooks);
    const visual = await composition(page, report, locale, id, width);
    report.cases.push({ locale, id: id || 'hub', width, height, mode: 'composition', facts, visual, css }); await context.close();
  }
  checkpoint(report, 'representative composition complete');
  for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const { context, page } = await fresh(browser, report, locale, undefined, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    const journey = await journeyFlow(page, report, locale, width);
    report.cases.push({ locale, width, height, mode: 'ordered global service journey', journey }); await context.close();
    for (const audience of ['travel', 'pilgrimage', 'business']) {
      const { context, page } = await fresh(browser, report, locale, undefined, width, height);
      const audienceState = await audienceContext(page, report, locale, audience);
      const nextLocale = locale === 'ar' ? 'tr' : 'ar'; await page.locator(`.header .languages a[lang="${nextLocale}"]`).click();
      await page.waitForURL(url => url.pathname === servicePath(nextLocale) && url.searchParams.get('audience') === audience);
      await expect(page.locator(hooks.hubRoot)).toHaveAttribute('data-requested-audience', audience);
      report.cases.push({ locale, width, height, mode: 'audience context', ...audienceState, localePreserved: nextLocale }); await context.close();
    }
  }
  report.checks.push('Twelve EN1440/390,AR390,TR1280 representative hub/tours/visa/business compositions; visible native keyboard Plan; three source Add/drawer/Explore/related/back-forward/reload/locale/ordered explicit-service Contact flows; nine native audience and locale context cases');
  checkpoint(report, 'global journey and audience context complete');
}

async function remainingAudience(browser, report) {
  for (const audience of ['travel', 'pilgrimage', 'business']) {
    const { context, page } = await fresh(browser, report, 'tr', undefined, 1280, 800);
    const audienceState = await audienceContext(page, report, 'tr', audience);
    await page.locator('.header .languages a[lang="ar"]').click();
    await page.waitForURL(url => url.pathname === servicePath('ar') && url.searchParams.get('audience') === audience);
    await expect(page.locator(hooks.hubRoot)).toHaveAttribute('data-requested-audience', audience);
    report.cases.push({ locale: 'tr', width: 1280, height: 800, mode: 'audience context', ...audienceState, localePreserved: 'ar' }); await context.close();
  }
  checkpoint(report, 'three remaining TR audience contexts complete');
}

async function fallbackCases(browser, report, staticArtwork) {
  for (const [locale, id, width, height] of [['en', undefined, 360, 844], ['ar', 'tours', 430, 844], ['tr', 'corporate', 768, 1024]]) {
    const { context, page } = await fresh(browser, report, locale, id, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    for (const chapter of await page.locator('[data-service-chapter]').all()) { await chapter.scrollIntoViewIfNeeded(); await bounds(page); }
    await capture(page, report, `${locale}-${id || 'hub'}-${width}-bounds`);
    report.cases.push({ locale, id: id || 'hub', width, height, mode: 'supplemental bounds' }); await context.close();
  }
  const cases = [['en', undefined, 1440, 900], ['en', 'tours', 1440, 900], ['ar', undefined, 390, 844], ['ar', 'visa-assistance', 390, 844], ['tr', undefined, 1280, 800], ['tr', 'corporate', 1280, 800]];
  for (const mode of ['reduced', 'noJS']) for (const [locale, id, width, height] of cases) {
    const { context, page } = await fresh(browser, report, locale, id, width, height, mode === 'noJS' ? { javaScriptEnabled: false } : { reducedMotion: 'reduce', ...(width < 768 ? { hasTouch: true, isMobile: true } : {}) });
    const facts = id ? await detailContent(page, locale, id, hooks) : await hubContent(page, locale, hooks);
    const artwork = await staticArtwork(page);
    const chosenService = id || 'tailor-made';
    const plan = page.locator(id ? '.rs-brief [data-service-plan]' : '.rs-final [data-service-plan]');
    expect(new URL(await plan.getAttribute('href'), page.url()).searchParams.get('service')).toBe(chosenService);
    const ids = mode === 'reduced' && (!id || !['visa-assistance', 'hajj-umrah'].includes(id)) ? [(id && serviceById(id).audience === 'business' ? inspirationGroups.business : inspirationGroups.travel)[0]] : [];
    if (ids.length) {
      const add = page.locator(`[data-inspiration-place="${ids[0]}"] button.journey-action`); await add.click(); await expect(add).toHaveAttribute('aria-pressed', 'true');
      await journeyState(page, ids, 'tours');
    }
    await plan.scrollIntoViewIfNeeded(); await capture(page, report, `${locale}-${id || 'hub'}-${width}-${mode}-plan`);
    await plan.click(); await page.waitForURL(`**/${locale}/contact?**`);
    const params = new URL(page.url()).searchParams; expect(params.get('service')).toBe(chosenService);
    expect(params.get('journey')).toBe(ids.length ? ids.join(',') : null); expect(params.get('destination')).toBe(ids[0] || null);
    await expect(page.locator('#inquiry-service')).toHaveValue(chosenService);
    await expect(page.locator('#inquiry-message')).toHaveValue(ids.length ? journeyMessage(locale, ids) : '');
    if (mode === 'noJS') {
      await page.goBack({ waitUntil: 'networkidle' });
      const link = page.locator(id ? hooks.related : hooks.needs).first(); const href = await link.getAttribute('href');
      await link.click(); await page.waitForURL('**' + href); await expect(page.locator('h1')).toBeVisible();
    }
    report.cases.push({ locale, id: id || 'hub', width, height, mode, facts, artwork, contextualContactService: chosenService, ids, nativeDiscovery: mode === 'noJS' }); await context.close();
  }
  report.checks.push('360/430/768 bounds; six EN/AR/TR reduced and six no-JS hub/detail source/static/native contextual Plan-to-Contact cases, reduced global Add and no-JS related/need discovery');
  checkpoint(report, 'responsive and fallback complete');
}

const primitivesSource = fs.readFileSync('components/services/ServicePrimitives.tsx', 'utf8');
expect(primitivesSource).not.toMatch(/(?:import|require)[^\n]*(?:gsap|three|lenis|BronzeJourney)/i);
const artworkSelector = '.rs-need-dominant>.photo,.rs-inspiration .rs-place-dominant .photo,.rs-final .rs-route';

function connectionFixture() {
  const connection = new EventTarget(), listeners = new Set();
  const add = connection.addEventListener.bind(connection), remove = connection.removeEventListener.bind(connection);
  connection.saveData = false;
  connection.addEventListener = (type, listener, options) => { if (type === 'change') listeners.add(listener); add(type, listener, options); };
  connection.removeEventListener = (type, listener, options) => { if (type === 'change') listeners.delete(listener); remove(type, listener, options); };
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  window.__qaConnection = connection; window.__qaListeners = listeners;
}

async function staticArtwork(page) {
  await expect(page.locator('.recovery-services')).not.toHaveAttribute('data-service-motion', 'enhanced');
  const result = await page.locator('.recovery-services').evaluate((root, selector) => {
    const targets = [...root.querySelectorAll(selector)];
    return { attributes: targets.map(node => node.getAttribute('data-service-reveal')),
      artwork: targets.flatMap(node => [node, ...node.querySelectorAll('img,path,circle')]).map(node => {
        const css = getComputedStyle(node); return { tag: node.tagName, clip: css.clipPath, transform: css.transform, offset: css.strokeDashoffset, opacity: css.opacity, animations: node.getAnimations().length };
      }) };
  }, artworkSelector);
  expect(result.attributes.every(value => value === null)).toBe(true);
  for (const item of result.artwork) {
    expect(item.animations).toBe(0); expect(item.clip).toBe('none'); expect(item.transform).toBe('none');
    if (item.tag === 'path') expect(Number.parseFloat(item.offset)).toBe(0);
    if (item.tag === 'circle') expect(Number(item.opacity)).toBe(1);
  }
  await expect(page.locator('h1')).toBeVisible(); return result;
}

async function finiteSamples(page, report, selector, kind) {
  report.activeCase.step = 'actual finite ' + kind;
  await expect(page.locator(selector)).toHaveAttribute('data-service-reveal', 'pending');
  const result = await page.evaluate(async ({ selector, kind }) => {
    const node = document.querySelector(selector), image = node.querySelector('img'), path = node.querySelector('path'), circle = node.querySelector('circle');
    const sample = start => {
      const rect = node.getBoundingClientRect();
      return { elapsed: performance.now() - start, wall: Date.now(), reveal: node.dataset.serviceReveal, clip: getComputedStyle(node).clipPath,
        scale: image ? new DOMMatrixReadOnly(getComputedStyle(image).transform).a : null,
        offset: path ? Number.parseFloat(getComputedStyle(path).strokeDashoffset) : null, nodeOpacity: circle ? Number(getComputedStyle(circle).opacity) : null,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        animations: [node, image, path, circle].filter(Boolean).flatMap(target => target.getAnimations().map(animation => ({ name: animation.animationName, currentTime: animation.currentTime, state: animation.playState, duration: animation.effect.getTiming().duration, delay: animation.effect.getTiming().delay, iterations: animation.effect.getTiming().iterations }))) };
    };
    const start = performance.now(), initial = sample(start), rect = node.getBoundingClientRect();
    // Use the actual fixed header height and target rectangle, not a below-fold
    // section's natural bottom. Native scroll and animation are never scrubbed.
    scrollTo({ top: scrollY + rect.top - document.querySelector('.header').getBoundingClientRect().height - 35, behavior: 'instant' });
    const frames = [];
    await new Promise(resolve => { const tick = () => { const frame = sample(start); frames.push(frame); if (frame.elapsed >= 1300) resolve(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return { selector, kind, initial, frames };
  }, { selector, kind });
  (report.motionSamples ||= []).push(result); // Preserve raw evidence before any assertion.
  expect(result.frames.some(frame => frame.reveal === 'visible')).toBe(true);
  const animations = result.frames.flatMap(frame => frame.animations);
  const timing = (name, duration, delay = 0) => {
    const matches = animations.filter(animation => animation.name === name); expect(matches.length, name + ' actually runs').toBeGreaterThan(0);
    for (const animation of matches) { expect(animation.duration).toBe(duration); expect(animation.delay).toBe(delay); expect(animation.iterations).toBe(1); }
    expect(matches.some(animation => animation.state === 'finished'), name + ' actually settles').toBe(true);
  };
  const final = result.frames.at(-1);
  if (kind === 'route') {
    expect(result.initial.offset).toBe(1); timing('rs-route-arrive', 950); timing('rs-node-arrive', 300, 750);
    expect(result.frames.some(frame => frame.offset > .05 && frame.offset < .95), 'actual intermediate route draw').toBe(true);
    expect(final.offset).toBe(0); expect(final.nodeOpacity).toBe(1);
  } else {
    timing('rs-photo-mask', 700); timing('rs-photo-depth', 700); expect(result.initial.clip).toContain('6%');
    expect(result.frames.some(frame => frame.scale > 1.001 && frame.scale < 1.019), 'actual intermediate depth').toBe(true);
    expect(result.frames.some(frame => frame.clip !== result.initial.clip && frame.clip !== final.clip), 'actual intermediate mask').toBe(true);
    expect(final.scale).toBeCloseTo(1, 5);
  }
  await capture(page, report, `${report.activeCase.locale}-${report.activeCase.id}-${report.activeCase.width}-${kind}-settled`);
  return result;
}

async function decodeRecording(browser, report, videoPath, prefix) {
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
    expect(Number.isFinite(metadata.duration)).toBe(true); expect(metadata.duration).toBeGreaterThan(3);
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

async function nativeCases(browser, report) {
  for (const [locale, id, width, height] of [['en', undefined, 1440, 900], ['ar', 'tours', 390, 844]]) {
    const { context, page, requestedScripts } = await fresh(browser, report, locale, id, width, height, { initScript: connectionFixture,
      recordVideo: { dir: path.join(report.artifacts, 'recordings'), size: { width, height } }, ...(width < 768 ? { hasTouch: true, isMobile: true } : {}) });
    await expect(page.locator('.recovery-services')).toHaveAttribute('data-service-motion', 'enhanced');
    const sequence = [];
    if (!id) sequence.push(await finiteSamples(page, report, '.rs-need-dominant>.photo', 'need-photo'));
    sequence.push(await finiteSamples(page, report, '.rs-inspiration .rs-place-dominant .photo', 'inspiration-photo'));
    sequence.push(await finiteSamples(page, report, '.rs-final .rs-route', 'route'));
    expect(requestedScripts.filter(url => /(?:gsap|lenis|three|webgl)/i.test(url))).toEqual([]);
    const video = page.video(); await context.close(); const videoPath = await video.path();
    const decoded = await decodeRecording(browser, report, videoPath, `${locale}-${id || 'hub'}-${width}`);
    report.cases.push({ locale, id: id || 'hub', width, height, mode: 'actual finite native', sequence, recording: videoPath, decoded, requestedScripts, nativeImports: ['Next Link', 'lucide-react', 'React', 'journey', 'JourneyStore', 'SiteShell'], heavyNamedRequests: 0 });
    checkpoint(report, `${locale} actual native recording and decoded frames complete`);
  }
  const { context, page } = await fresh(browser, report, 'en', undefined, 1440, 900, { initScript: connectionFixture });
  const firstPhoto = page.locator('.rs-need-dominant>.photo'); await firstPhoto.scrollIntoViewIfNeeded(); await expect(firstPhoto).toHaveAttribute('data-service-reveal', 'visible');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  const arrowLink = page.locator('[data-need=tours]'), arrow = arrowLink.locator(':scope > svg');
  await arrowLink.hover(); await page.waitForTimeout(160);
  const hover = await arrow.evaluate(node => ({ duration: getComputedStyle(node).transitionDuration, y: new DOMMatrixReadOnly(getComputedStyle(node).transform).f }));
  expect(hover.duration).toBe('0.12s'); expect(hover.y).toBeCloseTo(-2, 5);
  await page.mouse.move(0, 0); await page.waitForTimeout(160); expect(await arrow.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).f)).toBe(0);
  await page.evaluate(() => { window.__qaConnection.saveData = true; window.__qaConnection.dispatchEvent(new Event('change')); }); const saveData = await staticArtwork(page);
  await arrowLink.hover(); expect(await arrow.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).f)).toBe(0);
  await page.evaluate(() => { window.__qaConnection.saveData = false; window.__qaConnection.dispatchEvent(new Event('change')); });
  await expect(firstPhoto).toHaveAttribute('data-service-reveal', 'settled'); expect(await firstPhoto.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
  await page.locator('.motion-choice select').selectOption('reduced'); const siteCalm = await staticArtwork(page);
  await page.locator('.motion-choice select').selectOption('system'); await expect(firstPhoto).toHaveAttribute('data-service-reveal', 'settled');
  await page.emulateMedia({ reducedMotion: 'reduce' }); const systemCalm = await staticArtwork(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await expect(firstPhoto).toHaveAttribute('data-service-reveal', 'settled');
  await page.evaluate(() => { window.__qaDetachedRoot = document.querySelector('.recovery-services'); });
  await page.locator('.rs-final [data-service-plan]').click(); await page.waitForURL('**/en/contact?**');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(0);
  const detached = await page.evaluate(() => ({ connected: window.__qaDetachedRoot.isConnected, motion: window.__qaDetachedRoot.dataset.serviceMotion || null,
    reveals: window.__qaDetachedRoot.querySelectorAll('[data-service-reveal]').length, animations: window.__qaDetachedRoot.getAnimations({ subtree: true }).length }));
  expect(detached).toEqual({ connected: false, motion: null, reveals: 0, animations: 0 });
  await page.goBack({ waitUntil: 'networkidle' }); await expect(page.locator('.recovery-services')).toHaveAttribute('data-service-motion', 'enhanced');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  report.cases.push({ locale: 'en', id: 'hub', mode: 'native cleanup/preferences/SaveData/hover', saveData, siteCalm, systemCalm, hover, detached, remountListeners: 1, seenNeverReplays: true }); await context.close();
  for (const [label, id, initScript, calm] of [
    ['partial SaveData', undefined, () => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }), true],
    ['add-only connection', undefined, () => { window.__qaAddCalls = 0; Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false, addEventListener() { window.__qaAddCalls++; } } }); }, false],
    ['absent IO', undefined, () => Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined }), true],
    ['pilgrimage opts out', 'hajj-umrah', connectionFixture, true],
  ]) {
    const { context, page } = await fresh(browser, report, 'en', id, 1440, 900, { initScript });
    const artwork = calm ? await staticArtwork(page) : null;
    if (label === 'add-only connection') { await expect(page.locator('.recovery-services')).toHaveAttribute('data-service-motion', 'enhanced'); expect(await page.evaluate(() => window.__qaAddCalls)).toBe(0); }
    if (label === 'pilgrimage opts out') expect(await page.evaluate(() => window.__qaListeners.size)).toBe(0);
    report.cases.push({ locale: 'en', id: id || 'hub', mode: label, artwork, noSubscription: label === 'add-only connection' || label === 'pilgrimage opts out' }); await context.close();
  }
  report.checks.push('Actual rAF700ms photo mask/depth and950ms route/1050ms node + two actual WebMs/distinct250ms decoded sheets;120ms hover/calm bypass; site/system/SaveData cleanup/once-only restore; client Contact unmount/remount listeners; partial/add-only/absent IO/pilgrimage opt-out');
}

// Preparation mode executes no application code, output directory or browser.
if (process.env.QA_PREPARE_ONLY === '1') {
  console.log(JSON.stringify({ status: 'preparation pass', services: services.length, localizedRecords: services.length * locales.length,
    sourceOrder: serviceIds, needsMembership: needDestinations,
    related: Object.fromEntries(services.map(service => [service.slug, service.related])),
    groupsInSourceOrder: Object.fromEntries(['travel', 'pilgrimage', 'business'].map(audience => [audience, services.filter(service => service.audience === audience).map(service => service.slug)])),
    inspirationGroups,
    browserLaunched: false, applicationExecuted: false }));
} else {
  const report = createReport(); let browser;
  try {
    const phase = process.env.QA_PHASE || 'full'; expect(['full', 'continue']).toContain(phase); report.phase = phase;
    if (phase === 'continue') report.inheritedCoverage = inheritedCoverage(report);
    browser = await chromium.launch(); report.browserVersion = browser.version();
    if (phase === 'continue') await remainingAudience(browser, report); else await runCore(browser, report);
    await fallbackCases(browser, report, staticArtwork); await nativeCases(browser, report);
    expect(report.errors, 'unexpected runtime/HTTP errors').toEqual([]);
    expect(report.cases).toHaveLength(phase === 'continue' ? 25 : 73);
    report.coverage = { freshCases: report.cases.length, inheritedCases: report.inheritedCoverage?.cases.length || 0,
      combinedCases: report.cases.length + (report.inheritedCoverage?.cases.length || 0), freshFullMatrix: phase === 'full' };
    report.finalFingerprints = fingerprints(); expect(report.finalFingerprints, 'source remains frozen').toEqual(report.sourceFingerprints); report.status = 'pass';
  } catch (error) {
    report.status = 'fail'; report.failure = { message: error.message, stack: error.stack, activeCase: report.activeCase, at: new Date().toISOString() }; process.exitCode = 1;
    if (browser) for (const context of browser.contexts()) for (const page of context.pages()) {
      try { await page.screenshot({ path: path.join(report.artifacts, 'first-failure-' + browser.contexts().indexOf(context) + '.png') }); } catch { /* Preserve original failure. */ }
    }
  } finally {
    if (browser) await browser.close(); report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(report.artifacts, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ status: report.status, cases: report.cases.length, screens: report.screens.length, errors: report.errors.length, artifacts: report.artifacts, failure: report.failure?.message }));
  }
}
