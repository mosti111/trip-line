import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const stage=process.env.QA_STAGE||'after';
const base=process.env.QA_URL||'http://localhost:3021';
const out=path.resolve('../tmp/v3-reconstruction',stage);fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report={stage,base,captures:[]};
for(const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:width===1440?1000:844},isMobile:width===390,hasTouch:width===390});
 await page.goto(base+'/en',{waitUntil:'networkidle',timeout:180000});
 await page.waitForTimeout(1800);
 const chapters=stage==='before'?{hero:'.home-hero',services:'.worlds',turkiye:'.turkey-atlas',planner:'.process',arrival:'.invitation'}:{hero:'.home-hero',services:'#service-worlds',turkiye:'.turkey-atlas',planner:'.journey-builder',arrival:'.final-arrival'};
 for(const [chapter,selector] of Object.entries(chapters)) {
  const target=page.locator(selector).first();
  if(!await target.count())throw new Error(`Missing ${selector}`);
  await target.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.waitForTimeout(1400);
  await target.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY,behavior:'instant'}));
  await page.waitForTimeout(1400);
  const file=`${width}-${chapter}.png`;
  await page.screenshot({path:path.join(out,file)});report.captures.push(file);
 }
 await page.close();
}
await browser.close();fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report));

