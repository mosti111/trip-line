import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3021';
const phase=process.env.QA_PHASE||'B';
const selector=process.env.QA_SELECTOR||'.opening';
const out=path.resolve('../tmp/v3-reconstruction/phases');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===1440?1000:844},isMobile:width===390,hasTouch:width===390});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+(process.env.QA_PATH||'/en'),{waitUntil:'networkidle',timeout:180000});
 await page.locator(selector).first().evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
 await page.waitForTimeout(1200);
 await page.locator(selector).first().evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY,behavior:'instant'}));
 await page.waitForTimeout(1200);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect(errors).toEqual([]);
 await page.screenshot({path:path.join(out,`${phase}-${width}.png`)});
 console.log(`${phase}: ${width}px, no overflow or page errors`);
 await page.close();
}
await browser.close();
