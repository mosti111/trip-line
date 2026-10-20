import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, assertRecoveryHome, openingStage, filmLifecycle, resetJourney } from './verify-recovery-motion.mjs';
if (process.env.QA_STAGE === 'static') {
 await (await import('./verify-recovery-static.mjs')).verifyRecoveryStatic('public');
 process.exit(0);
}
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa');fs.mkdirSync(out,{recursive:true});
const places=['istanbul','trabzon','rize-ayder','uzungol','antalya','bodrum','fethiye','marmaris','sapanca','bursa','yalova','cappadocia'];
const services=['tours','hajj-umrah','camps','corporate','flights-hotels','tailor-made','events','training','visa-assistance'];
const countries=['turkiye','georgia','egypt','saudi-arabia','oman','qatar','uae','maldives','malaysia','indonesia'];
const paths=['','services',...services.map(s=>'services/'+s),'destinations',...countries.map(c=>'destinations/'+c),'business','about','contact','faq','privacy','terms',...places.map(p=>'destinations/turkiye/'+p)];
const report={ startedAt: new Date().toISOString(), browser: 'Chromium', stage: 'full', status:'running',base,routes:[],screens:[],checks:[],errors:[]};
const browser=await chromium.launch({headless:true});
try {
 const request=await browser.newContext();
 for(const locale of ['en','ar','tr'])for(const route of paths){const url=`/${locale}/${route}`;const r=await request.request.get(base+url);expect(r.status(),url).toBe(200);const html=await r.text();expect(html).toContain(`lang="${locale}"`);expect((html.match(/<h1(?:\s|>)/g)||[]).length,url+' heading').toBe(1);report.routes.push(url);}
 const missing=await request.request.get(base+'/en/not-a-page');expect(missing.status()).toBe(404);
 const redirect=await request.request.get(base+'/',{maxRedirects:0,headers:{'accept-language':'ar-TR,ar;q=0.9,en;q=0.8'}});expect(redirect.headers().location).toContain('/ar');
 report.checks.push('120 localized content routes, branded 404, browser-language redirect');
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 watchRuntime(page,report,'public');
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await resetJourney(page);
 await expect(page.locator('.ribbon-ready canvas')).toBeVisible({timeout:15000});
 await assertRecoveryHome(page,'en');await openingStage(page,.4);await expect.poll(()=>page.locator('.rh-arrival-photo').evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
 await filmLifecycle(page);
 const atlas=page.locator('.rt-explorer');await atlas.locator('.rt-index button').filter({hasText:'Rize & Ayder'}).click();await expect(atlas.locator('h3')).toHaveText('Rize & Ayder');await expect(atlas.locator('.rt-preview-actions a')).toHaveAttribute('href','/en/destinations/turkiye/rize-ayder');
 await atlas.locator('.rt-preview-actions button').click();await expect(page.locator('#journey-builder input[name=journey]')).toHaveValue('rize-ayder');await expect(page.locator('.header-journey')).toHaveText(/1/);
 await expect(page.locator('.rh-beyond .journey-text-link')).toHaveAttribute('href','/en/destinations');await page.locator('.rh-beyond .journey-text-link').click();await page.waitForURL('**/destinations');await expect(page.locator('h1')).toBeVisible();
 report.checks.push('Actual WebGL, fifteen chapters, decoded chapter06 film/play/pause/visibility/offscreen, opening motion, synchronized Türkiye Explore/global Add ordered context, secondary Beyond navigation');
 await page.goto(base+'/en/destinations/turkiye');await page.locator('.rt-filters').getByRole('button',{name:'The Black Sea',exact:true}).click();await expect(page.locator('.rt-directory-row')).toHaveCount(3);
 const hubExplorer=page.locator('.recovery-hub .rt-explorer');await hubExplorer.locator('.rt-index button').filter({hasText:'Uzungöl'}).click();await expect(hubExplorer.locator('h3')).toHaveText('Uzungöl');await hubExplorer.locator('.rt-preview-actions button').click();
 const hubBuilder=page.locator('.recovery-hub #journey-builder');await expect(hubBuilder.locator('input[name=journey]')).toHaveValue('rize-ayder,uzungol');await hubBuilder.locator('#builder-service').selectOption('tours');await hubBuilder.locator('button[type=submit]').click();await page.waitForURL('**/contact?**');
 expect(new URL(page.url()).searchParams.get('journey')).toBe('rize-ayder,uzungol');expect(new URL(page.url()).searchParams.get('destination')).toBe('rize-ayder');expect(new URL(page.url()).searchParams.get('service')).toBe('tours');await expect(page.locator('#inquiry-service')).toHaveCount(1);await expect(page.locator('[data-contact-stop]').first()).toHaveAttribute('data-contact-stop','rize-ayder');await expect(page.locator('#inquiry-service')).toHaveValue('tours');await expect(page.locator('[data-contact-stop]')).toHaveText(['01Rize & Ayder','02Uzungöl']);await expect(page.locator('#inquiry-message')).toHaveValue('');
 await page.getByRole('button',{name:'Prepare my inquiry'}).click();await expect(page.locator('#inquiry-name')).toBeFocused();
 await page.locator('#inquiry-name').fill('Frontend QA');await page.locator('#inquiry-email').fill('qa@example.com');await page.locator('#inquiry-message').fill('Please help us plan Uzungöl and Trabzon.');await page.locator('#inquiry-consent').check();await page.getByRole('button',{name:'Prepare my inquiry'}).click();await expect(page.locator('.inquiry-result')).toBeVisible();const message=new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');expect(message.split('Rize & Ayder → Uzungöl').length-1).toBe(1);expect(message).toContain('Frontend QA');expect(new URL(await page.locator('.inquiry-result a[href^="mailto:"]').getAttribute('href')).searchParams.get('body')).toBe(message);
 await page.locator('#inquiry-message').fill('Updated request');await expect(page.locator('.inquiry-result')).toHaveCount(0);
 report.checks.push('Regional filter, shared hub builder retains ordered context and hands service/first destination/full journey to Contact, validation focus, accurate WhatsApp message, stale message cleared on edit');
 await page.locator('.header .languages a[lang=ar]').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.locator('[data-contact-stop]').first()).toHaveAttribute('data-contact-stop','rize-ayder');await expect(page.locator('#inquiry-service')).toHaveValue('tours');expect(new URL(page.url()).searchParams.get('journey')).toBe('rize-ayder,uzungol');await page.goto(base+'/');expect(new URL(page.url()).pathname).toBe('/ar');
 await page.setViewportSize({width:390,height:844});await page.locator('.menu-button').click();await expect(page.locator('.nav-dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.nav-dialog')).not.toBeVisible();await expect(page.locator('.menu-button')).toBeFocused();
 report.checks.push('Language preserves context and persists cookie, Arabic RTL, modal Escape and focus return');
 for(const [name,url,width,height] of [['home-final','/en',1440,1000],['turkiye-desktop','/en/destinations/turkiye',1280,900],['turkiye-arabic','/ar/destinations/turkiye',390,844],['rize-mobile','/ar/destinations/turkiye/rize-ayder',360,800],['antalya-tablet','/tr/destinations/turkiye/antalya',768,1024],['contact-final','/en/contact?destination=trabzon',430,932]]){
  await page.setViewportSize({width,height});await page.goto(base+url,{waitUntil:'networkidle'});await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,40));}window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(250);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow').toBe(true);expect(await page.locator('h1').count()).toBe(1);expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).length)).toBe(0);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});report.screens.push({name,width,height});
 }
 const calm=await browser.newPage({reducedMotion:'reduce'});await calm.goto(base+'/en',{waitUntil:'networkidle'});await expect(calm.locator('.travel-site')).toHaveClass(/reduce-motion/);expect(await calm.locator('.ribbon canvas').count()).toBe(0);expect(await calm.locator('.rh-film-frame video').getAttribute('src')).toBe(null);await calm.close();
 await page.locator('.motion-choice select').selectOption('reduced');await page.goto(base+'/en');await expect(page.locator('.travel-site')).toHaveClass(/reduce-motion/);report.checks.push('Device and persistent reduced motion: static ribbon and no automatic video download');
 expect(report.errors,'Browser errors').toEqual([]);
 report.status='passed';
 console.log(JSON.stringify({routes:report.routes.length,screens:report.screens.length,checks:report.checks,errors:report.errors},null,2));
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'production-check.json'),JSON.stringify(report,null,2));await browser.close();}
