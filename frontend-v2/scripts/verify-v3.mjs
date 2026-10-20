import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, resetJourney, assertRecoveryHome, openingStage, filmLifecycle } from './verify-recovery-motion.mjs';
if (process.env.QA_STAGE === 'static') {
 await (await import('./verify-recovery-static.mjs')).verifyRecoveryStatic('v3');
 process.exit(0);
}
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v3');fs.mkdirSync(out,{recursive:true});
const report={ startedAt: new Date().toISOString(), browser: 'Chromium', stage: 'full', status:'running',base,checks:[],screens:[],errors:[],performance:{}};
const browser=await chromium.launch({headless:true});
function watch(page){watchRuntime(page,report,'v3');}
async function clean(page,name){
  expect(await page.locator('h1').count(),name+' h1').toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow').toBe(true);
  expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)),name+' images').toEqual([]);
}
async function fullyVisibleFocusedService(link,locale){
 await expect(link).toBeFocused();
 await expect(link).toBeInViewport({ratio:.9999});
 const bounds=()=>link.evaluate(node=>{const rect=node.getBoundingClientRect(),header=document.querySelector('.header')?.getBoundingClientRect();return{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:innerWidth,height:innerHeight,headerBottom:header?.bottom||0};});
 await expect.poll(async()=>{const box=await bounds();return box.left>=-.5&&box.right<=box.width+.5&&box.top>=Math.max(0,box.headerBottom)-.5&&box.bottom<=box.height+.5;}, {message:locale+' focused service fits viewport and clears sticky header'}).toBe(true);
 (report.serviceKeyboardBounds||=[]).push({locale,href:await link.getAttribute('href'),...await bounds()});
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});watch(page);
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await assertRecoveryHome(page,'en');
 await expect(page.locator('.ribbon-ready canvas')).toBeVisible();
 const builder=page.locator('#journey-builder');
 for(const name of ['Istanbul','Cappadocia','Antalya'])await builder.getByRole('checkbox',{name,exact:true}).check();
 await builder.getByRole('button',{name:'Move earlier: Antalya',exact:true}).click();
 await expect(builder.getByRole('button',{name:'Move earlier: Antalya',exact:true})).toBeFocused();
 await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya,cappadocia');
 await builder.locator('#builder-dates').fill('May 2027');await builder.locator('input[name=travelers]').fill('4');
 await builder.getByRole('button',{name:'Plan this journey',exact:true}).click();await page.waitForURL('**/contact?**');
 await expect(page.locator('#inquiry-message')).toHaveCount(1);
 await expect(page.locator('[data-contact-stop]')).toHaveText(['01Istanbul','02Antalya','03Cappadocia']);await expect(page.locator('#inquiry-message')).toHaveValue('');
 await expect(page.locator('#inquiry-dates')).toHaveValue('May 2027');await expect(page.locator('#inquiry-travelers')).toHaveValue('4');
 await page.locator('.header a[lang=ar]').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('[data-contact-stop]')).toHaveText(['01إسطنبول','02أنطاليا','03كابادوكيا']);await expect(page.locator('#inquiry-message')).toHaveValue('');
 await page.locator('#inquiry-name').fill('V3 QA');await page.locator('#inquiry-email').fill('v3@example.com');await page.locator('#inquiry-message').fill('Please discuss these arrangements.');await page.locator('#inquiry-consent').check();
 await page.locator('form button[type=submit]').click();await expect(page.locator('.inquiry-result')).toBeVisible();const contactText=new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');expect(contactText.split('إسطنبول ← أنطاليا ← كابادوكيا').length-1).toBe(1);expect(new URL(await page.locator('.inquiry-result a[href^="mailto:"]').getAttribute('href')).searchParams.get('body')).toBe(contactText);
 await page.locator('#inquiry-dates').fill('June 2027');await expect(page.locator('.inquiry-result')).toHaveCount(0);
 report.checks.push('Ordered journey, reorder, dates/travelers, localized query handoff, preparation, stale output invalidation');
 await page.goto(base+'/en/contact?journey=fake,antalya,antalya,istanbul&travelers=-1');
 await expect(page.locator('[data-contact-stop]')).toHaveText(['01Antalya','02Istanbul']);await expect(page.locator('#inquiry-message')).toHaveValue('');await expect(page.locator('#inquiry-travelers')).toHaveValue('');
 report.checks.push('Unknown/duplicate destination IDs and invalid traveler count sanitized');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await resetJourney(page);
 for(const name of ['Istanbul','Antalya'])await builder.getByRole('checkbox',{name,exact:true}).check();
 await builder.getByRole('button',{name:'Move earlier: Antalya',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(builder.getByRole('button',{name:'Move later: Antalya',exact:true})).toBeFocused();
 await builder.getByRole('button',{name:'Remove: Antalya',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(builder.getByRole('checkbox',{name:'Antalya',exact:true})).toBeFocused();
 await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul');
 report.checks.push('Keyboard reorder at boundary and removal restore usable focus; itinerary status updates');
 await resetJourney(page);await page.locator('.rt-index button').filter({hasText:'Rize & Ayder'}).click();await page.locator('.rt-preview-actions button').click();await expect(builder.locator('input[name=journey]')).toHaveValue('rize-ayder');
 await page.goto(base+'/en/destinations/turkiye/antalya',{waitUntil:'networkidle'});await page.locator('.nav-turkiye-link button').click();const mega=page.locator('.turkiye-mega');await expect(mega).toBeVisible();await mega.locator('.mega-groups').getByRole('link',{name:'Antalya',exact:true}).focus();await expect(mega.locator('.mega-preview h3')).toHaveText('Antalya');await mega.locator('.mega-preview-actions').getByRole('button',{name:'Add to journey: Antalya',exact:true}).click();await page.locator('.nav-turkiye-link button').click();await expect(mega).not.toBeVisible();await page.reload({waitUntil:'networkidle'});await expect(page.locator('.header-journey')).toHaveText(/2/);
 await page.locator('.header-journey').click();const drawer=page.locator('.journey-drawer');await expect(drawer).toBeVisible();await drawer.getByRole('button',{name:'Move earlier: Antalya',exact:true}).focus();await page.keyboard.press('Enter');await expect(drawer.getByRole('button',{name:'Move later: Antalya',exact:true})).toBeFocused();expect(await drawer.locator('[data-journey-stop]').evaluateAll(nodes=>nodes.map(node=>node.dataset.journeyStop))).toEqual(['antalya','rize-ayder']);await drawer.getByRole('button',{name:'Remove: Rize & Ayder',exact:true}).click();await expect(drawer.locator('[data-journey-stop]')).toHaveCount(1);await page.keyboard.press('Escape');await expect(page.locator('.header-journey')).toBeFocused();
 await page.locator('.header a[lang=ar]').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await page.goto(base+'/ar',{waitUntil:'networkidle'});await expect(builder.locator('input[name=journey]')).toHaveValue('antalya');const persistedJourney=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('tripline-journey')));expect(Object.keys(persistedJourney).sort()).toEqual(['destinations','journeyType']);expect(persistedJourney.destinations).toEqual(['antalya']);
 await page.locator('.header-journey').click();await page.locator('.journey-drawer-bottom a').first().click();await page.waitForURL('**/contact?**');await expect(page.locator('[data-contact-stop]')).toHaveText(['01أنطاليا']);await expect(page.locator('#inquiry-message')).toHaveValue('');await expect(page.locator('.journey-drawer')).not.toBeVisible();
 report.checks.push('Global quickview Add and visible shell-menu Add on a destination detail route, drawer keyboard reorder/remove, route/reload/locale session persistence stores IDs/type only, and drawer→contact ordered context; D05 body Add remains a later gate');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await page.locator('.rh-signature-image').first().click();await page.waitForURL('**/cappadocia');await expect(page.locator('h1')).toHaveText('Cappadocia');
 await page.waitForLoadState('networkidle');await page.reload({waitUntil:'networkidle'});await expect(page.locator('h1')).toHaveText('Cappadocia');await page.goBack({waitUntil:'networkidle'});await expect(page.locator('#journey-builder')).toBeAttached();await page.goForward();await expect(page.locator('h1')).toHaveText('Cappadocia');
 report.checks.push('Destination shared-element navigation, direct refresh, browser back/forward');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 const services=page.locator('.rh-services');
 for(const locale of ['en','ar','tr']){
  await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
  const choices=page.locator('.rh-intent');
  await expect(page.locator('.rh-world-plane')).toHaveCount(3);
  for(let i=0;i<3;i++){await choices.nth(i).focus();await page.keyboard.press('Enter');await expect(choices.nth(i)).toHaveAttribute('aria-pressed','true');await expect(page.locator('.rh-world-plane[data-selected=true]')).toHaveCount(1);await expect(page.locator('#builder-service')).toHaveValue(['tours','hajj-umrah','corporate'][i]);}
  const persisted=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('tripline-journey')).journeyType);expect(persisted).toBe('corporate');await page.reload({waitUntil:'networkidle'});await expect(choices.last()).toHaveAttribute('aria-pressed','true');
  await expect(services.locator('a')).toHaveCount(9);
  for(const link of await services.locator('a').all()){await link.focus();await fullyVisibleFocusedService(link,locale);}
  await page.screenshot({path:path.join(out,`services-keyboard-${locale}.png`)});
 }
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 report.checks.push('Three simultaneous spatial intent planes explicitly activate by keyboard; stored type persists reload, builder syncs, and all nine grouped links remain reachable EN/AR/TR');
 await page.setViewportSize({width:768,height:1000});await page.locator('.menu-button').click();const tabletMenu=page.locator('.nav-dialog');await expect(tabletMenu).toBeVisible();await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded','true');await expect(tabletMenu.locator('.dialog-header>span')).toHaveText('Trip Line');
 const menuLinks=tabletMenu.locator('nav>a');expect(await menuLinks.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')))).toEqual(['destinations/turkiye','services/hajj-umrah','business','services','about','destinations','faq','contact'].map(route=>'/en/'+route));for(const link of await menuLinks.all())await expect(link).toBeVisible();
 for(const locale of ['en','ar','tr'])await expect(tabletMenu.locator(`.languages a[lang=${locale}]`)).toHaveAttribute('href','/'+locale);await expect(tabletMenu.locator('.languages a[lang=en]')).toHaveAttribute('aria-current','true');
 const menuPlan=tabletMenu.locator('.mobile-menu-plan-row a');await expect(menuPlan).toBeVisible();const menuPlanHref=await menuPlan.getAttribute('href');expect(new URL(menuPlanHref,base).pathname).toBe('/en/contact');expect(new URL(menuPlanHref,base).searchParams.get('journey')).toBe('antalya');await expect(tabletMenu.locator('.dialog-footer>button')).toHaveText(/View journey.*1/);
 const menuImages=tabletMenu.locator('img');for(const image of await menuImages.all())await expect.poll(()=>image.evaluate(node=>node.complete&&node.naturalWidth>0)).toBe(true);report.tabletMenu={width:768,height:1000,primaryLinks:8,languageLinks:3,planningHref:menuPlanHref,journeyAction:true,decodedImageCount:await menuImages.count()};
 const menuClose=tabletMenu.locator('.dialog-header button');await menuClose.focus();await page.keyboard.press('Shift+Tab');await expect(tabletMenu.locator('.dialog-footer>a').last()).toBeFocused();await page.keyboard.press('Tab');await expect(menuClose).toBeFocused();await page.screenshot({path:path.join(out,'menu-tablet.png')});await page.keyboard.press('Escape');await expect(tabletMenu).not.toBeVisible();await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded','false');await expect(page.locator('.menu-button')).toBeFocused();
 await page.setViewportSize({width:1440,height:1000});await filmLifecycle(page);
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
  await expect(calm.locator('.ribbon canvas')).toHaveCount(0);await expect(calm.locator('.pin-spacer')).toHaveCount(0);expect(await calm.locator('video[src]').count()).toBe(0);await expect(calm.locator('.rh-arrival-copy')).toHaveCSS('transform','none');await calm.screenshot({path:path.join(out,`reduced-motion-${locale}.png`),fullPage:true});await calm.close();
 }
 const saver=await browser.newPage();watch(saver);await saver.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}));await saver.goto(base+'/en',{waitUntil:'networkidle'});expect(await saver.locator('video[src]').count()).toBe(0);await expect(saver.locator('.ribbon canvas')).toHaveCount(0);await expect(saver.locator('.rh-arrival-copy')).toHaveCSS('opacity','1');await saver.close();
 report.checks.push('Device reduced motion, native static composition, no automatic video or WebGL on data saver');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/en',{waitUntil:'networkidle'});await expect(page.locator('.ribbon-ready')).toBeVisible();
 await page.locator('.ribbon canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('.ribbon-ready')).toHaveCount(0);await expect(page.locator('.rh-arrival>.rh-sculpture')).toBeVisible();
 report.checks.push('WebGL context-loss event restores static SVG');
 const nojs=await browser.newPage({javaScriptEnabled:false});
 for(const route of ['/en','/ar','/tr','/en/services/tours','/ar/destinations/turkiye/rize-ayder','/tr/contact']){await nojs.goto(base+route);await expect(nojs.locator('h1')).toBeVisible();await clean(nojs,'no-JS '+route);}
 await nojs.goto(base+'/en');await expect(nojs.locator('.rh-arrival .rh-actions a').first()).toHaveAttribute('href','/en/destinations/turkiye');await expect(nojs.locator('.rh-intent')).toHaveCount(3);await expect(nojs.locator('.rh-services li a')).toHaveCount(9);await assertRecoveryHome(nojs,'en');for(const chapter of await nojs.locator('.recovery-home [data-chapter]').all())await expect(chapter.locator('h2').first()).toBeVisible();await nojs.screenshot({path:path.join(out,'no-js-home.png')});await nojs.close();report.checks.push('No-JS visible fifteen-chapter homepage in all locales, service/destination/contact content and destination links');
 for(const width of [390,1280]){
  const touch=await browser.newPage({viewport:{width,height:900},hasTouch:true,isMobile:true});watch(touch);await touch.goto(base+'/ar',{waitUntil:'networkidle'});
  expect(await touch.evaluate(()=>matchMedia('(pointer:coarse)').matches)).toBe(true);await expect(touch.locator('.pin-spacer')).toHaveCount(0);await expect(touch.locator('.ribbon canvas')).toHaveCount(0);
  await touch.locator('#journey-builder input[value=istanbul]').tap();await expect(touch.locator('input[name=journey]')).toHaveValue('istanbul');
  if(width<1024){await touch.locator('.menu-button').tap();await expect(touch.locator('.nav-dialog')).toBeVisible();await touch.locator('.nav-dialog .dialog-header button').tap();await expect(touch.locator('.nav-dialog')).not.toBeVisible();}else{await touch.locator('.nav-turkiye-link button').tap();await expect(touch.locator('.turkiye-mega')).toBeVisible();await touch.locator('.nav-turkiye-link button').tap();await expect(touch.locator('.turkiye-mega')).not.toBeVisible();}await clean(touch,'touch '+width);await touch.close();
 }
 report.checks.push('Emulated coarse touch at 390/1280: native vertical layout, static sculpture, planner and menu');
 for(const locale of ['en','ar','tr']){
  await page.setViewportSize({width:1280,height:600});await page.goto(base+'/'+locale,{waitUntil:'networkidle'});await expect(page.locator('.pin-spacer')).toHaveCount(1);await openingStage(page,.65);await page.locator('.rh-arrival .rh-actions a').first().focus();await expect(page.locator('.rh-arrival .rh-actions a').first()).toBeInViewport({ratio:1});
  await services.locator('a').last().focus();await fullyVisibleFocusedService(services.locator('a').last(),locale+' short');await clean(page,'short '+locale);
  await page.locator('.header-journey').click();await expect(page.locator('.journey-drawer')).toBeVisible();await page.locator('.journey-drawer-bottom a').first().focus();await expect(page.locator('.journey-drawer-bottom a').first()).toBeInViewport({ratio:1});await page.keyboard.press('Escape');await expect(page.locator('.header-journey')).toBeFocused();
 }
 report.checks.push('Short-height 1280×600 EN/AR/TR: compressed pin, readable hero keyboard restoration, reachable last service and journey drawer planning action');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/en',{waitUntil:'networkidle'});
 const orientation=await page.locator('.rt-desktop-map svg').first().evaluate(svg=>({paths:[...svg.querySelectorAll('g>path')].map(p=>p.getAttribute('d')),transform:getComputedStyle(svg).transform}));
 expect(orientation.paths.length).toBeGreaterThan(0);
 await page.goto(base+'/ar',{waitUntil:'networkidle'});expect(await page.locator('.rt-desktop-map svg').first().evaluate(svg=>({paths:[...svg.querySelectorAll('g>path')].map(p=>p.getAttribute('d')),transform:getComputedStyle(svg).transform}))).toEqual(orientation);
 report.checks.push('Arabic and English geography paths/orientation identical');
 await page.locator('.rt-index button').nth(2).click();const chosen=await page.locator('.rt-preview h3').textContent();await page.evaluate(()=>window.dispatchEvent(new CustomEvent('bronze-place',{detail:'antalya'})));await expect(page.locator('.rt-preview h3')).toHaveText(chosen);report.checks.push('Manual atlas choice survives guided scroll updates');
 await page.goto(base+'/en',{waitUntil:'networkidle'});await page.locator('.rh-film-frame video').evaluate(video=>video.dispatchEvent(new Event('error')));await expect(page.locator('.rh-film-frame video')).not.toHaveClass(/is-playing/);await expect(page.locator('.rh-film-frame>.photo')).toBeVisible();report.checks.push('Simulated media error exposes the existing photo fallback');
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});await page.setViewportSize({width:390,height:844});
 const started=Date.now();await page.goto(base+'/en',{waitUntil:'networkidle'});await page.locator('#journey-builder input[type=checkbox]').first().check();report.performance.mobile4xNavigationAndSelectionMs=Date.now()-started;await session.send('Emulation.setCPUThrottlingRate',{rate:1});
 report.checks.push('4× CPU-throttled mobile navigation and planner interaction');
 expect(report.errors).toEqual([]);
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));await browser.close();}
