import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve('../tmp/frontend-qa/v3');fs.mkdirSync(out,{recursive:true});
const report={status:'running',base,checks:[],screens:[],errors:[],performance:{}};
const browser=await chromium.launch({headless:true});
function watch(page){page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!(m.location().url.endsWith('/not-a-page')&&m.text().includes('404')))report.errors.push(m.text());});}
async function clean(page,name){
  expect(await page.locator('h1').count(),name+' h1').toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow').toBe(true);
  expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)),name+' images').toEqual([]);
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});watch(page);
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await expect(page.locator('.ribbon-ready canvas')).toBeVisible();
 const builder=page.locator('.journey-builder');
 for(const name of ['Istanbul','Cappadocia','Antalya'])await builder.getByRole('checkbox',{name,exact:true}).check();
 await builder.getByRole('button',{name:'Move earlier: Antalya',exact:true}).click();
 await expect(builder.getByRole('button',{name:'Move earlier: Antalya',exact:true})).toBeFocused();
 await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya,cappadocia');
 await builder.locator('input[name=dates]').fill('May 2027');await builder.locator('input[name=travelers]').fill('4');
 await builder.getByRole('button',{name:'Plan this journey',exact:true}).click();await page.waitForURL('**/contact?**');
 await expect(page.locator('#inquiry-message')).toHaveCount(1);
 await expect(page.locator('#inquiry-message')).toHaveValue(/Istanbul → Antalya → Cappadocia/);
 await expect(page.locator('#inquiry-dates')).toHaveValue('May 2027');await expect(page.locator('#inquiry-travelers')).toHaveValue('4');
 await page.locator('.header a[lang=ar]').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('#inquiry-message')).toHaveValue(/إسطنبول → أنطاليا → كابادوكيا/);
 await page.locator('#inquiry-name').fill('V3 QA');await page.locator('#inquiry-email').fill('v3@example.com');await page.locator('#inquiry-consent').check();
 await page.locator('form button[type=submit]').click();await expect(page.locator('.inquiry-result')).toBeVisible();
 await page.locator('#inquiry-dates').fill('June 2027');await expect(page.locator('.inquiry-result')).toHaveCount(0);
 report.checks.push('Ordered journey, reorder, dates/travelers, localized query handoff, preparation, stale output invalidation');
 await page.goto(base+'/en/contact?journey=fake,antalya,antalya,istanbul&travelers=-1');
 await expect(page.locator('#inquiry-message')).toHaveValue(/Antalya → Istanbul/);await expect(page.locator('#inquiry-travelers')).toHaveValue('');
 report.checks.push('Unknown/duplicate destination IDs and invalid traveler count sanitized');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 for(const name of ['Istanbul','Antalya'])await builder.getByRole('checkbox',{name,exact:true}).check();
 await builder.getByRole('button',{name:'Move earlier: Antalya',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(builder.getByRole('button',{name:'Move later: Antalya',exact:true})).toBeFocused();
 await builder.getByRole('button',{name:'Remove: Antalya',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(builder.getByRole('checkbox',{name:'Antalya',exact:true})).toBeFocused();
 await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul');
 report.checks.push('Keyboard reorder at boundary and removal restore usable focus; itinerary status updates');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await page.locator('.signature-places a.destination-portal').first().click();await page.waitForURL('**/cappadocia');await expect(page.locator('h1')).toHaveText('Cappadocia');
 await page.waitForLoadState('networkidle');await page.reload({waitUntil:'networkidle'});await expect(page.locator('h1')).toHaveText('Cappadocia');await page.goBack({waitUntil:'networkidle'});await expect(page.locator('.journey-builder')).toBeAttached();await page.goForward();await expect(page.locator('h1')).toHaveText('Cappadocia');
 report.checks.push('Destination shared-element navigation, direct refresh, browser back/forward');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 const services=page.locator('.service-route-directory');
 for(const locale of ['en','ar','tr']){
  await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
  const choices=page.locator('.world-choices button');
  for(let i=0;i<3;i++){await choices.nth(i).focus();await expect(choices.nth(i)).toHaveAttribute('aria-pressed','true');await expect(page.locator('.world-image[data-active=true]')).toHaveCount(1);}
  await choices.first().focus();await page.keyboard.press('ArrowDown');await expect(choices.nth(1)).toBeFocused();await expect(choices.nth(1)).toHaveAttribute('aria-pressed','true');
  await services.locator('summary').click();await expect(services.locator('a')).toHaveCount(9);
  for(const link of await services.locator('a').all()){await link.focus();await expect(link).toBeInViewport({ratio:1});}
  await page.screenshot({path:path.join(out,`services-keyboard-${locale}.png`)});
 }
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 report.checks.push('Three service worlds synchronize media on focus; arrow navigation and all nine service directory links work in EN/AR/TR');
 await page.locator('.menu-button').click();await expect.poll(()=>page.locator('.menu-image img').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);await page.screenshot({path:path.join(out,'menu-desktop.png')});await page.keyboard.press('Escape');await expect(page.locator('.menu-button')).toBeFocused();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(800);
 const heroVideo=page.locator('.home-hero video');await expect.poll(()=>heroVideo.evaluate(v=>v.paused)).toBe(false);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>heroVideo.evaluate(v=>v.paused)).toBe(true);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>heroVideo.evaluate(v=>v.paused)).toBe(false);await page.locator('.journey-builder').scrollIntoViewIfNeeded();await expect.poll(()=>heroVideo.evaluate(v=>v.paused)).toBe(true);
 report.checks.push('Menu Escape/focus return, simulated document visibility and offscreen video pause');
 // Representative templates at each required width, plus complete home across all widths.
 const cases=[];
 for(const locale of ['en','ar','tr'])for(const width of [360,390,430,768,1024,1280,1440])cases.push([`home-${locale}-${width}`,'/'+locale,width,width<768?844:1000]);
 for(const locale of ['en','ar','tr'])for(const [name,url] of [['discovery','destinations/turkiye'],['destination','destinations/turkiye/rize-ayder'],['pilgrimage','services/hajj-umrah'],['international','destinations'],['inquiry','contact'],['missing','not-a-page']])for(const width of [390,1440])cases.push([`${name}-${locale}-${width}`,`/${locale}/${url}`,width,width<768?844:1000]);
 for(const [name,url] of [['business','/en/business'],['destination-tablet','/tr/destinations/turkiye/antalya'],['inquiry-tablet','/ar/contact']])cases.push([name,url,768,1000]);
 for(const [name,url,width,height] of cases){
  await page.setViewportSize({width,height});const response=await page.goto(base+url,{waitUntil:'load'});expect(response.status()).toBe(url.endsWith('not-a-page')?404:200);await expect.poll(()=>page.locator('h1').evaluateAll(nodes=>nodes.length===1&&nodes[0].getBoundingClientRect().height>0)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('dir',url.startsWith('/ar')?'rtl':'ltr');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}scrollTo({top:0,behavior:'instant'});});
  await page.waitForTimeout(850);await clean(page,name);
  await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});report.screens.push({name,url,width,height,mode:'normal'});console.log('Captured',name);
 }
 await page.setViewportSize({width:844,height:390});await page.goto(base+'/ar');await clean(page,'landscape');await page.screenshot({path:path.join(out,'arabic-landscape.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('.menu-button').click();await page.screenshot({path:path.join(out,'menu-arabic-mobile.png')});await page.keyboard.press('Escape');
 for(const locale of ['en','ar','tr']){
  const calm=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});watch(calm);await calm.goto(base+'/'+locale,{waitUntil:'networkidle'});
  await expect(calm.locator('.ribbon canvas')).toHaveCount(0);await expect(calm.locator('.pin-spacer')).toHaveCount(0);expect(await calm.locator('video[src]').count()).toBe(0);await expect(calm.locator('.hero-content')).toHaveCSS('transform','none');await calm.screenshot({path:path.join(out,`reduced-motion-${locale}.png`),fullPage:true});await calm.close();
 }
 const saver=await browser.newPage();watch(saver);await saver.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}));await saver.goto(base+'/en',{waitUntil:'networkidle'});expect(await saver.locator('video[src]').count()).toBe(0);await expect(saver.locator('.ribbon canvas')).toHaveCount(0);await expect(saver.locator('.departure-copy')).toHaveCSS('opacity','1');await saver.close();
 report.checks.push('Device reduced motion, native static composition, no automatic video or WebGL on data saver');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/en',{waitUntil:'networkidle'});await expect(page.locator('.ribbon-ready')).toBeVisible();
 await page.locator('.ribbon canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('.ribbon-ready')).toHaveCount(0);await expect(page.locator('.ribbon>svg')).toHaveCSS('opacity','1');
 report.checks.push('WebGL context-loss event restores static SVG');
 const nojs=await browser.newPage({javaScriptEnabled:false});
 for(const route of ['/en','/ar','/tr','/en/services/tours','/ar/destinations/turkiye/rize-ayder','/tr/contact']){await nojs.goto(base+route);await expect(nojs.locator('h1')).toBeVisible();await clean(nojs,'no-JS '+route);}
 await nojs.goto(base+'/en');await expect(nojs.locator('.hero .button')).toHaveAttribute('href','/en/destinations/turkiye');await expect(nojs.locator('.world-choices button')).toHaveCount(3);await expect(nojs.locator('.service-route-directory a')).toHaveCount(9);await nojs.screenshot({path:path.join(out,'no-js-home.png')});await nojs.close();report.checks.push('No-JS visible homepage in all locales, service/destination/contact content and destination links');
 for(const width of [390,1280]){
  const touch=await browser.newPage({viewport:{width,height:900},hasTouch:true,isMobile:true});watch(touch);await touch.goto(base+'/ar',{waitUntil:'networkidle'});
  expect(await touch.evaluate(()=>matchMedia('(pointer:coarse)').matches)).toBe(true);await expect(touch.locator('.pin-spacer')).toHaveCount(0);await expect(touch.locator('.ribbon canvas')).toHaveCount(0);
  await touch.locator('.journey-builder input[value=istanbul]').tap();await expect(touch.locator('input[name=journey]')).toHaveValue('istanbul');
  await touch.locator('.menu-button').tap();await expect(touch.locator('dialog')).toBeVisible();await touch.locator('.dialog-header button').tap();await expect(touch.locator('dialog')).not.toBeVisible();await clean(touch,'touch '+width);await touch.close();
 }
 report.checks.push('Emulated coarse touch at 390/1280: native vertical layout, static sculpture, planner and menu');
 for(const locale of ['en','ar','tr']){
  await page.setViewportSize({width:1280,height:600});await page.goto(base+'/'+locale,{waitUntil:'networkidle'});await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await services.locator('summary').click();await services.locator('a').last().focus();await expect(services.locator('a').last()).toBeInViewport({ratio:1});await clean(page,'short '+locale);
  await page.locator('.menu-button').click();await page.locator('.dialog-footer>a').last().focus();await expect(page.locator('.dialog-footer>a').last()).toBeInViewport({ratio:1});await page.keyboard.press('Escape');await expect(page.locator('.menu-button')).toBeFocused();
 }
 report.checks.push('Short-height 1280×600 EN/AR/TR: no pin, reachable last service and scrollable menu footer');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/en',{waitUntil:'networkidle'});
 const orientation=await page.locator('.atlas-map svg').first().evaluate(svg=>({paths:[...svg.querySelectorAll('g>path')].map(p=>p.getAttribute('d')),transform:getComputedStyle(svg).transform}));
 await page.goto(base+'/ar',{waitUntil:'networkidle'});expect(await page.locator('.atlas-map svg').first().evaluate(svg=>({paths:[...svg.querySelectorAll('g>path')].map(p=>p.getAttribute('d')),transform:getComputedStyle(svg).transform}))).toEqual(orientation);
 report.checks.push('Arabic and English geography paths/orientation identical');
 await page.locator('.turkey-atlas .country-index button').nth(2).click();const chosen=await page.locator('.atlas-preview h3').textContent();await page.evaluate(()=>window.dispatchEvent(new CustomEvent('bronze-place',{detail:'antalya'})));await expect(page.locator('.atlas-preview h3')).toHaveText(chosen);report.checks.push('Manual atlas choice survives guided scroll updates');
 await page.goto(base+'/en',{waitUntil:'networkidle'});await page.locator('.home-hero video').evaluate(video=>video.dispatchEvent(new Event('error')));await expect(page.locator('.home-hero video')).not.toHaveClass(/is-playing/);await expect(page.locator('.home-hero>.photo')).toBeVisible();report.checks.push('Simulated media error exposes the existing photo fallback');
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});await page.setViewportSize({width:390,height:844});
 const started=Date.now();await page.goto(base+'/en',{waitUntil:'networkidle'});await page.locator('.journey-builder input[type=checkbox]').first().check();report.performance.mobile4xNavigationAndSelectionMs=Date.now()-started;await session.send('Emulation.setCPUThrottlingRate',{rate:1});
 report.checks.push('4× CPU-throttled mobile navigation and planner interaction');
 expect(report.errors).toEqual([]);
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));await browser.close();}
