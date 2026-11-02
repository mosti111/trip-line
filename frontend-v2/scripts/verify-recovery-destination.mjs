import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { watchRuntime } from './verify-recovery-motion.mjs';

const base = process.env.QA_URL || 'http://localhost:3003';
const startedAt = new Date().toISOString();
const out = path.resolve('../tmp/frontend-qa/recovery-destination', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
const sourceFiles = ['components/home-v3/DestinationJourney.tsx', 'components/turkiye/DestinationLocalNav.tsx',
  'components/turkiye/DestinationMotion.tsx', 'styles/recovery-destination.css', 'lib/turkiye.ts',
  'components/turkiye/TurkeyMap.tsx', 'components/experience/DestinationPortal.tsx', 'scripts/verify-recovery-destination.mjs'];
const fingerprints = () => Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(fs.readFileSync(path.resolve(file))).digest('hex')]));
const approvedRelated = {
  istanbul: ['bursa', 'cappadocia', 'sapanca'], trabzon: ['rize-ayder', 'uzungol', 'istanbul'],
  'rize-ayder': ['trabzon', 'uzungol', 'sapanca'], uzungol: ['rize-ayder', 'trabzon', 'yalova'],
  antalya: ['fethiye', 'marmaris', 'bodrum'], bodrum: ['marmaris', 'fethiye', 'antalya'],
  fethiye: ['antalya', 'marmaris', 'bodrum'], marmaris: ['bodrum', 'fethiye', 'antalya'],
  sapanca: ['yalova', 'bursa', 'uzungol'], bursa: ['istanbul', 'cappadocia', 'yalova'],
  yalova: ['sapanca', 'bursa', 'istanbul'], cappadocia: ['bursa', 'istanbul', 'rize-ayder'],
};

// Read approved immutable content through TypeScript's syntax tree, without
// executing application modules or importing their framework/client dependencies.
function sourceValue(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(sourceValue);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Unexpected source property');
    return [property.name.getText().replaceAll("'", ''), sourceValue(property.initializer)];
  }));
  if (ts.isCallExpression(node) && node.expression.getText() === 't') {
    const [en, ar, tr] = node.arguments.map(sourceValue); return { en, ar, tr };
  }
  throw new Error('Unsupported source content expression: ' + node.getText());
}
const source = ts.createSourceFile('turkiye.ts', fs.readFileSync('lib/turkiye.ts', 'utf8'), ts.ScriptTarget.Latest, true);
const declaration = source.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(node => node.name.getText() === 'turkishPlaces');
const places = sourceValue(declaration.initializer);
expect(places.map(place => place.slug)).toEqual(Object.keys(approvedRelated));
for (const place of places) { expect(place.related).toEqual(approvedRelated[place.slug]); expect(place.interests).toHaveLength(3); }
const detailSource = ts.createSourceFile('DestinationJourney.tsx', fs.readFileSync('components/home-v3/DestinationJourney.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const portalBindings = [];
function inspectPortals(node) {
  if (ts.isJsxOpeningElement(node) && node.tagName.getText() === 'DestinationPortal') portalBindings.push(node.attributes.properties.find(attribute => attribute.name?.getText() === 'slug')?.initializer?.getText());
  ts.forEachChild(node, inspectPortals);
}
inspectPortals(detailSource);
expect(portalBindings, 'only current hero and different featured related photo receive shared names').toEqual(['{place.slug}', '{featured.slug}']);
const placeById = id => places.find(place => place.slug === id);
const route = (locale, id) => `/${locale}/destinations/turkiye/${id}`;
const message = (locale, ids) => `${{ en: 'Places I would like to visit', ar: 'الأماكن التي أرغب في زيارتها', tr: 'Ziyaret etmek istediğim yerler' }[locale]}: ${ids.map(id => placeById(id).name[locale]).join(' → ')}`;

fs.mkdirSync(out, { recursive: true });
const report = { startedAt, status: 'running', base, artifacts: out, browser: 'Chromium',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sourceFingerprints: fingerprints(),
  cases: [], checks: [], screens: [], errors: [], gaps: ['Independent Astra rendered approval and final Q12 remain required; no physical-device, Safari/Firefox, AT or field-performance certification.'] };

async function bounds(page, label) {
  const state = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter(image => image.complete && image.currentSrc && !image.naturalWidth).map(image => image.currentSrc) }));
  expect(state.documentWidth, label + ' horizontal overflow').toBeLessThanOrEqual(state.width + 1);
  expect(state.broken, label + ' failed loaded media').toEqual([]); return state;
}
async function capture(page, name) {
  await bounds(page, name);
  await page.screenshot({ path: path.join(out, name + '.png') });
  report.screens.push({ name, path: path.join(out, name + '.png'), url: page.url(), viewport: page.viewportSize(), at: new Date().toISOString() });
}

