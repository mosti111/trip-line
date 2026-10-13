import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { watchRuntime } from './verify-recovery-motion.mjs';

// Independent immutable source expectations; application execution is unnecessary.
const parse = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
function unwrap(node) {
  while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}
function declaration(file, name) {
  const node = file.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).find(item => item.name.getText() === name);
  if (!node?.initializer) throw new Error(`Missing immutable declaration: ${name}`);
  return unwrap(node.initializer);
}
const uiNode = declaration(parse('lib/i18n.ts'), 'ui');
export function sourceValue(node) {
  node = unwrap(node);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(sourceValue);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Unsupported source property');
    return [property.name.getText().replaceAll("'", ''), sourceValue(property.initializer)];
  }));
  if (ts.isCallExpression(node) && node.expression.getText() === 't') {
    const [en, ar, tr] = node.arguments.map(sourceValue); return { en, ar, tr };
  }
  if (ts.isPropertyAccessExpression(node) && node.expression.getText() === 'ui') return sourceValue(uiNode.properties.find(property => property.name.getText() === node.name.text).initializer);
  throw new Error('Unsupported immutable expression: ' + node.getText());
}
export const locales = ['en', 'ar', 'tr'];
export const objectiveIds = ['corporate', 'events', 'camps', 'training'];
export const services = sourceValue(declaration(parse('lib/travel-content.ts'), 'services'));
export const objectives = objectiveIds.map(id => services.find(service => service.slug === id));
export const places = sourceValue(declaration(parse('lib/turkiye.ts'), 'turkishPlaces'));
export const profile = sourceValue(declaration(parse('lib/company-profile.ts'), 'companyProfile'));
const uiFact = key => sourceValue(uiNode.properties.find(property => property.name.getText() === key).initializer);
for (const objective of objectives) {
  expect(objective.audience).toBe('business'); expect(objective.points).toHaveLength(3);
  expect(fs.existsSync(path.join('public/media', objective.image))).toBe(true);
  for (const locale of locales) for (const text of [objective.title, objective.headline, objective.summary, objective.intro, objective.brief, objective.question, objective.answer, ...objective.points]) expect(text[locale].trim().length).toBeGreaterThan(0);
}
export const journeyMessage = (ids, locale) => ids.length ? `${{ en: 'Places I would like to visit', ar: 'الأماكن التي أرغب في زيارتها', tr: 'Ziyaret etmek istediğim yerler' }[locale]}: ${ids.map(id => places.find(place => place.slug === id).name[locale]).join(' → ')}` : '';
export function decodePreparedLinks(whatsapp, email, allowEmpty = false) {
  const wa = new URL(whatsapp), mail = new URL(email);
  expect(wa.origin).toBe('https://wa.me'); expect(wa.pathname).toBe('/905541072202');
  expect(mail.protocol).toBe('mailto:'); expect(mail.pathname).toBe('info@triplinetravel.net');
  const waText = wa.searchParams.get('text'), mailText = mail.searchParams.get('body');
  if (!allowEmpty) expect(waText).toBeTruthy(); expect(mailText).toBe(waText); return waText;
}
export const sourceFiles = ['components/services/BusinessExperience.tsx', 'components/services/BusinessBrief.tsx', 'components/travel/Pages.tsx', 'styles/recovery-business.css', 'lib/travel-content.ts', 'lib/company-profile.ts', 'lib/turkiye.ts', 'lib/journey.ts', 'components/experience/JourneyStore.tsx', 'scripts/verify-recovery-business.mjs'];
export const fingerprints = () => Object.fromEntries(sourceFiles.map(file => [file, fs.existsSync(file) ? createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null]));
export function createReport() {
  const startedAt = new Date().toISOString(), artifacts = path.resolve('../tmp/frontend-qa/recovery-business', startedAt.replaceAll(':', '-').replaceAll('.', '-'));
  fs.mkdirSync(artifacts, { recursive: true });
  return { status: 'running', startedAt, artifacts, base: process.env.QA_URL || 'http://localhost:3003', revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sourceFingerprints: fingerprints(), cases: [], screens: [], errors: [], checks: [], gaps: ['Independent rendered Astra review remains required. No physical-device, Safari/Firefox, assistive-technology or field-performance certification.'] };
}
const fields = ['organization', 'purpose', 'participants', 'location', 'dates'];
const values = { organization: 'QA organization 735', purpose: 'Planning a coordinated team visit 735', participants: '27', location: 'Istanbul meeting discussion 735', dates: 'Flexible October 2027 735' };
const hooks = { root: '.recovery-business', prepared: '[data-business-prepared]', message: '#business-message', prepare: '[data-business-prepare]' };
const briefCopy = sourceValue(declaration(parse('components/services/BusinessBrief.tsx'), 'copy'));
const objectiveLabels = sourceValue(declaration(parse('components/services/BusinessBrief.tsx'), 'objectives'));
function checkpoint(report, phase) {
  fs.writeFileSync(path.join(report.artifacts, 'progress.json'), JSON.stringify({ phase, cases: report.cases.length, screens: report.screens.length, at: new Date().toISOString() }, null, 2));
  console.log(JSON.stringify({ phase, cases: report.cases.length, screens: report.screens.length }));
}
async function bounds(page) {
  const state = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, broken: [...document.images].filter(image => image.complete && image.currentSrc && !image.naturalWidth).map(image => image.currentSrc) }));
  expect(state.documentWidth).toBeLessThanOrEqual(state.width + 1); expect(state.broken).toEqual([]); return state;
}
async function capture(page, report, name) {
  await bounds(page); const file = path.join(report.artifacts, name + '.png'); await page.screenshot({ path: file });
  report.screens.push({ name, path: file, at: new Date().toISOString(), viewport: page.viewportSize(), url: page.url() });
}
async function fresh(browser, report, locale, width, height, options = {}) {
  const { initScript, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width, height }, ...contextOptions });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage(), mutations = [], requestedScripts = [];
  report.activeCase = { locale, width, height, mode: options.javaScriptEnabled === false ? 'noJS' : options.reducedMotion === 'reduce' ? 'reduced' : 'normal' };
  watchRuntime(page, report, `${locale}-${width}-business`);
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) mutations.push({ method: request.method(), url: request.url() }); if (request.resourceType() === 'script') requestedScripts.push(request.url()); });
  await page.goto(`${report.base}/${locale}/business`, { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('lang', locale); await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('canvas,video,iframe,.pin-spacer')).toHaveCount(0);
  return { context, page, mutations, requestedScripts };
}
async function keyboardVisible(page, control) {
  await control.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(control).toBeFocused();
  const geometry = node => {
    const rect = node.getBoundingClientRect(), css = getComputedStyle(node), header = document.querySelector('.header')?.getBoundingClientRect();
    const sticky = document.querySelector('.mobile-plan[data-visible]'), sc = sticky && getComputedStyle(sticky), sr = sticky?.getBoundingClientRect();
    const painted = !!(sr && sc.display !== 'none' && sc.visibility === 'visible' && Number(sc.opacity) > 0 && sr.width && sr.height);
    return { unobscured: rect.top >= (header?.bottom || 0) - 1 && rect.bottom <= innerHeight + 1 && (!painted || rect.bottom <= sr.top + 1), focusVisible: node.matches(':focus-visible'), outline: parseFloat(css.outlineWidth) > 0 && css.outlineStyle !== 'none', shadow: css.boxShadow !== 'none', rect: { top: rect.top, bottom: rect.bottom }, headerBottom: header?.bottom, mobileCTA: painted ? { top: sr.top, bottom: sr.bottom } : null };
  };
  await expect.poll(() => control.evaluate(geometry)).toMatchObject({ unobscured: true, focusVisible: true });
  const state = await control.evaluate(geometry); expect(state.outline || state.shadow).toBe(true); return state;
}
async function sourceContext(page, locale, id) {
  const service = objectives.find(item => item.slug === id), preview = page.locator('[data-business-selected]'), capability = page.locator('[data-business-service]');
  await expect(preview).toHaveAttribute('data-business-selected', id); await expect(capability).toHaveAttribute('data-business-service', id);
  await expect(preview.locator('h3')).toHaveText(service.headline[locale]); await expect(preview.locator('[data-business-summary]')).toHaveText(service.summary[locale]);
  const image = preview.locator('img'); await expect(image).toHaveAttribute('alt', service.title[locale]);
  const src = new URL(await image.getAttribute('src'), page.url()); expect(src.searchParams.get('url') || src.pathname).toBe(`/media/${service.image}`);
  await expect.poll(() => image.evaluate((node, expected) => { const active = new URL(node.currentSrc, location.href); return { source: active.searchParams.get('url') || active.pathname, complete: node.complete, naturalWidth: node.naturalWidth > 0, expected }; }, `/media/${service.image}`)).toMatchObject({ source: `/media/${service.image}`, complete: true, naturalWidth: true });
  await image.evaluate(node => node.decode());
  await expect(capability.locator('h2')).toHaveText(service.intro[locale]); await expect(capability.locator('.rb-capabilities-layout > div:first-child > p')).toHaveText(service.brief[locale]);
  await expect(capability.locator('[data-business-points] p')).toHaveText(service.points.map(point => point[locale])); await expect(capability.locator('summary')).toHaveText(service.question[locale]);
  await capability.locator('summary').click(); await expect(capability.locator('details p')).toHaveText(service.answer[locale]); await capability.locator('summary').click();
  await expect(page.locator('[data-business-service-link]')).toHaveAttribute('href', `/${locale}/services/${id}`);
  return { id, image: service.image, sourceCapabilities: service.points.map(point => point[locale]) };
}
async function stored(page, ids, type) {
  const state = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tripline-journey')));
  expect(state).toEqual({ destinations: ids, journeyType: type }); return state;
}
async function privacy(page) {
  const state = await page.evaluate(() => ({ session: { ...sessionStorage }, local: { ...localStorage }, url: location.href }));
  for (const value of Object.values({ ...state.session, ...state.local, url: state.url })) for (const field of fields) expect(value).not.toContain(values[field]);
  return state;
}
async function prepare(page, locale, objective, ids, type, supplied = values) {
  reportStep(page, `prepare ${objective}`); const keyboard = await keyboardVisible(page, page.locator(hooks.prepare)); await page.keyboard.press('Enter');
  const result = page.locator(hooks.prepared); await expect(result).toBeVisible(); await expect(result).toBeFocused(); await expect(result).toHaveAttribute('data-prepared-service', objective);
  const message = await page.locator(hooks.message).inputValue(), label = objectiveLabels.find(item => item.id === objective).title[locale];
  const expected = [`${uiFact('inquiry')[locale]} — Trip Line`, `${briefCopy.objective[locale]}: ${label}`, `${uiFact('service')[locale]}: ${services.find(item => item.slug === objective).title[locale]}`, `${briefCopy.type[locale]}: ${services.find(item => item.slug === type).title[locale]}`, journeyMessage(ids, locale) || briefCopy.empty[locale], ...fields.filter(field => supplied[field]?.trim()).map(field => `${briefCopy[field][locale]}: ${supplied[field].trim()}`), '', uiFact('nextStepsBody')[locale]].join('\n');
  expect(message).toBe(expected); await expect(result.locator('h3')).toHaveText(uiFact('ready')[locale]); await expect(result.locator(':scope > p')).toHaveText(uiFact('readyBody')[locale]);
  expect(decodePreparedLinks(await page.locator('[data-business-whatsapp]').getAttribute('href'), await page.locator('[data-business-email]').getAttribute('href'))).toBe(expected);
  await privacy(page); return { objective, ids, type, message, keyboard };
}
function reportStep(page, step) { page.__qaBusinessStep = step; }
async function openDrawer(page) {
  if (await page.locator('.header-journey').isVisible()) await page.locator('.header-journey').click();
  else { await page.locator('.menu-button').click(); await expect(page.locator('.nav-dialog')).toBeVisible(); await page.locator('.nav-dialog .dialog-footer > button').click(); }
  await expect(page.locator('.journey-drawer')).toBeVisible();
}
async function closeDrawer(page) {
  await page.evaluate(() => { window.__qbClosed = new Promise(resolve => document.querySelector('.journey-drawer').addEventListener('close', () => requestAnimationFrame(() => requestAnimationFrame(resolve)), { once: true })); });
  await page.keyboard.press('Escape'); await page.evaluate(() => window.__qbClosed); await expect(page.locator('.journey-drawer')).toBeHidden();
  await expect(await page.locator('.header-journey').isVisible() ? page.locator('.header-journey') : page.locator('.menu-button')).toBeFocused();
}
async function permanentInvalidation(page, locale, objective, ids, type) {
  for (const field of fields) {
    await page.locator(`#business-${field}`).fill(field === 'participants' ? '28' : values[field] + ' edited'); await expect(page.locator(hooks.prepared)).toHaveCount(0);
    await page.locator(`#business-${field}`).fill(values[field]); await expect(page.locator(hooks.prepared)).toHaveCount(0); await prepare(page, locale, objective, ids, type);
  }
  const other = objective === 'events' ? 'corporate' : 'events';
  await page.locator(`[data-business-objective=${other}]`).click(); await expect(page.locator(hooks.prepared)).toHaveCount(0);
  await page.locator(`[data-business-objective=${objective}]`).click(); await expect(page.locator(hooks.prepared)).toHaveCount(0); await prepare(page, locale, objective, ids, type);
  await openDrawer(page); const select = page.locator('.journey-type-label select');
  await select.selectOption('training'); await expect(page.locator(hooks.prepared)).toHaveCount(0); await select.selectOption(type); await closeDrawer(page); await expect(page.locator(hooks.prepared)).toHaveCount(0); await prepare(page, locale, objective, ids, type);
  await openDrawer(page); await page.locator(`[data-journey-stop=${ids[1]}] [data-move="-1"]`).click(); await expect(page.locator(hooks.prepared)).toHaveCount(0);
  await page.locator(`[data-journey-stop=${ids[1]}] [data-move="1"]`).click(); await closeDrawer(page); await expect(page.locator(hooks.prepared)).toHaveCount(0); await stored(page, ids, type);
  return { fields: [...fields], objective: true, type: true, reorderedAndRestored: true };
}
async function staticMatrix(browser, report) {
  for (const [locale, width, height] of [['en',1440,900],['en',390,844],['ar',390,844],['tr',1280,900]]) {
    const { context, page, mutations, requestedScripts } = await fresh(browser, report, locale, width, height);
    const prefix = `${locale}-${width}`;
    expect(await page.locator('[data-business-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.businessChapter))).toEqual(['hero','objectives','capabilities','process','inspiration','plan']);
    await capture(page, report, `${prefix}-arrival`);
    await expect(page.locator('[data-business-objective][aria-pressed=true]')).toHaveCount(0);
    await page.locator(hooks.prepare).click(); await expect(page.locator('#business-objective-error')).toBeVisible(); await expect(page.locator('[data-business-objective=corporate]')).toBeFocused();
    const contexts = [], messages = [];
    for (const id of objectiveIds) {
      await keyboardVisible(page, page.locator(`[data-business-objective=${id}]`)); await page.keyboard.press('Enter');
      await expect(page.locator(`[data-business-objective=${id}]`)).toHaveAttribute('aria-pressed', 'true'); await expect(page.locator('[data-business-objective][aria-pressed=true]')).toHaveCount(1);
      contexts.push(await sourceContext(page, locale, id)); await page.locator('[data-business-selected]').scrollIntoViewIfNeeded(); await capture(page, report, `${prefix}-${id}-context`);
      await page.locator('[data-business-service]').scrollIntoViewIfNeeded(); await capture(page,report,`${prefix}-${id}-capabilities`);
      messages.push(await prepare(page, locale, id, [], 'tours', {}));
    }
    // Delivered form honestly marks purpose and all five detail fields optional.
    for(const chapter of ['process','inspiration','plan']) {await page.locator(`[data-business-chapter=${chapter}]`).scrollIntoViewIfNeeded();await capture(page,report,`${prefix}-${chapter}`);}
    for (const field of fields) await page.locator(`#business-${field}`).fill(values[field]);
    for (const bad of ['0','-1','1.5','abc']) { await page.locator('#business-participants').fill(bad); await page.locator(hooks.prepare).click(); await expect(page.locator('#business-participants-error')).toBeVisible(); await expect(page.locator('#business-participants')).toBeFocused(); await expect(page.locator(hooks.prepared)).toHaveCount(0); }
    await page.locator('#business-participants').fill(values.participants);
    for (const id of ['istanbul','sapanca']) {
      const place = places.find(item => item.slug === id), article = page.locator(`[data-business-place=${id}]`);
      await expect(article.locator('h3')).toHaveText(place.name[locale]); await expect(article.locator(':scope > p')).toHaveText(place.note[locale]);
      await expect(article.locator('a')).toHaveAttribute('href', `/${locale}/destinations/turkiye/${id}`); await article.locator('button').click(); await expect(article.locator('button')).toHaveAttribute('aria-pressed','true');
    }
    const ids = ['istanbul','sapanca']; await stored(page, ids, 'tours');
    await expect(page.locator('[data-business-journey]')).toHaveAttribute('data-business-journey', ids.join(','));
    for (const id of objectiveIds) { await page.locator(`[data-business-objective=${id}]`).click(); messages.push(await prepare(page, locale, id, ids, 'tours')); }
    const suffix = '\nQA visitor edited prepared message 735', editable = page.locator(hooks.message), initialMessage = await editable.inputValue(), custom = initialMessage + suffix;
    await keyboardVisible(page, editable); await page.keyboard.press('Control+End');
    await editable.pressSequentially(suffix, { delay: 15 }); await expect(editable).toBeFocused(); await expect(editable).toHaveValue(custom);
    expect(decodePreparedLinks(await page.locator('[data-business-whatsapp]').getAttribute('href'), await page.locator('[data-business-email]').getAttribute('href'))).toBe(custom); await privacy(page);
    await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await expect(editable).toBeFocused(); await expect(editable).toHaveValue('');
    expect(decodePreparedLinks(await page.locator('[data-business-whatsapp]').getAttribute('href'), await page.locator('[data-business-email]').getAttribute('href'), true)).toBe('');
    await prepare(page, locale, 'training', ids, 'tours'); await capture(page, report, `${prefix}-prepared`);
    const invalidation = await permanentInvalidation(page, locale, 'training', ids, 'tours');
    await prepare(page, locale, 'training', ids, 'tours'); await openDrawer(page);
    await page.locator('[data-journey-stop=sapanca] button').last().click(); await expect(page.locator(hooks.prepared)).toHaveCount(0); await closeDrawer(page);
    await page.locator('[data-business-place=sapanca] button').click(); await expect(page.locator(hooks.prepared)).toHaveCount(0); await stored(page, ids, 'tours');
    await page.reload({ waitUntil: 'networkidle' });
    for (const field of fields) await expect(page.locator(`#business-${field}`)).toHaveValue(''); await expect(page.locator(hooks.prepared)).toHaveCount(0); await expect(page.locator('[data-business-objective][aria-pressed=true]')).toHaveCount(0); await stored(page, ids, 'tours');
    await expect(page.locator('.rb-process li h3')).toHaveText(['step1','step2','step3'].map(key => uiFact(key)[locale])); await expect(page.locator('.rb-process li p')).toHaveText(['step1Body','step2Body','step3Body'].map(key => uiFact(key)[locale]));
    const orientation = await page.locator(hooks.root + ' img').evaluateAll(nodes => nodes.map(image => { let natural = true; for (let n = image; n && n.tagName !== 'BODY'; n = n.parentElement) { const m = new DOMMatrixReadOnly(getComputedStyle(n).transform); if (m.a <= 0 || m.d <= 0) natural = false; } return { src: image.currentSrc, natural }; }));
    expect(orientation.every(image => image.natural)).toBe(true); expect(mutations).toEqual([]);
    report.cases.push({ locale,width,height,mode:'objective/brief native matrix',contexts,messages,invalidation,orientation,mutations,requestedScripts,bounds:await bounds(page),purposeOptional:true }); await context.close(); checkpoint(report, `${prefix} objective/brief matrix complete`);
  }
}
async function fallbackMatrix(browser, report) {
  for (const [mode, options] of [['noJS',{javaScriptEnabled:false}],['reduced',{reducedMotion:'reduce'}],['SaveData',{initScript:()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}})}]]) for (const locale of locales) {
    const { context,page,mutations } = await fresh(browser,report,locale,390,844,options);
    await page.locator('.rb-objectives').scrollIntoViewIfNeeded();
    if (mode === 'noJS') { await expect(page.locator('.rb-objective-list a')).toHaveCount(4); expect(await page.locator('.rb-objective-list a').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')))).toEqual(objectiveIds.map(id=>`/${locale}/services/${id}`)); await expect(page.locator('.rb-form')).toBeHidden(); }
    else { await page.locator('[data-business-objective=events]').click(); await prepare(page,locale,'events',[],'tours',{}); }
    const interactionSettle = mode === 'SaveData' ? await settleIdentifiedSelection(page) : null;
    const motion = await page.locator(hooks.root).evaluate(node=>({ animations:node.getAnimations({subtree:true}).map(a=>({name:a.animationName,state:a.playState})), transform:getComputedStyle(node).transform }));
    expect(motion.animations).toEqual([]); expect(mutations).toEqual([]); await capture(page,report,`${locale}-390-${mode}`); report.cases.push({locale,width:390,height:844,mode,motion,interactionSettle,bounds:await bounds(page)}); await context.close();
  }
  for (const [width,height] of [[360,800],[430,844],[768,1024],[1280,600],[844,390]]) {
    const {context,page} = await fresh(browser,report,'ar',width,height); await capture(page,report,`ar-${width}x${height}-bounds`); await page.locator('.rb-plan').scrollIntoViewIfNeeded(); await capture(page,report,`ar-${width}x${height}-brief-bounds`); report.cases.push({locale:'ar',width,height,mode:'responsive bounds',bounds:await bounds(page)}); await context.close();
  }
  const {context,page,requestedScripts} = await fresh(browser,report,'en',1440,900,{initScript:()=>{ const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(type,...args) { return /webgl/i.test(type) ? null : original.call(this,type,...args); }; }});
  await page.locator('[data-business-objective=corporate]').click(); await prepare(page,'en','corporate',[],'tours',{}); await capture(page,report,'en-1440-noWebGL'); report.cases.push({locale:'en',width:1440,height:900,mode:'noWebGL',requestedScripts,limitation:'No B08 canvas/pin observed. Shared imports/requested script URLs do not certify opaque tree-shaken bundle contents.'}); await context.close();
}
async function settleIdentifiedSelection(page) {
  return page.locator(hooks.root).evaluate(async root => {
    const assertStatic = () => {
      const svg = root.querySelector('.rb-structural-line');
      if (root.getAttribute('data-business-motion') !== null || svg.getAttribute('data-business-line') !== null || getComputedStyle(svg.querySelector('path')).strokeDashoffset !== '0px') throw new Error('SaveData structural line is not static final');
      const essential = [...root.querySelectorAll('h1,h2,h3,p,a,button,input,textarea,img')].filter(node => node.getClientRects().length).map(node => ({ tag:node.tagName,opacity:getComputedStyle(node).opacity,transform:getComputedStyle(node).transform }));
      if (essential.some(node => node.opacity !== '1' || node.transform !== 'none')) throw new Error('Essential SaveData content fades or moves');
      return essential;
    };
    const before = assertStatic(), active = root.getAnimations({subtree:true});
    const pairs = {
      'background-color': ['backgroundColor','rgba(0, 0, 0, 0)','rgba(228, 215, 193, 0.333)'],
      'background-position-x': ['backgroundPositionX','0px','0%'],
      'background-position-y': ['backgroundPositionY','0px','0%'],
      'border-bottom-color': ['borderBottomColor','rgba(7, 31, 32, 0.267)','rgb(168, 121, 45)'],
    };
    const identities = active.map(animation => {
      const target=animation.effect?.target,timing=animation.effect.getTiming(),frames=animation.effect.getKeyframes(),pair=pairs[animation.transitionProperty];
      if (animation.constructor.name !== 'CSSTransition' || !target?.matches('button[data-business-objective="events"][aria-pressed="true"]') || !pair || timing.duration !== 200 || timing.delay !== 0 || timing.endDelay !== 0 || timing.iterations !== 1 || timing.easing !== 'ease' || timing.fill !== 'backwards' || frames.length !== 2 || frames[0][pair[0]] !== pair[1] || frames[1][pair[0]] !== pair[2] || frames[0].computedOffset !== 0 || frames[1].computedOffset !== 1) throw new Error('Unknown SaveData animation; exact identified selected-objective transition required');
      return {constructor:animation.constructor.name,property:animation.transitionProperty,objective:target.dataset.businessObjective,timing,keyframes:frames};
    });
    if (new Set(identities.map(item=>item.property)).size !== identities.length) throw new Error('Duplicated identified selection transition');
    await Promise.all(active.map(animation=>animation.finished));
    const after = assertStatic(); if (root.getAnimations({subtree:true}).length !== 0) throw new Error('SaveData root retains animation after identified native finishes');
    return {identities,before,after,remaining:0,method:'Await only independently diagnosed selected-events CSSTransition.finished'};
  });
}
function connectionFixture() {
  const connection = new EventTarget(), listeners = new Set(); connection.saveData = false;
  const add = connection.addEventListener.bind(connection), remove = connection.removeEventListener.bind(connection);
  connection.addEventListener = (type, callback, options) => { if (type === 'change') listeners.add(callback); return add(type, callback, options); };
  connection.removeEventListener = (type, callback, options) => { if (type === 'change') listeners.delete(callback); return remove(type, callback, options); };
  window.__qbConnection = connection; window.__qbListeners = listeners;
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
}
async function decodeRecording(browser, report, videoPath, prefix) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.route('http://qa-evidence.local/**', async route => {
      if (route.request().url().endsWith('/clip')) await route.fulfill({ contentType: 'video/webm', body: fs.readFileSync(videoPath) });
      else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><video muted playsinline></video><canvas></canvas>' });
    });
    await page.goto('http://qa-evidence.local/');
    const decoded = await page.evaluate(async prefix => {
      const video = document.querySelector('video'), canvas = document.querySelector('canvas'); video.src = URL.createObjectURL(await (await fetch('/clip')).blob());
      await new Promise((resolve,reject) => { video.addEventListener('loadeddata',resolve,{once:true}); video.addEventListener('error',reject,{once:true}); });
      const times = Array.from({length:Math.ceil(video.duration/.2)},(_,index)=>index*.2).filter(time=>time+.001<video.duration);
      const width = Math.min(360,video.videoWidth), height = Math.round(video.videoHeight*width/video.videoWidth), columns = video.videoWidth<600 ? 8 : 4;
      canvas.width = width*columns; canvas.height = Math.ceil(times.length/columns)*(height+24); const ctx=canvas.getContext('2d'), frames=[];
      ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,canvas.width,canvas.height);
      for (let index=0;index<times.length;index++) {
        const requested=times[index]+.001; await new Promise(resolve=>{video.addEventListener('seeked',resolve,{once:true});video.currentTime=requested;}); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        const x=index%columns*width,y=Math.floor(index/columns)*(height+24);ctx.drawImage(video,x,y+24,width,height);ctx.fillStyle='#071f20';ctx.font='12px sans-serif';ctx.fillText(prefix+' actual '+video.currentTime.toFixed(3)+'s',x+4,y+17);frames.push({requested,currentTime:video.currentTime});
      }
      URL.revokeObjectURL(video.src); return {duration:video.duration,width:video.videoWidth,height:video.videoHeight,frames,data:canvas.toDataURL('image/png')};
    },prefix);
    expect(decoded.duration).toBeGreaterThan(1.4); for (const frame of decoded.frames) expect(Math.abs(frame.requested-frame.currentTime)).toBeLessThan(.02);
    expect(new Set(decoded.frames.map(frame=>frame.currentTime)).size).toBe(decoded.frames.length);
    const sheet=path.join(report.artifacts,prefix+'-actual-native-frames.png');fs.writeFileSync(sheet,Buffer.from(decoded.data.split(',')[1],'base64'));
    const metadata={duration:decoded.duration,width:decoded.width,height:decoded.height,frames:decoded.frames}; return {...metadata,sheet,recording:videoPath,method:'Complete video Blob; distinct seeked/currentTime/two-rAF decoded recorded frames'};
  } finally {await context.close();}
}
async function lineIsolation(page) {
  const state=await page.locator(hooks.root).evaluate(root=>({animations:root.getAnimations({subtree:true}).map(animation=>({name:animation.animationName,target:animation.effect?.target?.matches('.rb-structural-line path')})),essential:[...root.querySelectorAll('h1,h2,h3,p,a,button,input,textarea,img')].filter(node=>node.getClientRects().length).map(node=>({tag:node.tagName,opacity:getComputedStyle(node).opacity,transform:getComputedStyle(node).transform,animations:node.getAnimations().length}))}));
  for (const animation of state.animations) {expect(animation.target).toBe(true);expect(animation.name).toBe('rb-line-arrival');}
  for (const element of state.essential) {expect(element.opacity).toBe('1');expect(element.transform).toBe('none');expect(element.animations).toBe(0);} return state;
}
async function staticLine(page) {
  await expect(page.locator(hooks.root)).not.toHaveAttribute('data-business-motion','enhanced');
  await expect(page.locator('.rb-structural-line')).not.toHaveAttribute('data-business-line',/./);
  const state=await page.locator('.rb-structural-line path').evaluate(async node=>{const animations=node.getAnimations();for(const animation of animations){if(animation.constructor.name!=='CSSTransition'||animation.transitionProperty!=='stroke-dashoffset'||animation.effect.getTiming().duration!==.01) throw new Error('Unexpected calm structural animation');}await Promise.all(animations.map(animation=>animation.finished));return {offset:getComputedStyle(node).strokeDashoffset,transform:getComputedStyle(node).transform,animations:node.getAnimations().length,awaitedNativeTransitions:animations.length};});
  expect(state.offset).toBe('0px');expect(state.transform).toBe('none');expect(state.animations).toBe(0);return {...state,isolation:await lineIsolation(page)};
}
async function finiteLine(page,report,label) {
  await expect(page.locator('.rb-structural-line')).toHaveAttribute('aria-hidden','true'); await expect(page.locator('.rb-structural-line')).toHaveAttribute('focusable','false');
  await expect(page.locator('.rb-structural-line')).toHaveAttribute('data-business-line','pending');
  const result=await page.evaluate(async()=>{
    const svg=document.querySelector('.rb-structural-line'),path=svg.querySelector('path'),start=performance.now();
    const sample=()=>({elapsed:performance.now()-start,wall:Date.now(),state:svg.dataset.businessLine,offset:parseFloat(getComputedStyle(path).strokeDashoffset),transform:getComputedStyle(path).transform,cssEasing:getComputedStyle(path).animationTimingFunction,animations:path.getAnimations().map(animation=>({name:animation.animationName,state:animation.playState,currentTime:animation.currentTime,timing:animation.effect.getTiming(),keyframes:animation.effect.getKeyframes()}))});
    const initial=sample(),rect=svg.getBoundingClientRect();scrollTo({top:scrollY+rect.top-document.querySelector('.header').getBoundingClientRect().height-40,behavior:'instant'});
    const frames=[];await new Promise(resolve=>{const tick=()=>{frames.push(sample());if(performance.now()-start>=1500)resolve();else requestAnimationFrame(tick);};requestAnimationFrame(tick);});return {initial,frames};
  });
  expect(result.initial.offset).toBe(1);expect(result.frames.some(frame=>frame.state==='visible')).toBe(true);expect(result.frames.some(frame=>frame.offset>0&&frame.offset<1)).toBe(true);expect(result.frames.at(-1).offset).toBe(0);
  const animations=result.frames.flatMap(frame=>frame.animations);expect(animations.length).toBeGreaterThan(0);for(const animation of animations){expect(animation.name).toBe('rb-line-arrival');expect(animation.timing.duration).toBe(1050);expect(animation.timing.iterations).toBe(1);expect(animation.keyframes[0].easing).toBe('ease-out');}expect(result.frames.filter(frame=>frame.animations.length).every(frame=>frame.cssEasing==='ease-out')).toBe(true);expect(animations.some(animation=>animation.state==='finished')).toBe(true);expect(result.frames.every(frame=>frame.transform==='none')).toBe(true);
  (report.motionSamples||=[]).push({label,...result});await capture(page,report,label+'-line-settled');return {...result,isolation:await lineIsolation(page)};
}
async function nativeMatrix(browser,report) {
  for(const [locale,width,height] of [['en',1440,900],['ar',390,844]]) {
    const {context,page,requestedScripts}=await fresh(browser,report,locale,width,height,{initScript:connectionFixture,recordVideo:{dir:path.join(report.artifacts,'recordings'),size:{width,height}}});
    await expect(page.locator(hooks.root)).toHaveAttribute('data-business-motion','enhanced');const sample=await finiteLine(page,report,`${locale}-${width}-native`);const video=page.video();await context.close();const recording=await video.path(),decoded=await decodeRecording(browser,report,recording,`${locale}-${width}`);report.cases.push({locale,width,height,mode:'actual structural recording',sample,recording,decoded,requestedScripts});checkpoint(report,`${locale}-${width} native timing/recorded frames complete`);
  }
  const {context,page}=await fresh(browser,report,'en',1440,900,{initScript:connectionFixture});await finiteLine(page,report,'lifecycle');await expect.poll(()=>page.evaluate(()=>window.__qbListeners.size)).toBe(1);
  await page.evaluate(()=>{window.__qbConnection.saveData=true;window.__qbConnection.dispatchEvent(new Event('change'));});const saveData=await staticLine(page);
  await page.evaluate(()=>{window.__qbConnection.saveData=false;window.__qbConnection.dispatchEvent(new Event('change'));});await expect(page.locator('.rb-structural-line')).toHaveAttribute('data-business-line','settled');expect(await page.locator('.rb-structural-line path').evaluate(node=>node.getAnimations().length)).toBe(0);
  await page.locator('.motion-choice select').selectOption('reduced');const siteCalm=await staticLine(page);await page.locator('.motion-choice select').selectOption('system');await expect(page.locator('.rb-structural-line')).toHaveAttribute('data-business-line','settled');
  await page.emulateMedia({reducedMotion:'reduce'});const systemCalm=await staticLine(page);await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('.rb-structural-line')).toHaveAttribute('data-business-line','settled');
  await page.evaluate(()=>{window.__qbDetached=document.querySelector('.recovery-business');});await page.locator('.rb-plan a[href="/en/contact"]').click();await page.waitForURL('**/en/contact');await expect.poll(()=>page.evaluate(()=>window.__qbListeners.size)).toBe(0);
  const detached=await page.evaluate(()=>({connected:window.__qbDetached.isConnected,motion:window.__qbDetached.getAttribute('data-business-motion'),line:window.__qbDetached.querySelector('.rb-structural-line').getAttribute('data-business-line'),animations:window.__qbDetached.getAnimations({subtree:true}).length}));expect(detached).toEqual({connected:false,motion:null,line:null,animations:0});
  await page.goBack({waitUntil:'networkidle'});await expect(page.locator(hooks.root)).toHaveAttribute('data-business-motion','enhanced');await expect.poll(()=>page.evaluate(()=>window.__qbListeners.size)).toBe(1);report.cases.push({locale:'en',width:1440,height:900,mode:'native lifecycle',saveData,siteCalm,systemCalm,detached,seenNoReplay:true,remountListeners:1});await context.close();
  for(const [mode,initScript] of [['partial SaveData',()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}})],['add-only connection',()=>{window.__qbAddCalls=0;Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,addEventListener(){window.__qbAddCalls++;}}});}],['absent IO',()=>Object.defineProperty(window,'IntersectionObserver',{configurable:true,value:undefined})]]) {
    const {context,page}=await fresh(browser,report,'en',1440,900,{initScript});const state=await staticLine(page);if(mode==='add-only connection')expect(await page.evaluate(()=>window.__qbAddCalls)).toBe(0);report.cases.push({locale:'en',width:1440,height:900,mode,state});await context.close();
  }
  checkpoint(report,'native lifecycle and partial API cases complete');
}
if (process.env.QA_PREPARE_ONLY === '1') {
  console.log(JSON.stringify({ status: 'source preparation pass', browserLaunched: false, applicationExecuted: false, objectives: objectives.map(service => ({ slug: service.slug, title: service.title, image: service.image, points: service.points })), locales, sourceFingerprints: fingerprints(), runtimePending: true }));
} else {
  if (process.env.QA_BUSINESS_RUNTIME_GRANTED !== '1') throw new Error('Exclusive frozen production grant required; QA_PREPARE_ONLY=1 stays browser-free.');
  const report = createReport(); let browser;
  try {
    browser = await chromium.launch(); report.browserVersion = browser.version();
    await staticMatrix(browser, report); await fallbackMatrix(browser, report); await nativeMatrix(browser, report);
    expect(report.cases).toHaveLength(25);
    expect(report.errors).toEqual([]); report.finalFingerprints = fingerprints(); expect(report.finalFingerprints).toEqual(report.sourceFingerprints); report.status = 'pass';
  } catch (error) {
    report.status = 'fail'; report.failure = { message:error.message,stack:error.stack,activeCase:report.activeCase,at:new Date().toISOString() }; process.exitCode = 1;
    if (browser) for (const context of browser.contexts()) for (const page of context.pages()) { report.failure.step = page.__qaBusinessStep; try { await page.screenshot({path:path.join(report.artifacts,`first-failure-${browser.contexts().indexOf(context)}.png`)}); } catch { /* Preserve original failure. */ } }
  } finally {
    if (browser) await browser.close(); report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(report.artifacts,'report.json'),JSON.stringify(report,null,2)); console.log(JSON.stringify({status:report.status,cases:report.cases.length,screens:report.screens.length,errors:report.errors.length,artifacts:report.artifacts,failure:report.failure?.message}));
  }
}
