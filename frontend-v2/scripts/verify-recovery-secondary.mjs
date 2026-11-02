import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { watchRuntime } from './verify-recovery-motion.mjs';

const require=createRequire(import.meta.url);
const cache=new Map();
function source(file){
 const absolute=path.resolve(file);if(cache.has(absolute))return cache.get(absolute).exports;
 const compiledModule={exports:{}};cache.set(absolute,compiledModule);
 const js=ts.transpileModule(fs.readFileSync(absolute,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('require','module','exports',js)(id=>id.startsWith('.')?source(path.resolve(path.dirname(absolute),id+'.ts')):require(id),compiledModule,compiledModule.exports);
 return compiledModule.exports;
}
const {countries,services,questions}=source('lib/travel-content.ts');
const {turkishPlaces}=source('lib/turkiye.ts');
const {ui}=source('lib/i18n.ts');
const base=process.env.QA_URL||'http://localhost:3043';
const stage=process.env.QA_SECONDARY_STAGE||'production';
const startedAt=new Date().toISOString();
const out=path.resolve('../tmp/frontend-qa/recovery-secondary',startedAt.replaceAll(':','-'));
fs.mkdirSync(out,{recursive:true});
const appFiles=['components/secondary/InternationalExperience.tsx','components/secondary/FAQExperience.tsx','components/secondary/LegalExperience.tsx','components/secondary/CountryPlan.tsx','components/travel/Pages.tsx','styles/recovery-secondary.css'];
const files=[...appFiles,'scripts/verify-recovery-secondary.mjs','lib/travel-content.ts','lib/turkiye.ts','lib/i18n.ts','lib/journey.ts','components/experience/JourneyStore.tsx','components/travel/Inquiry.tsx'];
const fingerprints=()=>Object.fromEntries(files.map(file=>[file,createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
const report={status:'running',stage,base,startedAt,revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fingerprints:fingerprints(),cases:[],screens:[],errors:[],requests:[],gaps:['Chromium only; no Safari, Firefox, physical device or assistive technology certification. Chunk names cannot prove opaque bundle isolation. Root Astra source/rendered acceptance pending.']};
fs.writeFileSync(path.join(out,'source-inventory.json'),JSON.stringify({countries,services:services.map(s=>({slug:s.slug,question:s.question,answer:s.answer})),questions,turkishPlaceIds:turkishPlaces.map(p=>p.slug)},null,2));
const browser=await chromium.launch({headless:true});let active;
const routes=['destinations','destinations/georgia','faq','privacy','terms'];
async function fresh(locale,width,height,options={}){
 const {seed,...settings}=options;
 const context=await browser.newContext({viewport:{width,height},...settings});
 if(seed)await context.addInitScript(value=>{if(!sessionStorage.getItem('tripline-journey'))sessionStorage.setItem('tripline-journey',JSON.stringify(value));},seed);
 if(settings.extraHTTPHeaders?.['Save-Data'])await context.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
 const page=await context.newPage();active=page;watchRuntime(page,report,`${locale}-${width}`);
 page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))report.requests.push({method:request.method(),url:request.url()});});
 return{page,context,locale,width,height};
}
async function go(s,route){await s.page.goto(`${base}/${s.locale}/${route}`,{waitUntil:'networkidle'});await expect(s.page.locator('h1')).toHaveCount(1);await expect(s.page.locator('html')).toHaveAttribute('dir',s.locale==='ar'?'rtl':'ltr');await expect(s.page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);await s.page.evaluate(()=>document.fonts.ready);}
async function bounds(s){
 expect(await s.page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth})),`overflow ${s.locale} ${s.width}`).toMatchObject({width:s.width});
 expect(await s.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no document overflow').toBe(true);
 await expect(s.page.locator('.recovery-secondary canvas,.recovery-secondary video,.pin-spacer')).toHaveCount(0);
 const broken=await s.page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));expect(broken).toEqual([]);
 expect(await s.page.locator('.recovery-secondary img').evaluateAll(images=>images.map(i=>({transform:getComputedStyle(i).transform,fit:getComputedStyle(i).objectFit})).filter(i=>i.transform.includes('-1')||i.fit!=='cover'))).toEqual([]);
}
async function shot(s,name,fullPage=true){const file=path.join(out,`${name}.png`);await s.page.screenshot({path:file,fullPage});report.screens.push({name,file,locale:s.locale,width:s.width,height:s.height,fullPage,at:new Date().toISOString()});}
function pass(name,details={}){report.cases.push({name,at:new Date().toISOString(),...details});}
async function family(s,route,capture=true){
 await go(s,route);
 if(route==='destinations'){
  await expect(s.page.locator('[data-primary-turkiye]')).toHaveAttribute('href',`/${s.locale}/destinations/turkiye`);
  await expect(s.page.locator('[data-directory-country]')).toHaveCount(9);
  for(const c of countries.filter(c=>c.slug!=='turkiye')){const row=s.page.locator(`[data-directory-country=${c.slug}]`);await expect(row).toContainText(c.name[s.locale]);await expect(row).toContainText(c.note[s.locale]);await expect(row.locator('a')).toHaveAttribute('href',`/${s.locale}/destinations/${c.slug}`);}
  await expect(s.page.locator('.atlas,.rt-map,.atlas-map')).toHaveCount(0);
 }else if(route.startsWith('destinations/')){
  const c=countries.find(c=>route===`destinations/${c.slug}`);await expect(s.page.locator('h1')).toHaveText(c.name[s.locale]);await expect(s.page.locator('[data-country-note]')).toHaveText(c.note[s.locale]);await expect(s.page.locator('.sx-coordinate')).toHaveText(c.coordinate);expect(await s.page.locator('[data-country-interest]').allTextContents()).toEqual(c.interests.map(i=>i[s.locale]));await expect(s.page.locator('.sx-country-photo img')).toHaveAttribute('src',new RegExp(`${c.slug}\\.jpg`));
  if(c.slug==='saudi-arabia')await expect(s.page.locator('.sx-related-services a[href$="services/hajj-umrah"]')).toHaveCount(1);
 }else if(route==='faq'){
  expect(await s.page.locator('[data-faq-group]').evaluateAll(nodes=>nodes.map(n=>n.dataset.faqGroup))).toEqual(['planning','turkiye','hajj','business','inquiry']);
  const summaries=await s.page.locator('.sx-faq-group summary').allTextContents();for(const q of [...questions,...services.map(service=>({q:service.question}))])expect(summaries).toContain(q.q[s.locale]);
  for(const detail of await s.page.locator('.sx-faq-group details').all()){await detail.locator('summary').click();await expect(detail).toHaveAttribute('open','');await expect(detail.locator('p')).toBeVisible();await detail.locator('summary').click();}
  await s.page.locator('.sx-contents a[href="#faq-turkiye"]').click();await expect(s.page).toHaveURL(/#faq-turkiye$/);await expect(s.page.locator('#faq-turkiye')).toBeInViewport();
  await s.page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 }else{
  await expect(s.page.locator('[data-legal-pending]')).toHaveText(ui.legalPending[s.locale]);await expect(s.page.locator('.sx-legal-notice')).toHaveText(ui.legalBody[s.locale]);await expect(s.page.locator('#preferences p')).toHaveText(ui.preferencesBody[s.locale]);
  await expect(s.page.locator('.recovery-secondary img,.recovery-secondary canvas,.recovery-secondary video,.recovery-secondary svg')).toHaveCount(0);
  for(const anchor of await s.page.locator('.sx-contents a[href^="#"]').all()){const target=await anchor.getAttribute('href');await anchor.click();await expect(s.page.locator(target)).toBeInViewport();}
  await s.page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 }
 await bounds(s);if(capture){await shot(s,`${s.locale}-${s.width}x${s.height}-${route.replaceAll('/','-')}`);await shot(s,`${s.locale}-${s.width}x${s.height}-${route.replaceAll('/','-')}-native`,false);}pass(`family ${s.locale} ${s.width}x${s.height} ${route}`);
}
async function keyboard(s,route){
 await go(s,route);const target=s.page.locator('.recovery-secondary a,.recovery-secondary summary').first();await target.focus();await expect(target).toBeFocused();await s.page.keyboard.press('Tab');
 const focus=await s.page.evaluate(()=>{const n=document.activeElement,r=n.getBoundingClientRect(),h=document.querySelector('.header').getBoundingClientRect();return{tag:n.tagName,outline:getComputedStyle(n).outlineStyle,top:r.top,bottom:r.bottom,header:h.bottom,height:innerHeight};});expect(focus.outline).not.toBe('none');expect(focus.top).toBeGreaterThanOrEqual(focus.header-1);expect(focus.bottom).toBeLessThanOrEqual(focus.height+1);pass(`painted keyboard ${s.locale} ${s.width} ${route}`,focus);
 if(route==='faq'){const summary=s.page.locator('.sx-faq-group summary').first();await summary.focus();await s.page.keyboard.press('Enter');await expect(s.page.locator('.sx-faq-group details').first()).toHaveAttribute('open','');await s.page.keyboard.press('Space');await expect(s.page.locator('.sx-faq-group details').first()).not.toHaveAttribute('open','');pass(`native disclosure Enter/Space ${s.locale} ${s.width}`);}
 const anchor=s.page.locator('.sx-contents a[href^="#"]').last();await anchor.focus();await s.page.keyboard.press('Enter');await expect(s.page.locator(await anchor.getAttribute('href'))).toBeInViewport();pass(`keyboard contents anchor ${s.locale} ${s.width} ${route}`);
}
async function closeDrawer(page){await page.keyboard.press('Escape');await expect(page.locator('.journey-drawer')).not.toBeVisible();await expect.poll(()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(document.activeElement?.matches('.header-journey,.header-plan,.menu-button'))))))).toBe(true);}
async function stored(page,ids){await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('tripline-journey'))?.destinations)).toEqual(ids);}
try{
 const matrix=stage==='targeted-dev'?[['en',1440,900],['en',390,844],['ar',390,844],['tr',1280,800]]:[...['en','ar'].flatMap(locale=>[[1440,900],[1280,600],[768,1024],[390,844]].map(([w,h])=>[locale,w,h])),['tr',1280,800],['tr',390,844],['en',360,800],['ar',430,932]];
 for(const [locale,width,height] of matrix){const s=await fresh(locale,width,height);for(const route of routes)await family(s,route);await keyboard(s,'faq');await keyboard(s,'privacy');await s.context.close();}
 // Exact source inventory on every international route and locale, plus Türkiye's separate hub.
 if(stage!=='targeted-dev')for(const locale of ['en','tr','ar']){const s=await fresh(locale,1280,800);for(const c of countries.filter(c=>c.slug!=='turkiye'))await family(s,`destinations/${c.slug}`,c.slug==='saudi-arabia');await go(s,'destinations/turkiye');await expect(s.page.locator('.rt-index button')).toHaveCount(12);pass(`all ten source country routes ${locale}`);await s.context.close();}
 const s=await fresh('en',1440,900,{seed:{destinations:['istanbul','rize-ayder'],journeyType:'tailor-made'}});const p=s.page;await go(s,'destinations/georgia');
 const plan=p.locator('[data-country-plan]').first();await expect(plan).toHaveAttribute('href',/journey=istanbul%2Crize-ayder/);await expect(plan).toHaveAttribute('href',/destination=georgia/);await expect(plan).toHaveAttribute('href',/service=tailor-made/);
 const popupPromise=s.context.waitForEvent('page');await plan.click({modifiers:['Control']});const popup=await popupPromise;await popup.waitForLoadState('networkidle');await expect(p).toHaveURL(/destinations\/georgia$/);await expect(popup).toHaveURL(/contact\?/);await popup.close();pass('native modified click country link');
 await plan.click();await p.waitForURL('**/en/contact?**');await p.waitForLoadState('networkidle');await expect(p.locator('[data-contact-ready]')).toBeVisible();expect(await p.locator('[data-contact-stop]').evaluateAll(n=>n.map(x=>x.dataset.contactStop))).toEqual(['istanbul','rize-ayder']);await expect(p.locator('[data-contact-country]')).toContainText('Georgia');await expect(p.locator('#inquiry-service')).toHaveValue('tailor-made');
 await p.locator('#inquiry-name').fill('Secondary QA');await p.locator('#inquiry-email').fill('qa@example.com');await p.locator('#inquiry-message').fill('Please discuss these arrangements.');await p.locator('#inquiry-consent').check();await p.locator('#inquiry form button[type=submit]').click();await expect(p.locator('.inquiry-result')).toBeVisible();
 const wa=new URL(await p.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');const mail=new URL(await p.locator('.inquiry-result a[href^="mailto:"]').getAttribute('href')).searchParams.get('body');expect(mail).toBe(wa);for(const term of ['Georgia','Istanbul','Rize & Ayder'])expect(wa.split(term).length-1,`exactly once ${term}`).toBe(1);expect(wa.indexOf('Istanbul')).toBeLessThan(wa.indexOf('Rize & Ayder'));expect(await p.evaluate(()=>JSON.parse(sessionStorage.getItem('tripline-journey')))).toEqual({destinations:['istanbul','rize-ayder'],journeyType:'tailor-made'});await shot(s,'country-ordered-contact-prepared');pass('Georgia plus ordered Istanbul/Rize exactly once in both prepared channels; no country store contamination');
 await p.goBack({waitUntil:'networkidle'});await expect(p.locator('[data-country-plan]').first()).toHaveAttribute('href',/destination=georgia/);await p.goForward({waitUntil:'networkidle'});await expect(p.locator('[data-contact-country]')).toContainText('Georgia');pass('country Contact back/forward');
 // Mutate the real provider, then follow native links across every secondary family.
 await go(s,'destinations/turkiye/bursa');await p.getByRole('button',{name:'Add to journey: Bursa',exact:true}).first().click();await stored(p,['istanbul','rize-ayder','bursa']);await p.locator('.header-journey').click();await expect(p.locator('.journey-drawer')).toBeVisible();
 await p.locator('[data-journey-stop=bursa] [data-move="-1"]').click();await p.locator('[data-journey-stop=bursa] [data-move="-1"]').click();await p.getByRole('button',{name:'Remove: Istanbul',exact:true}).click();await p.locator('.journey-type-label select').selectOption('corporate');await closeDrawer(p);await stored(p,['bursa','rize-ayder']);
 for(const route of ['destinations','destinations/georgia','faq','privacy','terms']){const link=route==='destinations/georgia'?p.locator('[data-directory-country=georgia] a'):p.locator(`.footer a[href="/en/${route}"]`).first();await link.click();await p.waitForURL(`**/en/${route}`);await p.waitForLoadState('networkidle');await stored(p,['bursa','rize-ayder']);}
 await p.goBack({waitUntil:'networkidle'});await expect(p).toHaveURL(/\/privacy$/);await stored(p,['bursa','rize-ayder']);await p.goForward({waitUntil:'networkidle'});await expect(p).toHaveURL(/\/terms$/);await stored(p,['bursa','rize-ayder']);
 await p.locator('.footer a[href="/en/destinations"]').first().click();await p.waitForURL('**/en/destinations');await p.waitForLoadState('networkidle');await p.locator('[data-directory-country=georgia] a').click();await p.waitForURL('**/en/destinations/georgia');await p.waitForLoadState('networkidle');const changed=p.locator('[data-country-plan]').first();await expect(changed).toHaveAttribute('href',/journey=bursa%2Crize-ayder/);await expect(changed).toHaveAttribute('href',/service=corporate/);await changed.click();await p.waitForURL('**/en/contact?**');await expect(p.locator('[data-contact-ready]')).toBeVisible();expect(await p.locator('[data-contact-stop]').evaluateAll(nodes=>nodes.map(n=>n.dataset.contactStop))).toEqual(['bursa','rize-ayder']);await expect(p.locator('[data-contact-country]')).toContainText('Georgia');await expect(p.locator('#inquiry-service')).toHaveValue('corporate');await shot(s,'mutated-country-ordered-contact');pass('actual Journey add/reorder/remove/type retained directory→country→FAQ→privacy→terms, back/forward, updated CountryPlan and Contact');
 await go(s,'faq?service=corporate&journey=istanbul%2Crize-ayder');await p.locator('.languages a[lang=ar]').first().click();await p.waitForURL('**/ar/faq?**');await p.waitForLoadState('networkidle');await expect(p.locator('html')).toHaveAttribute('dir','rtl');expect(new URL(p.url()).searchParams.get('journey')).toBe('istanbul,rize-ayder');expect(new URL(p.url()).searchParams.get('service')).toBe('corporate');await p.locator('.languages a[lang=tr]').first().click();await p.waitForURL('**/tr/faq?**');await p.waitForLoadState('networkidle');expect(new URL(p.url()).searchParams.get('journey')).toBe('istanbul,rize-ayder');pass('locale query preservation EN→AR→TR');await s.context.close();
 if(stage!=='targeted-dev')for(const [mode,options] of [['nojs',{javaScriptEnabled:false}],['reduced',{reducedMotion:'reduce'}],['savedata',{extraHTTPHeaders:{'Save-Data':'on'}}]])for(const locale of ['en','ar']){
  const m=await fresh(locale,390,844,options);for(const route of routes){await go(m,route);if(route==='faq'){await m.page.locator('summary').first().click();await expect(m.page.locator('details').first().locator('p')).toBeVisible();}await bounds(m);if(mode!=='nojs')expect(await m.page.locator('.recovery-secondary').evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.playState==='running').map(a=>a.animationName))).toEqual([]);await shot(m,`${mode}-${locale}-${route.replaceAll('/','-')}`,false);pass(`${mode} ${locale} ${route}`);}await m.context.close();
 }
 expect(report.errors).toEqual([]);expect(report.requests).toEqual([]);expect(fingerprints()).toEqual(report.fingerprints);report.status='passed';
}catch(error){report.status='failed';report.failure={message:error.message,stack:error.stack,at:new Date().toISOString(),url:active?.url()};if(active&&!active.isClosed())await active.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});process.exitCode=1;}
finally{report.finishedAt=new Date().toISOString();report.finalFingerprints=fingerprints();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({status:report.status,stage,cases:report.cases.length,screens:report.screens.length,errors:report.errors.length,out,failure:report.failure?.message},null,2));}
