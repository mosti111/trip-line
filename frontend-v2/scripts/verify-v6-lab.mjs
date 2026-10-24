import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base=process.env.QA_URL||'http://localhost:3006';
const out=fileURLToPath(new URL('../../docs/qa/2026-10-24-v6/P0/',import.meta.url));fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const prior=process.env.QA_REDUCED_ONLY?JSON.parse(fs.readFileSync(path.join(out,'report.json'),'utf8')):null;
const report={status:'running',cases:prior?.cases||[],errors:[],browser:browser.version()};
try{
 for(const [locale,width,height,reduced] of [['en',1440,900,false],['en',390,844,false],['ar',1440,900,false],['ar',390,844,false],['tr',1024,768,false],['en',1440,900,true]]){
  if(process.env.QA_REDUCED_ONLY&&!reduced)continue;
  const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference',recordVideo:{dir:out,size:{width,height}}});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  await page.goto(`${base}/${locale}/motion-lab`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1500);await expect(page.locator('.rh-arrival h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const id=`${locale}-${width}-${reduced?'reduced':'motion'}`;
  await page.screenshot({path:path.join(out,`${id}-hero.png`)});
  const stage=await page.locator('.rh-arrival-photo').evaluate(el=>getComputedStyle(el).transform);
  await page.mouse.wheel(0,460);await page.waitForTimeout(350);
  await page.screenshot({path:path.join(out,`${id}-departure.png`)});
  const departed=await page.locator('.rh-arrival-photo').evaluate(el=>getComputedStyle(el).transform);
  if(!reduced)expect(departed).not.toBe(stage);
  await page.mouse.wheel(0,-460);await page.waitForTimeout(300);
  await page.locator('.rt-explorer').scrollIntoViewIfNeeded();
  for(const index of [2,11,4]){
   await page.locator('.rt-index button').nth(index).click();await page.waitForTimeout(120);
   await page.screenshot({path:path.join(out,`${id}-atlas-${index}-start.png`)});
   await page.waitForTimeout(280);await page.screenshot({path:path.join(out,`${id}-atlas-${index}-mid.png`)});
   await page.waitForTimeout(450);await page.screenshot({path:path.join(out,`${id}-atlas-${index}-end.png`)});
   await expect(page.locator('.rt-index button').nth(index)).toHaveAttribute('aria-pressed','true');
  }
  await page.locator('.rt-index button').nth(2).click();await page.locator('.rt-index button').nth(11).click();await page.locator('.rt-index button').nth(4).click();
  await page.waitForTimeout(900);await expect(page.locator('.rt-preview h3')).toContainText(locale==='ar'?'أنطاليا':locale==='tr'?'Antalya':'Antalya');
  await page.mouse.move(0,0);await page.locator('.v6-network-heading').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  const track=page.locator('.v6-network-track').first();
  const x1=await track.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(650);const x2=await track.evaluate(el=>getComputedStyle(el).transform);
  if(!reduced)expect(x1).not.toBe(x2);else expect(x2).toBe('none');
  await page.locator('.v6-network-tracks').hover();await page.waitForTimeout(120);
  if(!reduced)expect(await track.evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
  else expect(await track.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await page.screenshot({path:path.join(out,`${id}-network.png`)});
  await page.locator('.v6-network-tracks').focus();if(!reduced)expect(await track.evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
  report.cases.push({id,heroStart:stage,heroDeparted:departed,trackStart:x1,trackEnd:x2});await context.close();
  fs.renameSync(await page.video().path(),path.join(out,`${id}.webm`));
 }
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
