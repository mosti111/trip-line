import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const qaBase = process.env.QA_URL || 'http://localhost:3003';
export function watchRuntime(page, report, name = 'page') {
  page.on('pageerror', error => report.errors.push({ name, kind: 'pageerror', message: error.message }));
  page.on('console', message => {
    if (message.type() === 'error' && !(message.location().url.includes('/not-a-page') && message.text().includes('404'))) report.errors.push({ name, kind: 'console', message: message.text() });
  });
  // Network cancellation is not itself a runtime fault: Next prefetch and paused media
  // legitimately abort. Keep actual failed HTTP assets, page/console errors and media
  // decode/playback assertions authoritative instead of a blanket requestfailed rule.
  page.on('response', response => {
    if (response.status() >= 400 && !new URL(response.url()).pathname.endsWith('/not-a-page')) report.errors.push({ name, kind: 'http', status: response.status(), url: response.url() });
  });
}
export async function resetJourney(page) {
  await page.evaluate(() => sessionStorage.removeItem('tripline-journey'));
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('');
}
export async function assertRecoveryHome(page, locale) {
  await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  expect(await page.locator('.recovery-home [data-chapter]').evaluateAll(nodes => nodes.map(node => node.dataset.chapter))).toEqual(Array.from({ length: 15 }, (_, index) => String(index + 1).padStart(2, '0')));
  await expect(page.locator('.rh-world-plane')).toHaveCount(3);
  await expect(page.locator('.rt-index button')).toHaveCount(12);
  await expect(page.locator('.rh-services li a')).toHaveCount(9);
  await expect(page.locator('.rh-arrival .rh-actions a').first()).toHaveAttribute('href', `/${locale}/destinations/turkiye`);
  await expect(page.locator('.rh-beyond .journey-text-link')).toHaveAttribute('href', `/${locale}/destinations`);
  await expect(page.locator('.recovery-home [role=tab]')).toHaveCount(0);
}
export async function openingRange(page) {
  const arrival = page.locator('.rh-arrival');
  await expect(arrival).toHaveAttribute('data-pin-end', /\d/);
  return arrival.evaluate(node => ({ start: Number(node.dataset.pinStart), end: Number(node.dataset.pinEnd) }));
}
export async function openingStage(page, progress) {
  const { start, end } = await openingRange(page);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start + (end - start) * progress);
  await expect.poll(() => page.locator('.rh-arrival').getAttribute('data-motion-progress')).toMatch(/\d/);
  await expect.poll(async () => Math.abs(Number(await page.locator('.rh-arrival').getAttribute('data-motion-progress')) - progress)).toBeLessThan(.055);
  await page.waitForTimeout(250);
  expect(Math.abs(Number(await page.locator('.rh-arrival').getAttribute('data-motion-progress'))-progress),'Labeled opening capture remains at its requested stage').toBeLessThan(.055);
}
export async function filmLifecycle(page) {
  const frame = page.locator('.rh-film-frame'), video = frame.locator('video');
  await frame.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(node => node.videoWidth), { timeout: 15000 }).toBeGreaterThan(0);
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
  await frame.getByRole('button', { name: 'Pause film', exact: true }).click();
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
  await frame.getByRole('button', { name: 'Play Istanbul film', exact: true }).click();
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
  await page.locator('#journey-builder').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(true);
}
function inspectMotion() {
  const arrival = document.querySelector('.rh-arrival'), scene = document.querySelector('.bronze-journey'), worlds = document.querySelector('#service-worlds');
  const geometry = selector => { const node = document.querySelector(selector); if (!node) return null; const rect = node.getBoundingClientRect(), css = getComputedStyle(node); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, opacity: css.opacity, transform: css.transform }; };
  const metal = document.querySelector('.rh-world-metal path');
  return { time: performance.now(), scrollY, viewport: { width: innerWidth, height: innerHeight, scrollX, documentScrollWidth: document.documentElement.scrollWidth }, headerPlan: geometry('.header-plan'), progress: Number(arrival?.dataset.motionProgress || 0), stage: arrival?.dataset.motionStage, cameraPosition: scene?.dataset.cameraPosition, cameraTarget: scene?.dataset.cameraTarget, routeParameter: Number(scene?.dataset.routeParameter || 0), context: scene?.dataset.contextState, handoff: worlds?.dataset.handoffState, handoffProgress: Number(worlds?.dataset.handoffProgress || 0), metallicStroke: metal ? getComputedStyle(metal).strokeWidth : null, metallic: geometry('.rh-world-metal'), photo: geometry('.rh-arrival-photo'), copy: geometry('.rh-arrival-copy'), route: geometry('.rh-world-route:not(.rh-world-metal)'), threshold: geometry('.rh-threshold-route') };
}
async function runMotion() {
  const out = path.resolve('../tmp/frontend-qa/recovery-motion'); fs.mkdirSync(out, { recursive: true });
  const report = { status: 'running', base: qaBase, startedAt: new Date().toISOString(), browser: 'Chromium', checks: [], cases: [], errors: [], screens: [], gaps: ['Independent rendered frame/playback judgment is required; automated geometry does not certify creative acceptance.'] };
  const browser = await chromium.launch();
  try {
    for (const [width, height] of [[1440,900],[1280,600]]) {
      const context = await browser.newContext({ viewport: { width, height }, recordVideo: { dir: path.join(out, 'recordings'), size: { width, height } } });
      const page = await context.newPage(); watchRuntime(page, report, `${width}x${height}`);
      await page.goto(qaBase + '/en', { waitUntil: 'networkidle' }); await assertRecoveryHome(page, 'en');
      await expect(page.locator('.recovery-home')).toHaveAttribute('data-home-motion', 'desktop');
      await expect(page.locator('.ribbon-ready canvas')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('.pin-spacer')).toHaveCount(1);
      const range = await openingRange(page), expectedTravel = height * (height >= 900 ? 1.8 : height >= 700 ? 1.5 : 1.2);
      expect(range.end - range.start).toBeCloseTo(expectedTravel, -1);
      const checkpoints = [];
      for (const progress of [0,.25,.5,.75,1]) {
        await openingStage(page, progress); const state = await page.evaluate(inspectMotion);
        const file = path.join(out, `${width}x${height}-${Math.round(progress * 100)}.png`);
        await page.screenshot({ path: file }); report.screens.push({ path: file, width, height, progress, state }); checkpoints.push(state);
        expect(Math.abs(state.viewport.scrollX), 'Opening checkpoint has no horizontal scroll').toBeLessThanOrEqual(.5);
        expect(state.viewport.documentScrollWidth, 'Opening checkpoint document fits viewport').toBeLessThanOrEqual(state.viewport.width+.5);
        expect(state.headerPlan.x, 'Header Plan left bound').toBeGreaterThanOrEqual(-.5);
        expect(state.headerPlan.x+state.headerPlan.width, 'Header Plan right bound').toBeLessThanOrEqual(state.viewport.width+.5);
        expect(state.headerPlan.y, 'Header Plan top bound').toBeGreaterThanOrEqual(-.5);
        expect(state.headerPlan.y+state.headerPlan.height, 'Header Plan bottom bound').toBeLessThanOrEqual(state.viewport.height+.5);
      }
      expect(new Set(checkpoints.map(state => state.cameraPosition)).size, 'Camera actually changes in route space').toBeGreaterThan(3);
      expect(new Set(checkpoints.map(state => state.cameraTarget)).size, 'Camera look target travels').toBeGreaterThan(2);
      expect(checkpoints.at(-1).routeParameter - checkpoints[0].routeParameter).toBeGreaterThan(.2);
      expect(checkpoints[3].photo.transform).not.toBe(checkpoints[0].photo.transform);
      await openingStage(page, 0);
      const sequence = [], sequenceOut = path.join(out, `${width}x${height}-sequence`); fs.mkdirSync(sequenceOut, { recursive: true });
      // Small wheel deltas preserve the actual Lenis/ScrollTrigger clock and reveal pacing.
      const worldEnd = await page.locator('#service-worlds').evaluate(node => scrollY + node.getBoundingClientRect().bottom);
      const steps = Math.ceil((worldEnd + height * .25) / 90);
      for (let frame = 0; frame <= steps; frame++) {
        if (frame) await page.mouse.wheel(0, 90);
        await page.waitForTimeout(95);
        const state = await page.evaluate(inspectMotion), file = path.join(sequenceOut, String(frame).padStart(4, '0') + '.png');
        await page.screenshot({ path: file }); sequence.push({ frame, path: file, capturedAt: new Date().toISOString(), ...state });
      }
      fs.writeFileSync(path.join(sequenceOut, 'frames.json'), JSON.stringify(sequence, null, 2));
      expect(sequence.some(frame => frame.progress > .4 && frame.progress < .7)).toBe(true);
      expect(sequence.some(frame => frame.handoff === 'flattening')).toBe(true);
      expect(sequence.some(frame => frame.handoff === 'graphic')).toBe(true);
      const metallicFrame = sequence.find(frame => frame.handoff === 'metallic'), graphicFrame = sequence.find(frame => frame.handoff === 'graphic');
      expect(Number.parseFloat(metallicFrame.metallicStroke) - Number.parseFloat(graphicFrame.metallicStroke)).toBeGreaterThan(5);
      expect(Number(graphicFrame.metallic.opacity)).toBeLessThan(.25);expect(Number(graphicFrame.route.opacity)).toBeGreaterThan(.8);
      // Let the actual wheel clock finish before a native positioned film capture.
      await page.waitForTimeout(2200);
      const filmTop = await page.locator('.rh-film-frame').evaluate(node => scrollY + node.getBoundingClientRect().top);
      const filmFrames = [];
      for (const [name, top] of [['framed',filmTop-height],['expanded',filmTop+150]]) {
        await page.evaluate(value=>scrollTo({top:value,behavior:'instant'}),top);await page.waitForTimeout(700);
        const geometry=await page.locator('.rh-film-frame').evaluate(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,transform:getComputedStyle(node).transform}));
        const file=path.join(out,`${width}x${height}-film-${name}.png`);await page.screenshot({path:file});filmFrames.push({name,...geometry});report.screens.push({path:file,width,height,chapter:'film',name,geometry});
      }
      expect(filmFrames[1].width/filmFrames[0].width).toBeGreaterThan(1.15);
      for (const [name,selector] of [['signature','.rh-signature-image'],['services','.rh-services'],['arrival','.rh-final']]) {
        await page.locator(selector).first().scrollIntoViewIfNeeded();await page.waitForTimeout(700);const file=path.join(out,`${width}x${height}-${name}.png`);await page.screenshot({path:file});report.screens.push({path:file,width,height,chapter:name});
      }
      report.cases.push({ locale: 'en', width, height, input: 'fine', motion: 'normal', pin: range, frames: sequence.length, sequence: path.join(sequenceOut, 'frames.json'), recording: await page.video().path() });
      await context.close();
    }
    report.checks.push('Tall and short fine desktop pin: initial/25/50/75/exit camera/target/route-space movement, Istanbul recession, timed small-wheel continuous capture and metallic→graphic handoff');
    const legal = await browser.newPage({ viewport: { width: 1440, height: 900 } }); watchRuntime(legal, report, 'fresh-legal');
    const chunks = []; legal.on('response', response => { if (/\/_next\/static\/chunks\/.*\.js/.test(response.url())) chunks.push(response); });
    await legal.goto(qaBase + '/en/privacy', { waitUntil: 'networkidle' });
    const inspected = [];
    for (const response of chunks) { const source = await response.text(); const markers = ['ScrollTrigger','WebGLRenderer','react-three','THREE.REVISION','GSAP','gsap-core','_gsap','WebGLRenderTarget','lenisVersion','class Lenis'].filter(marker => source.includes(marker)); inspected.push({ url: response.url(), bytes: source.length, markers }); expect(markers, 'Legal loaded heavy runtime ' + response.url()).toEqual([]); }
    expect(inspected.length).toBeGreaterThan(0); report.legalNetwork = inspected; await expect(legal.locator('canvas,.pin-spacer')).toHaveCount(0); await legal.close();
    report.checks.push('Fresh legal navigation: actual requested JavaScript chunk bodies inspected for GSAP/R3F/Three/Lenis runtime absence');
    expect(report.errors).toEqual([]); report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.failure = String(error); throw error; }
  finally { report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2)); await browser.close(); console.log(JSON.stringify(report, null, 2)); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await runMotion();