async function journeyState(page, ids, type = 'corporate') {
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tripline-journey')));
  expect(Object.keys(stored).sort(), 'journey persists only non-sensitive allowlisted keys').toEqual(['destinations', 'journeyType']);
  expect(stored.destinations, 'ordered global itinerary').toEqual(ids);
  expect(stored.journeyType).toBe(type);
}
async function openDrawer(page) {
  if (await page.locator('.header-journey').isVisible()) await page.locator('.header-journey').click();
  else {
    await page.locator('.menu-button').click();
    await expect(page.locator('.nav-dialog')).toBeVisible();
    await page.locator('.nav-dialog .dialog-footer > button').click();
  }
  await expect(page.locator('.journey-drawer')).toBeVisible();
}
async function orderedContact(page, locale, ids) {
  await page.waitForURL(`**/${locale}/contact?**`);
  const params = new URL(page.url()).searchParams;
  expect(params.get('journey')).toBe(ids.join(','));
  expect(params.get('destination')).toBe(ids[0]); expect(params.get('service')).toBe('corporate');
  await expect(page.locator('#inquiry-destination')).toHaveValue(ids[0]);
  await expect(page.locator('#inquiry-service')).toHaveValue('corporate');
  await expect(page.locator('#inquiry-message')).toHaveValue(message(locale, ids));
  await page.locator('#inquiry-name').fill('Destination QA');
  await page.locator('#inquiry-email').fill('qa@example.com');
  await page.locator('#inquiry-consent').check();
  await page.locator('#inquiry button[type=submit]').click();
  await expect(page.locator('.inquiry-result')).toBeVisible();
  const prepared = new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');
  expect(prepared).toContain(message(locale, ids)); expect(prepared).toContain('Destination QA');
  await journeyState(page, ids);
  await page.locator('#inquiry-message').fill('Updated destination inquiry');
  await expect(page.locator('.inquiry-result')).toHaveCount(0);
}

async function fresh(browser, locale, id, width = 1440, height = 900, options = {}) {
  report.activeCase = { locale, id, width, height, options, step: 'fresh direct navigation' };
  const { initScript, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width, height }, ...contextOptions });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage(); watchRuntime(page, report, `${locale}-${id}-${width}`);
  const css = [], pending = [];
  const requestedScripts = [];
  page.on('request', request => { if (request.resourceType() === 'script') requestedScripts.push(request.url()); });
  page.on('response', response => {
    if (response.status() === 200 && response.url().includes('.css')) pending.push(response.text().then(body => css.push({ url: response.url(), destination: body.includes('.recovery-destination'), locator: body.includes('.rt-map-locator') })));
  });
  await page.goto(base + route(locale, id), { waitUntil: 'networkidle' }); await Promise.all(pending);
  expect(css.some(item => item.destination), 'fresh detail navigation owns destination CSS').toBe(true);
  expect(css.some(item => item.locator), 'fresh detail navigation owns shared locator CSS').toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('.recovery-destination')).toHaveAttribute('data-destination', id);
  await expect(page.locator('.pin-spacer')).toHaveCount(0); await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-lenis-count', '1');
  return { context, page, css, requestedScripts };
}

