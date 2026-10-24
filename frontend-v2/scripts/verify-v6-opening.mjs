import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const out=fileURLToPath(new URL('../../docs/qa/2026-10-24-v6/P1/',import.meta.url));fs.mkdirSync(out,{recursive:true});
const base=process.env.QA_URL||'http://localhost:3006';const browser=await chromium.launch();const report={status:'running',cases:[],errors:[]};
try{
 for(const [locale,width,height] of [['en',1440,900],['ar',1440,900],['en',390,844],['ar',390,844]]){
  const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:out,size:{width,height}}});const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  await page.addInitScript(()=>{window.__entries=[];new MutationObserver(records=>records.forEach(r=>{if(r.attributeName==='data-entry')window.__entries.push({value:r.target.dataset.entry,time:performance.now()});})).observe(document,{subtree:true,attributes:true,attributeFilter:['data-entry']});});
  await page.goto(`${base}/${locale}`,{waitUntil:'domcontentloaded'});await page.locator('.rh-arrival[data-entry]').waitFor();
  await page.screenshot({path:path.join(out,`${locale}-${width}-start.png`)});await page.waitForTimeout(350);await page.screenshot({path:path.join(out,`${locale}-${width}-mid.png`)});await page.waitForTimeout(1100);await page.screenshot({path:path.join(out,`${locale}-${width}-end.png`)});
  const entries=await page.evaluate(()=>window.__entries);expect(entries.some(e=>e.value==='play')).toBe(true);expect(entries.at(-1).value).toBe('done');
  expect(entries.at(-1).time-entries.find(e=>e.value==='play').time).toBeLessThan(1600);
  await page.mouse.wheel(0,550);await page.waitForTimeout(180);await page.screenshot({path:path.join(out,`${locale}-${width}-departure.png`)});await page.mouse.wheel(0,-550);await page.waitForTimeout(200);
  if(width>1024){
   const trigger=page.locator('.nav-turkiye-link button');await trigger.click();await page.waitForTimeout(180);await page.screenshot({path:path.join(out,`${locale}-${width}-menu-mid.png`)});
   for(const id of ['cappadocia','rize-ayder','antalya'])await page.locator(`.mega-groups a[href$="/${id}"]`).hover();
   await expect(page.locator('.mega-preview-photo')).toHaveAttribute('data-preview-settled','antalya',{timeout:6000});await page.screenshot({path:path.join(out,`${locale}-${width}-menu-end.png`)});await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
   await trigger.click();await page.waitForTimeout(60);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  }else{
   const trigger=page.locator('.menu-button');await trigger.click();await page.waitForTimeout(200);await page.screenshot({path:path.join(out,`${locale}-${width}-menu-mid.png`)});await page.waitForTimeout(450);await page.screenshot({path:path.join(out,`${locale}-${width}-menu-end.png`)});await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
   await trigger.click();await page.waitForTimeout(60);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  }
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).overflow)).not.toBe('hidden');
  expect(await page.evaluate(()=>window.__entries.filter(e=>e.value==='play').length)).toBe(1);
  report.cases.push({locale,width,height,entries});await context.close();fs.renameSync(await page.video().path(),path.join(out,`${locale}-${width}.webm`));
 }
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
