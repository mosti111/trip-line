import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { watchRuntime, openingStage, filmLifecycle } from './verify-recovery-motion.mjs';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve(process.env.QA_OUT||'../tmp/v3-reconstruction/qa');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report={ startedAt: new Date().toISOString(), browser: 'Chromium', stage: 'full', status:'running',checks:[],errors:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 watchRuntime(page,report,'delayed-media');
 await page.route('**/_next/image?**',async route=>{if(route.request().url().includes('yalova.jpg'))await new Promise(resolve=>setTimeout(resolve,2500));await route.continue();});
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await filmLifecycle(page);await page.locator('.rh-film-frame').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.rh-film-frame video').evaluate(v=>v.paused)).toBe(false);
 await expect(page.locator('.rh-film-frame video')).toHaveCSS('opacity','1');
 for(const [stage,progress] of [['arrival',0],['hold',.2],['departure-enter',.55],['departure',.85]]){
  await openingStage(page,progress);
  await page.screenshot({path:path.join(out,`opening-${stage}.png`)});
 }
 await expect(page.locator('.rh-arrival-copy > .rh-actions')).toHaveCSS('opacity','0');await expect(page.locator('.rh-title-block').first()).toHaveCSS('opacity','0');
 await expect(page.locator('.rh-arrival')).toHaveAttribute('data-motion-stage',/travel|depart|transform/i);
 report.checks.push('Decoded chapter06 film is visibly opaque with full lifecycle; height-relative opening captures retain arrival, framing/camera change and readable route departure');
 const index=page.locator('.rt-index button');
 await index.first().click();await expect(page.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('alt','Istanbul');
 await index.nth(10).click();await page.waitForTimeout(350);
 await expect(page.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('src',/istanbul/);
 expect(await page.locator('.rt-preview-image[data-active=true] img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);await expect(page.locator('.rt-preview-image img')).toHaveCount(2);
 await expect(page.locator('.rt-preview-image[data-active=true] img')).toHaveAttribute('src',/yalova/,{timeout:10000});await expect(page.locator('.rt-preview h3')).toHaveText('Yalova');
 expect(await page.locator('.rt-preview-image img').count()).toBeLessThanOrEqual(2);
 report.checks.push('A delayed destination image retains previous media until loaded; only active and previous photos mount');
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'media.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));}
