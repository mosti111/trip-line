import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, assertRecoveryHome, openingStage } from './verify-recovery-motion.mjs';

const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v3');fs.mkdirSync(out,{recursive:true});
const report={ startedAt: new Date().toISOString(), browser: 'Chromium', stage: 'full', status:'running',checks:[],errors:[],expectedWebGLErrors:[],rendering:{}};
const browser=await chromium.launch({headless:true});
const watch=page=>watchRuntime(page,report,'resilience');
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});watch(page);
  await page.addInitScript(()=>{
    window.__bronzeDraws=0;
    for(const type of [window.WebGLRenderingContext,window.WebGL2RenderingContext]){
      if(!type)continue;
      for(const name of ['drawElements','drawArrays']){
        const original=type.prototype[name];
        type.prototype[name]=function(...args){window.__bronzeDraws++;return original.apply(this,args);};
      }
    }
  });
  await page.goto(base+'/en',{waitUntil:'networkidle'});await expect(page.locator('.ribbon-ready canvas')).toBeVisible({timeout:15000});
  await assertRecoveryHome(page,'en');await expect(page.locator('canvas')).toHaveCount(1);
  report.rendering.canvasDPR=await page.locator('canvas').evaluate(canvas=>canvas.width/canvas.getBoundingClientRect().width);expect(report.rendering.canvasDPR).toBeLessThanOrEqual(1.5+.02);
  await page.waitForTimeout(1000);
  const draws=()=>page.evaluate(()=>window.__bronzeDraws);
  let before=await draws();await page.waitForTimeout(500);report.rendering.idleDraws=await draws()-before;expect(report.rendering.idleDraws).toBe(0);
  await page.evaluate(()=>document.body.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'touch',clientX:100,clientY:100})));
  await page.waitForTimeout(300);expect(await draws()).toBe(before);
  await page.evaluate(()=>document.body.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',clientX:100,clientY:100})));
  await expect.poll(draws).toBeGreaterThan(before);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(300);before=await draws();await page.evaluate(()=>window.dispatchEvent(new CustomEvent('bronze-progress',{detail:.4})));await page.waitForTimeout(300);
  report.rendering.hiddenDraws=await draws()-before;expect(report.rendering.hiddenDraws).toBe(0);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.locator('#journey-builder').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);before=await draws();
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('bronze-progress',{detail:.5})));await page.waitForTimeout(500);
  report.rendering.offscreenDraws=await draws()-before;expect(report.rendering.offscreenDraws).toBe(0);
  report.checks.push('Measured zero WebGL draws while idle, hidden and offscreen; mouse invalidates, touch does not');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(out,'webgl-before-loss.png')});
  const hasLoss=await page.locator('canvas').evaluate(canvas=>{
    window.__loss=canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');
    if(!window.__loss)return false;window.__loss.loseContext();return true;
  });
  expect(hasLoss,'Chromium context-loss extension available').toBe(true);
  await expect(page.locator('.ribbon-ready')).toHaveCount(0);await expect(page.locator('.rh-arrival>.rh-sculpture')).toBeVisible();
  await page.screenshot({path:path.join(out,'webgl-lost.png')});before=await draws();await page.waitForTimeout(500);await page.evaluate(()=>window.__loss.restoreContext());await expect(page.locator('.ribbon-ready canvas')).toBeVisible();await expect(page.locator('.rh-arrival>.rh-sculpture')).not.toBeVisible();await expect.poll(draws).toBeGreaterThan(before);
  await page.screenshot({path:path.join(out,'webgl-restored.png')});
  report.checks.push('Actual WebGL context loss/restoration via Chromium extension recovers sculpture');
  await openingStage(page,.95);await expect(page.locator('.rh-arrival-copy > .rh-actions')).toHaveCSS('opacity','0');await expect(page.locator('.rh-title-block').first()).toHaveCSS('opacity','0');await expect(page.locator('.rh-departure')).toHaveCSS('opacity','1');
  await page.screenshot({path:path.join(out,'departure-refined.png')});
  await page.locator('.rh-arrival .rh-actions a').first().focus();await expect(page.locator('.rh-arrival-copy > .rh-actions')).toHaveCSS('opacity','1');await expect(page.locator('.rh-arrival .rh-actions a').first()).toBeInViewport({ratio:1});
  report.checks.push('Hero/departure copy sequenced without overlapping messages; hero keyboard focus restores readable arrival');
  await expect(page.locator('html')).toHaveAttribute('data-lenis-count','1');await expect(page.locator('html')).toHaveAttribute('data-lenis','running');
  // Desktop menu trigger is intentionally hidden; actual native modal opening still
  // exercises the shared observer, without a synthetic custom motion event.
  await page.locator('.nav-dialog').evaluate(dialog=>dialog.showModal());await expect(page.locator('html')).toHaveAttribute('data-lenis','paused');const modalTop=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,180);await page.waitForTimeout(200);expect(await page.evaluate(()=>scrollY)).toBe(modalTop);await page.locator('.nav-dialog').evaluate(dialog=>dialog.close());await expect(page.locator('html')).toHaveAttribute('data-lenis','running');
  await page.locator('#journey-builder input[value=istanbul]').check();await page.locator('.header-journey').click();await expect(page.locator('.journey-drawer')).toBeVisible();await expect(page.locator('html')).toHaveAttribute('data-lenis','paused');await page.keyboard.press('Escape');await expect(page.locator('html')).toHaveAttribute('data-lenis','running');await expect(page.locator('html')).toHaveAttribute('data-lenis-count','1');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(350);const resumedTop=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,90);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(resumedTop);
  report.checks.push('Exactly one Lenis; both real navigation and journey dialogs pause wheel travel and restore it after close');

  const unavailable=await browser.newPage({viewport:{width:1440,height:1000}});
  unavailable.on('pageerror',error=>report.expectedWebGLErrors.push(error.message));unavailable.on('console',message=>{if(message.type()==='error')report.expectedWebGLErrors.push(message.text());});
  await unavailable.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};});
  await unavailable.goto(base+'/en',{waitUntil:'networkidle'});await expect.poll(()=>report.expectedWebGLErrors.length).toBeGreaterThan(0);
  await expect(unavailable.locator('h1')).toBeVisible();await expect(unavailable.locator('.rh-arrival>.rh-sculpture')).toBeVisible();await expect(unavailable.locator('.ribbon-ready')).toHaveCount(0);
  expect(report.expectedWebGLErrors.every(message=>/Error creating WebGL context|THREE.WebGLRenderer/.test(message))).toBe(true);
  await unavailable.locator('#journey-builder input[value=istanbul]').check();await expect(unavailable.locator('input[name=journey]')).toHaveValue('istanbul');
  await unavailable.screenshot({path:path.join(out,'webgl-unavailable.png')});await unavailable.close();report.checks.push('WebGL unavailable at initialization: expected renderer errors contained; SVG/content/planner survive');

  const film=await browser.newPage({viewport:{width:390,height:844}});watch(film);
  await film.route('**/media/istanbul-ferries.mp4',route=>route.fulfill({status:200,contentType:'video/mp4',body:'invalid video data for fallback verification'}));
  await film.goto(base+'/en',{waitUntil:'networkidle'});await film.locator('.rh-film-frame').scrollIntoViewIfNeeded();await expect.poll(()=>film.locator('.rh-film-frame video').evaluate(video=>video.error?.code||0)).toBeGreaterThan(0);
  await expect(film.locator('.rh-film-frame video')).not.toHaveClass(/is-playing/);await expect(film.locator('.rh-film-frame>.photo')).toBeVisible();
  await expect(film.locator('.rh-film-frame .video-toggle')).toHaveText('Play Istanbul film');await film.screenshot({path:path.join(out,'video-fallback-mobile.png')});await film.unroute('**/media/istanbul-ferries.mp4');await film.locator('.rh-film-frame .video-toggle').click();await expect.poll(()=>film.locator('video').evaluate(video=>video.videoWidth),{timeout:15000}).toBeGreaterThan(0);await expect.poll(()=>film.locator('video').evaluate(video=>video.paused)).toBe(false);await film.close();
  report.checks.push('Undecodable chapter06 film retains poster/content/manual control; retry actually decodes and plays restored media');

  for(const locale of ['en','ar','tr']){
    await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
    await page.locator('.rt-index button').nth(2).click();await expect.poll(()=>page.locator('.rt-desktop-map .rt-map-canvas').first().evaluate(node=>getComputedStyle(node).transform)).not.toBe('none');
    const added=page.locator('#journey-builder input[value=bodrum]');await added.uncheck();await added.check();await expect(page.locator('.rh-builder-route [data-stop=bodrum]')).toBeAttached();await expect.poll(()=>page.locator('.rh-builder-route [data-stop=bodrum]').evaluate(node=>node.style.backgroundColor)).not.toBe('');
    await page.locator('.motion-choice select').selectOption('reduced');await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('.ribbon canvas')).toHaveCount(0);
    await expect.poll(()=>page.locator('.rh-arrival-copy').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).isIdentity)).toBe(true);await expect(page.locator('.rh-arrival-copy')).toHaveCSS('opacity','1');
    await expect(page.locator('.rt-desktop-map .rt-map-canvas').first()).toHaveCSS('transform','none');expect(await page.locator('.rh-builder-route [data-stop=bodrum]').evaluate(node=>node.style.backgroundColor),'Reduced preference removes observer-created builder highlight residue').toBe('');expect(await page.locator('.rh-film-frame').evaluate(node=>node.getAttribute('style')||''),'Reduced preference restores film frame inline style').toBe('');
    await page.locator('.motion-choice select').selectOption('system');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(page.locator('.pin-spacer')).toHaveCount(1);await expect(page.locator('.ribbon-ready canvas')).toBeVisible();
    await page.locator('.rh-arrival .rh-actions a').first().click();await page.waitForURL('**/destinations/turkiye');await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('html')).not.toHaveClass(/lenis/);
  }
  report.checks.push('EN/AR/TR live preference toggle tears down/recreates scenes and removes actual map-focus/builder-highlight tween residue; leaving home removes pins and Lenis');
  await page.goto(base+'/en',{waitUntil:'networkidle'});await expect(page.locator('.pin-spacer')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('data-lenis-count','1');await page.setViewportSize({width:768,height:1024});await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('.ribbon canvas')).toHaveCount(0);await expect(page.locator('html')).not.toHaveAttribute('data-lenis-count','1');await expect(page.locator('.rh-arrival .rh-actions a').first()).toBeVisible();await page.setViewportSize({width:1280,height:600});await expect(page.locator('.pin-spacer')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('data-lenis-count','1');await expect(page.locator('.ribbon-ready canvas')).toBeVisible();report.checks.push('Resize desktop→native tablet→short fine desktop cleans and recreates exactly one pin/Lenis/canvas');

  await page.setViewportSize({width:768,height:1024});await page.goto(base+'/ar',{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';document.body.style.fontSize='32px';});
  await page.locator('.menu-button').click();await page.locator('.dialog-footer>a').last().focus();await expect(page.locator('.dialog-footer>a').last()).toBeInViewport({ratio:1});await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  report.checks.push('Arabic enlarged base text: menu footer reachable without document overflow (not browser text-zoom certification)');
  expect(report.errors).toEqual([]);report.status='passed';console.log(JSON.stringify(report,null,2));
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'resilience.json'),JSON.stringify(report,null,2));await browser.close();}
