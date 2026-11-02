import {chromium} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v11/scenes');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report=[];
for(const locale of ['en','tr','ar'])for(const width of (process.env.QA_DESKTOP_ONLY?[1440]:process.env.QA_PHONE_ONLY?[390]:[390,1440])){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:process.env.QA_REDUCED?'reduce':'no-preference',hasTouch:width===390,isMobile:width===390});
 await page.goto((process.env.QA_URL||'http://localhost:3017')+'/'+locale,{waitUntil:'networkidle'});await page.waitForTimeout(1700);
 for(const [name,selector] of Object.entries({hero:'.rh-arrival',worlds:'.rh-world-stage',explorer:'.rt-preview',cappadocia:'.rh-signature-0',rize:'.rh-signature-1',antalya:'.rh-signature-2',partners:'.v61-network',planner:'.rh-builder',final:'.rh-final'})){
  const node=page.locator(selector).first();await node.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,-110));await page.waitForTimeout(800);
  const box=await node.boundingBox();await page.screenshot({path:path.join(out,`${locale}-${width}-${name}.png`)});report.push({locale,width,name,box});
 }
 await page.close();
}
await browser.close();fs.writeFileSync(path.join(out,'scenes.json'),JSON.stringify(report,null,2));
