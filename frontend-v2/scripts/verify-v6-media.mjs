import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';import path from 'node:path';import { fileURLToPath } from 'node:url';
const out=fileURLToPath(new URL('../../docs/qa/2026-10-24-v6/P1/media/',import.meta.url));fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();const report={status:'running',cases:[],errors:[]};
try{for(const [locale,width,height] of [['en',1440,900],['ar',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>report.errors.push(String(e)));await page.goto((process.env.QA_URL||'http://localhost:3006')+`/${locale}/motion-lab`,{waitUntil:'networkidle'});
 const media=page.locator('.rt-preview-media');
 for(const [index,id] of [[2,'rize-ayder'],[11,'cappadocia'],[4,'antalya'],[2,'rize-ayder']]){
  await page.locator('.rt-index button').nth(index).click();await expect(media).toHaveAttribute('data-shown',id);await page.waitForTimeout(750);
  await page.screenshot({path:path.join(out,`${locale}-${width}-${id}.png`)});
  expect(await page.locator(`.rt-preview-image[data-place="${id}"] img`).evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 }
 await page.route('**/*yalova*',route=>route.abort());await page.locator('.rt-index button').nth(10).click();await expect(page.locator('.rt-photo-status')).toBeVisible();await expect(media).toHaveAttribute('data-shown','rize-ayder');
 report.cases.push({locale,width,height,loadedAndShown:['rize-ayder','cappadocia','antalya','rize-ayder'],failedImageRetains:'rize-ayder'});await page.close();
}expect(report.errors).toEqual([]);report.status='passed';}catch(e){report.status='failed';report.failure=String(e);throw e;}finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
