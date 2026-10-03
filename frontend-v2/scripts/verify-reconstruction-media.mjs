import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve('../tmp/v3-reconstruction/qa');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report={status:'running',checks:[],errors:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.route('**/_next/image?**',async route=>{if(route.request().url().includes('yalova.jpg'))await new Promise(resolve=>setTimeout(resolve,2500));await route.continue();});
 await page.goto(base+'/en',{waitUntil:'networkidle'});
 await expect.poll(()=>page.locator('.home-hero video').evaluate(v=>v.videoWidth)).toBeGreaterThan(0);
 await expect(page.locator('.home-hero video')).toHaveCSS('opacity','1');
 for(const [stage,top] of [['arrival',0],['hold',220],['departure-enter',800],['departure',1250]]){
  await page.evaluate(top=>scrollTo({top,behavior:'instant'}),top);await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(out,`opening-${stage}.png`)});
 }
 await expect(page.locator('.departure-copy')).toHaveCSS('opacity','1');
 await expect(page.locator('.hero-content')).toHaveCSS('opacity','0');
 report.checks.push('Decoded hero film is visibly opaque; staged opening captures retain arrival, framing change and readable departure');
 const index=page.locator('.turkey-atlas .country-index button');
 await index.first().click();await expect(page.locator('.explorer-image[data-active=true] img')).toHaveAttribute('alt','Istanbul');
 await index.nth(10).click();await page.waitForTimeout(350);
 await expect(page.locator('.explorer-image[data-active=true] img')).toHaveAttribute('src',/istanbul/);
 await expect(page.locator('.explorer-image[data-active=true] img')).toHaveAttribute('alt','Yalova',{timeout:10000});
 await expect(page.locator('.explorer-image img')).toHaveCount(2);
 report.checks.push('A delayed destination image retains previous media until loaded; only active and previous photos mount');
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{fs.writeFileSync(path.join(out,'media.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));}
