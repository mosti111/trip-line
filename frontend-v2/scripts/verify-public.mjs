import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve('..','tmp','frontend-qa');fs.mkdirSync(out,{recursive:true});
const places=['istanbul','trabzon','rize-ayder','uzungol','antalya','bodrum','fethiye','marmaris','sapanca','bursa','yalova','cappadocia'];
const services=['tours','hajj-umrah','camps','corporate','flights-hotels','tailor-made','events','training','visa-assistance'];
const countries=['turkiye','georgia','egypt','saudi-arabia','oman','qatar','uae','maldives','malaysia','indonesia'];
const paths=['','services',...services.map(s=>'services/'+s),'destinations',...countries.map(c=>'destinations/'+c),'business','about','contact','faq','privacy','terms',...places.map(p=>'destinations/turkiye/'+p)];
const report={routes:[],screens:[],checks:[],errors:[]};
const browser=await chromium.launch({headless:true});
try {
 const request=await browser.newContext();
 for(const locale of ['en','ar','tr'])for(const route of paths){const url=`/${locale}/${route}`;const r=await request.request.get(base+url);expect(r.status(),url).toBe(200);const html=await r.text();expect(html).toContain(`lang="${locale}"`);expect((html.match(/<h1(?:\s|>)/g)||[]).length,url+' heading').toBe(1);report.routes.push(url);}
 const missing=await request.request.get(base+'/en/not-a-page');expect(missing.status()).toBe(404);
 const redirect=await request.request.get(base+'/',{maxRedirects:0,headers:{'accept-language':'ar-TR,ar;q=0.9,en;q=0.8'}});expect(redirect.headers().location).toContain('/ar');
 report.checks.push('120 localized content routes, branded 404, browser-language redirect');
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await expect(page.locator('.ribbon-ready canvas')).toBeVisible({timeout:15000});
 await expect.poll(()=>page.locator('.home-hero video').evaluate(v=>v.videoWidth)).toBeGreaterThan(0);
 await page.locator('.home-hero').getByRole('button',{name:'Pause film',exact:true}).click();expect(await page.locator('.home-hero video').evaluate(v=>v.paused)).toBe(true);
 await page.locator('.home-hero').getByRole('button',{name:'Play Istanbul film',exact:true}).click();await expect.poll(()=>page.locator('.home-hero video').evaluate(v=>v.paused)).toBe(false);
 await page.evaluate(()=>window.scrollTo({top:350,behavior:'instant'}));await page.waitForTimeout(150);await expect.poll(()=>page.locator('.hero-content').evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
 const atlas=page.locator('.turkey-atlas');await atlas.getByRole('button',{name:'Rize & Ayder',exact:false}).first().click();await expect(atlas.locator('h3')).toHaveText('Rize & Ayder');await expect(atlas.locator('.atlas-inquiry')).toHaveAttribute('href','/en/contact?service=tours&destination=rize-ayder');
 await page.getByRole('button',{name:'Beyond Türkiye',exact:true}).click();await expect(page.locator('#atlas')).toBeVisible();await page.getByRole('button',{name:'Explore Türkiye',exact:true}).click();
 report.checks.push('WebGL canvas, decoded local film, pause/resume, scroll parallax, synchronized Türkiye atlas, international mode');
 await page.goto(base+'/en/destinations/turkiye');await page.getByRole('button',{name:'The Black Sea',exact:true}).click();await expect(page.locator('.turkey-place')).toHaveCount(3);
 await page.locator('.brief-fields select[name=destination]').selectOption('uzungol');await page.locator('.brief-fields button').click();await page.waitForURL('**/contact?**');await expect(page.locator('#inquiry-service')).toHaveCount(1);await expect(page.locator('#inquiry-destination')).toHaveValue('uzungol');await expect(page.locator('#inquiry-service')).toHaveValue('tours');
 await page.getByRole('button',{name:'Prepare my inquiry'}).click();await expect(page.locator('#inquiry-name')).toBeFocused();
 await page.locator('#inquiry-name').fill('Frontend QA');await page.locator('#inquiry-email').fill('qa@example.com');await page.locator('#inquiry-message').fill('Please help us plan Uzungöl and Trabzon.');await page.locator('#inquiry-consent').check();await page.getByRole('button',{name:'Prepare my inquiry'}).click();await expect(page.locator('.inquiry-result')).toBeVisible();const message=new URL(await page.locator('.inquiry-result a').first().getAttribute('href')).searchParams.get('text');expect(message).toContain('Uzungöl');expect(message).toContain('Frontend QA');
 await page.locator('#inquiry-message').fill('Updated request');await expect(page.locator('.inquiry-result')).toHaveCount(0);
 report.checks.push('Regional filter, planner selection handoff, validation focus, accurate WhatsApp message, stale message cleared on edit');
 await page.locator('.header .languages a[lang=ar]').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.locator('#inquiry-destination')).toHaveValue('uzungol');await page.goto(base+'/');expect(new URL(page.url()).pathname).toBe('/ar');
 await page.setViewportSize({width:390,height:844});await page.locator('.menu-button').click();await expect(page.locator('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();await expect(page.locator('.menu-button')).toBeFocused();
 report.checks.push('Language preserves context and persists cookie, Arabic RTL, modal Escape and focus return');
 for(const [name,url,width,height] of [['home-final','/en',1440,1000],['turkiye-desktop','/en/destinations/turkiye',1280,900],['turkiye-arabic','/ar/destinations/turkiye',390,844],['rize-mobile','/ar/destinations/turkiye/rize-ayder',360,800],['antalya-tablet','/tr/destinations/turkiye/antalya',768,1024],['contact-final','/en/contact?destination=trabzon',430,932]]){
  await page.setViewportSize({width,height});await page.goto(base+url,{waitUntil:'networkidle'});await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,40));}window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(250);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow').toBe(true);expect(await page.locator('h1').count()).toBe(1);expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).length)).toBe(0);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});report.screens.push({name,width,height});
 }
 const calm=await browser.newPage({reducedMotion:'reduce'});await calm.goto(base+'/en',{waitUntil:'networkidle'});await expect(calm.locator('.travel-site')).toHaveClass(/reduce-motion/);expect(await calm.locator('.ribbon canvas').count()).toBe(0);expect(await calm.locator('.home-hero video').getAttribute('src')).toBe(null);await calm.close();
 await page.locator('.motion-choice select').selectOption('reduced');await page.goto(base+'/en');await expect(page.locator('.travel-site')).toHaveClass(/reduce-motion/);report.checks.push('Device and persistent reduced motion: static ribbon and no automatic video download');
 expect(report.errors,'Browser errors').toEqual([]);
 console.log(JSON.stringify({routes:report.routes.length,screens:report.screens.length,checks:report.checks,errors:report.errors},null,2));
}finally{fs.writeFileSync(path.join(out,'production-check.json'),JSON.stringify(report,null,2));await browser.close();}