async function content(page, locale, id) {
  const place = placeById(id), root = page.locator('.recovery-destination');
  await expect(page.locator('h1')).toHaveCount(1); await expect(root.locator('h1')).toHaveText(place.name[locale]);
  await expect(root.locator('.rd-arrival-copy > p')).toHaveText(place.note[locale]);
  await expect(root.locator('.rd-source-note')).toHaveText(place.note[locale]);
  await expect(root.locator('.rd-interest h3')).toHaveText(place.interests.map(item => item[locale]));
  expect(await root.locator('[data-destination-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.destinationChapter))).toEqual(Array.from({ length: 11 }, (_, index) => String(index + 1).padStart(2, '0')));
  const chapters = root.locator('[data-destination-chapter]');
  for (let index = 0; index < 11; index++) expect(await chapters.nth(index).locator(index ? 'h2' : 'h1').count()).toBeGreaterThan(0);
  await expect(root.locator('.rd-related [data-related]')).toHaveCount(3);
  expect(await root.locator('.rd-related [data-related]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.related, href: node.getAttribute('href') })))).toEqual(approvedRelated[id].map(relatedId => ({ id: relatedId, href: route(locale, relatedId) })));
  for (const relatedId of approvedRelated[id]) await expect(root.locator(`[data-related="${relatedId}"]`)).toContainText(placeById(relatedId).name[locale]);
  expect(await root.locator('.rd-service-links > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(['tours', 'flights-hotels', 'tailor-made'].map(slug => `/${locale}/services/${slug}`));
  await expect(root.locator('.rd-wayfinding a')).toHaveAttribute('href', `/${locale}/destinations/turkiye`);
  await expect(root.locator('.rd-coordinate')).toHaveText(Array(4).fill(`${place.lat.toFixed(2)}° N / ${place.lon.toFixed(2)}° E`));
  for (const coordinate of await root.locator('.rd-coordinate').all()) await expect(coordinate).toHaveAttribute('dir', 'ltr');
  const map = root.locator('.rt-map-locator');
  await expect(map).toHaveCount(1); await expect(map).toHaveAttribute('dir', 'ltr');
  const selected = map.locator('.rt-map-pin[aria-pressed=true]');
  await expect(selected).toHaveCount(1); await expect(selected).toHaveAttribute('aria-label', place.name[locale]);
  await expect(map.locator('.rt-map-pin:disabled')).toHaveCount(12);
  const pinStyles = await map.evaluate(host => [...host.querySelectorAll('.rt-map-pin')].map(node => ({ selected: node.getAttribute('aria-pressed') === 'true', background: getComputedStyle(node).backgroundColor, color: getComputedStyle(node).color })));
  const activeStyle = pinStyles.find(item => item.selected);
  expect(['rgb(200, 144, 57)', 'rgb(215, 170, 77)'], 'actual locator selection is bronze').toContain(activeStyle.background);
  expect(pinStyles.filter(item => !item.selected).every(item => item.background !== activeStyle.background), 'current locator is visibly distinct').toBe(true);
  const luminance = color => color.match(/\d+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const foreground = luminance(activeStyle.color), background = luminance(activeStyle.background);
  expect((Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05), 'small locator number stays readable').toBeGreaterThanOrEqual(4.5);
  const geo = await map.evaluate((host, place) => {
    const anchors = [...host.querySelectorAll('.rt-anchor')];
    const selected = anchors.find(node => Number(node.getAttribute('r')) === 5);
    const center = node => { const rect = node.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; };
    return { direction: getComputedStyle(host).direction, selected: { x: Number(selected.getAttribute('cx')), y: Number(selected.getAttribute('cy')) },
      source: { x: (place.lon - 25) * 40, y: (43 - place.lat) * 52 }, istanbul: center(anchors[0]), trabzon: center(anchors[1]), antalya: center(anchors[4]),
      matrices: [host.querySelector('.rt-map-canvas'), host.querySelector('svg')].map(node => { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); return { x: matrix.a, y: matrix.d }; }) };
  }, place);
  expect(geo.selected.x).toBeCloseTo(geo.source.x, 5); expect(geo.selected.y).toBeCloseTo(geo.source.y, 5);
  expect(geo.direction).toBe('ltr'); for (const matrix of geo.matrices) { expect(matrix.x).toBeGreaterThan(0); expect(matrix.y).toBeGreaterThan(0); }
  expect(geo.trabzon.x).toBeGreaterThan(geo.istanbul.x); expect(geo.antalya.y).toBeGreaterThan(geo.istanbul.y);
  const portalNames = await root.evaluate(root => [...root.querySelectorAll('*')].map(node => getComputedStyle(node).viewTransitionName).filter(name => name && name !== 'none' && name !== 'auto'));
  expect(new Set(portalNames).size, 'simultaneous named transition surfaces are unique').toBe(portalNames.length);
  await bounds(page, locale + '/' + id);
  return { related: approvedRelated[id], geography: geo, locatorPinStyles: pinStyles, namedPortalSurfaces: portalNames };
}

async function headerClearance(page, target) {
  await expect.poll(() => page.evaluate(target => {
    const heading = document.querySelector(target).querySelector('h2,h3');
    const header = document.querySelector('.header').getBoundingClientRect();
    const nav = document.querySelector('.rd-local-nav').getBoundingClientRect();
    const rect = heading.getBoundingClientRect();
    return rect.top >= Math.max(header.bottom, nav.bottom) - 1 && rect.bottom <= innerHeight + 1;
  }, target)).toBe(true);
  const state = await page.evaluate(target => {
    const heading = document.querySelector(target).querySelector('h2,h3').getBoundingClientRect();
    const header = document.querySelector('.header').getBoundingClientRect();
    const nav = document.querySelector('.rd-local-nav').getBoundingClientRect();
    return { top: heading.top, bottom: heading.bottom, safeTop: Math.max(header.bottom, nav.bottom), viewport: innerHeight };
  }, target);
  expect(state.top, 'anchored heading clears global header and local navigation').toBeGreaterThanOrEqual(state.safeTop - 1);
  expect(state.bottom, 'anchored heading is readable in viewport').toBeLessThanOrEqual(state.viewport + 1);
  return state;
}

async function localNavigation(page, width) {
  const targets = ['place-overview', 'place-experience', 'place-plan', 'place-services', 'place-continue'];
  expect(await page.locator('.rd-nav-links a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(targets.map(id => '#' + id));
  const results = [];
  if (width >= 768) {
    await page.locator('.rd-local-nav').evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top + 30, behavior: 'instant' }));
    await expect.poll(() => page.locator('.rd-local-nav').evaluate(node => Math.abs(node.getBoundingClientRect().top - document.querySelector('.header').getBoundingClientRect().bottom))).toBeLessThanOrEqual(1);
    results.push({ stickyPastNaturalPosition: true, top: await page.locator('.rd-local-nav').evaluate(node => node.getBoundingClientRect().top) });
    for (const id of targets) {
      const link = page.locator(`.rd-nav-links a[href="#${id}"]`);
      await link.focus(); await page.keyboard.press('Enter');
      await expect.poll(() => new URL(page.url()).hash).toBe('#' + id);
      await page.waitForTimeout(160);
      await expect(link).toHaveAttribute('aria-current', 'location');
      const sticky = await page.locator('.rd-local-nav').evaluate(node => ({ position: getComputedStyle(node).position, top: node.getBoundingClientRect().top, headerBottom: document.querySelector('.header').getBoundingClientRect().bottom }));
      expect(sticky.position).toBe('sticky'); expect(sticky.top).toBeGreaterThanOrEqual(sticky.headerBottom - 1);
      results.push({ id, ...await headerClearance(page, '#' + id) });
    }
  } else {
    const select = page.locator('#destination-chapter');
    await select.selectOption('place-overview'); await select.focus();
    await expect(select).toBeFocused();
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    await expect.poll(() => new URL(page.url()).hash).toBe('#place-experience');
    await expect(select).toHaveValue('place-experience');
    results.push({ keyboard: true, id: 'place-experience', ...await headerClearance(page, '#place-experience') });
    // Native hash navigation moves the sequential focus starting point into the
    // section, just as a plain select/location.hash baseline does. Require usable
    // forward continuation instead of forcing focus back into the selector.
    await page.keyboard.press('Tab');
    await expect(page.locator('#place-add button.journey-action')).toBeFocused();
    const continuation = await page.evaluate(() => {
      const node = document.activeElement, rect = node.getBoundingClientRect();
      return { tag: node.tagName, class: node.className, top: rect.top, bottom: rect.bottom, viewport: innerHeight,
        safeTop: Math.max(document.querySelector('.header').getBoundingClientRect().bottom, document.querySelector('.rd-local-nav').getBoundingClientRect().bottom) };
    });
    expect(continuation.top).toBeGreaterThanOrEqual(continuation.safeTop - 1); expect(continuation.bottom).toBeLessThanOrEqual(continuation.viewport + 1);
    results.push({ nativeHashFocusTransfer: true, tabContinuesToAdd: continuation });
    for (const id of targets) {
      await select.selectOption(id); await page.waitForTimeout(160);
      await expect(select).toHaveValue(id);
      results.push({ id, ...await headerClearance(page, '#' + id) });
    }
  }
  return results;
}

async function longSectionNavigation(page, width) {
  const order = [
    ['place-overview', 'overview'], ['place-locate', 'overview'], ['place-experience', 'experience'],
    ['place-feel', 'experience'], ['place-add', 'plan'], ['place-services', 'trip-line'],
    ['place-process', 'trip-line'], ['place-plan', 'plan'], ['place-continue', 'continue'], ['place-final', 'continue'],
  ];
  const navTargets = { overview: 'place-overview', experience: 'place-experience', plan: 'place-plan', 'trip-line': 'place-services', continue: 'place-continue' };
  const states = [];
  for (const [direction, steps] of [['forward', order], ['reverse', [...order].reverse()]]) {
    for (const [id, key] of steps) {
      await page.locator('#' + id).evaluate(node => {
        const rect = node.getBoundingClientRect();
        const header = document.querySelector('.header').getBoundingClientRect();
        const nav = document.querySelector('.rd-local-nav').getBoundingClientRect();
        const offset = Math.max(header.bottom, nav.bottom) + 20;
        const middle = Math.min(rect.height * .4, Math.max(0, rect.height - innerHeight * .6));
        scrollTo({ top: scrollY + rect.top + middle - offset, behavior: 'instant' });
      });
      const current = page.locator('.rd-nav-links a[aria-current=location]');
      await expect(current).toHaveCount(1);
      await expect(current, `${direction} long-section active chapter ${id}`).toHaveAttribute('href', '#' + navTargets[key]);
      if (width < 768) await expect(page.locator('#destination-chapter')).toHaveValue(navTargets[key]);
      states.push({ direction, id, active: key, scrollY: await page.evaluate(() => scrollY) });
    }
  }
  return states;
}

async function composition(page, locale, id, width) {
  const prefix = `${locale}-${id}-${width}`;
  for (const selector of ['.rd-arrival', '.rd-locate', '#place-interest-1', '#place-interest-3', '.rd-plan', '.rd-related', '.rd-final']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    const images = page.locator(selector + ' img');
    for (const image of await images.all()) await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
    const orientation = await images.evaluateAll(images => images.every(image => {
      for (let node = image; node && !node.classList.contains('recovery-destination'); node = node.parentElement) {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); if (matrix.a <= 0 || matrix.d <= 0) return false;
      } return true;
    }));
    expect(orientation, 'source photography is never mirrored').toBe(true);
    await capture(page, prefix + '-' + selector.replaceAll(/[.#]/g, ''));
  }
  if (width < 768) {
    await page.locator('.rd-plan').scrollIntoViewIfNeeded();
    await expect(page.locator('.mobile-plan')).toHaveCSS('visibility', 'hidden');
    await capture(page, prefix + '-sticky-suppressed');
  }
}

async function journeyFlow(page, locale, width) {
  // Exactly one deterministic session setup; every later route/reload/locale
  // assertion reads persisted application state without resetting it.
  await page.evaluate(() => sessionStorage.setItem('tripline-journey', JSON.stringify({ destinations: ['trabzon'], journeyType: 'corporate' })));
  await page.reload({ waitUntil: 'networkidle' });
  const addLabel = { en: 'Add to journey', ar: 'أضف إلى الرحلة', tr: 'Yolculuğa ekle' };
  const add = id => page.locator('.recovery-destination').getByRole('button', { name: `${addLabel[locale]}: ${placeById(id).name[locale]}`, exact: true }).first();
  await add('istanbul').click(); await add('istanbul').click();
  const firstIds = ['trabzon', 'istanbul']; await journeyState(page, firstIds);
  await openDrawer(page);
  await expect(page.locator('.journey-stops li > a')).toHaveText(firstIds.map(id => placeById(id).name[locale]));
  await page.keyboard.press('Escape'); await expect(page.locator('.journey-drawer')).not.toBeVisible();
  await page.locator('[data-related="bursa"]').click(); await page.waitForURL('**' + route(locale, 'bursa'));
  await expect(page.locator('h1')).toHaveText(placeById('bursa').name[locale]); await journeyState(page, firstIds);
  await page.goBack({ waitUntil: 'networkidle' }); await expect(page.locator('h1')).toHaveText(placeById('istanbul').name[locale]);
  await page.goForward({ waitUntil: 'networkidle' }); await expect(page.locator('h1')).toHaveText(placeById('bursa').name[locale]);
  await add('bursa').click(); const ids = [...firstIds, 'bursa']; await journeyState(page, ids);
  await page.reload({ waitUntil: 'networkidle' }); await journeyState(page, ids);
  const nextLocale = locale === 'ar' ? 'tr' : 'ar';
  await page.locator(`.header .languages a[lang=${nextLocale}]`).click(); await page.waitForURL('**' + route(nextLocale, 'bursa'));
  await expect(page.locator('h1')).toHaveText(placeById('bursa').name[nextLocale]); await journeyState(page, ids);
  await page.locator('.rd-plan a.journey-action-primary').click(); await orderedContact(page, nextLocale, ids);
  await capture(page, `${locale}-${width}-ordered-contact-${nextLocale}`);
  return { ids, service: 'corporate', locale: nextLocale, backForward: true, reload: true, exactPreparedMessage: true, personalDataNotPersisted: true };
}

async function runCore(browser) {
  for (const locale of ['en', 'ar', 'tr']) for (const place of places) {
    const { context, page, css } = await fresh(browser, locale, place.slug);
    report.cases.push({ locale, id: place.slug, width: 1440, height: 900, mode: 'source inventory', directCss: css, ...await content(page, locale, place.slug) });
    await context.close();
  }
  const representative = ['istanbul', 'rize-ayder', 'antalya', 'cappadocia'];
  for (const [locale, id, width, height] of [
    ...representative.flatMap(id => [['en', id, 1440, 900], ['en', id, 390, 844]]),
    ['ar', 'rize-ayder', 390, 844], ['tr', 'antalya', 1280, 800],
  ]) {
    const { context, page } = await fresh(browser, locale, id, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    await composition(page, locale, id, width);
    const navigation = await localNavigation(page, width);
    const longSections = await longSectionNavigation(page, width);
    report.cases.push({ locale, id, width, height, mode: 'composition', navigation, longSections }); await context.close();
  }
  for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const { context, page } = await fresh(browser, locale, 'istanbul', width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    const journey = await journeyFlow(page, locale, width);
    report.cases.push({ locale, id: 'istanbul', width, height, mode: 'global journey', journey }); await context.close();
  }
  report.checks.push('36 fresh direct localized source records/eleven parts/curated related order/real locator; ten representative compositions and native keyboard/header-clearance navigation; three actual ordered global journey/drawer/back-forward/reload/locale/Contact flows');
}

async function fallbackCases(browser, staticArtwork) {
  for (const [locale, id, width, height] of [['en', 'cappadocia', 360, 844], ['ar', 'rize-ayder', 430, 844], ['tr', 'istanbul', 768, 1024]]) {
    const { context, page } = await fresh(browser, locale, id, width, height, width < 768 ? { hasTouch: true, isMobile: true } : {});
    for (const chapter of await page.locator('[data-destination-chapter]').all()) { await chapter.scrollIntoViewIfNeeded(); await bounds(page, locale + '/' + width); }
    report.cases.push({ locale, id, width, height, mode: 'supplemental bounds' });
    await capture(page, `${locale}-${id}-${width}-bounds`); await context.close();
  }
  for (const [locale, id, width, height] of [['en', 'istanbul', 1440, 900], ['ar', 'rize-ayder', 390, 844], ['tr', 'antalya', 1280, 800]]) {
    const { context, page } = await fresh(browser, locale, id, width, height, { reducedMotion: 'reduce', ...(width < 768 ? { hasTouch: true, isMobile: true } : {}) });
    await content(page, locale, id); const artwork = await staticArtwork(page);
    await page.locator('.rd-arrival button.journey-action').click();
    await expect(page.locator('.rd-arrival button.journey-action')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.rd-arrival a.journey-action-primary').click();
    await page.waitForURL(`**/${locale}/contact?**`);
    const params = new URL(page.url()).searchParams;
    expect(params.get('journey')).toBe(id); expect(params.get('destination')).toBe(id); expect(params.get('service')).toBe('tours');
    await expect(page.locator('#inquiry-message')).toHaveValue(message(locale, [id]));
    report.cases.push({ locale, id, width, height, mode: 'reduced', artwork, addPlanToContact: true });
    await capture(page, `${locale}-${id}-${width}-reduced-contact`); await context.close();
  }
  for (const [locale, id, width, height] of [['en', 'istanbul', 1440, 900], ['ar', 'rize-ayder', 390, 844], ['tr', 'antalya', 1280, 800]]) {
    const { context, page } = await fresh(browser, locale, id, width, height, { javaScriptEnabled: false });
    await content(page, locale, id);
    if (width < 768) expect(!await page.locator('#destination-chapter').isVisible() || await page.locator('#destination-chapter').isDisabled(), 'no-JS visitor does not see a misleading active inert selector').toBe(true);
    await expect(page.locator('.rd-plan a.journey-action-primary')).toHaveAttribute('href', new RegExp(`^/${locale}/contact\\?`));
    const nativeParams = new URL(await page.locator('.rd-plan a.journey-action-primary').getAttribute('href'), base).searchParams;
    expect(nativeParams.get('journey')).toBe(id); expect(nativeParams.get('destination')).toBe(id);
    const native = page.locator(width < 768 ? '.rd-nav-native' : '.rd-nav-links').locator('a[href="#place-overview"]');
    await native.click(); await headerClearance(page, '#place-overview');
    await capture(page, `${locale}-${id}-${width}-no-js-overview`);
    await page.locator('.rd-related [data-related]').first().click();
    await page.waitForURL('**' + route(locale, approvedRelated[id][0]));
    await expect(page.locator('h1')).toHaveText(placeById(approvedRelated[id][0]).name[locale]);
    await page.locator('.rd-wayfinding a').click(); await page.waitForURL(`**/${locale}/destinations/turkiye`);
    await expect(page.locator('.recovery-hub')).toBeVisible();
    report.cases.push({ locale, id, width, height, mode: 'noJS', nativeRelatedAndHub: true, contextualPlan: true }); await context.close();
  }
  report.checks.push('360/430/768 bounds, EN/AR/TR reduced static artwork with functional Add/Plan/Contact, and no-JS source/locator/native anchors/contextual planning/related/back-to-hub navigation');
}

// Native hooks are the delivered controller/CSS, not an assumed framework.
const motionSource = fs.readFileSync('components/turkiye/DestinationMotion.tsx', 'utf8');
expect(motionSource).not.toMatch(/(?:import|require)[^\n]*(?:gsap|three|lenis|BronzeJourney)/i);

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
  await expect(page.locator('.recovery-destination')).not.toHaveAttribute('data-destination-motion', 'enhanced');
  const state = await page.locator('.recovery-destination').evaluate(root => {
    const targets = [...root.querySelectorAll('.rd-interest-photo,.rd-feel,.rd-final-route')];
    return { revealAttributes: targets.map(node => node.getAttribute('data-destination-reveal')),
      artworks: targets.flatMap(node => [node, ...node.querySelectorAll('.photo,path,circle')]).map(node => {
        const css = getComputedStyle(node); return { clip: css.clipPath, transform: css.transform, offset: css.strokeDashoffset, opacity: css.opacity, animations: node.getAnimations().length, tag: node.tagName };
      }) };
  });
  expect(state.revealAttributes).toEqual(Array(5).fill(null));
  for (const item of state.artworks) {
    expect(item.animations, 'calm artwork has no running/filled animation').toBe(0);
    expect(item.clip).toBe('none'); expect(item.transform).toBe('none');
    if (item.tag === 'path') expect(Number.parseFloat(item.offset)).toBe(0);
    if (item.tag === 'circle') expect(Number(item.opacity)).toBe(1);
  }
  await expect(page.locator('h1')).toBeVisible(); return state;
}

async function finiteSamples(page, selector, kind) {
  report.activeCase.step = 'actual finite ' + kind;
  await expect(page.locator(selector)).toHaveAttribute('data-destination-reveal', 'pending');
  // Scroll and collect on rAF without screenshot/Node round trips obscuring the
  // short intermediate states. Never alter CSS animation currentTime/progress.
  const result = await page.evaluate(async ({ selector, kind }) => {
    const node = document.querySelector(selector), photo = node.querySelector('.photo');
    const path = node.querySelector('path'), circle = node.querySelector('circle');
    const sample = start => {
      const css = getComputedStyle(node), image = photo && getComputedStyle(photo);
      const rect = node.getBoundingClientRect();
      return { elapsed: performance.now() - start, wall: Date.now(), reveal: node.dataset.destinationReveal,
        clip: css.clipPath, scale: image ? new DOMMatrixReadOnly(image.transform).a : null,
        offset: path ? Number.parseFloat(getComputedStyle(path).strokeDashoffset) : null,
        nodeOpacity: circle ? Number(getComputedStyle(circle).opacity) : null,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        animations: [node, photo, path, circle].filter(Boolean).flatMap(target => target.getAnimations().map(animation => ({ name: animation.animationName, currentTime: animation.currentTime, state: animation.playState, duration: animation.effect.getTiming().duration, delay: animation.effect.getTiming().delay, iterations: animation.effect.getTiming().iterations }))) };
    };
    const start = performance.now(), initial = sample(start);
    const rect = node.getBoundingClientRect();
    // On fresh arrival the nav is still below the hero. Its natural bottom is
    // not a viewport inset; use the measured bar heights for post-scroll sticky.
    const bars = document.querySelector('.header').getBoundingClientRect().height + document.querySelector('.rd-local-nav').getBoundingClientRect().height;
    scrollTo({ top: scrollY + rect.top - bars - 35, behavior: 'instant' });
    const frames = [];
    await new Promise(resolve => {
      const tick = () => { const state = sample(start); frames.push(state); if (state.elapsed >= 1500) resolve(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    return { kind, selector, initial, frames };
  }, { selector, kind });
  (report.motionSamples ||= []).push(result);
  expect(result.frames.some(frame => frame.reveal === 'visible')).toBe(true);
  const animations = result.frames.flatMap(frame => frame.animations);
  const timing = (name, duration, delay = 0) => {
    const matches = animations.filter(animation => animation.name === name);
    expect(matches.length, name + ' actual animation exists').toBeGreaterThan(0);
    for (const animation of matches) { expect(animation.duration).toBe(duration); expect(animation.delay).toBe(delay); expect(animation.iterations).toBe(1); }
    expect(matches.some(animation => animation.state === 'finished'), name + ' actually settles').toBe(true);
  };
  const last = result.frames.at(-1);
  if (kind === 'route') {
    expect(result.initial.offset).toBe(1); timing('rd-route-arrive', 1100); timing('rd-node-arrive', 300, 950);
    expect(result.frames.some(frame => frame.offset > .05 && frame.offset < .95), 'actual intermediate route drawing').toBe(true);
    expect(last.offset).toBe(0); expect(last.nodeOpacity).toBe(1);
  } else {
    timing('rd-image-depth', kind === 'feel' ? 950 : 850);
    expect(result.frames.some(frame => frame.scale > 1.001 && frame.scale < 1.034), 'actual intermediate photo depth').toBe(true);
    expect(last.scale).toBeCloseTo(1, 5);
    if (kind === 'interest') {
      timing('rd-image-mask', 850); expect(result.initial.clip).toContain('8%');
      expect(result.frames.some(frame => frame.clip !== result.initial.clip && frame.clip !== last.clip), 'actual intermediate photo mask').toBe(true);
    }
  }
  await capture(page, report.activeCase.locale + '-' + report.activeCase.width + '-' + kind + '-settled');
  return result;
}

async function decodeRecording(browser, videoPath, prefix) {
  const context = await browser.newContext(), page = await context.newPage();
  try {
    await page.route('http://qa-evidence.local/**', async route => {
      if (route.request().url().endsWith('/clip')) await route.fulfill({ contentType: 'video/webm', body: fs.readFileSync(videoPath) });
      else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><video id="recording" muted playsinline></video><canvas id="sheet"></canvas>' });
    });
    await page.goto('http://qa-evidence.local/');
    const metadata = await page.evaluate(async () => {
      const video = document.querySelector('video');
      const blob = await (await fetch('/clip')).blob(); video.src = URL.createObjectURL(blob);
      await new Promise((resolve, reject) => { video.addEventListener('loadeddata', resolve, { once: true }); video.addEventListener('error', reject, { once: true }); });
      return { duration: video.duration, width: video.videoWidth, height: video.videoHeight };
    });
    expect(Number.isFinite(metadata.duration)).toBe(true); expect(metadata.duration).toBeGreaterThan(3);
    const times = Array.from({ length: Math.ceil(metadata.duration / .25) }, (_, index) => index * .25).filter(time => time + .001 < metadata.duration);
    const extracted = await page.evaluate(async ({ times, prefix }) => {
      const video = document.querySelector('video'), canvas = document.querySelector('canvas');
      const width = Math.round(Math.min(360, video.videoWidth)), height = Math.round(video.videoHeight * width / video.videoWidth);
      const columns = video.videoWidth < 600 ? 8 : 4;
      canvas.width = columns * width; canvas.height = Math.ceil(times.length / columns) * (height + 24);
      const ctx = canvas.getContext('2d'), frames = []; ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < times.length; index++) {
        const requested = times[index] + .001;
        await new Promise(resolve => { video.addEventListener('seeked', resolve, { once: true }); video.currentTime = requested; });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const x = (index % columns) * width, y = Math.floor(index / columns) * (height + 24);
        ctx.drawImage(video, x, y + 24, width, height); ctx.fillStyle = '#071f20'; ctx.font = '12px sans-serif';
        ctx.fillText(prefix + ' actual ' + video.currentTime.toFixed(3) + 's', x + 4, y + 17);
        frames.push({ requested, currentTime: video.currentTime });
      }
      URL.revokeObjectURL(video.src); return { frames, data: canvas.toDataURL('image/png') };
    }, { times, prefix });
    for (const frame of extracted.frames) expect(Math.abs(frame.currentTime - frame.requested), 'decoded actual distinct requested time').toBeLessThan(.02);
    expect(new Set(extracted.frames.map(frame => frame.currentTime)).size).toBe(times.length);
    const sheet = path.join(out, prefix + '-actual-native-frames.png');
    fs.writeFileSync(sheet, Buffer.from(extracted.data.split(',')[1], 'base64'));
    return { origin: videoPath, sheet, ...metadata, interval: .25, frames: extracted.frames, method: 'full recording Blob, distinct currentTime + seeked + two rAF; no application scrubbing' };
  } finally { await context.close(); }
}

async function nativeCases(browser) {
  for (const [locale, id, width, height] of [['en', 'istanbul', 1440, 900], ['ar', 'rize-ayder', 390, 844]]) {
    const { context, page, requestedScripts } = await fresh(browser, locale, id, width, height, {
      initScript: connectionFixture, recordVideo: { dir: path.join(out, 'recordings'), size: { width, height } },
      ...(width < 768 ? { hasTouch: true, isMobile: true } : {}),
    });
    await expect(page.locator('.recovery-destination')).toHaveAttribute('data-destination-motion', 'enhanced');
    const sequence = [];
    sequence.push(await finiteSamples(page, '#place-interest-1 .rd-interest-photo', 'interest'));
    sequence.push(await finiteSamples(page, '.rd-feel', 'feel'));
    sequence.push(await finiteSamples(page, '.rd-final-route', 'route'));
    expect(requestedScripts.filter(url => /(?:gsap|lenis|three|webgl)/i.test(url)), 'detail does not request named heavy runtime chunks').toEqual([]);
    const video = page.video(); await context.close(); const videoPath = await video.path();
    const decoded = await decodeRecording(browser, videoPath, locale + '-' + width);
    report.cases.push({ locale, id, width, height, mode: 'actual finite native motion', sequence, recording: videoPath, decoded, requestedScripts, nativeSourceImports: ['react', 'SiteShell'], heavyNamedChunks: 0 });
  }

  const { context, page } = await fresh(browser, 'en', 'istanbul', 1440, 900, { initScript: connectionFixture });
  await page.locator('#place-interest-1 .rd-interest-photo').scrollIntoViewIfNeeded();
  await expect(page.locator('#place-interest-1 .rd-interest-photo')).toHaveAttribute('data-destination-reveal', 'visible');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  await page.evaluate(() => { window.__qaConnection.saveData = true; window.__qaConnection.dispatchEvent(new Event('change')); });
  const saveData = await staticArtwork(page);
  await page.evaluate(() => { window.__qaConnection.saveData = false; window.__qaConnection.dispatchEvent(new Event('change')); });
  await expect(page.locator('#place-interest-1 .rd-interest-photo')).toHaveAttribute('data-destination-reveal', 'settled');
  expect(await page.locator('#place-interest-1 .rd-interest-photo').evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
  await page.locator('.footer .motion-choice select').selectOption('reduced'); const siteCalm = await staticArtwork(page);
  await page.locator('.footer .motion-choice select').selectOption('system');
  await expect(page.locator('#place-interest-1 .rd-interest-photo')).toHaveAttribute('data-destination-reveal', 'settled');
  await page.emulateMedia({ reducedMotion: 'reduce' }); const systemCalm = await staticArtwork(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#place-interest-1 .rd-interest-photo')).toHaveAttribute('data-destination-reveal', 'settled');
  await page.evaluate(() => { window.__qaDetachedRoot = document.querySelector('.recovery-destination'); });
  await page.locator('.rd-service-links a').first().click(); await page.waitForURL('**/en/services/tours');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(0);
  const detached = await page.evaluate(() => ({ connected: window.__qaDetachedRoot.isConnected, motion: window.__qaDetachedRoot.dataset.destinationMotion || null,
    reveals: window.__qaDetachedRoot.querySelectorAll('[data-destination-reveal]').length, animations: window.__qaDetachedRoot.getAnimations({ subtree: true }).length }));
  expect(detached).toEqual({ connected: false, motion: null, reveals: 0, animations: 0 });
  await page.goBack({ waitUntil: 'networkidle' });
  await expect(page.locator('.recovery-destination')).toHaveAttribute('data-destination-motion', 'enhanced');
  await expect.poll(() => page.evaluate(() => window.__qaListeners.size)).toBe(1);
  report.cases.push({ locale: 'en', id: 'istanbul', mode: 'cleanup / preference / SaveData', saveData, siteCalm, systemCalm, detached, remountListeners: 1, seenNeverReplays: true });
  await context.close();

  for (const [label, initScript, shouldBeStatic] of [
    ['partial SaveData', () => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }), true],
    ['add-only connection', () => { window.__qaAddCalls = 0; Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false, addEventListener() { window.__qaAddCalls++; } } }); }, false],
    ['absent IntersectionObserver', () => Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined }), true],
  ]) {
    const { context, page } = await fresh(browser, 'en', 'istanbul', 1440, 900, { initScript });
    const artwork = shouldBeStatic ? await staticArtwork(page) : null;
    if (label === 'add-only connection') { await expect(page.locator('.recovery-destination')).toHaveAttribute('data-destination-motion', 'enhanced'); expect(await page.evaluate(() => window.__qaAddCalls)).toBe(0); }
    await content(page, 'en', 'istanbul');
    report.cases.push({ locale: 'en', id: 'istanbul', mode: label, artwork, addOnlySubscribed: label === 'add-only connection' ? false : undefined }); await context.close();
  }
  report.checks.push('Actual rAF finite 850ms mask/depth,950ms Feel and1100ms route/1250ms node; actual WebM plus distinct-time decoded frames; native import isolation, SaveData/system/site cleanup and once-only restore; client-route unmount/remount listener cleanup; partial/add-only/absent IO resilience');
}

let browser;
try {
  const phase = process.env.QA_PHASE;
  expect([undefined, 'native']).toContain(phase);
  if (phase === 'native') {
    expect(process.env.QA_PRIOR_REPORT, 'native continuation requires its exact prior report').toBeTruthy();
    const priorPath = path.resolve(process.env.QA_PRIOR_REPORT), bytes = fs.readFileSync(priorPath), prior = JSON.parse(bytes);
    expect(prior.status).toBe('fail'); expect(prior.errors).toEqual([]); expect(prior.cases).toHaveLength(58);
    expect(prior.failure.activeCase.step).toBe('actual finite interest');
    expect(prior.sourceFingerprints['scripts/verify-recovery-destination.mjs']).toBe('61b5541fe893da2e3d276539a6ad1742b1e08744812111820dab05045bba0742');
    for (const file of sourceFiles.filter(file => file !== 'scripts/verify-recovery-destination.mjs')) expect(prior.sourceFingerprints[file], 'inherited immutable source ' + file).toBe(report.sourceFingerprints[file]);
    report.inheritedCoverage = { path: priorPath, reportSha256: createHash('sha256').update(bytes).digest('hex'), previousScript: prior.sourceFingerprints['scripts/verify-recovery-destination.mjs'],
      startedAt: prior.startedAt, finishedAt: prior.finishedAt, cases: prior.cases, screens: prior.screens, checks: prior.checks, sourceFingerprints: prior.sourceFingerprints,
      reason: '58 completed cases retained from same immutable app; failure was helper motion-trigger geometry, only unverified native checks continued' };
    report.phase = 'native continuation';
  } else report.phase = 'full';
  browser = await chromium.launch(); report.browserVersion = browser.version();
  if (phase !== 'native') { await runCore(browser); await fallbackCases(browser, staticArtwork); }
  await nativeCases(browser);
  if (phase === 'native') {
    const { context, page } = await fresh(browser, 'tr', 'antalya', 1280, 800);
    await page.locator('.rd-nav-links a[href="#place-plan"]').click();
    await expect(page.locator('.rd-nav-links a[href="#place-plan"]')).toHaveAttribute('aria-current', 'location');
    const clearance = await headerClearance(page, '#place-plan');
    await expect.poll(() => page.locator('.rd-local-nav').evaluate(node => Math.abs(node.getBoundingClientRect().top - document.querySelector('.header').getBoundingClientRect().bottom))).toBeLessThanOrEqual(1);
    await page.waitForTimeout(300); await capture(page, 'tr-antalya-1280-plan-measured-settled');
    report.supplements = [{ locale: 'tr', id: 'antalya', width: 1280, height: 800, measuredPlan: clearance, active: 'plan', navSettled: true }]; await context.close();
  }
  expect(report.errors, 'unexpected runtime or HTTP errors').toEqual([]);
  report.finalFingerprints = fingerprints(); expect(report.finalFingerprints, 'verified source stays frozen').toEqual(report.sourceFingerprints);
  report.status = 'pass';
} catch (error) {
  report.status = 'fail'; report.failure = { message: error.message, stack: error.stack, activeCase: report.activeCase, at: new Date().toISOString() };
  if (browser) for (const context of browser.contexts()) for (const page of context.pages()) {
    try { await page.screenshot({ path: path.join(out, 'first-failure-' + browser.contexts().indexOf(context) + '.png') }); } catch { /* Preserve original failure. */ }
  }
  process.exitCode = 1;
} finally {
  if (browser) await browser.close(); report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: report.status, cases: report.cases.length, screens: report.screens.length, errors: report.errors.length, artifacts: out, failure: report.failure?.message }));
}
