import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { watchRuntime } from './verify-recovery-motion.mjs';

const base = process.env.QA_URL || 'http://localhost:3003';
const startedAt = new Date().toISOString();
const out = path.resolve('../tmp/frontend-qa/recovery-hub', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
fs.mkdirSync(out, { recursive: true });
const fingerprintFiles = [
  'components/turkiye/TurkeyHub.tsx', 'components/travel/Pages.tsx',
  'components/home-v3/JourneyBuilder.tsx', 'styles/recovery-hub.css',
  'components/travel/TurkeyDiscovery.tsx', 'components/turkiye/TurkeyMap.tsx',
  'scripts/verify-public.mjs', 'scripts/verify-recovery-hub.mjs',
];
const sourceFingerprints = () => Object.fromEntries(fingerprintFiles.map(file => [file, createHash('sha256').update(fs.readFileSync(path.resolve(file))).digest('hex')]));
const inventory = [
  ['istanbul', 'Istanbul', 'إسطنبول', 'İstanbul', '41.01', '28.98'],
  ['trabzon', 'Trabzon', 'طرابزون', 'Trabzon', '41.00', '39.72'],
  ['rize-ayder', 'Rize & Ayder', 'ريزا وآيدر', 'Rize ve Ayder', '40.96', '40.95'],
  ['uzungol', 'Uzungöl', 'أوزونجول', 'Uzungöl', '40.62', '40.29'],
  ['antalya', 'Antalya', 'أنطاليا', 'Antalya', '36.89', '30.70'],
  ['bodrum', 'Bodrum', 'بودروم', 'Bodrum', '37.03', '27.43'],
  ['fethiye', 'Fethiye', 'فتحية', 'Fethiye', '36.62', '29.13'],
  ['marmaris', 'Marmaris', 'مرمريس', 'Marmaris', '36.86', '28.27'],
  ['sapanca', 'Sapanca', 'صبانجا', 'Sapanca', '40.69', '30.27'],
  ['bursa', 'Bursa', 'بورصة', 'Bursa', '40.20', '29.06'],
  ['yalova', 'Yalova', 'يلوا', 'Yalova', '40.66', '29.28'],
  ['cappadocia', 'Cappadocia', 'كابادوكيا', 'Kapadokya', '38.65', '34.83'],
];
const localeIndex = { en: 1, ar: 2, tr: 3 };
const groupLabels = {
  en: ['City & culture', 'The Black Sea', 'The coast', 'Nature & slow days'],
  ar: ['مدن وثقافة', 'البحر الأسود', 'الساحل', 'طبيعة واسترخاء'],
  tr: ['Şehir ve kültür', 'Karadeniz', 'Kıyılar', 'Doğa ve sakin günler'],
};
const routeLabel = { en: 'Places I would like to visit', ar: 'الأماكن التي أرغب في زيارتها', tr: 'Ziyaret etmek istediğim yerler' };
const flexibleLabel = { en: 'My dates are flexible', ar: 'مواعيدي مرنة', tr: 'Tarihlerim esnek' };
const prepareLabel = { en: 'Prepare my inquiry', ar: 'جهّز استفساري', tr: 'Talebimi hazırla' };
const report = {
  startedAt, status: 'running', browser: 'Chromium', base, artifacts: out,
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  relevantDiff: execFileSync('git', ['status', '--short', '--', ...fingerprintFiles], { encoding: 'utf8' }).trim(),
  sourceFingerprints: sourceFingerprints(),
  stage: 'final', cases: [], checks: [], screens: [], errors: [],
  gaps: ['Independent Astra rendered acceptance and final Q12 remain required; browser emulation is not a physical-device or assistive-technology audit.'],
};
const browser = await chromium.launch({ headless: true });
report.browserVersion = browser.version();
const named = (id, locale) => inventory.find(item => item[0] === id)[localeIndex[locale]];
const hubPath = locale => `/${locale}/destinations/turkiye`;
const expectedMessage = (ids, locale) => `${routeLabel[locale]}: ${ids.map(id => named(id, locale)).join(' → ')}`;

async function fresh(locale, width, height, options = {}) {
  report.activeCase = { locale, width, height, options, step: 'fresh direct navigation' };
  const context = await browser.newContext({ viewport: { width, height }, ...options });
  const page = await context.newPage();
  watchRuntime(page, report, `hub-${locale}-${width}-${options.javaScriptEnabled === false ? 'noJS' : options.reducedMotion || 'normal'}`);
  const css = [];
  const pendingCss = [];
  page.on('response', response => {
    if (!response.url().includes('.css') || response.status() !== 200) return;
    pendingCss.push(response.text().then(body => css.push({ url: response.url(), bytes: Buffer.byteLength(body), hub: body.includes('.recovery-hub'), builder: body.includes('.rh-builder'), explorer: body.includes('.rt-explorer') })));
  });
  await page.goto(base + hubPath(locale), { waitUntil: 'networkidle' });
  await Promise.all(pendingCss);
  expect(css.some(item => item.hub), 'fresh direct navigation loads hub CSS').toBe(true);
  expect(css.some(item => item.builder), 'fresh direct navigation loads shared builder CSS').toBe(true);
  expect(css.some(item => item.explorer), 'fresh direct navigation loads shared explorer CSS').toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.recovery-hub[data-turkiye-hub]')).toHaveCount(1);
  await expect(page.locator('.recovery-hub [data-hub-chapter]')).toHaveCount(10);
  expect(await page.locator('.recovery-hub [data-hub-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.hubChapter))).toEqual(Array.from({ length: 10 }, (_, index) => String(index + 1).padStart(2, '0')));
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-lenis-count', '1');
  await expect(page.locator('.recovery-hub #journey-builder input[name=journey]')).toHaveValue('');
  return { context, page, css };
}

async function bounds(page, label) {
  const state = await page.evaluate(() => ({ width: innerWidth, scrollX, documentWidth: document.documentElement.scrollWidth,
    broken: [...document.images].filter(image => image.complete && image.currentSrc && !image.naturalWidth).map(image => image.currentSrc) }));
  expect(state.documentWidth, label + ' document overflow').toBeLessThanOrEqual(state.width + 1);
  expect(state.scrollX, label + ' horizontal scroll').toBe(0);
  expect(state.broken, label + ' failed loaded images').toEqual([]);
  return state;
}

async function capture(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(out, name + '.png'), fullPage });
  report.screens.push({ name, path: path.join(out, name + '.png'), viewport: page.viewportSize(), url: page.url(), at: new Date().toISOString() });
  report.activeCase.step = name;
}

async function sequence(locator, checkpoints) {
  return locator.evaluate(async (node, checkpoints) => {
    const samples = [], start = performance.now();
    for (const checkpoint of checkpoints) {
      await new Promise(resolve => setTimeout(resolve, Math.max(0, checkpoint - (performance.now() - start))));
      await new Promise(resolve => requestAnimationFrame(resolve));
      const css = getComputedStyle(node);
      samples.push({ elapsed: performance.now() - start, shadow: css.boxShadow, clip: css.clipPath,
        dash: css.strokeDashoffset, opacity: css.opacity, transform: css.transform,
        animations: node.getAnimations().map(animation => ({ name: animation.animationName, state: animation.playState,
          time: animation.currentTime, duration: animation.effect.getComputedTiming().duration,
          iterations: animation.effect.getComputedTiming().iterations })) });
    }
    return samples;
  }, checkpoints);
}

async function staticArtwork(page) {
  await expect(page.locator('.recovery-hub')).not.toHaveAttribute('data-hub-motion', 'enhanced');
  await expect.poll(() => page.locator('.recovery-hub [data-hub-reveal]').evaluateAll(nodes => nodes.every(node => node.dataset.hubReveal === ''))).toBe(true);
  const state = await page.locator('.recovery-hub').evaluate(root => ({
    moving: root.getAnimations({ subtree: true }).filter(animation => animation.animationName?.startsWith('rhub-')).length,
    masks: [...root.querySelectorAll('.rhub-side-media')].map(node => getComputedStyle(node).clipPath),
    routes: [...root.querySelectorAll('.rhub-arrival-route path,.rhub-final-route path')].map(node => ({ dash: getComputedStyle(node).strokeDashoffset, transform: getComputedStyle(node).transform })),
    titleOpacity: getComputedStyle(root.querySelector('h1')).opacity,
  }));
  expect(state.moving, 'static artwork has no hub animations').toBe(0);
  expect(state.masks).toEqual(['none', 'none', 'none', 'none']);
  for (const route of state.routes) { expect(Number.parseFloat(route.dash)).toBe(0); expect(route.transform).toBe('none'); }
  expect(state.titleOpacity).toBe('1');
  return state;
}

async function nativeFeedback(page, locale, width) {
  report.activeCase.step = 'native feedback timed sequence';
  await expect(page.locator('.recovery-hub')).toHaveAttribute('data-hub-motion', 'enhanced');
  const explorer = page.locator('.recovery-hub .rt-explorer');
  const map = explorer.locator(width < 1024 ? '.rt-mobile-map' : '.rt-desktop-map');
  if (width < 1024) await map.locator('summary').click();
  const pin = map.locator('.rt-map-pin').nth(3);
  await pin.click();
  await expect(pin).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.rt-index button').nth(3)).toHaveAttribute('aria-pressed', 'true');
  const pulse = await sequence(pin, [0, 120, 360, 800]);
  expect(pulse.some(sample => sample.animations.some(animation => animation.name === 'rhub-pin-select' && animation.state === 'running' && animation.duration === 550 && animation.iterations === 1)), 'actual finite selected-pin pulse runs').toBe(true);
  expect(new Set(pulse.map(sample => sample.shadow)).size, 'pin feedback visibly changes over time').toBeGreaterThan(1);
  expect(pulse.at(-1).shadow, 'pin pulse settles').toBe('none');
  expect(pulse.at(-1).animations).toEqual([]);
  expect(new Set(pulse.map(sample => sample.transform)).size, 'pin feedback does not move geography').toBe(1);
  await capture(page, `${locale}-${width}-pin-feedback-settled`);
  await pin.click();
  const sameSelection = await sequence(pin, [0, 200]);
  expect(sameSelection.every(sample => sample.animations.length === 0 && sample.shadow === 'none'), 'same selected pin does not repeat its pulse').toBe(true);
  if (width < 1024) await map.locator('summary').click();

  const photo = page.locator('.rhub-side-media').first();
  const final = page.locator('.rhub-final-route');
  await expect(photo).toHaveAttribute('data-hub-reveal', 'pending');
  await expect(final).toHaveAttribute('data-hub-reveal', 'pending');
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute('data-hub-reveal', 'visible');
  const mask = await sequence(photo, [0, 120, 350, 950]);
  expect(mask.some(sample => sample.animations.some(animation => animation.name === 'rhub-image-reveal' && animation.state === 'running' && animation.duration === 800 && animation.iterations === 1)), 'actual photo mask reveal runs').toBe(true);
  expect(new Set(mask.map(sample => sample.clip)).size).toBeGreaterThan(1);
  expect(mask.at(-1).clip).toMatch(/^inset\(/);
  expect(mask.at(-1).clip.match(/[\d.]+/g).map(Number).every(value => value === 0), 'settled photo mask is fully open').toBe(true);
  expect(mask.at(-1).animations.every(animation => animation.state === 'finished')).toBe(true);
  await capture(page, `${locale}-${width}-photo-reveal-settled`);
  await page.locator('.rhub-final').scrollIntoViewIfNeeded();
  await expect(final).toHaveAttribute('data-hub-reveal', 'visible');
  const route = await sequence(final.locator('path'), [0, 180, 430, 680, 1250]);
  expect(route.some(sample => sample.animations.some(animation => animation.name === 'rhub-route-arrive' && animation.state === 'running' && animation.duration === 1000 && animation.iterations === 1)), 'actual route draws').toBe(true);
  expect(Number.parseFloat(route[0].dash), 'route initial offset precedes settled artwork').toBeGreaterThan(0);
  for (let index = 1; index < 4; index++) {
    expect(Number.parseFloat(route[index].dash), 'actual intermediate route offset progresses').toBeLessThan(Number.parseFloat(route[index - 1].dash));
    expect(Number.parseFloat(route[index].dash), 'intermediate route precedes completion').toBeGreaterThan(0);
  }
  expect(Number.parseFloat(route.at(-1).dash), 'route settles fully drawn').toBe(0);
  expect(route.at(-1).animations.every(animation => animation.state === 'finished')).toBe(true);
  await expect(final.locator('circle')).toHaveCSS('opacity', '1');
  await capture(page, `${locale}-${width}-route-reveal-settled`);

  await page.locator('.footer .motion-choice select').selectOption('reduced');
  const cleanup = await staticArtwork(page);
  await capture(page, `${locale}-${width}-native-reduced-cleanup`);
  await page.locator('.footer .motion-choice select').selectOption('system');
  await expect(page.locator('.recovery-hub')).toHaveAttribute('data-hub-motion', 'enhanced');
  await expect(photo).toHaveAttribute('data-hub-reveal', 'settled');
  await expect(final).toHaveAttribute('data-hub-reveal', 'settled');
  expect(await photo.evaluate(node => node.getAnimations().length), 'seen photo does not replay on preference restoration').toBe(0);
  expect(await final.evaluate(node => node.getAnimations({ subtree: true }).length), 'seen route does not replay on preference restoration').toBe(0);
  report.cases.at(-1).nativeFeedback = { pulse, sameSelection, mask, route, cleanup, noRevealReplay: true };
}

async function composition(page, locale, width) {
  const chapters = page.locator('.recovery-hub [data-hub-chapter]');
  for (let index = 0; index < 10; index++) {
    expect(await chapters.nth(index).locator(index ? 'h2' : 'h1').count(), 'logical chapter heading').toBeGreaterThanOrEqual(1);
    await chapters.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await bounds(page, `${locale}/${width}/chapter${index + 1}`);
    await capture(page, `${locale}-${width}-chapter-${String(index + 1).padStart(2, '0')}`);
  }
  await expect(page.locator('.recovery-hub #builder-title')).toBeVisible();
  await expect(page.locator('.recovery-hub #builder-title')).toHaveText({ en: 'Your Türkiye.', ar: 'تركيا بطريقتك.', tr: 'Senin Türkiye’n.' }[locale]);
  await expect(page.locator('.recovery-hub #journey-builder')).toHaveAttribute('data-chapter', '07');
  await expect(page.locator('.recovery-hub [data-hub-chapter="08"]')).toContainText(locale === 'ar' ? '٢٠١٩' : '2019');
  await expect(page.locator('.recovery-hub [data-hub-chapter="08"]')).toContainText(locale === 'ar' ? '٢٠٢٥' : '2025');
  await expect(page.locator('.recovery-hub [data-hub-chapter="08"]')).toContainText(/TÜRSAB|TURSAB/);
  const categoryAnchors = page.locator('[data-hub-chapter="02"] .rhub-category-line a');
  await expect(categoryAnchors).toHaveCount(4);
  for (const [index, id] of ['city', 'black-sea', 'coast', 'nature'].entries()) {
    await expect(categoryAnchors.nth(index)).toHaveAttribute('href', '#hub-side-' + id);
    await expect(page.locator(`[data-hub-chapter="06"] #hub-side-${id}`)).toHaveCount(1);
  }
  expect(await page.locator('[data-hub-chapter="09"] .rhub-country-links a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(['georgia', 'egypt', 'saudi-arabia', 'oman', 'qatar', 'uae', 'maldives', 'malaysia', 'indonesia'].map(id => `/${locale}/destinations/${id}`));
  if (width < 768) {
    for (const selector of ['#journey-builder', '[data-hub-chapter="10"]']) {
      await page.locator(selector).evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top - 90, behavior: 'instant' }));
      await expect.poll(() => page.evaluate(selector => { const rect = document.querySelector(selector).getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0; }, selector)).toBe(true);
      await expect(page.locator('.mobile-plan')).not.toHaveAttribute('data-visible', '');
      await expect(page.locator('.mobile-plan')).toHaveCSS('visibility', 'hidden');
      await capture(page, `${locale}-${width}-${selector === '#journey-builder' ? 'builder' : 'final'}-sticky-suppressed`);
    }
  }
}

async function choose(page, locale, id) {
  const explorer = page.locator('.recovery-hub .rt-explorer');
  const index = inventory.findIndex(item => item[0] === id);
  const item = inventory[index];
  await explorer.locator('.rt-index button').nth(index).click();
  await expect(explorer.locator('.rt-index button').nth(index)).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.rt-preview h3')).toHaveText(item[localeIndex[locale]]);
  await expect(explorer.locator('.rt-preview .rt-coordinate')).toHaveText(`${item[4]}° N / ${item[5]}° E`);
  await expect(explorer.locator('.rt-preview .rt-coordinate')).toHaveAttribute('dir', 'ltr');
  await expect(explorer.locator('.rt-preview-actions a')).toHaveAttribute('href', `/${locale}/destinations/turkiye/${id}`);
  await expect(explorer.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('alt', item[localeIndex[locale]]);
  await expect.poll(() => explorer.locator('.rt-preview-image[data-active=true] img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await explorer.locator('.rt-preview-image[data-active=true] img').evaluate(image => { for (let node = image; node && !node.classList.contains('rt-preview-media'); node = node.parentElement) { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); if (matrix.a <= 0 || matrix.d <= 0) return false; } return true; }), 'preview photo is not mirrored').toBe(true);
  await expect(explorer.locator('.rt-preview .rt-interests li')).toHaveCount(3);
  expect(await explorer.locator('.rt-preview-image').count()).toBeLessThanOrEqual(2);
}

async function inventoryAndMap(page, locale, width) {
  const explorer = page.locator('.recovery-hub .rt-explorer');
  await expect(explorer.locator('.rt-index button')).toHaveCount(12);
  await expect(page.locator('.recovery-hub .rt-directory-group')).toHaveCount(4);
  await expect(page.locator('.recovery-hub .rt-directory-group h3')).toHaveText(groupLabels[locale]);
  await expect(page.locator('.recovery-hub .rt-directory-row')).toHaveCount(12);
  const directoryLinks = await page.locator('.recovery-hub .rt-directory-row > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(new Set(directoryLinks).size).toBe(12);
  for (const item of inventory) expect(directoryLinks).toContain(`/${locale}/destinations/turkiye/${item[0]}`);
  for (const item of inventory) await choose(page, locale, item[0]);
  const indexButtons = explorer.locator('.rt-index button');
  await indexButtons.first().focus(); await page.keyboard.press('Tab');
  await expect(indexButtons.nth(1)).toBeFocused(); await page.keyboard.press('Space');
  await expect(indexButtons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  const mapHost = explorer.locator(width < 1024 ? '.rt-mobile-map' : '.rt-desktop-map');
  if (width < 1024) await mapHost.locator('summary').click();
  await expect(mapHost.locator('.rt-map')).toHaveAttribute('dir', 'ltr');
  await expect(mapHost.locator('svg')).toHaveAttribute('viewBox', '0 -80 825 550');
  const pins = mapHost.locator('.rt-map-pin');
  await expect(pins).toHaveCount(12);
  await pins.nth(1).click();
  await expect(explorer.locator('.rt-index button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.rt-preview h3')).toHaveText(named('trabzon', locale));
  const geo = await mapHost.evaluate(host => ({ direction: getComputedStyle(host.querySelector('.rt-map')).direction,
    transforms: [host.querySelector('.rt-map-canvas'), host.querySelector('svg')].map(node => { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); return { scaleX: matrix.a, scaleY: matrix.d, x: matrix.e, y: matrix.f }; }),
    anchors: [...host.querySelectorAll('.rt-anchor')].map(node => { const rect = node.getBoundingClientRect(); return { x: Number(node.getAttribute('cx')), y: Number(node.getAttribute('cy')), screenX: rect.x + rect.width / 2, screenY: rect.y + rect.height / 2 }; }),
    targets: [...host.querySelectorAll('.rt-map-pin')].map(node => { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height }; }) }));
  expect(geo.direction).toBe('ltr');
  for (const matrix of geo.transforms) { expect(matrix.scaleX).toBeGreaterThan(0); expect(matrix.scaleY).toBeGreaterThan(0); expect(matrix.scaleX).toBeLessThanOrEqual(1.04 + .001); expect(Math.abs(matrix.x)).toBeLessThanOrEqual(30); expect(Math.abs(matrix.y)).toBeLessThanOrEqual(30); }
  expect(geo.anchors[1].x, 'Trabzon remains east of Istanbul').toBeGreaterThan(geo.anchors[0].x);
  expect(geo.anchors[4].y, 'Antalya remains south of Istanbul').toBeGreaterThan(geo.anchors[0].y);
  expect(geo.anchors[1].screenX, 'actual rendered east remains right in RTL').toBeGreaterThan(geo.anchors[0].screenX);
  expect(geo.anchors[4].screenY, 'actual rendered south remains below').toBeGreaterThan(geo.anchors[0].screenY);
  for (const target of geo.targets) { expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44); }
  report.cases.at(-1).geography = geo;
  await capture(page, `${locale}-${width}-selected-map`);
  if (width < 1024) await mapHost.locator('summary').click();
}

async function filteredExplore(page, locale, width) {
  const directory = page.locator('.recovery-hub .rt-directory');
  for (const [index, count] of [2, 3, 4, 3].entries()) {
    const filter = directory.locator('.rt-filters button').nth(index + 1);
    await filter.focus(); await page.keyboard.press('Space');
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(directory.locator('.rt-directory-row')).toHaveCount(count);
    await expect(directory.locator('.rt-directory-group h3')).toHaveText([groupLabels[locale][index]]);
  }
  await directory.locator('.rt-filters button').nth(2).click();
  await expect(directory.locator('.rt-directory-row')).toHaveCount(3);
  const row = directory.locator('.rt-directory-row').filter({ hasText: named('uzungol', locale) });
  await expect(row.locator('a')).toHaveAttribute('href', `/${locale}/destinations/turkiye/uzungol`);
  await row.locator('a').focus();
  await expect(directory.locator('.rt-directory-preview h3')).toHaveText(named('uzungol', locale));
  await expect(directory.locator('.rt-directory-preview a')).toHaveAttribute('href', `/${locale}/destinations/turkiye/uzungol`);
  await capture(page, `${locale}-${width}-filtered-uzungol`);
  await row.locator('a').press('Enter');
  await page.waitForURL(`**/${locale}/destinations/turkiye/uzungol`);
  await expect(page.locator('h1')).toBeVisible();
  await page.goBack({ waitUntil: 'networkidle' });
  await expect(page.locator('.recovery-hub')).toBeVisible();
}

async function journeyAndContact(page, locale, width) {
  const builder = page.locator('.recovery-hub #journey-builder');
  const explorer = page.locator('.recovery-hub .rt-explorer');
  for (const id of ['rize-ayder', 'uzungol']) { await choose(page, locale, id); await explorer.locator('.rt-preview-actions button').click(); }
  await expect(builder.locator('input[name=journey]')).toHaveValue('rize-ayder,uzungol');
  await expect(page.locator('[data-hub-journey-count]')).toContainText('2');
  const viewJourney = page.locator('[data-hub-chapter="04"] button');
  await viewJourney.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.journey-drawer')).toBeVisible();
  await expect(page.locator('.journey-drawer .journey-stops li > a')).toHaveText(['rize-ayder', 'uzungol'].map(id => named(id, locale)));
  await page.keyboard.press('Escape'); await expect(viewJourney).toBeFocused();
  await explorer.locator('.rt-preview-actions button').click();
  await expect(builder.locator('input[name=journey]')).toHaveValue('rize-ayder,uzungol');
  await builder.locator('[data-stop="uzungol"] button[data-move="-1"]').focus();
  await page.keyboard.press('Enter');
  await expect(builder.locator('input[name=journey]')).toHaveValue('uzungol,rize-ayder');
  await expect(builder.locator('[data-stop="uzungol"] button[data-move="1"]')).toBeFocused();
  await builder.locator('[data-stop="rize-ayder"] button:not([data-move])').click();
  await expect(builder.locator('input[value="rize-ayder"]')).toBeFocused();
  await expect(builder.locator('input[name=journey]')).toHaveValue('uzungol');
  await choose(page, locale, 'rize-ayder'); await explorer.locator('.rt-preview-actions button').click();
  const ids = ['uzungol', 'rize-ayder'];
  await expect(builder.locator('input[name=journey]')).toHaveValue(ids.join(','));
  await expect(page.locator('[data-hub-journey-summary]')).toContainText(named('uzungol', locale));
  await expect(page.locator('[data-hub-journey-summary]')).toContainText(named('rize-ayder', locale));
  await expect(page.locator('[data-hub-journey-summary] ol strong')).toHaveText(ids.map(id => named(id, locale)));
  const finalPlan = page.locator('[data-hub-chapter="10"] .rhub-actions > a').first();
  const finalParams = new URL(await finalPlan.getAttribute('href'), base).searchParams;
  expect(finalParams.get('journey')).toBe(ids.join(',')); expect(finalParams.get('destination')).toBe(ids[0]);
  await expect(page.locator('.recovery-hub .rt-itinerary').first()).toHaveAttribute('d', /^M .+ Q .+/);
  await builder.locator('#builder-service').selectOption('corporate');
  await expect.poll(async () => new URL(await finalPlan.getAttribute('href'), base).searchParams.get('service')).toBe('corporate');
  await builder.locator('#builder-dates').fill('20–27 October 2026');
  await expect(builder.locator('.rh-flexible input')).not.toBeChecked();
  await builder.locator('#builder-travelers').fill('4');
  await capture(page, `${locale}-${width}-itinerary-local-fields`);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(builder.locator('input[name=journey]')).toHaveValue(ids.join(','));
  await expect(builder.locator('#builder-service')).toHaveValue('corporate');
  await expect(builder.locator('#builder-dates')).toHaveValue('');
  await expect(builder.locator('#builder-travelers')).toHaveValue('');
  await expect(builder.locator('.rh-flexible input')).toBeChecked();
  await expect(builder.locator('input[name=dates]')).toHaveValue(flexibleLabel[locale]);
  await builder.locator('#builder-dates').fill('20–27 October 2026');
  await builder.locator('.rh-flexible input').check();
  await expect(builder.locator('#builder-dates')).toHaveValue('');
  await expect(builder.locator('input[name=dates]')).toHaveValue(flexibleLabel[locale]);
  await builder.locator('#builder-dates').fill('20–27 October 2026');
  await builder.locator('#builder-travelers').fill('4');
  await builder.locator('button[type=submit]').focus(); await page.keyboard.press('Enter');
  await page.waitForURL(`**/${locale}/contact?**`);
  const params = new URL(page.url()).searchParams;
  for (const [key, value] of Object.entries({ journey: ids.join(','), destination: ids[0], service: 'corporate', dates: '20–27 October 2026', travelers: '4' })) expect(params.get(key), 'Contact query ' + key).toBe(value);
  await expect(page.locator('#inquiry-service')).toHaveValue('corporate');
  await expect(page.locator('#inquiry-destination')).toHaveValue(ids[0]);
  await expect(page.locator('#inquiry-dates')).toHaveValue('20–27 October 2026');
  await expect(page.locator('#inquiry-travelers')).toHaveValue('4');
  await expect(page.locator('#inquiry-message')).toHaveValue(expectedMessage(ids, locale));
  await page.getByRole('button', { name: prepareLabel[locale], exact: true }).click();
  await expect(page.locator('#inquiry-name')).toBeFocused();
  await page.locator('#inquiry-name').fill('Hub QA'); await page.locator('#inquiry-email').fill('qa@example.com'); await page.locator('#inquiry-consent').check();
  await page.getByRole('button', { name: prepareLabel[locale], exact: true }).click();
  await expect(page.locator('.inquiry-result')).toBeVisible();
  const prepared = new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');
  expect(prepared).toContain(expectedMessage(ids, locale)); expect(prepared).toContain('Hub QA'); expect(prepared).toContain('20–27 October 2026');
  await page.locator('#inquiry-travelers').fill('5'); await expect(page.locator('.inquiry-result')).toHaveCount(0);
  const nextLocale = locale === 'ar' ? 'tr' : 'ar';
  await page.locator(`.header .languages a[lang=${nextLocale}]`).click();
  await page.waitForURL(`**/${nextLocale}/contact?**`);
  for (const [key, value] of params) expect(new URL(page.url()).searchParams.get(key), 'locale query ' + key).toBe(value);
  await expect(page.locator('#inquiry-message')).toHaveValue(expectedMessage(ids, nextLocale));
  await page.goto(base + hubPath(nextLocale), { waitUntil: 'networkidle' });
  await expect(page.locator('.recovery-hub #journey-builder input[name=journey]')).toHaveValue(ids.join(','));
  await expect(page.locator('.recovery-hub #builder-service')).toHaveValue('corporate');
  await page.locator('.recovery-hub #journey-builder button[type=submit]').click();
  await page.waitForURL(`**/${nextLocale}/contact?**`);
  expect(new URL(page.url()).searchParams.get('dates')).toBe(flexibleLabel[nextLocale]);
  await expect(page.locator('#inquiry-dates')).toHaveValue(flexibleLabel[nextLocale]);
  report.cases.at(-1).journey = { ids, service: 'corporate', localFieldsClearedOnReload: true, locale: nextLocale, preparedMessage: true, staleEdit: true, flexibleContactHandoff: true };
}

try {
  for (const [locale, width, height] of [['en', 1440, 900], ['en', 390, 844], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const timed = locale === 'en' && width === 1440 || locale === 'ar';
    const options = { ...(width < 768 ? { hasTouch: true, isMobile: true } : {}), ...(timed ? { recordVideo: { dir: path.join(out, 'recordings'), size: { width, height } } } : {}) };
    const { context, page, css } = await fresh(locale, width, height, options);
    report.cases.push({ locale, width, height, mode: report.stage, input: width < 768 ? 'coarse/touch' : 'fine', directCss: css });
    if (timed) await nativeFeedback(page, locale, width);
    await composition(page, locale, width); await inventoryAndMap(page, locale, width);
    await filteredExplore(page, locale, width); await journeyAndContact(page, locale, width);
    const video = page.video(); await context.close();
    if (video) report.cases.at(-1).recording = await video.path();
  }
  report.checks.push('Four fresh direct-route compositions: ten parts, one H1, source attribution, explicit hub/explorer/builder CSS, twelve inventory, four groups, all index/preview/coordinate states and unmirrored geographic map');
  report.checks.push('Actual filtered-row Explore navigation, global Add/deduplication/reorder/remove/focus, conceptual itinerary, local dates/travelers/flexible/reload, ordered Contact handoff/prepared message/stale edit and locale/session persistence');
  for (const width of [360, 430, 768]) {
    const { context, page } = await fresh('en', width, width === 768 ? 1024 : 844, width < 768 ? { hasTouch: true, isMobile: true } : {});
    for (const chapter of await page.locator('[data-hub-chapter]').all()) { await chapter.scrollIntoViewIfNeeded(); await bounds(page, 'EN supplemental ' + width); }
    await capture(page, `en-${width}-bounds`, true);
    report.cases.push({ locale: 'en', width, height: width === 768 ? 1024 : 844, mode: 'bounds', input: width < 768 ? 'coarse/touch' : 'fine' });
    await context.close();
  }
  for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844]]) {
    const { context, page } = await fresh(locale, width, height, { reducedMotion: 'reduce', ...(width < 768 ? { hasTouch: true, isMobile: true } : {}) });
    await choose(page, locale, 'uzungol'); await page.locator('.recovery-hub .rt-preview-actions button').click();
    await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('uzungol');
    const artwork = await staticArtwork(page);
    await bounds(page, locale + ' reduced'); await capture(page, `${locale}-${width}-reduced-selected`);
    report.cases.push({ locale, width, height, mode: 'reduced', input: width < 768 ? 'coarse/touch' : 'fine', artwork }); await context.close();
  }
  for (const [locale, width, height] of [['en', 1440, 900], ['ar', 390, 844], ['tr', 1280, 800]]) {
    const { context, page } = await fresh(locale, width, height, { javaScriptEnabled: false });
    await expect(page.locator('.recovery-hub .rt-directory-row > a')).toHaveCount(12);
    for (const chapter of await page.locator('[data-hub-chapter]').all()) { await chapter.scrollIntoViewIfNeeded(); await bounds(page, locale + ' noJS'); }
    await capture(page, `${locale}-${width}-no-js`, true);
    await page.locator('.recovery-hub .rt-directory-row > a').first().click(); await page.waitForURL(`**/${locale}/destinations/turkiye/istanbul`); await expect(page.locator('h1')).toBeVisible();
    report.cases.push({ locale, width, height, mode: 'noJS', essentialDirectoryExplore: true }); await context.close();
  }
  report.checks.push('360/430/768 bounds, coarse/touch composition, reduced EN/AR selection, and fresh no-JS EN/AR/TR directory navigation; hub has no cinematic pin, Lenis or WebGL');
  report.checks.push('Actual timed EN desktop/AR coarse pin550ms, mask800ms and route1000ms progression/settling, same-pin nonrepeat, dynamic reduced cleanup and seen-reveal nonreplay; actual interaction recordings retained');
  expect(report.errors, 'Unexpected browser errors').toEqual([]);
  expect(sourceFingerprints(), 'Application and scripts remain frozen throughout hub verification').toEqual(report.sourceFingerprints);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed'; report.failure = String(error); report.failedAt = { ...report.activeCase };
  const page = browser.contexts().at(-1)?.pages().at(-1);
  if (page && !page.isClosed()) {
    try { await capture(page, `failure-${report.activeCase.locale}-${report.activeCase.width}`); }
    catch (captureError) { report.captureFailure = String(captureError); }
  }
  throw error;
}
finally { report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); console.log(JSON.stringify(report)); }
